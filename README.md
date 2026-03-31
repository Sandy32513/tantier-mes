# Operon OPS 1.0 — Smart Factory Operations Platform

> **System Name:** Operon Operations Platform Suite (Operon OPS 1.0)  
> **Company:** SS Electronics Pvt Ltd  
> **Version:** `1.0.0` | **Build:** `2026.03`  
> **Stack:** Node.js · Express.js · MySQL · HTML · CSS · JavaScript · Chart.js

---

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Project Structure](#project-structure)
4. [Frontend](#frontend)
5. [Backend](#backend)
6. [Database](#database)
7. [ER Diagram](#er-diagram)
8. [API Reference](#api-reference)
9. [Sample Data](#sample-data)
10. [Dependencies](#dependencies)
11. [Getting Started](#getting-started)
12. [CI/CD Pipeline](#cicd-pipeline)
13. [Completed Tasks](#completed-tasks)
14. [Pending Tasks](#pending-tasks)
15. [Known Bugs & Issues](#known-bugs--issues)
16. [Future Plans](#future-plans)
17. [Version History](#version-history)

---

## Overview

Operon OPS 1.0 is a **Manufacturing Execution System (MES)** built for SS Electronics Pvt Ltd. It provides real-time factory operations management across planning, execution, inventory, quality, and IIoT domains. The platform is designed for shop-floor operators, production supervisors, and quality inspectors.

### Key Capabilities

| Area | Description |
|---|---|
| **General Setup** | System config, org roles, custom tables, control numbers |
| **Master Data** | Employees, customers, item categories, subcategories, item master |
| **Factory Setup** | Factories, shifts, skills, skillsets, tools, equipment, production lines, processes |
| **Factory Uploads** | Bulk Excel/CSV import for tool groups, tools, equipment groups, equipment |
| **Product Configuration** | Manufacturing routes, BOM, product spec, common product spec, packing spec with full revision lifecycle |
| **Shopfloor Console** | KPI dashboard, QC filter panel, inspection table |
| **Job & Lot Management** | Job orders, lot list, move lot (UI stubs ready) |

---

## Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                        Browser (Client)                       │
│        HTML5 + Vanilla CSS + JavaScript (public/js/app.js)   │
│              Chart.js for KPI dashboards                      │
└───────────────────────────┬──────────────────────────────────┘
                            │ HTTP (REST)
                            ▼
┌──────────────────────────────────────────────────────────────┐
│                    Express.js Server (server.js)              │
│                                                               │
│  ┌─────────────┐  ┌───────────────┐  ┌────────────────────┐  │
│  │  Page Routes │  │  API Routes   │  │  Auth (/api/login) │  │
│  │  (35 views)  │  │  (20 domains) │  │  Health (/health)  │  │
│  └─────────────┘  └───────┬───────┘  └────────────────────┘  │
│                            │                                   │
│  ┌────────────────────────▼──────────────────────────────┐   │
│  │            Business Logic Layer                         │   │
│  │  routes/apiRouter.js    – Generic CRUD factory          │   │
│  │  routes/productConfiguration.js – Lifecycle management  │   │
│  │  routes/uploads.js       – Excel/CSV bulk upload        │   │
│  │  controllers/uploadController.js – Validation engine    │   │
│  │  models/createProductConfigModel.js – Revision model    │   │
│  │  services/excelParser.js – Spreadsheet parser           │   │
│  └────────────────────────┬──────────────────────────────┘   │
└───────────────────────────┼──────────────────────────────────┘
                            │ mysql2/promise (connection pool)
                            ▼
┌──────────────────────────────────────────────────────────────┐
│                   MySQL Database (tantier_mes)                │
│     25 tables · Auto-bootstrapped · Idempotent seed data     │
└──────────────────────────────────────────────────────────────┘
```

### Design Patterns

| Pattern | Where Applied |
|---|---|
| **Factory/Builder** | `createApiRouter(table, columns)` — generates full CRUD router for any table in one line |
| **Factory/Builder** | `createProductConfigModel(config)` — generates revision-aware model for any product config entity |
| **Middleware Guard** | `requireDb` — blocks all DB-backed routes if database is unavailable (graceful degraded mode) |
| **Retry + Backoff** | `initDatabase()` — retries MySQL connection up to 5× with exponential backoff + jitter |
| **Transaction Safety** | Upload bulk inserts and `activate()` use explicit `BEGIN/COMMIT/ROLLBACK` |
| **Idempotent Seeds** | `seedIfEmpty` / `ensureRows` — safe to run on every startup without duplicating data |

---

## Project Structure

```
tantier-mes/
├── server.js                    # App entry point, routes registration, shutdown handling
├── database.js                  # MySQL pool, schema bootstrap, seed logic, health check
├── package.json                 # Dependencies and npm scripts
├── .env.example                 # Environment variable template
├── .gitignore
├── start.bat / start.sh         # Quick-start scripts
│
├── routes/                      # Express route definitions
│   ├── apiRouter.js             # Generic CRUD router factory
│   ├── employees.js             # /api/employees
│   ├── customers.js             # /api/customers
│   ├── systemConfig.js          # /api/system-configurations
│   ├── organizationRole.js      # /api/organizational-roles
│   ├── customTables.js          # /api/custom-tables
│   ├── controlNumbers.js        # /api/control-numbers
│   ├── itemCategories.js        # /api/item-categories
│   ├── itemSubcategories.js     # /api/item-subcategories
│   ├── items.js                 # /api/items
│   ├── factories.js             # /api/factories
│   ├── shifts.js                # /api/shifts
│   ├── skills.js                # /api/skills
│   ├── skillsets.js             # /api/skillsets
│   ├── toolGroups.js            # /api/tool-groups
│   ├── tools.js                 # /api/tools
│   ├── equipmentGroups.js       # /api/equipment-groups
│   ├── equipment.js             # /api/equipment
│   ├── processes.js             # /api/processes
│   ├── productionLines.js       # /api/production-lines
│   ├── uploads.js               # /api/upload/:type (bulk Excel/CSV)
│   └── productConfiguration.js  # /api/product-config/* (revision lifecycle)
│
├── controllers/
│   ├── uploadController.js      # Upload validation engine (tool groups, tools, equipment groups, equipment)
│   └── productConfigController.js # Product config HTTP handler bridge
│
├── models/
│   ├── createProductConfigModel.js  # Revision lifecycle model factory
│   ├── manufacturingRouteModel.js   # Instance: manufacturing_routes
│   ├── bomModel.js                  # Instance: bill_of_materials
│   ├── productSpecModel.js          # Instance: product_specs
│   ├── commonProductSpecModel.js    # Instance: common_product_specs
│   └── packingSpecModel.js          # Instance: packing_specs
│
├── services/
│   └── excelParser.js           # xlsx-powered spreadsheet → row array parser
│
├── views/                       # Static HTML pages served by Express
│   ├── layout.html              # Reference shell template
│   ├── login.html               # Login page
│   ├── dashboard.html           # Main dashboard (KPI cards + Chart.js)
│   ├── employees.html           # Master Data pages (×5)
│   ├── factories.html           # Factory Setup pages (×10)
│   ├── manufacturingRoute.html  # Product Config pages (×5)
│   ├── shopfloorConsole.html    # Standalone shopfloor shell
│   ├── jobOrders.html           # Operations stub pages
│   └── ...                      # (35 total HTML views)
│
├── public/
│   ├── css/
│   │   ├── theme.css            # Centralized Microsoft-style color tokens
│   │   ├── main.css             # Application shell + all module styles
│   │   └── login.css            # Login-specific styles
│   ├── js/
│   │   ├── app.js               # Main SPA renderer — sidebar, modals, CRUD, toasts, pagination
│   │   └── login.js             # Login form submit + redirect
│   └── images/
│
├── scripts/
│   ├── setup-db.sql             # Base schema DDL (25 CREATE TABLE IF NOT EXISTS)
│   ├── seed-data.sql            # Standalone seed SQL (idempotent)
│   ├── setup.js                 # CLI database setup runner
│   ├── progress-update.js       # Repository scanner → Project_Progress.md auto-updater
│   └── publish-github.ps1       # PowerShell GitHub publish workflow
│
├── docs/
│   ├── index.html               # Project documentation index
│   └── README.md                # Docs sub-readme
│
└── src/
    ├── components/
    │   └── index.js             # Shared component utilities
    └── styles/
```

---

## Frontend

### Technology

| Item | Detail |
|---|---|
| Rendering | Static HTML files served directly by Express (`res.sendFile`) |
| Styling | Vanilla CSS with centralized design tokens in `theme.css` |
| Logic | Single JS bundle — `public/js/app.js` (~108 KB) |
| Charts | Chart.js v4.5.1 (dashboard KPI widgets) |
| Design System | Microsoft Fluent-inspired color palette, sidebar navigation, topbar, breadcrumbs, fixed footer |

### Pages (35 Views)

| Category | Pages |
|---|---|
| **Auth** | Login |
| **Core** | Dashboard |
| **General Setup** | System Configuration, Organizational Role, Custom Table Setup, Control Number Setup |
| **Master Data** | Employees, Customers, Item Categories, Item Subcategories, Item Master |
| **Factory Setup** | Factories, Shifts, Skills, Skillsets, Tool Groups, Tools, Equipment Groups, Equipment, Processes, Production Lines |
| **Factory Uploads** | Tool Group Upload, Tool Upload, Equipment Group Upload, Equipment Upload |
| **Product Configuration** | Manufacturing Route, Bill of Materials, Product Spec, Common Product Spec, Packing Spec |
| **Operations (UI stubs)** | Job Orders, Lot List, Move Lot, Shopfloor Console |

### UI Pattern — Generic CRUD Page

Every CRUD module is rendered by `app.js` via a declarative config object. No page-specific JS files needed. Features provided out of the box:

- ✅ Search filter across all fields
- ✅ Sortable columns
- ✅ Add / Edit modal forms
- ✅ Inline delete with confirmation
- ✅ Pagination (configurable page size)
- ✅ Toast notifications (success / error)
- ✅ Breadcrumb navigation

### UI Pattern — Upload Pages

Factory upload pages provide:

1. **File picker** — accepts `.xlsx` / `.csv`
2. **Preview table** — shows rows with per-cell validation errors highlighted in red
3. **Summary bar** — total / valid / invalid row counts
4. **Post** — one-click submit of validated rows only

### App Shell Layout

```
┌─────────────────────────────────────────────────────────────┐
│  [H] Operon OPS 1.0 | Smart Factory Operations Platform      │
│       [Build 2026.03] [U] santhosh [SS Electronics Pvt Ltd]  │
├──────────────┬──────────────────────────────────────────────┤
│  Sidebar     │  Breadcrumb: Category > Module               │
│  [Search]    │  ┌─────────────────────────────────────────┐  │
│  > Category  │  │  Page Content (table / form / KPIs)     │  │
│    > Module  │  └─────────────────────────────────────────┘  │
├──────────────┴──────────────────────────────────────────────┤
│  © 2026 SS Electronics Pvt Ltd | Operon OPS | All Rights     │
└─────────────────────────────────────────────────────────────┘
```

---

## Backend

### Server (`server.js`)

- **Framework:** Express.js 4.18
- **Port:** `3000` (configurable via `PORT` env var)
- **Auth:** Simple credential check against `DEFAULT_USER_ID` / `DEFAULT_PASSWORD` env vars (no session; client-side redirect)
- **Degraded mode:** If MySQL is unavailable at startup, the HTTP server still starts; all DB-backed API routes return `503` with a helpful hint
- **Graceful shutdown:** `SIGINT`/`SIGTERM` → close connection pool → `process.exit(0)` with 5s forced timeout
- **Health endpoint:** `GET /health` — returns JSON with DB status, uptime, and service name

### Route Architecture

All standard CRUD routes are generated by `createApiRouter(table, columns)`:

```js
// One line = full GET/POST/PUT/DELETE CRUD
module.exports = createApiRouter('items', ['item_category', 'item_subcategory', 'item_code', ...]);
```

Product Configuration routes add lifecycle management on top of CRUD:  

`Draft → Release → Activate (sets as default) → Archive`  
`Copy` creates the next revision from any state.

### Upload Flow

```
POST /api/upload/:type (multipart)       ← file attached
  → parseSpreadsheet (xlsx)
  → normalize & map columns (with aliases)
  → loadContext (validate FK references from DB)
  → validate each row (required, type, range, duplicates, existence)
  → return preview JSON

POST /api/upload/:type (JSON body)       ← rows from preview
  → re-validate rows
  → INSERT all valid rows in a single transaction
  → return inserted count
```

Upload types: `tool-group`, `tool`, `equipment-group`, `equipment`

---

## Database

### Connection

| Parameter | Default |
|---|---|
| Host | `localhost` |
| Port | `3306` |
| Database | `tantier_mes` |
| Pool size | 10 connections |
| Retry | 5 attempts, exponential backoff (1s → 16s) |
| Keep-alive | Enabled (30s initial delay) |

### Bootstrap Sequence (on every startup)

1. Validate env vars
2. `CREATE DATABASE IF NOT EXISTS tantier_mes`
3. Create connection pool → `SELECT 1` validation
4. Run `scripts/setup-db.sql` (25× `CREATE TABLE IF NOT EXISTS`)
5. `ensureUploadSchema()` — adds extended columns (ALTER TABLE if missing)
6. `ensureProductConfigurationSchema()` — adds revision lifecycle columns
7. `seedDatabase()` — inserts reference data only if tables are empty

### Table Catalogue (25 tables)

| # | Table | Purpose |
|---|---|---|
| 1 | `modules` | System module registry (Planning, Execution, WIP, SPC, etc.) |
| 2 | `employees` | Employee master with org role and extension |
| 3 | `system_configurations` | Key-value system config entries |
| 4 | `organizational_roles` | Org structure, reporting hierarchy, and codes |
| 5 | `customers` | Customer master with mother-customer grouping |
| 6 | `custom_tables` | Dynamic lookup tables with date effectivity |
| 7 | `control_numbers` | Auto-number sequences for different transaction types |
| 8 | `item_categories` | Top-level item classification (FG, SFG, RM, Tool, Equipment, etc.) |
| 9 | `item_subcategories` | Second-level classification under a category |
| 10 | `items` | Item master with source, UOM, tracking type |
| 11 | `factories` | Factory/plant master |
| 12 | `shifts` | Work shift definitions |
| 13 | `skills` | Individual skill definitions |
| 14 | `skillsets` | Grouped skill profiles |
| 15 | `tool_groups` | Tool classification groups with calibration metadata |
| 16 | `tools` | Individual tool instances with tracking and calibration dates |
| 17 | `equipment_groups` | Equipment classification groups with cost and setup data |
| 18 | `equipment` | Individual equipment assets with efficiency and production line |
| 19 | `processes` | Manufacturing process definitions (types: Manufacturing, Assembly, Quality, etc.) |
| 20 | `production_lines` | Production line master linked to factory |
| 21 | `manufacturing_routes` | Revision-controlled routing definitions |
| 22 | `bill_of_materials` | Revision-controlled BOM entries |
| 23 | `product_specs` | Product spec with effectivity date range |
| 24 | `common_product_specs` | Shared product quality specs |
| 25 | `packing_specs` | Packing specification with dimension and NG packing flag |

### Full Schema DDL

See [`scripts/setup-db.sql`](./scripts/setup-db.sql) for all `CREATE TABLE` statements.

Key column patterns used across tables:

| Column | Type | Used in |
|---|---|---|
| `id` | `INT AUTO_INCREMENT PK` | All tables |
| `code` | `VARCHAR(50–100) NOT NULL` | Lookup tables |
| `revision_number` | `INT NOT NULL DEFAULT 0` | Product config tables |
| `status` / `state` | `VARCHAR(50) DEFAULT 'Draft'` | Product config tables |
| `is_default` | `BOOLEAN DEFAULT FALSE` | Product config tables |
| `is_active` | `BOOLEAN DEFAULT TRUE` | Tools, equipment, production lines |
| `is_immutable` | `BOOLEAN DEFAULT FALSE` | item_categories, factories |
| `created_date` | `DATETIME DEFAULT CURRENT_TIMESTAMP` | Product config tables |

---

## ER Diagram

```
modules
  id, module_name

employees
  id, employee_no, first_name, middle_name, last_name, org_role*, extension
                                                              │
organizational_roles ──────────────────────────────────── (org_role ref)
  id, org_structure, reports_to, name, code

customers
  id, name, code, mother_customer

system_configurations
  id, config_name

custom_tables
  id, name, date_from, date_to, is_active

control_numbers
  id, type, format, counter, alphanumeric_counter

item_categories
  id, code, description, remarks, is_immutable
    │
    └──► item_subcategories
           id, item_category*, code, description, type
                │
                └──► items
                       id, item_category*, item_subcategory*, item_code,
                       description, alias, item_source, uom, track_by,
                       is_sold, has_virtual_bom

factories
  id, name, code, is_default, is_immutable
    │
    └──► production_lines
           id, factory*, name, code, description, is_active
                │
                └──► equipment (production_line ref)

shifts
  id, name, code

skills
  id, name, code, description

skillsets
  id, name, code, description

tool_groups
  id, name, code, description, item_subcategory*, tool_group_item_code,
  track_by, tool_life, calibration_trigger, tool_group_description
    │
    └──► tools
           id, tool_group*, name, code, description, uom, is_active,
           tracking_number, date_acquired, last_calibration_date, remaining_tool_life

equipment_groups
  id, name, code, description, item_subcategory*, equipment_group_code,
  equipment_group_description, setup_time, cost_per_hour
    │
    └──► equipment
           id, equipment_group*, name, code, description, serial_no, is_active,
           tracking_number, production_line*, efficiency_percentage,
           effectivity_date, maximum_component_limit

processes
  id, name, code, description, process_type

─── Product Configuration (Revision-Controlled) ──────────────────

manufacturing_routes
  id, code, description, revision_number, status, is_default, created_date

bill_of_materials
  id, item_code*, description, revision_number, remarks, state, is_default, created_date

product_specs
  id, item_code*, description, revision_number, state, is_default,
  effectivity_start_date, effectivity_end_date, created_date

common_product_specs
  id, code, description, revision_number, state, is_default, created_date

packing_specs
  id, name, code, dimension, is_ng_packing, revision_number, state, is_default, created_date

* = logical FK reference (not enforced as DB constraint)
```

---

## API Reference

### Authentication

| Method | Path | Description |
|---|---|---|
| `POST` | `/api/login` | Authenticate with userId + password. Returns `{ success, redirect }` |

Validation rules: `userId` must be numeric; `password` must contain at least one letter.

### Health

| Method | Path | Description |
|---|---|---|
| `GET` | `/health` | Returns service status, DB status, and uptime |

### Standard CRUD APIs

All standard routes follow the same pattern:  
`GET /api/{resource}` — list all  
`POST /api/{resource}` — create  
`PUT /api/{resource}/:id` — update by id  
`DELETE /api/{resource}/:id` — delete by id

| Resource | Base Path | Columns |
|---|---|---|
| Employees | `/api/employees` | employee_no, first_name, middle_name, last_name, org_role, extension |
| Customers | `/api/customers` | name, code, mother_customer |
| System Config | `/api/system-configurations` | config_name |
| Org Roles | `/api/organizational-roles` | org_structure, reports_to, name, code |
| Custom Tables | `/api/custom-tables` | name, date_from, date_to, is_active |
| Control Numbers | `/api/control-numbers` | type, format, counter, alphanumeric_counter |
| Item Categories | `/api/item-categories` | code, description, remarks, is_immutable |
| Item Subcategories | `/api/item-subcategories` | item_category, code, description, type |
| Items | `/api/items` | item_category, item_subcategory, item_code, description, alias, item_source, uom, track_by, is_sold, has_virtual_bom |
| Factories | `/api/factories` | name, code, is_default, is_immutable |
| Shifts | `/api/shifts` | name, code |
| Skills | `/api/skills` | name, code, description |
| Skillsets | `/api/skillsets` | name, code, description |
| Tool Groups | `/api/tool-groups` | name, code, description |
| Tools | `/api/tools` | tool_group, name, code, description, uom, is_active |
| Equipment Groups | `/api/equipment-groups` | name, code, description |
| Equipment | `/api/equipment` | equipment_group, name, code, description, serial_no, is_active |
| Processes | `/api/processes` | name, code, description, process_type |
| Production Lines | `/api/production-lines` | factory, name, code, description, is_active |

### Modules API

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/modules` | Returns list of all system module names in order |

### Upload API

| Method | Path | Body | Description |
|---|---|---|---|
| `POST` | `/api/upload/tool-group` | `multipart/form-data` (file) | Preview Excel/CSV |
| `POST` | `/api/upload/tool-group` | `application/json` (rows) | Post validated rows |
| `POST` | `/api/upload/tool` | `multipart/form-data` or `json` | Same as above |
| `POST` | `/api/upload/equipment-group` | `multipart/form-data` or `json` | Same as above |
| `POST` | `/api/upload/equipment` | `multipart/form-data` or `json` | Same as above |

### Product Configuration API (Revision Lifecycle)

Base: `/api`

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/{entity}` | List all revisions |
| `POST` | `/api/{entity}` | Create new revision (Draft) |
| `PUT` | `/api/{entity}/:id` | Edit (Draft only) |
| `DELETE` | `/api/{entity}/:id` | Delete (Draft only) |
| `POST` | `/api/{entity}/:id/copy` | Copy to next revision number |
| `POST` | `/api/{entity}/:id/release` | Draft → Released |
| `POST` | `/api/{entity}/:id/activate` | Released → Active (sets is_default=1, clears others) |
| `POST` | `/api/{entity}/:id/archive` | Any → Archived |

Entities: `manufacturing-routes`, `bill-of-materials`, `product-specs`, `common-product-specs`, `packing-specs`

---

## Sample Data

### Employees (seeded)

| employee_no | first_name | last_name | org_role | extension |
|---|---|---|---|---|
| 244387 | Pranav | Varshan K K | OPS-SUP | 1001 |
| 776144 | Devivarai | — | SFC Operator | 1002 |
| 700922 | Senthilkumar | Dinesh | OPS-KEY USER | 1003 |
| 243704 | Shivamurathy | — | QC SUP | 1004 |
| 205934 | Megha | — | OPS-KEY USER | 1005 |
| 796458 | Ramya D | — | CNC OPR | 1006 |

### Item Categories (seeded)

| code | description |
|---|---|
| FG | Finished Goods |
| SFG | Semi Finished Goods |
| RM | Raw Material |
| BO | Bought Out |
| CON | Consumables |
| PKG | Packing Material |
| MANUAL | Manual Work |
| Equipment | Equipment *(system-generated, immutable)* |
| Tool | Tool *(system-generated, immutable)* |

### Factories (seeded)

| name | code | is_default |
|---|---|---|
| SS Electronics Main Plant | 9010 | Yes |

### Shifts (seeded)

| name | code |
|---|---|
| First Shift | 1st shift |
| Second Shift | 2nd shift |
| Third Shift | 3rd shift |

### Production Lines (seeded)

| name | code | factory |
|---|---|---|
| Band Manufacturing Line 1 | BML-01 | 9010 |
| Anodizing Line 1 | ANO-01 | 9010 |
| Final Assembly Line | FAL-01 | 9010 |

### Manufacturing Routes (seeded, sample)

| code | description | revision | status |
|---|---|---|---|
| ANO-AT | ANO-AT | 6 | Released ● Default |
| CNC9 - MAIN ASSY | CNC9 - MAIN ASSY | 9 | Released ● Default |
| BM-QC-06 | BM_IPQC_6_COSMETIC INSPECTION | 1 | Released |

### Control Numbers (seeded)

| type | format | counter |
|---|---|---|
| Job Order | {Series} | 1 |
| Inventory Transaction | {Series} | 335663 |
| Equipment | {0} | 11 |
| Dispatch Plan Detail | {prodlinedesc}-{series:000000} | 1 |

---

## Dependencies

### Runtime

| Package | Version | Purpose |
|---|---|---|
| `express` | ^4.18.2 | HTTP server and routing |
| `mysql2` | ^3.9.2 | MySQL client with promise API |
| `dotenv` | ^16.6.1 | Environment variable loader |
| `body-parser` | ^1.20.2 | JSON and URL-encoded request parsing |
| `cors` | ^2.8.5 | Cross-origin resource sharing headers |
| `multer` | ^2.1.1 | Multipart file upload handling |
| `xlsx` | ^0.18.5 | Excel and CSV spreadsheet parsing |
| `chart.js` | ^4.5.1 | Client-side chart rendering (dashboard) |

### Dev

| Package | Version | Purpose |
|---|---|---|
| `nodemon` | ^3.1.0 | Auto-restart on file changes during development |

---

## Getting Started

### Prerequisites

- Node.js ≥ 18
- MySQL ≥ 8.0

### Setup

```bash
# 1. Clone the repository
git clone <repo-url>
cd tantier-mes

# 2. Install dependencies
npm install

# 3. Configure environment
copy .env.example .env
# Edit .env — set DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, DEFAULT_USER_ID, DEFAULT_PASSWORD

# 4. Start the server (database is auto-bootstrapped on first start)
npm start          # Production
npm run dev        # Development (nodemon)
```

### Environment Variables

| Variable | Required | Default | Description |
|---|---|---|---|
| `PORT` | No | `3000` | HTTP server port |
| `DB_HOST` | Yes | — | MySQL host |
| `DB_PORT` | No | `3306` | MySQL port |
| `DB_USER` | Yes | — | MySQL username |
| `DB_PASSWORD` | Yes | — | MySQL password |
| `DB_NAME` | Yes | `tantier_mes` | MySQL database name |
| `DEFAULT_USER_ID` | Yes | — | Login user ID (numeric) |
| `DEFAULT_PASSWORD` | Yes | — | Login password |

### NPM Scripts

| Script | Command | Description |
|---|---|---|
| `start` | `node server.js` | Production start |
| `dev` | `nodemon server.js` | Development with auto-reload |
| `setup` | `node scripts/setup.js` | Manual database setup |
| `progress` | `node scripts/progress-update.js` | Append progress milestone |
| `progress:refresh` | `node scripts/progress-update.js --refresh` | Regenerate Project_Progress.md |

---

## CI/CD Pipeline

### Current Pipeline

```
Developer Machine
       │
       ▼
  npm run dev          ← Local development
       │
  Code changes
       │
       ▼
  npm run progress -- "Milestone" "Done" "Next"  ← Update project progress
       │
       ▼
  scripts/publish-github.ps1    ← PowerShell publish script
       │
       ├── git add .
       ├── git commit -m "..."
       └── git push origin main
```

### Automated on Server Startup

- `server.js` calls `refreshProjectProgress({ silent: true })` on every boot to keep `Project_Progress.md` in sync with the current repository state.

### Database Bootstrap (Automatic)

Every server start runs the full 7-phase bootstrap:
1. Env validation
2. `CREATE DATABASE IF NOT EXISTS`
3. Connection pool validation (`SELECT 1`)
4. `setup-db.sql` (base schema)
5. `ensureUploadSchema()` (extended columns)
6. `ensureProductConfigurationSchema()` (lifecycle columns)
7. `seedDatabase()` (reference data — idempotent)

---

## Completed Tasks

### System Foundation
- [x] Express.js project scaffold with environment variable validation
- [x] MySQL connection pool with retry logic (exponential backoff, up to 5 attempts)
- [x] Graceful shutdown handling (`SIGINT`/`SIGTERM`)
- [x] Health check endpoint (`/health`)
- [x] Degraded-mode operation (server runs even if MySQL is down)
- [x] Structured logger (`log.info`, `log.warn`, `log.error`)

### Authentication
- [x] Login page with user ID and password validation
- [x] Numeric-only user ID enforcement
- [x] Letter-required password enforcement
- [x] Post-login redirect to dashboard
- [x] Logout redirect to login page

### UI & Design System
- [x] Microsoft Fluent-inspired color tokens (`theme.css`)
- [x] Shared application shell (topbar, sidebar, breadcrumbs, fixed footer)
- [x] Operon OPS 1.0 branding across all views and startup messaging
- [x] Reusable CRUD page renderer (search, sort, modal, pagination, toasts)
- [x] Login page dedicated styling (`login.css`)
- [x] Build tag and company name in topbar

### General Setup Modules (4)
- [x] System Configuration — CRUD
- [x] Organizational Role — CRUD
- [x] Custom Table Setup — CRUD
- [x] Control Number Setup — CRUD

### Master Data Modules (5)
- [x] Employees — CRUD
- [x] Customers — CRUD
- [x] Item Categories — CRUD with immutability flag
- [x] Item Subcategories — CRUD
- [x] Item Master — CRUD

### Factory Setup Modules (10)
- [x] Factories
- [x] Shifts
- [x] Skills
- [x] Skillsets
- [x] Tool Groups
- [x] Tools
- [x] Equipment Groups
- [x] Equipment
- [x] Processes
- [x] Production Lines

### Factory Uploads (4)
- [x] Tool Group Upload — Excel/CSV with FK validation against item_subcategories
- [x] Tool Upload — Excel/CSV with FK validation against tool_groups, date parsing
- [x] Equipment Group Upload — Excel/CSV with decimal validation (setup_time, cost_per_hour)
- [x] Equipment Upload — Excel/CSV with FK validation against equipment_groups and production_lines

### Product Configuration (5 + Lifecycle)
- [x] Manufacturing Route — full revision lifecycle
- [x] Bill of Materials — full revision lifecycle
- [x] Product Spec — with effectivity date range
- [x] Common Product Spec — full revision lifecycle
- [x] Packing Spec — with dimension and NG-packing flag
- [x] Lifecycle actions: Copy, Release, Activate (set as default, transaction-safe), Archive
- [x] Export action (frontend)

### Database & Seeding
- [x] Auto-create database on first run
- [x] `setup-db.sql` — 25-table base schema (`CREATE TABLE IF NOT EXISTS`)
- [x] Extended upload schema via `ensureColumn` (ALTER TABLE only if column missing)
- [x] Extended product config schema columns
- [x] Idempotent seed data (`seedIfEmpty` / `ensureRows`)
- [x] OPS branding normalization (migrates old `MES-CON` role codes)

### Shopfloor Console
- [x] Standalone shell (mini sidebar, no main sidebar)
- [x] KPI cards, QC filter panel, sticky-header inspection table
- [x] API-backed metrics with fallback to defaults
- [x] Page aliases (`/ShopfloorConsole`, `/ShopFloorConsole`)

### Progress Tracking
- [x] `Project_Progress.md` auto-generated from repository scan
- [x] `npm run progress` CLI to append milestones
- [x] Auto-refresh on every server startup

---

## Pending Tasks

### High Priority
- [ ] **Session-based authentication guard** — protect all page routes with server-side session validation (currently only client-side redirect)
- [ ] **Stronger form validation** — consistent required-field, length, and format checks across all CRUD modules
- [ ] **Route coverage** — wire remaining sidebar menu items (currently show "coming soon" placeholders)

### Medium Priority
- [ ] **Inventory Management module** — stock transactions, goods receipt, goods issue
- [ ] **Work In Process (WIP) module** — lot tracking, move lot, WIP status dashboard
- [ ] **Quality Management module** — inspection plans, defect capture, SPC chart integration
- [ ] **Job Order module** — creation, dispatch, tracking
- [ ] **Lot List module** — batch/serial traceability

### Low Priority
- [ ] **IIoT integration pages** — device connection, sensor data feeds, alert management
- [ ] **CMMS (Maintenance)** — preventive maintenance schedules, work order management
- [ ] **OEE module** — availability, performance, quality metrics per production line
- [ ] **RMS (Resource Management)** — scheduling and resource allocation

---

## Known Bugs & Issues

| Priority | Issue | Status | Fix Applied |
|---|---|---|---|
| **Fixed** | UI routes for Job Orders, Lot List, Shopfloor Console returned 404 | Resolved | Added alias routes (`/JobOrder`, `/JobOrders`, `/LotList`, `/MoveLot`, `/ShopfloorConsole`, `/ShopFloorConsole`) |
| **Fixed** | Product Configuration routes mismatched legacy URL patterns | Resolved | Added legacy alias URLs (`/ManufacturingRoute`, `/BillOfMaterials`, etc.) |
| **Fixed** | Branding inconsistency — `MES` references in login, footer, navbar titles | Resolved | Full rebrand to `Operon OPS` across all views, layout, seed data |
| **Fixed** | Stale `MES-CON` role code in seeded org roles | Resolved | `ensureRows` updates existing rows to `OPS-CON` on startup |
| **Fixed** | `activate` action previously used different lifecycle wording | Resolved | Standardized to `activate` in both frontend and backend |
| **Fixed** | Theme inconsistency across pages | Resolved | Centralized all color tokens in `public/css/theme.css` |
| **Open** | No server-side auth guard on page routes | Open — High | See Pending Tasks |
| **Open** | `pnpm-lock.yaml` exists alongside `package-lock.json` | Open — Low | Remove `pnpm-lock.yaml` if `npm` is the chosen package manager |

---

## Future Plans

### Short-Term (v1.1)
- Server-side session auth with JWT or express-session
- Role-based access control (RBAC) using org_roles
- Inventory Management and WIP modules
- Job Order creation and dispatch flow
- Lot traceability (lot list, move lot)

### Medium-Term (v1.2)
- Quality Management: inspection plans, defect recording, SPC charts
- CMMS: equipment maintenance scheduling, work orders
- OEE dashboard per production line
- Audit trail / change log for all master data

### Long-Term (v2.0)
- IIoT integration: MQTT/REST device data ingestion
- Real-time shopfloor monitoring with WebSocket
- SAP integration (purchase orders, sales orders, GR/GI sync)
- Multi-factory support with tenant isolation
- Mobile-responsive PWA for shop floor operators
- Automated SPC alerts and email notifications

---

## Version History

| Version | Build | Date | Summary |
|---|---|---|---|
| 1.0.0 | 2026.03 | 2026-03-12 | Full factory setup, product config, upload modules, Operon OPS branding, Shopfloor Console |
| 1.0.0-beta | 2026.03 | 2026-03-11 | Microsoft Fluent theme, factory uploads, product configuration revision lifecycle |
| 1.0.0-alpha | 2026.03 | 2026-03-10 | Base Express scaffold, login, dashboard, general setup, master data, factory setup |

### Change Log

#### 2026-03-12
- Implemented Shopfloor Console with standalone shell, KPI cards, and filter panel
- Added missing UI route aliases for Job Orders, Lot List, and Shopfloor Console
- Wired auto-refresh of `Project_Progress.md` into server startup
- Rebranded all references from `Tantier MES` to `Operon OPS`

#### 2026-03-11
- Renamed system to Operon Operations Platform Suite / Operon OPS 1.0
- Centralized Microsoft-style color theme in `public/css/theme.css`
- Implemented reusable factory upload pages (Excel/CSV preview + post)
- Implemented all five Product Configuration modules with full lifecycle
- Added revision lifecycle actions: Copy, Release, Activate, Archive, Export
- Added legacy alias routes for product config pages

#### 2026-03-10
- Established base Express app structure and project progress logging
- Implemented login flow, dashboard, and initial admin modules
- Created `Project_Progress.md` with auto-append script

---

*© 2026 SS Electronics Pvt Ltd. All Rights Reserved.*  
*Operon Operations Platform Suite (OPS) — Operon OPS 1.0*
