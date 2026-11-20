# Decisions

Technical choices that have been made, or are still open, for the frontend. Add one short file per decision (`NNN-title.md`: context, options, choice, why) when the team agrees.

## Decided
| Topic | Choice |
| --- | --- |
| Framework | Next.js (App Router) + React + TypeScript |
| Hosting | Vercel (public repo) |
| Colours, fonts, shapes | `src/styles/tokens/` (confirmed Option B palette, Font Selection Option A) |
| Navigation | Sidebar Option B (accordion; icon rail on phones) |
| Styling of shared components | CSS Modules + design tokens (no UI library) |

## Not decided yet (ask before adding anything)
- Package manager (npm is assumed in the README and CI)
- UI component library
- Form library and validation library
- Data fetching / caching library
- i18n library (WR-08)
- Test runner (unit) and e2e tool
- Map library (WR-06) and QR scanning library (WR-04)
