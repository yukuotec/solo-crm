# App Scripts

## Usage

### Stop the App

```bash
./scripts/stop-app.sh
```

### Restart the App (Full Stop + Start)

```bash
./scripts/restart-app.sh
```

### Quick Commands

| Command | Description |
|---------|-------------|
| `./scripts/stop-app.sh` | Stop all app processes |
| `./scripts/restart-app.sh` | Stop and restart the app |
| `npm run dev` | Start development mode |

## What the Scripts Do

### stop-app.sh
1. Kills all Electron processes
2. Kills all Vite dev server processes
3. Kills all npm dev processes
4. Waits 2 seconds for clean shutdown
5. Force kills if any processes remain

### restart-app.sh
1. Stops all processes (same as stop-app.sh)
2. Checks database status (companies/deals count)
3. Starts the app with `npm run dev`
4. Waits 10 seconds for startup
5. Verifies app is running

## Troubleshooting

### Check if app is running

```bash
ps aux | grep "Electron \." | grep -v grep
```

### Check database

```bash
sqlite3 ~/Library/Application\ Support/solo-crm/crm.db "SELECT COUNT(*) FROM companies;"
```

### View logs

```bash
tail -f ~/Library/Application\ Support/solo-crm/logs/*.log
```

### Manual stop (if script fails)

```bash
pkill -9 -f Electron
pkill -9 -f vite
pkill -9 -f "npm run dev"
```

## Keyboard Shortcuts (in running app)

| Shortcut | Action |
|----------|--------|
| `Cmd+Q` | Quit app |
| `Cmd+K` | Global search |
| `Escape` | Close modal/search |
