# Decisions

Technical choices that have been made, or are still open, for the frontend. Add one short file per decision (`NNN-title.md`: context, options, choice, why) when the team agrees.

## Decided

| Topic                       | Choice                                                                                                                                                                     |
| --------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Framework                   | Next.js 16 (App Router) + React 19 + TypeScript 5                                                                                                                          |
| Package manager             | npm, with exact versions (`.npmrc` `save-exact`) and `npm ci` from `package-lock.json`                                                                                     |
| Linting and formatting      | ESLint 9 (`eslint-config-next`) + Prettier (`.prettierrc`)                                                                                                                 |
| Hosting                     | Vercel                                                                                                                                                                     |
| Colours, fonts, shapes      | `src/styles/tokens/` (confirmed Option B palette, Font Selection Option A)                                                                                                 |
| Navigation                  | Sidebar Option B (accordion; icon rail on phones)                                                                                                                          |
| Styling                     | CSS Modules + design tokens. **No Tailwind** for now: the tokens already cover it. Can be revisited.                                                                       |
| Translations (WR-08)        | Built-in `t()` with JSON files in `src/i18n/messages/` (no library). English is the fallback for any missing Sinhala / Tamil text.                                         |
| Working without the backend | `NEXT_PUBLIC_USE_MOCK_API=true`: each module's `api/` file returns mock data (`src/shared/lib/mock-store.ts`).                                                             |
| Sign-in and roles (FR-01)   | Session cookie checked by `src/proxy.ts`; permissions per role from the proposal section 12, checked by `RouteGuard` and `usePermission()`. The backend has the final say. |

**Why TypeScript 5 and not 7:** the lint tooling (`typescript-eslint`) supports TypeScript only below 6.1. Upgrade when it supports newer versions.

## Not decided yet (ask before adding anything)

- UI component library
- Form library and validation library
- Data fetching / caching library
- Test runner (unit) and e2e tool
- Map library (WR-06) and QR scanning library (WR-04)
