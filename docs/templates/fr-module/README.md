# FR module template (list page + popups)

A ready-made starting point for a feature (FR-xx). It gives you a list page where records are
**created, viewed, edited, approved and rejected in popups**, so users never wait for a new page
to load. The table updates in place after each save.

```
fr-module/
  index.ts                        public exports (the route imports only from here)
  messages.en.json                English text – copy into src/i18n/messages/en.json
  types/example.types.ts          record, form values, API input
  schemas/example.schema.ts       form validation (returns i18n keys)
  api/example.api.ts              list / create / update / approve / reject (+ mock data)
  hooks/useExampleItems.ts        loads the list; replace() updates one row after a save
  components/
    ExamplePage.tsx               list page: table, ••• row menu, which popup is open
    ExampleFormDialog.tsx         create + edit popup (one form for both)
    ExampleDetailsDialog.tsx      view / review popup with Edit, Reject, Approve buttons
    status.ts                     badge colour per status
    ExamplePage.module.css        styles (tokens only)
  __tests__/README.md
```

## Start a new FR from it

1. Copy the folder into your FR folder, e.g. `src/modules/site-tree/fr-14-replanting/`.
2. Rename `Example` / `example` to your feature in file names and code (`ReplantingPage`, `replanting.api.ts`, …).
3. Set `AREA` in the page to your permission area (`AREAS` in `src/shared/lib/auth/permissions.ts`).
4. Move the keys from `messages.en.json` into `src/i18n/messages/en.json` under your own namespace
   (e.g. `replanting.*`) and update the `t('example.…')` calls. Add `si.json` / `ta.json` when known.
   Then delete `messages.en.json` from your folder.
5. Change the fields in `types`, `schemas`, the form and the table to match your wireframe and the backend DTO.
6. Keep `ENDPOINT` as a TODO until the backend contract (`docs/api/`) has the real path.
7. Add the thin route: `src/app/(app)/<domain>/<feature>/page.tsx` → `return <ReplantingPage />;`

## Popup or page?

| Use a **popup** (`Dialog`, `ConfirmDialog`)       | Use a **separate page**                                    |
| ------------------------------------------------- | ---------------------------------------------------------- |
| Short forms: up to ~8 fields, one section         | Long forms or several sections / steps                     |
| View / review a record, then approve or reject    | Field capture that must work offline (WR-05)               |
| Approve, reject, cancel, deactivate (with reason) | A record people need to link to, print (WR-07) or bookmark |
| Quick edits of one record from a list             | Screens the wireframe draws as a full page                 |

Follow the wireframe first (`docs/wireframes/INDEX.md`, section 18 "Manage popups" shows the popup style).

## Rules the template already follows

- **Text:** every label goes through `t()` (WR-08). No English typed straight into JSX.
- **Permissions:** the New button and each menu action appear only for roles that may use them
  (`usePermission(AREA, 'C' | 'U' | 'A')`). The backend must check too.
- **No delete (BR-09):** there is no Delete action. Records are adjusted, rejected or cancelled with a reason.
- **Locked after decision:** only `PENDING` records can be edited, approved or rejected.
- **Shared components only:** `PageHeader`, `Button`, `Badge`, `Callout`, `Dialog`, `ConfirmDialog`,
  `RowMenu`, `TextField`, `SelectField`. See `docs/design-system.md`.
- **Mock data:** works without the backend while `NEXT_PUBLIC_USE_MOCK_API=true`; changes are kept in
  the browser so a reload doesn't lose them.
- **Accessibility:** popups trap focus and close with Escape; the row menu works with arrow keys;
  the success message is announced to screen readers.
