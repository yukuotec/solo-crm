# Solo CRM

A minimalist, local-first CRM application for solo entrepreneurs.

## Features

- **Contacts** - Manage your professional contacts with email, phone, and notes
- **Companies** - Track companies and link contacts to them
- **Deals Pipeline** - Visual Kanban-style pipeline to track your deals through stages
- **Tasks** - Manage your todo list with priorities and due dates
- **Activities** - Log calls, meetings, emails, and notes (coming soon)
- **Dashboard** - Get an overview of your pipeline, tasks, and key metrics

## Tech Stack

- **Electron** - Cross-platform desktop app
- **React** - Component-based UI
- **SQLite** - Local database (single file, no server needed)
- **Zustand** - Lightweight state management
- **Tailwind CSS** - Utility-first styling

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Build for production
npm run build
```

### Development Mode

Running `npm run dev` will:
1. Start the Vite dev server for the React renderer (port 5173)
2. Launch Electron once the renderer is ready
3. Enable hot reload for React components

### Production Build

Running `npm run build` will create distributable packages:
- **macOS**: `.dmg` file
- **Windows**: `.exe` installer
- **Linux**: `.AppImage` file

Builds are output to the `dist/` directory.

## Data Storage

All data is stored locally in a single SQLite database file:
- **macOS**: `~/Library/Application Support/solo-crm/crm.db`
- **Windows**: `%APPDATA%/solo-crm/crm.db`
- **Linux**: `~/.config/solo-crm/crm.db`

Logs are stored in the same directory under `logs/`.

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Cmd/Ctrl + N` | New item (context-dependent) |
| `Cmd/Ctrl + K` | Quick search |
| `Escape` | Close modal/cancel action |

## Project Structure

```
src/
├── main/           # Electron main process
│   ├── main.js     # Entry point
│   ├── preload.js  # Preload script (IPC bridge)
│   ├── logger.js   # Logging utility
│   └── ipc-handlers.js  # IPC request handlers
├── renderer/       # React renderer process
│   ├── App.jsx     # Main app component
│   ├── index.jsx   # React entry point
│   ├── index.css   # Global styles
│   └── logger.js   # Renderer logging
├── db/             # Database layer
│   ├── database.js     # SQLite initialization & migrations
│   └── repositories/   # Data repositories
└── shared/         # Shared code
    └── store.js    # Zustand state stores
```

## License

MIT
