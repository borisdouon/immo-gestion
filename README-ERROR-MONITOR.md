# Terminal Error Monitor & Auto-Fix Agent

An intelligent background service that continuously monitors your terminal output for errors and automatically fixes them using AI-powered analysis.

## Features

- 🔍 **Real-time Error Detection**: Monitors terminal output for TypeScript, ESLint, import, build, dependency, syntax, and type errors
- 🤖 **Auto-Fix Capabilities**: Automatically fixes common errors including:
  - Missing imports
  - Unused variables
  - Missing dependencies
  - Type errors
  - Syntax errors
- 📁 **File Watching**: Monitors file changes and checks for errors automatically
- 📝 **Comprehensive Logging**: Logs all detected errors and fixes to `error-monitor.log`
- ⚙️ **Configurable**: Customize behavior via `.error-monitor-config.json`

## Installation

1. Install required dependencies:
```bash
npm install chokidar --save-dev
```

2. The error monitor is ready to use!

## Usage

### Basic Usage

Run your development server with error monitoring:
```bash
npm run dev:monitor
```

Or monitor any command:
```bash
npm run monitor -- npm run build
npm run monitor -- npm test
```

### Manual Usage

```bash
node error-monitor.js [command] [args...]
```

Examples:
```bash
node error-monitor.js npm run dev
node error-monitor.js npm run build
node error-monitor.js npx tsc --watch
```

## Configuration

Edit `.error-monitor-config.json` to customize behavior:

```json
{
  "enabled": true,
  "autoFix": true,
  "logLevel": "INFO",
  "watchFiles": true,
  "patterns": {
    "typescript": true,
    "eslint": true,
    "import": true,
    "build": true,
    "dependency": true,
    "syntax": true,
    "type": true
  },
  "fixStrategies": {
    "installMissingPackages": true,
    "fixImports": true,
    "removeUnused": true,
    "fixSyntax": true,
    "fixTypes": true
  }
}
```

## How It Works

1. **Error Detection**: The monitor watches terminal output for error patterns
2. **Error Analysis**: When an error is detected, it's analyzed to determine the type and cause
3. **Auto-Fix**: The system attempts to automatically fix the error using predefined strategies
4. **Logging**: All actions are logged to `error-monitor.log` for review

## Supported Error Types

- **TypeScript Errors**: TS compilation errors
- **ESLint Errors**: Code quality and style issues
- **Import Errors**: Missing modules or incorrect import paths
- **Build Errors**: Compilation failures
- **Dependency Errors**: Missing npm packages
- **Syntax Errors**: JavaScript/TypeScript syntax issues
- **Type Errors**: TypeScript type mismatches

## Logs

All monitoring activity is logged to `error-monitor.log` in the project root. Check this file to see:
- Detected errors
- Fix attempts
- Success/failure status
- Timestamps

## Limitations

- Some complex errors may require manual intervention
- The auto-fix system prioritizes safety and may not fix all errors
- File watching requires `chokidar` package
- Some fixes may require project-specific knowledge

## Troubleshooting

If the monitor isn't working:
1. Ensure `chokidar` is installed: `npm install chokidar --save-dev`
2. Check `error-monitor.log` for details
3. Verify the configuration file exists and is valid JSON
4. Make sure you have write permissions for the project directory

## Stopping the Monitor

Press `Ctrl+C` to gracefully stop the monitor.






