#!/bin/bash
# Bash script to start error monitor on Unix/Linux/Mac
# Usage: ./start-monitor.sh [command] [args...]

COMMAND="${1:-npm}"
shift
ARGS="${@:-run dev}"

echo "Starting Error Monitor..."
echo "Command: $COMMAND $ARGS"

node error-monitor.js $COMMAND $ARGS






