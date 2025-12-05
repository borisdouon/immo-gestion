# PowerShell script to start error monitor on Windows
# Usage: .\start-monitor.ps1 [command] [args...]

param(
    [string]$Command = "npm",
    [string[]]$Args = @("run", "dev")
)

Write-Host "Starting Error Monitor..." -ForegroundColor Green
Write-Host "Command: $Command $($Args -join ' ')" -ForegroundColor Cyan

node error-monitor.js $Command $Args






