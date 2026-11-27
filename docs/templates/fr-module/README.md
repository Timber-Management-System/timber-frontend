# FR module template (list page + popups)

A ready-made starting point for a feature (FR-xx). It gives you a list page where records are
**created, viewed, edited, approved and rejected in popups**, so users never wait for a new page
to load. The table updates in place after each save.

```
fr-module/
  index.ts                        public exports (the route imports only from here)
  messages.en.json                English text – copy into src/i18n/messages/en.json
  types/example.types.ts          record, form values, API input
  schemas/example.schema.ts       validation per step (returns i18n keys), draft rules
  api/example.api.ts              list / create / update / approve / reject, drafts (+ mock data)
  hooks/useExampleItems.ts        loads the list; replace() updates one row after a save
  components/
    ExamplePage.tsx               list page: table, ••• row menu, which popup is open
    ExampleFormDialog.tsx         create + edit popup with steps, sections and "Save as draft"
    ExampleDetailsDialog.tsx      view / review popup with Edit, Reject, Approve buttons
    status.ts                     badge colour per status, which statuses can be edited
    ExamplePage.module.css        styles (tokens only)
  __tests__/README.md
```

## The form popup (approved layout)

```
 MODULE NAME                                                       [x]
 New record
 Fill in the record details. You can save a draft and finish later.
 ──────────────────────────────────────────────────────────────────────
     (1) Information ───── (2) Details ───── (3) Review         <- Stepper (stays put)
 ──────────────────────────────────────────────────────────────────────
  ┌ 01  Record information ────────────────────────────────┐    <- FormSection cards
  │ Reference (read-only)          Date *                   │      (the body scrolls)
  └─────────────────────────────────────────────────────────┘
  ┌ 02  Name and site ──────────────────────────────────────┐
  │ Name *                         Site *                   │
  └─────────────────────────────────────────────────────────┘
 ──────────────────────────────────────────────────────────────────────
 Cancel                               [Back] [Save as draft] [Continue]
```

- **Continue** checks only the fields on the current step (`STEP_FIELDS` in the schema), then moves on.
  On the last step it becomes **Create record** (or **Save changes** when editing).
- **Finished steps** get a tick and can be clicked to go back; values are kept.
- **Save as draft** needs only a name (`DRAFT_FIELDS`). Drafts can be edited and finished later,
  but can't be approved until they are sent (status `DRAFT` → `PENDING`).
- **Read-only fields** (an ID the system assigns) use `readOnly` and get the beige "filled in for you" style.
- **Few fields?** Use one step: drop the `Stepper` and keep the sections. **Very short** (1–3 fields)?
  A plain `Dialog` is enough.

Shared parts used: `Dialog` (`eyebrow`, `subheader`, `footerStart`, `bodyTone="sections"`, `size="lg"`),
`Stepper`, `FormSection` + `FullWidth`, `TextField`, `SelectField`, `Button`.

## Start a new FR from it

1. Copy the folder into your FR folder, e.g. `src/modules/site-tree/fr-14-replanting/`.
2. Rename `Example` / `example` to your feature in file names and code (`ReplantingPage`, `replanting.api.ts`, …).
3. Set `AREA` in the page to your permission area (`AREAS` in `src/shared/lib/auth/permissions.ts`).
4. Move the keys from `messages.en.json` into `src/i18n/messages/en.json` under your own namespace
   (e.g. `replanting.*`) and update the `t('example.…')` calls. Set `eyebrow` to your module name.
   Add `si.json` / `ta.json` when known. Then delete `messages.en.json` and this README from your folder.
5. Change the fields in `types`, `schemas` (`STEP_FIELDS`), the form steps and the table to match your
   wireframe and the backend DTO.
6. Keep `ENDPOINT` as a TODO until the backend contract (`docs/api/`) has the real path.
7. Add the thin route: `src/app/(app)/<domain>/<feature>/page.tsx` → `return <ReplantingPage />;`

## Popup or page?

| Use a **popup** (`Dialog`, `ConfirmDialog`)              | Use a **separate page**                                    |
| -------------------------------------------------------- | ---------------------------------------------------------- |
| Create / edit forms, split into steps when they get long | Very long forms (many steps, tables of lines to fill in)   |
| View / review a record, then approve or reject           | Field capture that must work offline (WR-05)               |
| Approve, reject, cancel, deactivate (with reason)        | A record people need to link to, print (WR-07) or bookmark |
| Quick edits of one record from a list                    | Screens the wireframe draws as a full page                 |

Follow the wireframe first (`docs/wireframes/INDEX.md`, section 18 "Manage popups" shows the popup style).

## Rules the template already follows

- **Text:** every label goes through `t()` (WR-08). No English typed straight into JSX.
- **Permissions:** the New button and each menu action appear only for roles that may use them
  (`usePermission(AREA, 'C' | 'U' | 'A')`). The backend must check too.
- **No delete (BR-09):** there is no Delete action. Records are adjusted, rejected or cancelled with a reason.
- **Locked after decision:** drafts and pending records can be edited; only pending records can be
  approved or rejected; approved and rejected records are read-only.
- **Shared components only:** `PageHeader`, `Button`, `Badge`, `Callout`, `Dialog`, `ConfirmDialog`,
  `Stepper`, `FormSection`, `RowMenu`, `TextField`, `SelectField`. See `docs/design-system.md`.
- **Mock data:** works without the backend while `NEXT_PUBLIC_USE_MOCK_API=true`; changes are kept in
  the browser so a reload doesn't lose them. Never keep passwords or personal IDs there.
- **Accessibility:** popups trap focus and close with Escape; the current step is announced
  (`aria-current="step"`); the row menu works with arrow keys; success messages are announced.
- **Phones:** the popup fits the screen, fields stack in one column, the stepper shows only the
  current step's name, and Cancel moves under the main buttons.
