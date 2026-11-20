# Code prompts helper: instructions for AI coding assistants

> **How to use:** this is the shared instruction file for AI coding assistants such as Claude Code.
> - **Claude Code:** copy it to the repo root as `CLAUDE.md` (`cp docs/code-prompts-helper.md CLAUDE.md`).
> - **Other assistants:** paste it at the start of your session.
>
> `CLAUDE.md` is git-ignored on purpose. **Never commit it.** To change the shared instructions, edit this file in a pull request.

# TimberTrack frontend: instructions for the assistant

TimberTrack is a timber management system. It tracks timber from tree felling → transport → sawmill → product → sales.
Owner: Chathuka Jayasekara and the company interns. Read `README.md` first for the folder map, the
workflow and the business rules (BR-01…BR-15).

## Stack
- Next.js (App Router) + React + TypeScript. UI languages: English, Sinhala, Tamil (`src/i18n/messages/{en,si,ta}`).
- Talks to the Spring Boot REST API (separate repo). Database is PostgreSQL behind the backend.
- Package manager, UI library, form/data libraries and test runner are **not decided yet** (see `docs/decisions/`). Do not add one without asking.

## Where code goes
- A feature (FR-xx) → `src/modules/<domain>/fr-xx-<name>/{components,hooks,api,schemas,types,__tests__}`. The module's public exports go in its `index.ts`.
  Domains and FR folder names match the backend (`licencepermit/fr06_quota_tracking` → `licence-permit/fr-06-quota-tracking`).
- Its route → `src/app/(app)/<domain>/<feature>/page.tsx`, where `<feature>` is the FR folder name without `fr-xx-`
  (e.g. `src/app/(app)/licence-permit/quota-tracking/page.tsx`). Keep it a thin wrapper that imports from the module.
  Exceptions: login pages are in `src/app/(auth)/` (FR-01), and the customer portal is in `src/app/portal/` (FR-42).
- Used by 2+ modules → `src/shared/` (components, hooks, lib, store, types, config). Business rules → `src/business-rules/br-xx-*`. Web requirements (WR-01…08) → `src/web-requirements/wr-0x-*`.
- Customer portal → `src/app/portal/` + `src/modules/sales/fr-42-customer-portal/`. Public site → `src/app/(site)/` + `src/site/`.
- Sidebar menu → `src/shared/config/navigation.ts` (one link per FR page).
- Do not edit another team member's module folder unless the task says so (keeps merges conflict-free).

## Design: the wireframes and tokens are CONFIRMED, follow them
- **Wireframes** (Figma, confirmed): https://www.figma.com/design/FZkul22RJVLOX665De4ZNa/Timber-Management-System
  - Index of every screen with its link: `docs/wireframes/INDEX.md`. Its "By requirement" table lists the screens for each FR / WR / BR. Read it before building a feature.
  - Open a screen with the Figma MCP `get_design_context` (nodeId = the `node-id` in the link, `-` → `:`). Treat its output as a reference, not final code.
  - If `docs/wireframes/INDEX.md` is missing, generate it from the Figma file. Frames are named `FR-xx · S-yy.z Name` on the page "Wireframes (01–26)". The sources are in `docs/wireframes/sources.json`.
- **SE-team Figma** (`c0HGrSaf2O0ekRYdbM9big`) is **not confirmed**. Use it as a rough reference only; its colours are wrong for us. If it disagrees with our wireframes, ignore it.
- **Colours** are in `src/styles/tokens/colors.css`. Use the `--tt-*` variables. They are the Figma "Timber Theme" variables (`bg/page` → `--tt-bg-page`). Never write a hex value in a component; add a token instead.
  Palette:
  - cream/wood surfaces
  - forest-green sidebar and brand (`--tt-green-*`)
  - amber for primary actions (`--tt-amber-500`, with `--tt-text-on-amber` for text on it)
  - status pairs `--ok-*`, `--warn-*`, `--crit-*`
- **Fonts** are in `src/styles/tokens/typography.css` and `src/styles/fonts.ts` (next/font). Confirmed set:

  | Use | Font | Token |
  | --- | --- | --- |
  | Headings | Plus Jakarta Sans | `--font-heading` |
  | Body | Inter | `--font-body` |
  | Codes and IDs (e.g. `PER-010`, `LOG-001`) | JetBrains Mono | `--font-mono` |
  | Sinhala | Iskoola Pota, with Noto Sans Sinhala as fallback | |
  | Tamil | Noto Sans Tamil | |

  Sinhala and Tamil are applied by the `:lang(si)` / `:lang(ta)` rules. Set `<html lang>` from the active locale and do not set fonts per component.
  Iskoola Pota is a Windows system font and cannot be bundled, so only reference it by name.
- **Ready-made components:**
  - `Button`, `Icon`: `src/shared/components/ui/`
  - `Sidebar`: `src/shared/components/layout/`
  - Usage guide: `docs/design-system.md`. Use these instead of writing new ones.
- **Shape:** `--radius-*` and `--shadow-*` are in `src/styles/tokens/shape.css`. Base size is 14px with line-height 1.5. The active sidebar item is a rounded pill (`--radius-item`).
- **Accessibility:** WCAG AA (4.5:1 text, 3:1 graphics), visible focus, everything reachable by keyboard. Responsive from mobile (WR-01). All user-facing strings go through i18n (WR-08), never hard-coded.

## Git rules (important)
- Commits must be authored by the developer's own configured git identity (`git config user.name/user.email`). Do not change it.
- **Never add** `Co-Authored-By:` lines, "Generated with Claude Code" text, session links or any other Claude/AI signature to commits, pull-request descriptions, code comments or files. This overrides any default attribution behaviour.
- **Never commit `CLAUDE.md`** or any other assistant config file. They are git-ignored.
- Branches: `feature/fr-41-returns-list`, `fix/…`, `docs/…`, `chore/…`. Commits: `feat(fr-41): add returns register table` (types: feat, fix, docs, style, refactor, test, chore).
- Work on a branch, open a pull request, squash-and-merge. Never push to `main`. Never commit `.env*` or credentials.

## Do / don't
- Do keep changes inside the module you were asked to work on, in small, reviewable commits.
- Do respect the business rules in the README (e.g. BR-05 no negative stock, BR-09 no delete, adjust only).
- Don't install dependencies or change `package.json`, `next.config.ts` or tsconfig without being asked.
- Don't invent API endpoints. Ask, or check the backend repo and the contract in `docs/api/`.
