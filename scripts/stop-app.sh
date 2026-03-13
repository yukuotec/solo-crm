#!/bin/bash
#
# stop-app.sh - Fully stop solo-crm app
#
# Usage: ./scripts/stop-app.sh
#

set -e

APP_NAME="solo-crm"

echo "========================================"
echo "  $APP_NAME - Stop"
echo "========================================"
echo ""

# Stop all related processes
echo "🛑 Stopping processes..."

# Kill Electron processes
if pgrep -f "Electron" > /dev/null; then
  pkill -f "Electron"
  echo "   ✓ Killed Electron processes"
else
  echo "   - No Electron processes running"
fi

# Kill vite dev server
if pgrep -f "vite" > /dev/null; then
  pkill -f "vite"
  echo "   ✓ Killed Vite processes"
else
  echo "   - No Vite processes running"
fi

# Kill npm dev processes
if pgrep -f "npm run dev" > /dev/null; then
  pkill -f "npm run dev"
  echo "   ✓ Killed npm dev processes"
else
  echo "   - No npm dev processes running"
fi

# Wait for processes to fully terminate
sleep 2

# Force kill if still running
if pgrep -f "Electron|vite|npm run dev" > /dev/null; then
  echo "   ⚠️  Forcing kill..."
  pkill -9 -f "Electron" 2>/dev/null || true
  pkill -9 -f "vite" 2>/dev/null || true
  pkill -9 -f "npm run dev" 2>/dev/null || true
fi

echo ""
echo "========================================"
echo "  ✅ $APP_NAME Stopped"
echo "========================================"
