# Quick Start Guide

## Prerequisites
- Node.js 18+
- npm

## Installation

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev
```

## Usage

### Navigation
- Click sidebar items to switch between views
- Use **Cmd/Ctrl+K** for global search

### Contacts
1. Click "Contacts" in sidebar
2. Click "+ Add Contact" to create a new contact
3. Fill in the form and click "Save Contact"
4. Export contacts to CSV using the Export button

### Companies
1. Click "Companies" in sidebar
2. Click "+ Add Company" to create
3. View linked contacts count in the table

### Deals Pipeline
1. Click "Deals" in sidebar
2. View deals organized by stage in Kanban board
3. Click "+ Add Deal" to create a new deal
4. Set value, probability, and close date

### Tasks
1. Click "Tasks" in sidebar
2. Click "+ Add Task" to create
3. Click the checkbox to toggle task completion
4. Tasks are sorted by due date and priority

### Dashboard
- View total counts for contacts, companies, deals
- See pipeline value and deal distribution by stage
- View upcoming tasks for the next 7 days

### Global Search
- Press **Cmd/Ctrl+K** to open search
- Type to search across contacts, companies, and deals
- Press **ESC** to close

### Export Data
- Each module has an Export button
- Click to download CSV of all records

## Data Storage

Data is stored locally in SQLite database:
- **macOS**: `~/Library/Application Support/solo-crm/crm.db`
- **Windows**: `%APPDATA%/solo-crm/crm.db`
- **Linux**: `~/.config/solo-crm/crm.db`

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Cmd/Ctrl + K` | Open global search |
| `Escape` | Close modal/search |

## Production Build

```bash
# Build for production
npm run build

# Output: dist/ folder with distributable files
```
