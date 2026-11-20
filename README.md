# 🌲 Timber Management System - Frontend

Web frontend for the **Timber Production and Inventory Management System** by Quick Solutions (Pvt) Ltd.

The system follows timber through its whole life:

**licence & permit → tree survey → felling → log QR tag → transport → sawmill → inventory → sales → invoice & payment → compliance reports**

Every log gets a unique ID and QR tag, so any piece of timber can be traced back to its tree and permit.

This repo is **only the frontend**. Business rules, quota checks and calculations live in the **backend API** (a separate repository). The frontend talks to it through `NEXT_PUBLIC_API_URL`.

> 🚧 **Status: project setup.** Every file is an empty placeholder. Pick a module, open its files and start building.

---

## 🛠 Tech Stack

| Technology | Used for |
| --- | --- |
| **Next.js** (App Router) | Pages, routing, layouts |
| **React** | UI |
| **TypeScript** | Type safety |
| **Tailwind CSS** | Styling (responsive, phone → desktop) |
| **PWA** (service worker + IndexedDB) | Offline field mode with later sync |
| ESLint + Prettier | Code quality and formatting |

---

## 🚀 Getting Started

You need **Node.js 20+**, **Git** and access to the [Timber-Management-System](https://github.com/Timber-Management-System) organization.

```bash
# 1. Clone
git clone https://github.com/Timber-Management-System/timber-frontend.git
cd timber-frontend

# 2. Set your Git name and email (once per computer)
git config --global user.name  "your-github-username"
git config --global user.email "your-github-email"

# 3. Create your local env file and fill in the values
cp .env.example .env.local

# 4. Install and run
npm install
npm run dev
```

Open <http://localhost:3000>.

> `npm install` and `npm run dev` will work once the base setup task is done. That task fills in `package.json` and the config files.

---

## 🧩 Modules - who builds what

Each module has **one route folder** (pages) and **one feature folder** (components, API calls, types). Pick a module and work only inside its folders. This is the main way we avoid merge conflicts.

| Area | URL | Page folder `src/app/(dashboard)/…` | Feature folder `src/features/…` | Requirements | Phase |
| --- | --- | --- | --- | --- | --- |
| A. Login & users | `/login`, `/admin/users` | `(auth)/`, `admin/users/` | `auth/`, `admin/` | FR-01 – 03 | 1 |
| B. Licences & permits | `/licences`, `/permits` | `licences/`, `permits/` | `permits/` | FR-04 – 09 | 1 |
| C. Sites & trees | `/sites`, `/trees` | `sites/`, `trees/` | `sites-trees/` | FR-10 – 14 | 1 |
| D. Felling & logs | `/felling`, `/logs` | `felling/`, `logs/` | `felling/`, `logs/` | FR-15 – 19 | 1–2 |
| E. Transport | `/transport` | `transport/` | `transport/` | FR-20 – 23 | 2 |
| F. Sawmill production | `/production` | `production/` | `production/` | FR-24 – 28 | 2 |
| G. Inventory | `/inventory` | `inventory/` | `inventory/` | FR-29 – 34 | 1 |
| H. Customers & sales | `/sales` | `sales/` | `sales/` | FR-35 – 43 | 1–3 |
| I. Procurement | `/procurement` | `procurement/` | `procurement/` | FR-44 – 45 | 2 |
| J. Finance & costing | `/finance` | `finance/` | `finance/` | FR-46 – 49 | 2–3 |
| K. Reports & dashboard | `/dashboard`, `/reports` | `dashboard/`, `reports/` | `dashboard/`, `reports/` | FR-50 – 55 | 1 |
| L. Notifications & admin | `/notifications`, `/admin` | `notifications/`, `admin/` | `notifications/`, `admin/` | FR-56 – 58 | 1 |
| Offline field mode | `/field` | `src/app/(field)/field/` | `field/` | FR-19, WR-05 | 2 |
| Customer portal | `/portal` | `src/app/(portal)/portal/` | `portal/` | FR-42, WR-09 | 2 |

Requirement IDs (FR-xx, WR-xx, BR-xx) come from the project proposal document.

---

## 📁 Folder Structure

```
timber-frontend/
├── src/
│   ├── app/                    # PAGES - each folder is a URL
│   │   ├── (auth)/             #   login, forgot/reset password, MFA
│   │   ├── (dashboard)/        #   main app with sidebar (modules A–L above)
│   │   ├── (field)/field/      #   mobile, offline field screens
│   │   ├── (portal)/portal/    #   customer portal
│   │   └── api/health/         #   health-check route
│   │
│   ├── features/               # MODULE CODE - one folder per module
│   │   └── <module>/
│   │       ├── components/     #   UI used only by this module
│   │       ├── *.service.ts    #   calls to the backend API
│   │       ├── *.types.ts      #   TypeScript types
│   │       └── *.schema.ts     #   form validation
│   │
│   ├── components/             # SHARED UI - used by many modules
│   │   ├── ui/                 #   Button, Input, Modal, Table…
│   │   ├── layout/             #   AppShell, Sidebar, Topbar…
│   │   ├── shared/             #   DataTable, GlobalSearch, RoleGuard…
│   │   ├── qr/  maps/  charts/  print/
│   │
│   ├── lib/
│   │   ├── api-client.ts       #   single place for API calls
│   │   ├── auth/               #   session + role permissions
│   │   ├── calculations/       #   volume, yield, wastage (must match backend)
│   │   └── offline/            #   IndexedDB, sync queue, conflicts
│   ├── hooks/                  # useAuth, usePermission, useQrScanner…
│   ├── store/                  # global state
│   ├── types/                  # shared types (API, roles)
│   ├── config/                 # navigation, roles, routes
│   ├── i18n/                   # English, Sinhala, Tamil text
│   └── middleware.ts           # blocks pages for users not logged in
│
├── public/                     # icons, images, service worker (sw.js)
├── tests/                      # unit tests (calculations) and e2e
└── .env.example                # copy to .env.local
```

**How a page works:** a page in `src/app/` → uses components from `src/features/<module>/components/` → which call `src/features/<module>/*.service.ts` → which uses `src/lib/api-client.ts` → backend API.

---

## 🔀 Daily Git Workflow

**Never push straight to `main`.** Always use a branch and a Pull Request.

```bash
# 1. Get the latest main
git checkout main
git pull origin main

# 2. Make a branch for your task
git checkout -b feature/inventory-stock-table

# 3. Work, then save your changes
git add .
git commit -m "feat(inventory): add stock table"

# 4. Get the newest main into your branch BEFORE pushing
git pull origin main

# 5. Push your branch
git push -u origin feature/inventory-stock-table
```

6. On GitHub, open a **Pull Request** into `main`. The PR template will show a short checklist.
7. A teammate reviews it, then you click **Squash and merge**.
8. Go back to `main` and pull again:

```bash
git checkout main
git pull origin main
git branch -d feature/inventory-stock-table
```

**Branch names:** `feature/…`, `fix/…`, `docs/…`, `refactor/…`
**Commit messages:** `feat(module): …`, `fix(module): …`, `docs: …`, `style: …`, `chore: …`

---

## 🛡 Rules to Avoid Merge Conflicts

1. **Stay in your module's folders.** Only edit `src/app/(dashboard)/<your-module>/` and `src/features/<your-module>/`.
2. **Ask before editing shared files.** Post in the team chat first. Shared files are:
   `src/components/**`, `src/lib/**`, `src/config/**`, `src/types/**`, `src/app/layout.tsx`, `src/app/(dashboard)/layout.tsx`, `package.json`.
3. **Pull every morning** and **pull before every push** (`git pull origin main`).
4. **Keep branches small.** Merge within 1–3 days.
5. **Don't reformat files you didn't change.**
6. **Don't commit** `node_modules/`, `.next/` or `.env.local`. `.gitignore` already blocks them.
7. If `package-lock.json` conflicts, don't fix it by hand:
   ```bash
   git checkout origin/main -- package-lock.json
   npm install
   git add package-lock.json
   ```

Line endings are already handled by `.gitattributes`, so Windows and Mac users won't conflict over them.

---

## 🧯 Fixing a Merge Conflict

If `git pull origin main` says **CONFLICT**:

1. Run `git status` to see the conflicted files.
2. Open each file. In VS Code, click **Accept Current**, **Accept Incoming** or **Accept Both**. Make sure no `<<<<<<<`, `=======` or `>>>>>>>` lines are left.
3. Save the files, then run:
   ```bash
   git add .
   git commit
   git push
   ```

Not sure which version is right? Ask the teammate who wrote the other change.
To cancel and go back: `git merge --abort`.

---

## 📐 Coding Conventions

- Components: `PascalCase.tsx`. Hooks: `useSomething.ts`. Services: `name.service.ts`.
- Call the API only from `*.service.ts` files, never from inside components.
- Use TypeScript types. Avoid `any`.
- Check permissions with `usePermission` / `RoleGuard`. Roles follow section 12 of the proposal.
- Volume, yield and wastage always come from `src/lib/calculations/`. Don't write the formulas anywhere else (business rules BR-13 to BR-15).
- Make field screens phone-friendly: large buttons, high contrast, and they must work offline.
- Run `npm run lint` before you push.
