# Decisions

Technical choices that have been made, or are still open, for the frontend. Add one short file per decision (`NNN-title.md`: context, options, choice, why) when the team agrees.

## Decided
| Topic | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router) + React 19 + TypeScript 5 |
| Package manager | npm, with exact versions (`.npmrc` `save-exact`) and `npm ci` from `package-lock.json` |
| Linting and formatting | ESLint 9 (`eslint-config-next`) + Prettier (`.prettierrc`) |
| Hosting | Vercel |
| Colours, fonts, shapes | `src/styles/tokens/` (confirmed Option B palette, Font Selection Option A) |
| Navigation | Sidebar Option B (accordion; icon rail on phones) |
| Styling | CSS Modules + design tokens. **No Tailwind** for now: the tokens already cover it. Can be revisited. |

**Why TypeScript 5 and not 7:** the lint tooling (`typescript-eslint`) supports TypeScript only below 6.1. Upgrade when it supports newer versions.

## Not decided yet (ask before adding anything)
- UI component library
- Form library and validation library
- Data fetching / caching library
- i18n library (WR-08)
- Test runner (unit) and e2e tool
- Map library (WR-06) and QR scanning library (WR-04)
