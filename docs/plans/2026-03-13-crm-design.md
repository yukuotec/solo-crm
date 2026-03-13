# Solo Entrepreneur CRM - Design Document

**Date:** March 13, 2026  
**Status:** Approved

## Overview

A minimalist, fast, local-first CRM application designed for solo entrepreneurs who need to manage contacts, companies, deals, and activities without complexity or cloud dependencies.

## Target User

- Solo entrepreneur / solopreneur
- Single user, no multi-user requirements
- Values simplicity and speed over features
- No learning curve desired

## Tech Stack

| Layer | Technology | Rationale |
|-------|------------|-----------|
| Desktop Shell | Electron | Cross-platform (Windows/macOS/Linux), native-like experience |
| UI Framework | React | Component-based, lightweight, familiar |
| Database | SQLite | Local storage, no server, zero config, single file |
| Backend | Node.js | Electron native, simple logic layer |
| Styling | CSS/Tailwind | Minimalist, fast rendering |

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
│  │   (Business Logic, APIs)    │    │
│  └──────────────┬──────────────┘    │
│                 │                   │
│  ┌──────────────▼──────────────┐    │
│  │       SQLite Database       │    │
│  │    (Local .db file)         │    │
│  └─────────────────────────────┘    │
└─────────────────────────────────────┘
```

## Core Modules

### 1. Contacts
- **Fields:** Name, email, phone, company (link), tags, notes, created/updated dates
- **Actions:** Add, edit, delete, search, filter by tags/company

### 2. Companies
- **Fields:** Name, website, industry, address, phone, notes
- **Actions:** Add, edit, delete, view linked contacts

### 3. Deals/Pipeline
- **Fields:** Title, contact (link), company (link), stage, value, probability, close date, notes
- **Stages:** Lead → Qualified → Proposal → Negotiation → Closed Won/Lost
- **Actions:** Add, edit, move stages, filter by stage

### 4. Tasks
- **Fields:** Title, description, due date, priority, status, related contact/deal
- **Actions:** Add, complete, snooze, filter by due date/priority

### 5. Activities
- **Types:** Call, Meeting, Email, Note, Other
- **Fields:** Type, date/time, contact (link), deal (link), notes
- **Actions:** Log activity, view history per contact/deal

### 6. Dashboard
- **Widgets:**
  - Pipeline summary (deals by stage, total value)
  - Upcoming tasks (next 7 days)
  - Recent activities
  - Quick stats (total contacts, companies, deals)

## UI Design Principles

- **Minimalist:** Clean interfaces, no visual clutter
- **Fast:** Quick load times, instant search, keyboard shortcuts
- **Keyboard-friendly:** Navigate and act without mouse
- **Dark mode:** Easy on the eyes for long sessions
- **No fluff:** No unnecessary animations or decorations

## Data Model

### Database Schema (SQLite)

```sql
-- Contacts
contacts (id, name, email, phone, company_id, tags, notes, created_at, updated_at)

-- Companies
companies (id, name, website, industry, address, phone, notes, created_at, updated_at)

-- Deals
deals (id, title, contact_id, company_id, stage, value, probability, close_date, notes, created_at, updated_at)

-- Tasks
tasks (id, title, description, due_date, priority, status, contact_id, deal_id, created_at, updated_at)

-- Activities
activities (id, type, date, contact_id, deal_id, notes, created_at)
```

## Data Storage

- **Location:** User's local machine (app data directory)
- **Format:** Single SQLite database file (`crm.db`)
- **Backup:** User copies the .db file manually
- **Sync:** None (local-only by design)

## Non-Goals (Out of Scope for v1)

- Cloud sync
- Multi-user support
- Email/Calendar/Phone integrations
- Mobile app
- Advanced reporting/analytics
- API for third-party integrations

## Success Criteria

- ✅ User can add a contact in under 30 seconds
- ✅ User can view pipeline status at a glance
- ✅ App launches in under 2 seconds
- ✅ Zero configuration required
- ✅ Works offline (always)
- ✅ Data exportable (SQLite dump or CSV)

## Future Considerations

- CSV import/export
- Data backup reminders
- Keyboard shortcuts cheat sheet
- Custom pipeline stages
- Email templates for quick responses

---

## Approval

**Design approved by user:** March 13, 2026
