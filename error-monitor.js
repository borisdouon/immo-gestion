#!/usr/bin/env node

/**
 * Terminal Error Monitor & Auto-Fix Agent
 * Continuously monitors terminal output for errors and automatically fixes them
 */

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Try to load error fixer if available
let ErrorFixer;
try {
  ErrorFixer = require('./error-fixer');
} catch (error) {
  // ErrorFixer not available
}

class ErrorMonitor {
  constructor() {
    this.fixer = ErrorFixer ? new ErrorFixer() : null;
    this.config = this.loadConfig();
    this.errorPatterns = {
      // TypeScript errors
      typescript: {
        pattern: /error TS\d+: (.+)/gi,
        filePattern: /\((\d+),(\d+)\)/g,
        fixes: this.fixTypeScriptError.bind(this)
      },
      // ESLint errors
      eslint: {
        pattern: /(\d+):(\d+)\s+error\s+(.+?)\s+([^\s]+)/gi,
        fixes: this.fixESLintError.bind(this)
      },
      // Import errors
      import: {
        pattern: /Cannot find module ['"](.+?)['"]/gi,
        fixes: this.fixImportError.bind(this)
      },
      // Build errors
      build: {
        pattern: /Failed to compile|Error:|Build error/gi,
        fixes: this.fixBuildError.bind(this)
      },
      // Dependency errors
      dependency: {
        pattern: /Module not found|Cannot resolve|Package not found/gi,
        fixes: this.fixDependencyError.bind(this)
      },
      // Syntax errors
      syntax: {
        pattern: /SyntaxError|Unexpected token|Parse error/gi,
        fixes: this.fixSyntaxError.bind(this)
      },
      // Type errors
      type: {
        pattern: /Type ['"](.+?)['"] is not assignable to type/gi,
        fixes: this.fixTypeError.bind(this)
      }
    };
    
    this.fixedErrors = new Set();
    this.logFile = path.join(__dirname, 'error-monitor.log');
    this.isMonitoring = false;
  }

  loadConfig() {
    try {
      const configPath = path.join(__dirname, '.error-monitor-config.json');
      if (fs.existsSync(configPath)) {
        return JSON.parse(fs.readFileSync(configPath, 'utf8'));
      }
    } catch (error) {
      this.log(`Failed to load config: ${error.message}`, 'WARN');
    }
    return { enabled: true, autoFix: true };
  }

  log(message, type = 'INFO') {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] [${type}] ${message}`;
    console.log(logMessage);
    fs.appendFileSync(this.logFile, logMessage + '\n');
  }

  async fixTypeScriptError(error, file, line, column) {
    this.log(`Attempting to fix TypeScript error: ${error} in ${file}:${line}:${column}`);
    
    // Common TypeScript fixes
    if (error.includes('Cannot find name')) {
      return { action: 'add-import', file, error };
    }
    if (error.includes('is possibly')) {
      return { action: 'add-null-check', file, line };
    }
    if (error.includes('Property') && error.includes('does not exist')) {
      return { action: 'fix-property', file, error };
    }
    if (error.includes('Type') && error.includes('is not assignable')) {
      return { action: 'fix-type', file, error };
    }
    
    return null;
  }

  async fixESLintError(line, column, rule, file) {
    this.log(`Attempting to fix ESLint error: ${rule} in ${file}:${line}:${column}`);
    
    // Common ESLint fixes
    if (rule.includes('no-unused-vars')) {
      return { action: 'remove-unused', file, line };
    }
    if (rule.includes('react-hooks')) {
      return { action: 'fix-react-hooks', file, line };
    }
    if (rule.includes('@typescript-eslint')) {
      return { action: 'fix-typescript-eslint', file, line, rule };
    }
    
    return null;
  }

  async fixImportError(module) {
    this.log(`Attempting to fix import error: Cannot find module ${module}`);
    
    // Check if it's a local import
    if (module.startsWith('.')) {
      return { action: 'fix-local-import', module };
    }
    
    // Check if package exists
    const packageJson = path.join(__dirname, 'package.json');
    if (fs.existsSync(packageJson)) {
      const pkg = JSON.parse(fs.readFileSync(packageJson, 'utf8'));
      const allDeps = { ...pkg.dependencies, ...pkg.devDependencies };
      
      // Try to find similar package
      const similar = Object.keys(allDeps).find(dep => 
        dep.includes(module.split('/')[0]) || module.includes(dep)
      );
      
      if (!similar && !module.startsWith('@')) {
        return { action: 'install-package', package: module };
      }
    }
    
    return null;
  }

  async fixBuildError(error) {
    this.log(`Attempting to fix build error: ${error}`);
    return { action: 'analyze-build-error', error };
  }

  async fixDependencyError(error) {
    this.log(`Attempting to fix dependency error: ${error}`);
    return { action: 'install-dependency', error };
  }

  async fixSyntaxError(error) {
    this.log(`Attempting to fix syntax error: ${error}`);
    return { action: 'fix-syntax', error };
  }

  async fixTypeError(error) {
    this.log(`Attempting to fix type error: ${error}`);
    return { action: 'fix-type-assignment', error };
  }

  async applyFix(fix) {
    if (!fix) return false;

    const errorKey = `${fix.action}-${fix.file || fix.module || fix.package || 'unknown'}`;
    if (this.fixedErrors.has(errorKey)) {
      return false; // Already tried to fix this
    }
    this.fixedErrors.add(errorKey);

    try {
      switch (fix.action) {
        case 'install-package':
          this.log(`Installing package: ${fix.package}`);
          await this.runCommand('npm', ['install', fix.package]);
          return true;

        case 'fix-local-import':
          this.log(`Fixing local import: ${fix.module}`);
          if (this.fixer) {
            return await this.fixer.fixMissingImport(fix.file, fix.module);
          }
          return false;

        case 'add-import':
          this.log(`Adding missing import in ${fix.file}`);
          if (this.fixer && fix.file && fix.error) {
            const symbol = fix.error.match(/Cannot find name ['"](.+?)['"]/)?.[1];
            if (symbol) {
              return await this.fixer.fixMissingImport(fix.file, symbol);
            }
          }
          return false;

        case 'remove-unused':
          this.log(`Removing unused variable in ${fix.file}:${fix.line}`);
          if (this.fixer && fix.file && fix.line) {
            return await this.fixer.fixUnusedVariable(fix.file, parseInt(fix.line));
          }
          return false;

        case 'fix-type':
          this.log(`Fixing type error in ${fix.file}`);
          if (this.fixer && fix.file && fix.error) {
            return await this.fixer.fixTypeError(fix.file, fix.error);
          }
          return false;

        case 'fix-syntax':
          this.log(`Fixing syntax error`);
          if (this.fixer && fix.error) {
            return await this.fixer.fixSyntaxError(fix.file, fix.error);
          }
          return false;

        case 'install-dependency':
          this.log(`Installing missing dependency`);
          if (this.fixer && fix.error) {
            const packageMatch = fix.error.match(/['"](.+?)['"]/);
            if (packageMatch) {
              return await this.fixer.installPackage(packageMatch[1]);
            }
          }
          return false;

        default:
          this.log(`Unknown fix action: ${fix.action}`);
          return false;
      }
    } catch (error) {
      this.log(`Failed to apply fix: ${error.message}`, 'ERROR');
      return false;
    }
  }

  async runCommand(command, args = []) {
    return new Promise((resolve, reject) => {
      const proc = spawn(command, args, {
        cwd: __dirname,
        shell: true,
        stdio: 'inherit'
      });

      proc.on('close', (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`Command failed with code ${code}`));
        }
      });

      proc.on('error', reject);
    });
  }

  async analyzeAndFixError(line) {
    for (const [errorType, config] of Object.entries(this.errorPatterns)) {
      const matches = [...line.matchAll(config.pattern)];
      
      for (const match of matches) {
        this.log(`Detected ${errorType} error: ${match[0]}`, 'ERROR');
        
        let fix = null;
        if (errorType === 'typescript') {
          const fileMatch = line.match(/^(.+?)\((\d+),(\d+)\)/);
          if (fileMatch) {
            fix = await config.fixes(match[1], fileMatch[1], fileMatch[2], fileMatch[3]);
          }
        } else if (errorType === 'eslint') {
          fix = await config.fixes(match[1], match[2], match[3], match[4]);
        } else {
          fix = await config.fixes(match[0] || match[1]);
        }
        
        if (fix) {
          const applied = await this.applyFix(fix);
          if (applied) {
            this.log(`Successfully applied fix for ${errorType} error`, 'SUCCESS');
          }
        }
      }
    }
  }

  monitorProcess(process) {
    const rl = readline.createInterface({
      input: process.stdout,
      terminal: false
    });

    const rlErr = readline.createInterface({
      input: process.stderr,
      terminal: false
    });

    rl.on('line', async (line) => {
      await this.analyzeAndFixError(line);
    });

    rlErr.on('line', async (line) => {
      await this.analyzeAndFixError(line);
    });

    process.on('close', (code) => {
      this.log(`Monitored process exited with code ${code}`);
      this.isMonitoring = false;
    });
  }

  async startMonitoring(command, args = []) {
    if (this.isMonitoring) {
      this.log('Monitor is already running', 'WARN');
      return;
    }

    this.log(`Starting error monitor for: ${command} ${args.join(' ')}`);
    this.isMonitoring = true;

    const proc = spawn(command, args, {
      cwd: __dirname,
      shell: true,
      stdio: ['inherit', 'pipe', 'pipe']
    });

    this.monitorProcess(proc);

    // Also monitor file changes for TypeScript/ESLint errors
    this.startFileWatcher();
  }

  startFileWatcher() {
    try {
      const chokidar = require('chokidar');
      
      const watcher = chokidar.watch([
        '**/*.{ts,tsx,js,jsx}',
        '!node_modules/**',
        '!.next/**'
      ], {
        ignored: /node_modules|\.next/,
        persistent: true
      });

      watcher.on('change', async (filePath) => {
        this.log(`File changed: ${filePath}`);
        // Run lint check on changed file
        await this.checkFileForErrors(filePath);
      });
    } catch (error) {
      this.log('File watcher not available (chokidar not installed). Install with: npm install chokidar', 'WARN');
    }
  }

  async checkFileForErrors(filePath) {
    try {
      // Run TypeScript check
      const tsc = spawn('npx', ['tsc', '--noEmit', filePath], {
        cwd: __dirname,
        shell: true,
        stdio: 'pipe'
      });

      let output = '';
      tsc.stdout.on('data', (data) => {
        output += data.toString();
      });

      tsc.stderr.on('data', (data) => {
        output += data.toString();
      });

      tsc.on('close', async () => {
        if (output) {
          await this.analyzeAndFixError(output);
        }
      });
    } catch (error) {
      // Silent fail - file might not be TypeScript
    }
  }
}

// Main execution
if (require.main === module) {
  const monitor = new ErrorMonitor();
  
  // Get command from args or default to 'npm run dev'
  const command = process.argv[2] || 'npm';
  const args = process.argv.slice(3).length > 0 ? process.argv.slice(3) : ['run', 'dev'];
  
  monitor.startMonitoring(command, args).catch(error => {
    console.error('Failed to start monitor:', error);
    process.exit(1);
  });

  // Graceful shutdown
  process.on('SIGINT', () => {
    monitor.log('Shutting down error monitor...');
    process.exit(0);
  });
}

module.exports = ErrorMonitor;

