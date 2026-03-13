# Solo Entrepreneur CRM - Implementation Plan

**Date:** March 13, 2026  
**Based on:** [Design Document](./2026-03-13-crm-design.md)

---

## Phase 1: Project Setup & Scaffolding

### Milestone 1.1: Initialize Project
- [ ] Create package.json with Electron, React, SQLite dependencies
- [ ] Set up project structure (src/, public/, resources/)
- [ ] Configure webpack/vite bundler for Electron + React
- [ ] Set up ESLint + Prettier for code quality
- [ ] Initialize git repository (done)
- [ ] Choose state management (Zustand recommended for simplicity)

### Milestone 1.2: Electron Base
- [ ] Create main process (main.js)
- [ ] Create preload script for secure IPC
- [ ] Set up Electron window with React renderer
- [ ] Configure app icons and metadata
- [ ] Enable context isolation, disable remote module
- [ ] Set up Content Security Policy
- [ ] Test basic Electron app launches

### Milestone 1.3: Logging
- [ ] Set up main process logging (file + console)
- [ ] Set up renderer process logging
- [ ] Define log levels (error, warn, info, debug)

**Deliverable:** Empty Electron app with React renders successfully, logging configured

---

## Phase 2: Database Layer

### Milestone 2.1: SQLite Setup
- [ ] Install better-sqlite3 (synchronous SQLite for Node)
- [ ] Create database initialization module
- [ ] Define schema (contacts, companies, deals, tasks, activities)
- [ ] Create migration system for schema updates
- [ ] Set up database path in user data directory

### Milestone 2.2: Data Models & Repository Pattern
- [ ] Create Contact model + repository
- [ ] Create Company model + repository
- [ ] Create Deal model + repository
- [ ] Create Task model + repository
- [ ] Create Activity model + repository
- [ ] Implement CRUD operations for each

### Milestone 2.3: IPC Bridge
- [ ] Define IPC channels for database operations
- [ ] Create secure handlers in main process
- [ ] Expose database API to renderer via preload
- [ ] Add error handling and validation

**Deliverable:** Full CRUD operations working for all entities via IPC

---

## Phase 3: Core UI Components

### Milestone 3.1: Design System
- [ ] Set up Tailwind CSS
- [ ] Define color palette (light + dark mode)
- [ ] Create base components (Button, Input, Select, Modal)
- [ ] Create layout components (Sidebar, Header, Main)
- [ ] Implement dark mode toggle

### Milestone 3.2: Navigation & Layout
- [ ] Create main app shell (sidebar navigation)
- [ ] Implement route switching (React Router)
- [ ] Create navigation items (Dashboard, Contacts, Companies, Deals, Tasks)
- [ ] Add keyboard navigation support

### Milestone 3.3: Common Patterns
- [ ] Create DataTable component (sortable, filterable)
- [ ] Create SearchBar component
- [ ] Create Pagination component
- [ ] Create EmptyState component
- [ ] Create LoadingState component
- [ ] Create Toast/Notification component
- [ ] Create ErrorBoundary component (React error boundaries)

### Milestone 3.4: Keyboard Shortcuts
- [ ] Global shortcuts (Cmd/Ctrl+N for new, Cmd/Ctrl+K for search)
- [ ] Keyboard navigation (arrow keys, Enter, Escape)
- [ ] Shortcuts infrastructure (extensible for module-specific shortcuts)

**Deliverable:** Reusable UI component library ready, keyboard navigation functional

---

## Phase 4: Feature Modules

### Milestone 4.1: Dashboard
- [ ] Create dashboard layout
- [ ] Implement pipeline summary widget (deals by stage)
- [ ] Implement upcoming tasks widget (next 7 days)
- [ ] Implement recent activities widget
- [ ] Implement quick stats widget
- [ ] Add refresh mechanism

### Milestone 4.2: Contacts Module
- [ ] Contacts list view (table with search/filter)
- [ ] Contact detail view
- [ ] Add/Edit contact form
- [ ] Delete contact with confirmation
- [ ] Tag management
- [ ] Link to company

### Milestone 4.3: Companies Module
- [ ] Companies list view
- [ ] Company detail view
- [ ] Add/Edit company form
- [ ] Delete company with confirmation
- [ ] View linked contacts

### Milestone 4.4: Deals/Pipeline Module
- [ ] Pipeline board view (Kanban style)
- [ ] Deal detail view
- [ ] Add/Edit deal form
- [ ] Drag-and-drop stage changes
- [ ] Deal value formatting
- [ ] Probability calculations

### Milestone 4.5: Tasks Module
- [ ] Tasks list view (with filters)
- [ ] Add/Edit task form
- [ ] Mark task complete
- [ ] Task priority indicators
- [ ] Due date highlighting (overdue, today, upcoming)

### Milestone 4.6: Activities Module
- [ ] Activity log per contact/deal
- [ ] Log new activity form
- [ ] Activity type icons (call, meeting, email, note)
- [ ] Activity timeline view
- [ ] Filter by type/date

**Deliverable:** All core modules functional

---

## Phase 5: Polish & UX

### Milestone 5.1: Global Search
- [ ] Global search across contacts, companies, deals
- [ ] Search keyboard shortcut (Cmd/Ctrl+K) launcher
- [ ] Advanced filters per module
- [ ] Saved filters (optional stretch goal)

### Milestone 5.2: Data Import/Export
- [ ] Export to CSV (contacts, companies, deals)
- [ ] Import from CSV (basic support)
- [ ] Database backup reminder

### Milestone 5.3: Error Handling
- [ ] User-friendly error messages
- [ ] Graceful degradation
- [ ] IPC error propagation to UI

**Deliverable:** Polished, user-friendly application

---

## Phase 6: Testing & Quality

### Milestone 6.1: Unit Tests
- [ ] Set up Jest testing framework
- [ ] Test database operations
- [ ] Test business logic
- [ ] Test utility functions

### Milestone 6.2: Integration Tests
- [ ] Test IPC communication
- [ ] Test full CRUD flows
- [ ] Test error scenarios

### Milestone 6.3: Manual Testing
- [ ] Create test checklist
- [ ] Test all user flows
- [ ] Test edge cases (empty states, large datasets)
- [ ] Cross-platform testing (Windows, macOS, Linux)

**Deliverable:** Test suite passing, bugs fixed

---

## Phase 7: Build & Distribution

### Milestone 7.1: Build Configuration
- [ ] Configure electron-builder
- [ ] Set up app icons for all platforms
- [ ] Configure code signing (optional)
- [ ] Create build scripts

### Milestone 7.2: Platform Builds
- [ ] Build Windows installer (.exe)
- [ ] Build macOS app (.dmg)
- [ ] Build Linux package (.deb/.AppImage)
- [ ] Test installed applications

### Milestone 7.3: Documentation
- [ ] Write README.md
- [ ] Create user guide
- [ ] Document keyboard shortcuts
- [ ] Add troubleshooting guide

**Deliverable:** Production-ready builds for all platforms

---

## Timeline Estimate

| Phase | Estimated Time |
|-------|---------------|
| Phase 1: Setup | 2-3 days |
| Phase 2: Database | 2-3 days |
| Phase 3: UI Components | 3-4 days |
| Phase 4: Features | 5-7 days |
| Phase 5: Polish | 1-2 days |
| Phase 6: Testing | 2-3 days |
| Phase 7: Build | 1-2 days |
| **Total** | **16-24 days** |

---

## Development Approach: Vertical Slices

After Phase 3 (UI Components), consider building **one complete feature end-to-end** before tackling all modules:

1. Build Contacts module fully (DB → IPC → UI → Tests)
2. This validates the entire architecture early
3. Then replicate the pattern for Companies, Deals, etc.

This approach catches integration issues sooner than building all layers horizontally.

---

## Priority Order (MVP First)

If time-constrained, build in this order:

1. ✅ Project setup + Database layer
2. ✅ Contacts module (list + CRUD)
3. ✅ Companies module (list + CRUD)
4. ✅ Deals module (list + CRUD, basic pipeline)
5. ✅ Dashboard (basic stats)
6. ✅ Tasks module
7. ⏸️ Activities module (can be v1.1)
8. ⏸️ Advanced features (import/export, global search, saved filters)

---

## Next Steps

Ready to begin implementation. Start with **Phase 1, Milestone 1.1**.
