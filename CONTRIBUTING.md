# Developer guide: how to work on TimberTrack

Read this once before your first task. It covers:
- setting up your own work environment
- picking a task
- naming your branch
- committing and opening a pull request
- starting a new feature from the templates

The examples use **FR-12 Tree approval**. Its code lives in `src/modules/site-tree/fr-12-tree-approval/`.

---

## 1. Your own work environment (once per computer)

Every developer works on **their own copy** of the repo. Nobody edits files on someone else's computer or directly on GitHub.

You need **Node.js 22 or newer**, **Git**, **VS Code**, and **2FA turned on for your GitHub account**.

```bash
git clone https://github.com/Timber-Management-System/timber-frontend.git
cd timber-frontend

git config --global user.name  "your-github-username"
git config --global user.email "your-github-email"

cp .env.example .env.local        # your private settings (never committed)
npm ci                            # installs the exact package versions
npm run dev                       # http://localhost:3000
```

**The backend isn't ready yet.** Work with mock data. Every API file in the module template has a `USE_MOCK` switch with sample data. Turn it off when the backend endpoint exists.

**Optional:** to use an AI assistant (Claude Code etc.), copy the shared instructions: `cp docs/code-prompts-helper.md CLAUDE.md`. Never commit `CLAUDE.md`.

---

## 2. Pick a task

1. Open **Issues** and pick one, or ask an admin to create one. Use the issue forms: **FR task**, **Business rule** or **Bug**.
2. **Assign it to yourself** so nobody else starts the same work.
3. **One issue = one FR = one branch.**

---

## 3. Branch name format

```
type/fr-number-short-name
```

| Type | Use it for | Example |
| --- | --- | --- |
| `feature/` | New FR work | `feature/fr-12-tree-approval` |
| `fix/` | A bug | `fix/fr-12-approval-button-disabled` |
| `docs/` | Documentation only | `docs/fr-12-readme-update` |
| `refactor/` | Cleaning code, no new behaviour | `refactor/fr-12-approval-hooks` |
| `feature/br-…` | A business rule | `feature/br-05-no-negative-stock` |

- Use **small letters and dashes** only: no spaces, no capitals, and no branches named after yourself.
- **The FR (or BR) number comes first**, so we can find the branch quickly.
- **Keep it short:** one FR, one task.

---

## 4. Steps (copy exactly)

```bash
# Start from the newest main
git checkout main
git pull origin main

# Create your branch
git checkout -b feature/fr-12-tree-approval

# Work only in your FR folder:
#   src/modules/site-tree/fr-12-tree-approval/
#   src/app/(app)/site-tree/tree-approval/page.tsx

# Check before you commit
npm run lint
npm run typecheck
npm run build

# Commit small and often
git add .
git commit -m "feat(fr-12): add tree approval list table"

# Get the newest main into your branch BEFORE pushing
git pull origin main

# Push your branch
git push -u origin feature/fr-12-tree-approval
```

> We use `git pull origin main` (merge), not `--rebase`. A rebase after you've already pushed needs a force push, and that's easy to get wrong. Your PR is squash-merged anyway, so the history stays clean.

---

## 5. Then on GitHub

1. Open a **Pull Request** into `main` with the title `feat(fr-12): tree approval list`. Fill in the template and write `Closes #<issue number>`.
2. Wait for the two checks to turn green: **Lint & Build** and **Dependency Review**. If one is red, push more commits to the same branch to fix it.
3. An **admin reviews** the PR. If they ask for changes, push more commits to the same branch.
4. The **admin squash-merges** it, and the branch is deleted automatically. Developers can't merge.

## 6. After the merge

```bash
git checkout main
git pull origin main
git branch -d feature/fr-12-tree-approval
```

---

## 7. Commit message format

```
type(fr-number): what you did      ← in small letters
```

- `feat(fr-12): add approval status badge`
- `fix(fr-12): correct date format in table`
- `docs(fr-12): add notes about the approval flow`
- `feat(br-05): add no-negative-stock check`

The types are `feat`, `fix`, `docs`, `style`, `refactor`, `test` and `chore`.

---

## 8. Start a new FR (module template)

Your FR folder already exists with empty sub-folders. Copy the template into it:

```bash
cp -r docs/templates/fr-module/* src/modules/site-tree/fr-12-tree-approval/
```

Then:

1. **Rename** `Example` / `example` to your feature everywhere (files and code): `ExamplePage` → `TreeApprovalPage`, `example.api.ts` → `tree-approval.api.ts` …
2. **Point the page at your module**. Replace the placeholder in `src/app/(app)/site-tree/tree-approval/page.tsx`:
   ```tsx
   import { TreeApprovalPage } from '@/modules/site-tree/fr-12-tree-approval';

   export default function Page() {
     return <TreeApprovalPage />;
   }
   ```
3. **Build the screen from the Figma wireframe** for your FR, using the design system (`docs/design-system.md`).

| Template file | What goes in it |
| --- | --- |
| `index.ts` | What the page imports. Nothing else imports from inside your folder. |
| `components/` | Your screens and parts, with a `.module.css` next to each, using tokens only |
| `hooks/` | Loading data for components (loading and error states) |
| `api/` | Backend calls through `@/shared/lib/api-client`, with a `USE_MOCK` switch until the backend is ready |
| `schemas/` | Form validation. Errors are i18n keys. |
| `types/` | TypeScript types that match the backend DTOs |
| `__tests__/` | Tests (the test runner isn't decided yet, so see the README in there) |

---

## 9. Business rules (BR-01 … BR-15)

The rules are listed in the README. Each one has a folder in `src/business-rules/`. A rule is **one pure function**:
- no API calls, no React
- it returns `pass()` or `fail(rule, code, messageKey)` from `src/business-rules/rule-result.ts`

Template and worked example (BR-05): `docs/templates/business-rule/index.ts`

```ts
import { checkNoNegativeStock } from '@/business-rules/br-05-no-negative-stock';

const result = checkNoNegativeStock({ available: 10, requested: 12 });
if (!result.ok) {
  // show t(result.messageKey, result.params) next to the quantity field
}
```

- **One developer owns each rule.** FR developers import it; they don't copy the logic.
- **The backend has the final say.** The frontend check only warns the user early.
- `src/business-rules/` is a shared folder, so changes need an admin review.

---

## 10. Rules

- **Never work on `main`.** Never push to `main`.
- **One branch per task**, merged within 1–3 days.
- **Only touch your own FR folder** unless the task says otherwise. For shared files, ask first: `src/shared/`, `src/styles/`, `src/business-rules/`, `src/shared/config/navigation.ts`, `package.json`.
- **Never commit** `.env.local`, passwords, tokens or `CLAUDE.md`.
- **Don't add npm packages** without asking an admin.
- **Use the design system:** `--tt-*` colour tokens, `Button`, `Icon`, `Sidebar`. No hex colours in components.
- **No AI signatures** (`Co-Authored-By`, "Generated with …") in commits, PRs, code or files.

Stuck? Ask in the team chat, or comment on your issue and tag an admin.
