# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Solo Entrepreneur CRM - A local-first, minimalist desktop CRM application for single users. Built with Electron, React, and SQLite.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Desktop Shell | Electron |
| UI Framework | React |
| Database | SQLite (better-sqlite3) |
| Backend | Node.js |
| Styling | Custom CSS (dark mode) |
| State | Zustand |

## Architecture

```
┌─────────────────────────────────────┐
│           Electron App              │
│  ┌─────────────────────────────┐    │
│  │       React Frontend        │    │
│  │  (Views, Components, State) │    │
│  └──────────────┬──────────────┘    │
│                 │                   │
│  ┌──────────────▼──────────────┐    │
│  │      Node.js Backend        │    │
│  │   (Business Logic, IPC)     │    │
│  └──────────────┬──────────────┘    │
│                 │                   │
│  ┌──────────────▼──────────────┐    │
│  │       SQLite Database       │    │
│  │    (Local .db file)         │    │
│  └─────────────────────────────┘    │
└─────────────────────────────────────┘
```

## Core Modules

1. **Contacts** - Name, email, phone, company link, tags, notes
2. **Companies** - Name, website, industry, address, phone
3. **Deals/Pipeline** - Title, contact, company, stage, value, probability, close date
4. **Tasks** - Title, description, due date, priority, status
5. **Activities** - Call, Meeting, Email, Note types with timestamps
6. **Dashboard** - Pipeline summary, upcoming tasks, recent activities, quick stats

## Implementation Status

**Current Phase:** Phase 2 Complete - Core UI ready for enhancement

### Completed
- ✅ Phase 1: Project setup (Electron, React, Vite, Zustand, logging)
- ✅ Phase 2: Database layer (SQLite, migrations, repositories, IPC)
- ✅ Basic UI: Sidebar navigation, dashboard, all module views with CRUD forms
- ✅ Pipeline Kanban board for deals
- ✅ Task management with priorities

### Pending (Phase 3+)
- [ ] Tailwind CSS migration (currently custom CSS)
- [ ] Reusable components: Modal, Toast, DataTable, SearchBar, Pagination
- [ ] ErrorBoundary component
- [ ] Global keyboard shortcuts
- [ ] Global search across entities
- [ ] CSV import/export
- [ ] Activities module UI

Refer to `docs/plans/2026-03-13-crm-implementation-plan.md` for full details.

## Commands

```bash
# Development
npm run dev          # Start Vite + Electron

# Build
npm run build        # Build renderer + create distributable
npm run build:renderer  # Build renderer only

# Code quality
npm run lint         # Run ESLint
npm run lint:fix     # Auto-fix issues
npm run format       # Run Prettier
```

## Key Files

- `src/main/main.js` - Electron main process entry
- `src/main/preload.js` - IPC bridge (contextBridge)
- `src/main/ipc-handlers.js` - All IPC request handlers
- `src/db/database.js` - SQLite init + migrations
- `src/db/repositories/` - Data repositories (CRUD)
- `src/shared/store.js` - Zustand state management
- `src/renderer/App.jsx` - Main React component

## Design Principles

- **Minimalist:** Clean interfaces, no visual clutter
- **Fast:** Quick load times, instant search, keyboard shortcuts
- **Keyboard-friendly:** Navigate and act without mouse
- **Dark mode:** Built-in from the start
- **Local-first:** Single SQLite file, zero config, works offline

## Data Model

```
contacts (id, name, email, phone, company_id, tags, notes, created_at, updated_at)
companies (id, name, website, industry, address, phone, notes, created_at, updated_at)
deals (id, title, contact_id, company_id, stage, value, probability, close_date, notes, created_at, updated_at)
tasks (id, title, description, due_date, priority, status, contact_id, deal_id, created_at, updated_at)
activities (id, type, date, contact_id, deal_id, notes, created_at)
```

## Non-Goals (v1)

- Cloud sync
- Multi-user support
- Email/Calendar/Phone integrations
- Mobile app
- Advanced analytics

## Documentation

- `docs/plans/2026-03-13-crm-design.md` - Full design document with requirements
- `docs/plans/2026-03-13-crm-implementation-plan.md` - Phased implementation plan with milestones
