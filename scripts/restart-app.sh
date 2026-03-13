#!/bin/bash
#
# restart-app.sh - Full stop and restart for solo-crm
#
# Usage: ./scripts/restart-app.sh
#

set -e

APP_NAME="solo-crm"
DB_PATH="$HOME/Library/Application Support/solo-crm/crm.db"

echo "========================================"
echo "  $APP_NAME - Full Stop & Restart"
echo "========================================"
echo ""

# Step 1: Stop all related processes
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
echo "   ⏳ Waiting 2 seconds..."
sleep 2

# Verify all stopped
if pgrep -f "Electron|vite|npm run dev" > /dev/null; then
  echo "   ⚠️  Some processes still running, forcing kill..."
  pkill -9 -f "Electron" 2>/dev/null || true
  pkill -9 -f "vite" 2>/dev/null || true
  pkill -9 -f "npm run dev" 2>/dev/null || true
  sleep 1
fi

echo ""

# Step 2: Verify database
echo "📁 Checking database..."
if [ -f "$DB_PATH" ]; then
  COMPANIES=$(sqlite3 "$DB_PATH" "SELECT COUNT(*) FROM companies;" 2>/dev/null || echo "0")
  DEALS=$(sqlite3 "$DB_PATH" "SELECT COUNT(*) FROM deals;" 2>/dev/null || echo "0")
  echo "   ✓ Database found: $DB_PATH"
  echo "   📊 Companies: $COMPANIES"
  echo "   📊 Deals: $DEALS"
else
  echo "   ⚠️  Database not found at: $DB_PATH"
  echo "   Database will be created on first app launch"
fi
echo ""

# Step 3: Start the app
echo "🚀 Starting $APP_NAME..."
echo ""

# Start in background
npm run dev &

# Wait for app to start
echo "   ⏳ Waiting for app to start (10 seconds)..."
sleep 10

# Verify app is running
if pgrep -f "Electron \." > /dev/null; then
  echo ""
  echo "========================================"
  echo "  ✅ $APP_NAME Started Successfully!"
  echo "========================================"
  echo ""
  echo "App processes:"
  ps aux | grep "Electron \." | grep -v grep | head -3
  echo ""
  echo "To stop: ./scripts/stop-app.sh"
  echo "To view logs: tail -f ~/Library/Application\\ Support/solo-crm/logs/*.log"
else
  echo ""
  echo "========================================"
  echo "  ⚠️  App may not have started correctly"
  echo "========================================"
  echo ""
  echo "Check for errors in the output above"
  echo "Or run: npm run dev"
fi
