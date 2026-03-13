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
| Styling | Tailwind CSS |

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

**Current Phase:** Phase 1 - Project Setup & Scaffolding

Refer to `docs/plans/2026-03-13-crm-implementation-plan.md` for the full implementation plan with milestones and priority order.

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
