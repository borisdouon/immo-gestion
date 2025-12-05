#!/usr/bin/env node

/**
 * Advanced Error Fixer Module
 * Handles complex error fixing with file analysis and code generation
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class ErrorFixer {
  constructor() {
    this.projectRoot = __dirname;
  }

  /**
   * Fix missing imports by analyzing file and adding necessary imports
   */
  async fixMissingImport(filePath, missingSymbol) {
    try {
      if (!fs.existsSync(filePath)) {
        return false;
      }

      const content = fs.readFileSync(filePath, 'utf8');
      
      // Check if import already exists
      if (content.includes(missingSymbol)) {
        return true;
      }

      // Try to find where to add import
      const lines = content.split('\n');
      let lastImportIndex = -1;
      
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].trim().startsWith('import ')) {
          lastImportIndex = i;
        }
      }

      // Try to determine import path
      const importPath = this.findImportPath(missingSymbol, filePath);
      
      if (importPath) {
        const importStatement = `import { ${missingSymbol} } from '${importPath}';`;
        
        if (lastImportIndex >= 0) {
          lines.splice(lastImportIndex + 1, 0, importStatement);
        } else {
          lines.unshift(importStatement);
        }
        
        fs.writeFileSync(filePath, lines.join('\n'), 'utf8');
        return true;
      }
    } catch (error) {
      console.error(`Failed to fix missing import: ${error.message}`);
    }
    
    return false;
  }

  /**
   * Find import path for a symbol
   */
  findImportPath(symbol, currentFile) {
    // Check common locations
    const commonPaths = [
      'react',
      'next',
      '@/components',
      '@/lib',
      '@/hooks',
      '@/types'
    ];

    // Try to find in node_modules or local files
    for (const basePath of commonPaths) {
      try {
        // This is simplified - real implementation would search files
        if (basePath.startsWith('@/')) {
          const localPath = basePath.replace('@/', '');
          const fullPath = path.join(this.projectRoot, localPath);
          if (fs.existsSync(fullPath)) {
            // Search for symbol in files
            const found = this.searchForSymbol(symbol, fullPath);
            if (found) {
              return `${basePath}/${found}`;
            }
          }
        } else {
          // Check if it's a node module
          try {
            require.resolve(basePath);
            return basePath;
          } catch {}
        }
      } catch {}
    }

    return null;
  }

  /**
   * Search for symbol in directory
   */
  searchForSymbol(symbol, dir) {
    try {
      const files = fs.readdirSync(dir, { recursive: true });
      for (const file of files) {
        if (file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.js') || file.endsWith('.jsx')) {
          const filePath = path.join(dir, file);
          const content = fs.readFileSync(filePath, 'utf8');
          
          // Check for export
          if (content.includes(`export`) && content.includes(symbol)) {
            return file.replace(/\.(ts|tsx|js|jsx)$/, '');
          }
        }
      }
    } catch {}
    return null;
  }

  /**
   * Fix unused variable by removing it
   */
  async fixUnusedVariable(filePath, lineNumber) {
    try {
      if (!fs.existsSync(filePath)) {
        return false;
      }

      const content = fs.readFileSync(filePath, 'utf8');
      const lines = content.split('\n');
      
      if (lineNumber > 0 && lineNumber <= lines.length) {
        const line = lines[lineNumber - 1];
        
        // Try to remove unused variable declaration
        if (line.includes('const ') || line.includes('let ') || line.includes('var ')) {
          // Check if it's only declaration (no usage)
          const varName = line.match(/(?:const|let|var)\s+(\w+)/)?.[1];
          if (varName) {
            const usageCount = content.split(varName).length - 1;
            if (usageCount <= 1) {
              // Only appears in declaration, safe to remove
              lines.splice(lineNumber - 1, 1);
              fs.writeFileSync(filePath, lines.join('\n'), 'utf8');
              return true;
            }
          }
        }
      }
    } catch (error) {
      console.error(`Failed to fix unused variable: ${error.message}`);
    }
    
    return false;
  }

  /**
   * Install missing package
   */
  async installPackage(packageName) {
    try {
      console.log(`Installing package: ${packageName}`);
      execSync(`npm install ${packageName}`, {
        cwd: this.projectRoot,
        stdio: 'inherit'
      });
      return true;
    } catch (error) {
      console.error(`Failed to install package: ${error.message}`);
      return false;
    }
  }

  /**
   * Fix TypeScript type errors
   */
  async fixTypeError(filePath, error) {
    try {
      if (!fs.existsSync(filePath)) {
        return false;
      }

      const content = fs.readFileSync(filePath, 'utf8');
      
      // Common type fixes
      if (error.includes('possibly null')) {
        // Add null check
        return this.addNullCheck(content, filePath);
      }
      
      if (error.includes('not assignable')) {
        // Try to fix type assertion
        return this.fixTypeAssertion(content, filePath, error);
      }
      
    } catch (error) {
      console.error(`Failed to fix type error: ${error.message}`);
    }
    
    return false;
  }

  addNullCheck(content, filePath) {
    // This would need more sophisticated analysis
    // Simplified version
    return false;
  }

  fixTypeAssertion(content, filePath, error) {
    // This would need more sophisticated analysis
    // Simplified version
    return false;
  }

  /**
   * Fix syntax errors
   */
  async fixSyntaxError(filePath, error) {
    try {
      if (!fs.existsSync(filePath)) {
        return false;
      }

      const content = fs.readFileSync(filePath, 'utf8');
      
      // Common syntax fixes
      if (error.includes('Unexpected token')) {
        // Try to fix common issues like missing semicolons, brackets
        return this.fixCommonSyntaxIssues(content, filePath);
      }
      
    } catch (error) {
      console.error(`Failed to fix syntax error: ${error.message}`);
    }
    
    return false;
  }

  fixCommonSyntaxIssues(content, filePath) {
    // Try to fix missing brackets, quotes, etc.
    // This is simplified - real implementation would use AST parser
    let fixed = content;
    let changed = false;
    
    // Fix missing closing brackets (very basic)
    const openBrackets = (fixed.match(/\{/g) || []).length;
    const closeBrackets = (fixed.match(/\}/g) || []).length;
    
    if (openBrackets > closeBrackets && !fixed.trim().endsWith('}')) {
      fixed += '\n}';
      changed = true;
    }
    
    if (changed) {
      fs.writeFileSync(filePath, fixed, 'utf8');
      return true;
    }
    
    return false;
  }
}

module.exports = ErrorFixer;






