# 🌲 Timber Management System — Frontend

The web frontend for the **Timber Management System**, a platform for running a timber business end to end: stock in the yards, buying from suppliers, selling to customers, sawmill processing, transport permits, invoices and reports.

This repository holds **only the frontend** (user interface). It talks to the Timber Management System **backend API**, which lives in a separate repository in the [Timber-Management-System](https://github.com/Timber-Management-System) organization.

> **Status:** 🚧 Project setup. The folder structure and empty files are in place, and features are being built module by module.

---

## 📑 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [How It Works](#-how-it-works)
- [Folder Structure](#-folder-structure)
- [Getting Started](#-getting-started)
- [Git Workflow (Clone → Branch → Push → Merge)](#-git-workflow-clone--branch--push--merge)
- [Avoiding Merge Conflicts](#-avoiding-merge-conflicts)
- [Resolving a Merge Conflict](#-resolving-a-merge-conflict)
- [Coding Conventions](#-coding-conventions)

---

## ✨ Features

| Module | What it does |
| --- | --- |
| **Dashboard** | Overview of stock levels, recent sales and purchases, and alerts |
| **Inventory** | Track timber stock (logs, sawn timber, planks) by species, size, grade and volume (m³ / cubic feet) |
| **Species** | Manage timber species and grades (e.g. Teak, Mahogany, Jak) |
| **Yards** | Storage yards and warehouses, and the stock held in each |
| **Processing** | Sawmill operations that convert logs into sawn timber, with wastage tracking |
| **Suppliers** | Supplier details and purchase history |
| **Customers** | Customer details and order history |
| **Purchases** | Purchase orders for buying timber from suppliers |
| **Sales** | Sales orders for selling timber to customers |
| **Invoices** | Generate and view invoices for sales |
| **Transport** | Vehicle and delivery tracking |
| **Permits** | Timber transport and felling permits |
| **Reports** | Stock, sales, purchase and profit reports |
| **Users & Settings** | User accounts, roles and system settings |

---

## 🛠 Tech Stack

| Technology | Purpose |
| --- | --- |
| [Next.js](https://nextjs.org/) (App Router) | React framework: routing, layouts, server and client rendering |
| [React](https://react.dev/) | UI library |
| [TypeScript](https://www.typescriptlang.org/) | Type safety across the codebase |
| [Tailwind CSS](https://tailwindcss.com/) | Utility-first styling |
| ESLint + Prettier | Linting and consistent code formatting |
| npm | Package manager |
| Git + GitHub | Version control and collaboration |

> The backend is a separate service. This frontend calls it over REST using the URL in `NEXT_PUBLIC_API_URL`.

---

## ⚙ How It Works

```
 ┌──────────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
 │   Pages      │ ──▶ │  Components  │ ──▶ │  Services    │ ──▶ │  Backend API │
 │ src/app/...  │     │src/components│     │ src/services │     │ (separate    │
 │ (routes)     │ ◀── │ (UI pieces)  │ ◀── │ (API calls)  │ ◀── │  repository) │
 └──────────────┘     └──────────────┘     └──────────────┘     └──────────────┘
         │                    │                    │
         └──── hooks / store (shared state) ───────┘   types (shared TypeScript models)
```

1. **Routing**: each folder in `src/app/` is a URL. For example, `src/app/(dashboard)/inventory/page.tsx` becomes `/inventory`.
   - `(auth)` and `(dashboard)` are **route groups**. The brackets keep them out of the URL, and each group has its own layout: auth pages are plain, while dashboard pages get the sidebar and navbar.
   - `[id]` folders are **dynamic routes**. For example, `/inventory/42` shows timber item 42.
2. **Pages** are built from **components** in `src/components/`.
3. Components never call `fetch` directly. They use **services** in `src/services/`, which go through one shared client in `src/lib/api-client.ts`. That client adds the base URL and the auth token in one place.
4. **Hooks** (`src/hooks/`) and the **store** (`src/store/`) hold shared logic and state, such as the logged-in user and UI state.
5. **Types** (`src/types/`) define the data models (Timber, Supplier, Order and so on) used everywhere.
6. **Middleware** (`src/middleware.ts`) protects dashboard routes and redirects users who aren't logged in to `/login`.

---

## 📁 Folder Structure

```
timber-frontend/
├── .github/
│   └── PULL_REQUEST_TEMPLATE.md
├── public/                     # Static files (images, icons, fonts)
├── src/
│   ├── app/                    # Next.js App Router (routes & layouts)
│   │   ├── (auth)/             # login, register, forgot-password
│   │   ├── (dashboard)/        # all logged-in modules
│   │   │   ├── dashboard/
│   │   │   ├── inventory/      # list, new, [id]
│   │   │   ├── species/
│   │   │   ├── yards/
│   │   │   ├── processing/
│   │   │   ├── suppliers/
│   │   │   ├── customers/
│   │   │   ├── purchases/
│   │   │   ├── sales/
│   │   │   ├── invoices/
│   │   │   ├── transport/
│   │   │   ├── permits/
│   │   │   ├── reports/
│   │   │   ├── users/
│   │   │   └── settings/
│   │   ├── api/health/         # simple health-check route
│   │   ├── layout.tsx          # root layout
│   │   ├── page.tsx            # landing page
│   │   ├── globals.css
│   │   ├── loading.tsx / error.tsx / not-found.tsx
│   ├── components/
│   │   ├── ui/                 # Button, Input, Modal, Table… (generic)
│   │   ├── layout/             # Sidebar, Navbar, Footer
│   │   ├── shared/             # DataTable, SearchBar, Pagination…
│   │   ├── dashboard/ charts/  # dashboard widgets & charts
│   │   └── inventory/ suppliers/ customers/ orders/ invoices/   # module-specific
│   ├── hooks/                  # useAuth, useFetch, useDebounce…
│   ├── lib/                    # api-client, utils, constants, validators
│   ├── services/               # one file per backend resource
│   ├── store/                  # global state
│   ├── types/                  # TypeScript models
│   ├── config/                 # site config, sidebar navigation
│   └── middleware.ts           # route protection
├── tests/                      # unit & e2e tests
├── .env.example                # copy to .env.local
├── .gitattributes              # consistent line endings (prevents fake conflicts)
├── .gitignore
├── next.config.ts / tsconfig.json / tailwind.config.ts / eslint.config.mjs
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) **v20 or newer** (`node -v`)
- [Git](https://git-scm.com/) (`git --version`)
- Access to the [Timber-Management-System](https://github.com/Timber-Management-System) GitHub organization

### 1. Clone the repository

```bash
git clone https://github.com/Timber-Management-System/timber-frontend.git
cd timber-frontend
```

### 2. Set your Git identity (once per machine)

```bash
git config --global user.name  "your-github-username"
git config --global user.email "your-github-email@example.com"
```

### 3. Install dependencies

```bash
npm install
```

### 4. Set up environment variables

```bash
cp .env.example .env.local
```

Then edit `.env.local`. For example:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

> ⚠ Never commit `.env.local`. It is already listed in `.gitignore`.

### 5. Run the development server

```bash
npm run dev
```

Open <http://localhost:3000> in your browser.

### Available scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the dev server with hot reload |
| `npm run build` | Build for production |
| `npm run start` | Run the production build |
| `npm run lint` | Check code with ESLint |

---

## 🔀 Git Workflow (Clone → Branch → Push → Merge)

**Never push directly to `main`.** Every change goes through a feature branch and a Pull Request (PR).

### Branch naming

| Type | Pattern | Example |
| --- | --- | --- |
| New feature | `feature/<short-name>` | `feature/inventory-table` |
| Bug fix | `fix/<short-name>` | `fix/login-redirect` |
| Refactor or cleanup | `refactor/<short-name>` | `refactor/api-client` |
| Docs | `docs/<short-name>` | `docs/readme-update` |

### Step-by-step

```bash
# 1. Start from an up-to-date main
git checkout main
git pull origin main

# 2. Create your branch
git checkout -b feature/inventory-table

# 3. Work, then commit small, focused changes
git add .
git commit -m "feat: add inventory table with pagination"

# 4. Before pushing, bring in the latest main (see "Avoiding Merge Conflicts")
git fetch origin
git merge origin/main        # or: git rebase origin/main

# 5. Push your branch
git push -u origin feature/inventory-table
```

6. On GitHub, open a **Pull Request** from your branch into `main`.
7. Ask a teammate to **review**. Fix any comments by pushing more commits to the same branch.
8. Once approved, **merge** the PR on GitHub (use **Squash and merge** to keep history clean).
9. Delete the branch, then update your local `main`:

```bash
git checkout main
git pull origin main
git branch -d feature/inventory-table
```

### Commit message format

Use [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add supplier form
fix: correct stock volume calculation
style: format sidebar component
refactor: move fetch logic into timber.service
docs: update setup steps in README
chore: update dependencies
```

---

## 🛡 Avoiding Merge Conflicts

1. **Pull often.** Run `git pull origin main` before you start work each day, and merge `origin/main` into your branch before you push.
2. **Keep branches small and short-lived.** Aim to merge within 1–3 days. Big branches that live a long time cause big conflicts.
3. **One feature per branch.** Don't mix unrelated changes.
4. **Split the work by module.** Each person owns different folders (e.g. one person on `inventory/`, another on `suppliers/`), so you rarely edit the same file.
5. **Tell the team before touching shared files** such as `src/app/layout.tsx`, `src/config/navigation.ts`, `src/lib/api-client.ts`, `src/types/*` and `package.json`.
6. **Don't reformat files you aren't working on.** Format-only changes create noisy conflicts.
7. **Never commit `node_modules/`, `.next/` or `.env.local`.**
8. **Line endings are handled for you.** `.gitattributes` forces LF line endings on every OS, so Windows and Mac users don't overwrite each other's files.
9. **`package-lock.json` conflicts:** don't hand-edit them. Accept `main`'s version, then run `npm install` again:
   ```bash
   git checkout origin/main -- package-lock.json
   npm install
   git add package-lock.json
   ```

---

## 🧯 Resolving a Merge Conflict

If `git merge origin/main` reports a conflict:

```bash
# 1. See which files conflict
git status
```

2. Open each conflicted file. Git marks the conflicting parts like this:

```
<<<<<<< HEAD
your changes
=======
changes from main
>>>>>>> origin/main
```

3. Edit the file to keep the correct code, and delete the `<<<<<<<`, `=======` and `>>>>>>>` lines. VS Code's **"Accept Current / Incoming / Both"** buttons make this easier.
4. Mark the conflict as resolved, then finish the merge:

```bash
git add <file>
git commit            # completes the merge
npm run dev           # make sure the app still works
git push
```

> Not sure which change is right? **Ask the teammate who wrote the other change** before you pick one.
> To cancel a merge and start over: `git merge --abort`.

---

## 📐 Coding Conventions

- **Components:** `PascalCase.tsx` (e.g. `TimberTable.tsx`)
- **Hooks:** `useSomething.ts`
- **Services:** `resource.service.ts` (e.g. `timber.service.ts`)
- **Generic UI** goes in `components/ui/`. Components for one module go in that module's folder.
- **API calls** live only in `src/services/`, never inside components.
- **Use TypeScript types** from `src/types/` instead of `any`.
- Run `npm run lint` before you push.

---

## 👥 Contributors

Maintained by the **Timber Management System** team.
