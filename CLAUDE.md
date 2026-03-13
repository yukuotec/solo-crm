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
| State | Zustand |
| Styling | Custom CSS (dark mode) |

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
6. **Dashboard** - Pipeline summary, upcoming tasks, quick stats

## Implementation Status

**Current Phase:** Phase 3 Complete - Feature-rich CRM ready for use

### Completed
- ✅ Phase 1: Project setup (Electron, React, Vite, Zustand, logging)
- ✅ Phase 2: Database layer (SQLite, migrations, repositories, IPC)
- ✅ Phase 3: Core UI components and enhancements
- ✅ Sidebar navigation with tab switching
- ✅ Dashboard with stats, pipeline summary, upcoming tasks
- ✅ Pipeline Kanban board for deals
- ✅ Task management with priorities and status toggle
- ✅ **Modal component** for forms with ESC key close
- ✅ **Toast notifications** for user feedback
- ✅ **Global search** (Cmd/Ctrl+K) across contacts, companies, deals
- ✅ **CSV export** for all data types
- ✅ **ErrorBoundary** for graceful error handling
- ✅ **Detail views** showing relations (Contact → deals/tasks/activities, Company → contacts)
- ✅ File system IPC handlers for exports

### Pending
- [ ] Activities module UI (logging, timeline view)
- [ ] DataTable with sorting and pagination
- [ ] Delete confirmations with ConfirmModal
- [ ] Contact/Company/Deal linking in forms
- [ ] Keyboard navigation (arrow keys)
- [ ] Data import from CSV

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

**Main Process:**
- `src/main/main.js` - Electron entry point, DB init
- `src/main/preload.js` - IPC bridge (contextBridge)
- `src/main/ipc-handlers.js` - All IPC request handlers
- `src/main/logger.js` - Main process logging

**Database:**
- `src/db/database.js` - SQLite init + migrations
- `src/db/repositories/` - CRUD repositories for each entity

**Renderer:**
- `src/renderer/App.jsx` - Main React component
- `src/renderer/components/` - Reusable UI components
- `src/shared/store.js` - Zustand state management

## Component Library

| Component | Description |
|-----------|-------------|
| `ToastProvider`, `useToast` | Toast notifications (success, error, warning, info) |
| `Modal`, `ConfirmModal` | Modal dialogs with ESC close |
| `GlobalSearch` | Cmd/Ctrl+K search across all entities |
| `ExportMenu` | CSV export dropdown |
| `ErrorBoundary` | React error boundary |
| `ContactDetail`, `CompanyDetail`, `DealDetail` | Detail views with relations |

## Design Principles

- **Minimalist:** Clean interfaces, no visual clutter
- **Fast:** Quick load times, instant search
- **Keyboard-friendly:** Global shortcuts (Cmd+K for search)
- **Dark mode:** Built-in from the start
- **Local-first:** Single SQLite file, zero config, works offline

## Data Model

```sql
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

- `docs/plans/2026-03-13-crm-design.md` - Full design document
- `docs/plans/2026-03-13-crm-implementation-plan.md` - Implementation plan
