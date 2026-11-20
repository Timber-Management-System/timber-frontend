# 🌲 Timber Management System - Frontend

Web frontend for the **Timber Production and Inventory Management System** by Quick Solutions (Pvt) Ltd.

The system follows timber through its whole life:

**licence & permit → tree survey → felling → log QR tag → transport → sawmill → inventory → sales → invoice & payment → compliance reports**

Every log gets a unique ID and QR tag, so any piece of timber can be traced back to its tree and permit.

This repo is **only the frontend**. Business rules, quota checks and calculations live in the **backend API** (`timber-backend`, a separate repository, planned as Java Spring Boot + PostgreSQL). The frontend talks to it through `NEXT_PUBLIC_API_URL`.

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
| **GitHub Actions** | CI pipeline: lint, build and dependency security checks |
| **Vercel** | Hosting (preview per PR, production from `main`) |

---

## 🚀 Getting Started

You need **Node.js 22 LTS**, **Git**, 2FA turned on for your GitHub account and access to the [Timber-Management-System](https://github.com/Timber-Management-System) organization.

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

**One requirement = one folder = one page.** Every functional requirement (FR-01 … FR-58) in the proposal has:
- its own **module folder**: `src/modules/<domain>/fr-xx-<name>/`
- its own **page**: `src/app/(app)/<domain>/<name>/page.tsx`

When you get an FR task, work only inside that FR's folders. This is the main way we avoid merge conflicts.

Folder names match the backend, so you can always find the matching API. For example, backend `licencepermit/fr06_quota_tracking` is frontend `licence-permit/fr-06-quota-tracking`.

| Area | Domain folder | Requirements | Backend module | Phase |
| --- | --- | --- | --- | --- |
| A. Users & access | `user-access` | FR-01 – 02 | `useraccess` | 1 |
| B. Licences & permits | `licence-permit` | FR-04 – 09 | `licencepermit` | 1–2 |
| C. Sites & trees | `site-tree` | FR-10 – 14 | `sitetree` | 1–2 |
| D. Felling & logs | `felling` | FR-15 – 19 | `felling` | 1–2 |
| E. Transport | `transport` | FR-20 – 23 | `transport` | 2 |
| F. Sawmill production | `sawmill` | FR-24 – 28 | `sawmill` | 2 |
| G. Inventory | `inventory` | FR-29 – 34 | `inventory` | 1–2 |
| H. Customers & sales | `sales` | FR-35 – 43 | `sales` | 1–3 |
| I. Procurement | `procurement` | FR-44 – 45 | `procurement` | 2 |
| J. Finance & costing | `finance` | FR-46 – 49 | `finance` | 2–3 |
| K. Reports | `reports` | FR-50 – 55 | `reports` | 1 |
| L. Audit, notifications & admin | `audit-admin` | FR-03, FR-56 – 58 | `auditadmin` | 1 |

<details>
<summary><b>All 58 requirements: folder and page URL</b></summary>

| FR | Module folder `src/modules/…` | Page URL |
| --- | --- | --- |
| FR-01 | `user-access/fr-01-authentication` | `/login`, `/user-access/roles` |
| FR-02 | `user-access/fr-02-user-management` | `/user-access/user-management` |
| FR-03 | `audit-admin/fr-03-audit-log` | `/audit-admin/audit-log` |
| FR-04 | `licence-permit/fr-04-company-licence` | `/licence-permit/company-licence` |
| FR-05 | `licence-permit/fr-05-felling-permit` | `/licence-permit/felling-permit` |
| FR-06 | `licence-permit/fr-06-quota-tracking` | `/licence-permit/quota-tracking` |
| FR-07 | `licence-permit/fr-07-expiry-alerts` | `/licence-permit/expiry-alerts` |
| FR-08 | `licence-permit/fr-08-transport-permit` | `/licence-permit/transport-permit` |
| FR-09 | `licence-permit/fr-09-permit-documents` | `/licence-permit/permit-documents` |
| FR-10 | `site-tree/fr-10-site-lot` | `/site-tree/site-lot` |
| FR-11 | `site-tree/fr-11-tree-survey` | `/site-tree/tree-survey` |
| FR-12 | `site-tree/fr-12-tree-approval` | `/site-tree/tree-approval` |
| FR-13 | `site-tree/fr-13-protected-species` | `/site-tree/protected-species` |
| FR-14 | `site-tree/fr-14-replanting` | `/site-tree/replanting` |
| FR-15 | `felling/fr-15-work-orders` | `/felling/work-orders` |
| FR-16 | `felling/fr-16-felled-trees` | `/felling/felled-trees` |
| FR-17 | `felling/fr-17-log-tags` | `/felling/log-tags` |
| FR-18 | `felling/fr-18-equipment-safety` | `/felling/equipment-safety` |
| FR-19 | `felling/fr-19-offline-capture` | `/felling/offline-capture` |
| FR-20 | `transport/fr-20-trips` | `/transport/trips` |
| FR-21 | `transport/fr-21-delivery-notes` | `/transport/delivery-notes` |
| FR-22 | `transport/fr-22-reconciliation` | `/transport/reconciliation` |
| FR-23 | `transport/fr-23-vehicles-drivers` | `/transport/vehicles-drivers` |
| FR-24 | `sawmill/fr-24-log-receiving` | `/sawmill/log-receiving` |
| FR-25 | `sawmill/fr-25-processing-orders` | `/sawmill/processing-orders` |
| FR-26 | `sawmill/fr-26-production-output` | `/sawmill/production-output` |
| FR-27 | `sawmill/fr-27-machine-usage` | `/sawmill/machine-usage` |
| FR-28 | `sawmill/fr-28-quality-grading` | `/sawmill/quality-grading` |
| FR-29 | `inventory/fr-29-stock-overview` | `/inventory/stock-overview` |
| FR-30 | `inventory/fr-30-stock-by-location` | `/inventory/stock-by-location` |
| FR-31 | `inventory/fr-31-stock-movements` | `/inventory/stock-movements` |
| FR-32 | `inventory/fr-32-stock-take-alerts` | `/inventory/stock-take-alerts` |
| FR-33 | `inventory/fr-33-traceability` | `/inventory/traceability` |
| FR-34 | `inventory/fr-34-stock-valuation` | `/inventory/stock-valuation` |
| FR-35 | `sales/fr-35-customers` | `/sales/customers` |
| FR-36 | `sales/fr-36-quotations-orders` | `/sales/quotations-orders` |
| FR-37 | `sales/fr-37-pricing` | `/sales/pricing` |
| FR-38 | `sales/fr-38-dispatch` | `/sales/dispatch` |
| FR-39 | `sales/fr-39-invoicing-payments` | `/sales/invoicing-payments` |
| FR-40 | `sales/fr-40-credit-control` | `/sales/credit-control` |
| FR-41 | `sales/fr-41-returns-complaints` | `/sales/returns-complaints` |
| FR-42 | `sales/fr-42-customer-portal` | `/portal` |
| FR-43 | `sales/fr-43-export-sales` | `/sales/export-sales` |
| FR-44 | `procurement/fr-44-suppliers-purchase-orders` | `/procurement/suppliers-purchase-orders` |
| FR-45 | `procurement/fr-45-goods-received` | `/procurement/goods-received` |
| FR-46 | `finance/fr-46-costing` | `/finance/costing` |
| FR-47 | `finance/fr-47-wages` | `/finance/wages` |
| FR-48 | `finance/fr-48-accounting-export` | `/finance/accounting-export` |
| FR-49 | `finance/fr-49-profitability` | `/finance/profitability` |
| FR-50 | `reports/fr-50-permit-utilization` | `/reports/permit-utilization` |
| FR-51 | `reports/fr-51-felling-production` | `/reports/felling-production` |
| FR-52 | `reports/fr-52-inventory-ageing` | `/reports/inventory-ageing` |
| FR-53 | `reports/fr-53-sales-receivables` | `/reports/sales-receivables` |
| FR-54 | `reports/fr-54-traceability-audit` | `/reports/traceability-audit` |
| FR-55 | `reports/fr-55-export-scheduled` | `/reports/export-scheduled` |
| FR-56 | `audit-admin/fr-56-notifications` | `/audit-admin/notifications` |
| FR-57 | `audit-admin/fr-57-master-data` | `/audit-admin/master-data` |
| FR-58 | `audit-admin/fr-58-backup-config` | `/audit-admin/backup-config` |

</details>

### Web requirements (shared features)

| WR | Folder | What it is | Backend |
| --- | --- | --- | --- |
| WR-01 | `src/web-requirements/wr-01-responsive-layout` | Works on phone, tablet, desktop | – |
| WR-02 | `src/web-requirements/wr-02-role-dashboards` | Role-based dashboard (`/dashboard`) | `dashboard/wr02` |
| WR-03 | `src/web-requirements/wr-03-global-search` | Search logs, permits, customers, orders (`/search`) | `search/wr03` |
| WR-04 | `src/web-requirements/wr-04-qr-scanning` | Camera QR scanning | – |
| WR-05 | `src/web-requirements/wr-05-offline-sync` | Offline storage and sync for field screens | `sync/wr05` |
| WR-06 | `src/web-requirements/wr-06-map-view` | Map of sites and trees | – |
| WR-07 | `src/web-requirements/wr-07-printing` | Printable delivery notes, invoices, QR labels | – |
| WR-08 | `src/web-requirements/wr-08-multi-language` | English, Sinhala, Tamil | – |
| WR-09 | `src/modules/sales/fr-42-customer-portal` + `src/app/portal/` | Customer portal | `sales/fr42` |
| WR-10 | `src/site/` + `src/app/(site)/` | Public website (optional) | `website/wr10` |

### Business rules

Each rule has a folder in `src/business-rules/`. The frontend checks the rules to give early, clear messages. **The backend always has the final say.**

| BR | Folder | Rule |
| --- | --- | --- |
| BR-01 | `br-01-permit-quota` | No felling without an approved, valid permit with quota left |
| BR-02 | `br-02-protected-species` | Protected species can never be selected for felling |
| BR-03 | `br-03-log-traceability` | Every log keeps its unique ID linked to its tree and permit |
| BR-04 | `br-04-transport-permit` | Transport needs a valid transport permit and delivery note |
| BR-05 | `br-05-no-negative-stock` | Stock can't go negative; sell only available stock |
| BR-06 | `br-06-expired-licence-block` | Expired licences or permits block related transactions |
| BR-07 | `br-07-approvals` | Price changes, stock adjustments and write-offs need approval |
| BR-08 | `br-08-credit-limit` | No new dispatch for a customer over their credit limit without approval |
| BR-09 | `br-09-no-delete-adjust-only` | Permit-linked records can't be deleted, only corrected by a logged adjustment |
| BR-10 | `br-10-entry-deadline` | Felling and log records must be entered within the agreed number of days |
| BR-11 | `br-11-transport-tolerance` | Loaded vs received difference over tolerance triggers an investigation |
| BR-12 | `br-12-export-documents` | Export sales need valid export documents before dispatch |
| BR-13 | `br-13-volume-method` | One volume method (Smalian or Huber), set in master data |
| BR-14 | `br-14-yield-wastage` | Yield % + wastage % = 100%, same unit (m³) and basis |
| BR-15 | `br-15-bark-basis` | Every volume states under-bark or over-bark; same basis for input and output |

---

## 📁 Folder Structure

```
timber-frontend/
├── src/
│   ├── app/                         # PAGES - each folder is a URL
│   │   ├── (auth)/                  #   login, forgot/reset password, MFA (FR-01)
│   │   ├── (app)/                   #   logged-in app, with the sidebar
│   │   │   ├── layout.tsx           #     sidebar shell
│   │   │   ├── dashboard/           #     role dashboards (WR-02)
│   │   │   └── <domain>/<name>/     #     one thin page.tsx per FR
│   │   ├── portal/                  #   customer portal (FR-42)
│   │   ├── (site)/                  #   public website (WR-10, optional)
│   │   └── api/health/              #   health-check route
│   │
│   ├── modules/                     # FEATURE CODE - one folder per FR
│   │   └── <domain>/fr-xx-<name>/
│   │       ├── components/          #   UI for this FR only
│   │       ├── hooks/               #   React hooks
│   │       ├── api/                 #   calls to the backend
│   │       ├── schemas/             #   form validation
│   │       ├── types/               #   TypeScript types
│   │       ├── __tests__/           #   tests
│   │       └── index.ts             #   what the page imports
│   │
│   ├── web-requirements/wr-0x-*/    # WR-01…08: dashboards, search, QR, offline, maps, printing, languages
│   ├── business-rules/br-xx-*/      # BR-01…15 (volume, yield, wastage maths is in br-13…15)
│   ├── shared/                      # USED BY 2+ MODULES
│   │   ├── components/ui/           #   Button, Icon…
│   │   ├── components/layout/       #   Sidebar…
│   │   ├── config/navigation.ts     #   sidebar menu
│   │   └── hooks/ lib/ store/ types/
│   ├── site/                        # public website code
│   ├── styles/                      # design tokens (colours, fonts, shapes)
│   ├── i18n/                        # English, Sinhala, Tamil text
│   └── middleware.ts                # blocks pages for users not logged in
│
├── docs/
│   ├── design-system.md             # how to use tokens, Button, Sidebar
│   ├── code-prompts-helper.md       # instructions for AI assistants
│   ├── wireframes/                  # Figma sources (+ screen index)
│   ├── decisions/                   # tech decisions (made / still open)
│   └── api/                         # backend API contract (when available)
├── public/                          # icons, images, service worker (sw.js)
├── tests/e2e/                       # end-to-end tests
├── .github/                         # CI pipeline, CODEOWNERS, PR/issue templates (admins only)
├── .npmrc                           # npm security settings (don't edit)
├── SECURITY.md                      # how to report security problems
└── .env.example                     # copy to .env.local
```

**How a page works:**
1. The page `src/app/(app)/inventory/stock-overview/page.tsx` imports from `src/modules/inventory/fr-29-stock-overview` (its `index.ts`).
2. That module's `components/` use its `api/` functions.
3. Those go through the shared API client in `src/shared/lib/`.
4. The client calls backend `inventory/fr29_stock_overview`.

---

## 🔀 Daily Git Workflow

`main` is protected. **Developers can't push or merge to `main`.** You open a Pull Request, the CI pipeline runs, an admin reviews it, and **only an admin merges it**.

```bash
# 1. Get the latest main
git checkout main
git pull origin main

# 2. Make a branch for your task
git checkout -b feature/fr-29-stock-table

# 3. Work, then save your changes
git add .
git commit -m "feat(fr-29): add stock table"

# 4. Get the newest main into your branch BEFORE pushing
git pull origin main

# 5. Push your branch
git push -u origin feature/fr-29-stock-table
```

6. On GitHub, open a **Pull Request** into `main` and fill in the checklist.
7. Wait for the **CI checks** (✅ Lint & Build, ✅ Dependency Review) to pass. Fix anything red by pushing more commits to the same branch.
8. An **admin reviews** your PR. If they ask for changes, push fixes to the same branch.
9. The admin **merges** it (squash and merge). The branch is deleted automatically.
10. Go back to `main` and pull again:

```bash
git checkout main
git pull origin main
git branch -d feature/fr-29-stock-table
```

**Branch names:** `feature/…`, `fix/…`, `docs/…`, `refactor/…`
**Commit messages:** `feat(fr-29): …`, `fix(fr-29): …`, `docs: …`, `style: …`, `chore: …`

---

## 🛡 Rules to Avoid Merge Conflicts

1. **Stay in your FR's folders.** Only edit `src/modules/<domain>/fr-xx-<name>/` and its page `src/app/(app)/<domain>/<name>/`.
2. **Ask before editing shared files.** Post in the team chat first. Shared files are:
   `src/shared/**`, `src/styles/**`, `src/business-rules/**`, `src/web-requirements/**`, `src/app/layout.tsx`, `src/app/(app)/layout.tsx`, `package.json`.
   To add a page to the sidebar menu, ask an admin to update `src/shared/config/navigation.ts`.
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

## 🔒 Security Rules (public repo)

This repo is public so it can deploy on Vercel. Anyone can see the code, so:

1. **No secrets in code.** Real values go in `.env.local` (local) or Vercel settings (deployed). Never put a secret in a `NEXT_PUBLIC_` variable, because those are sent to the browser.
2. **Don't add npm packages without admin approval.** Check the exact spelling, weekly downloads, age and maintainer first. Fake look-alike names are common malware.
3. **Don't edit `.npmrc`** (it blocks install scripts, which is where most npm malware runs) **or `.github/`.**
4. **Use `npm ci`** after pulling. It installs exactly what `package-lock.json` says.
5. **Never download or run** files or links posted in issues, comments or PRs by strangers, even if they say "fix". Report them to an admin.
6. **Never clone and run** a random repo someone sends you, such as a "test task" or "job interview" repo.
7. **Turn on 2FA** for GitHub and use only trusted VS Code extensions.
8. Found a security problem? Follow [SECURITY.md](SECURITY.md). Don't open a public issue.

---

## 📐 Coding Conventions

- Components: `PascalCase.tsx`. Hooks: `useSomething.ts`.
- Pages in `src/app/` stay thin. They only import from the module's `index.ts`.
- Call the API only from the module's `api/` folder, never from inside components.
- Use TypeScript types. Avoid `any`.
- Check permissions by role. Roles follow section 12 of the proposal.
- Volume, yield and wastage always come from `src/business-rules/br-13-volume-method`, `br-14-yield-wastage` and `br-15-bark-basis`. Don't write the formulas anywhere else.
- **Use the design system.** Use the colour and font tokens, `Button`, `Icon` and `Sidebar`. Never write a hex colour in a component. See [docs/design-system.md](docs/design-system.md).
- Make field screens phone-friendly: large buttons, high contrast, and they must work offline.
- All text the user sees goes through i18n (English, Sinhala, Tamil). Don't hard-code it.
- Run `npm run lint` before you push.

### Using an AI coding assistant (Claude Code etc.)

- Use the shared instructions in [docs/code-prompts-helper.md](docs/code-prompts-helper.md). For Claude Code, copy it to `CLAUDE.md` in the repo root: `cp docs/code-prompts-helper.md CLAUDE.md`.
- **Never commit `CLAUDE.md`.** It's git-ignored. To change the shared instructions, edit `docs/code-prompts-helper.md` in a PR.
- No AI signatures (`Co-Authored-By`, "Generated with …") in commits, PRs, code or files.
