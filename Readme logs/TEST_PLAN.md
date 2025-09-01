# Catalyst HR System - Comprehensive Test Plan

This document defines manual test cases and validation checklists for all pages and core features across Catalyst HR System. Use it for QA passes before demos and releases.

## How to run locally (Windows)
- Prereqs: Node.js 16+ (PowerShell OK)
- Start server: `npm start`
- Open: http://localhost:3000
- Optional validation: `npm run validate` (checks broken local links/assets)
- Demo credentials (password: demo123):
  - Regular: demo@catalyst.com
  - Admin: admin@catalyst.com
  - TH: th@catalyst.com
  - Hiring: hiring@catalyst.com

## Global checks (all pages)
- [ ] Nav loads and active item highlights
- [ ] Footer links work
- [ ] Layout responsive (sm/md/lg)
- [ ] No console errors
- [ ] Images have alt text
- [ ] Keyboard navigation and focus visible
- [ ] Links and buttons have discernible names (aria-label where needed)

## Authentication
- [ ] Login modal opens from navbar
- [ ] Valid/invalid inputs show feedback
- [ ] Demo login sets UI state and replaces auth buttons
- [ ] Logout restores guest UI
- [ ] Register modal validates passwords and email

## Gamification (new)
- [ ] Progress UI visible (level, XP)
- [ ] On login: +25 XP and progress bar updates
- [ ] On job view: +10 XP toast appears
- [ ] On job apply: +100 XP and level ups show notifications
- [ ] Achievements unlock as thresholds reached

## AI Matching (new)
- [ ] Job cards show AI % badge
- [ ] Tooltip shows “Coincidencia AI”
- [ ] Job details modal shows AI % badge
- [ ] Score changes when user profile (skills, location) changes (localStorage userProfile)

## Home (index.html)
- [ ] Hero badges show (HR + Partner Riwi)
- [ ] Featured jobs cards images render (no broken links)
- [ ] “Ver detalles” opens job modal, “Aplicar ahora” gates to login when needed
- [ ] Courses cards images render

## Jobs (pages/empleos.html)
- [ ] Search filters apply and list updates
- [ ] Job cards render company name and verified badge
- [ ] Details modal content: requirements, benefits, location
- [ ] AI badge present on cards and modal (if reused)

## Job Details (pages/detalles-empleo.html | pages/detalle-empleo.html)
- [ ] Content loads (description, responsibilities)
- [ ] Apply button requires login (modal, not redirect)

## Companies (pages/empresas.html)
- [ ] Logos and verified badges present
- [ ] Company detail links load

## HR Modules
- Resume DB (pages/resume-database.html)
  - [ ] Candidate cards render
  - [ ] Filters and search work
  - [ ] Document links open
- Hiring Dashboard (pages/hiring-dashboard.html)
  - [ ] Metrics, charts load (no errors)
  - [ ] Navigation to pipelines
- Kanban (pages/kanban.html)
  - [ ] Columns and drag-and-drop work (if enabled)
  - [ ] Candidate details open
- Reports (pages/reports.html)
  - [ ] Charts show and export buttons exist

## Training
- Courses (pages/capacitaciones.html)
  - [ ] List displays, categories filter
  - [ ] Course details open (pages/detalles-curso.html)
- Mis Cursos (pages/mis-cursos.html) [auth]
  - [ ] Enrolled list appears (after enroll API ready)
- Certificados (pages/certificados.html) [auth]
  - [ ] Certificates list renders

## User Profile (pages/perfil.html)
- [ ] Profile sections load
- [ ] Edit/save shows confirmation (local only if DB not configured)
- [ ] Image upload UI present (uploads will require server DB)

## Admin/User Management
- User Management (pages/user-management.html)
  - [ ] Table renders users
  - [ ] Role changes (when backend ready)
- Roles (pages/roles.html)
  - [ ] Role descriptions and permissions visible

## Legal/Policy
- [ ] Términos (pages/terminos.html) opens
- [ ] Privacidad (pages/privacidad.html) opens
- [ ] Cookies (pages/cookies.html) opens

## Analytics/Performance
- [ ] Home and heavy pages load < 2s on localhost
- [ ] No 404 network requests
- [ ] Images lazy-load where appropriate

## Known Issues / Follow-ups
- Database connection requires MariaDB/MySQL; frontend runs with db.json fallback
- Some admin actions depend on backend DB

## Sign-off
- QA Name: ______________________   Date: ___________
- Reviewer: ______________________  Date: ___________

