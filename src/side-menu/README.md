# side-menu

**Library sidebar** — searchable catalog of item types plus "+ Add section",
feeding the form-item-editor dialog with new-item insert sessions.

Migrated from `school/components/custom-form` → `react-packages/form-edit-react`
(`useSide`, `MenuItemDefinition`) + `section-edit-ui` (`FormMenuItem` `mapMenu`).

## Library scope (this package)

| File | Role |
|---|---|
| `MenuItemDefinition.t.ts` | Catalog entry `{ title, icon?, n?, header: { type, params } }` |
| `createBlankFormItem.ts` | **`createBlankFormItem(definition, random)`** → `NewFormItem` (`header` with fresh id + `deleted: false`, `children: n × []`); school `FormMenuItem` `mapMenu` |
| `useSide.ts` | **`useSide({ menuItems, setAddFormItem, setAddSection, blankSection, random })`** — accent-insensitive search filter, `renderMenuItems`, `addSection` emitting a `NewSection` (`index: -1`); port of school `useSide` |
| `FormMenuItem.tsx` | Catalog row button — click emits `createBlankFormItem(definition, random)` |
| `Side.tsx` | Sidebar UI: title, search input, catalog rows, "+ Add section" (school `form-edit-ui/Side` minus theme / i18n / icon set) |

## Add flow (school parity)

Click a type → **open the form-item-editor dialog** with a new-item session.
No blank item is inserted on click; the list only changes on dialog Save:

```
FormMenuItem click
  → createBlankFormItem(definition, random)     NewFormItem { header, children }
  → openFormItemInsertSession(newItem)          index/sIndex: -1, total: 0   (form-edit)
  → form-item-editor dialog (validate)
  → applyFlatFormItem(items, session, item, n)  appends to session.sIndex's section
```

**Which section?** — school `editors/selectSection.tsx`: whenever there's more
than one non-deleted section, the dialog also asks. The demo passes
`extra.sectionPicker = { sIndex, setSIndex, sections }` where each option's
`index` is the section marker's **flat** index (`section.meta.index`, school
`p.index`). Picking an option updates `session.sIndex` before Save;
`applyFlatFormItem` then appends after the last *non-deleted* item in that
section (school `justAfter` — never after trailing soft-deleted items). With
exactly one section, `sIndex` stays `-1` and resolves to that section
automatically (no picker shown) — same as `edit-section`'s slot inserts, which
always have a concrete index/section and never show the picker.

"+ Add section" emits `NewSection`
(`{ header: blankSection(random()), index: -1, items: [[]], total: 0 }`); the
consumer opens the section-edit dialog and saves via `updateSectionInFlat`
(`index === -1` → append).

## Deviations from school

| School | Here | Why |
|---|---|---|
| `addSection` hardcodes the `AppSection` blank header | `blankSection(id)` factory param | `SectionConfig` is generic in this repo |
| `FormMenuItem` click payload carries `index/sIndex: -1` | payload is `NewFormItem` (header + children only) | the consumer attaches the span (`openFormItemInsertSession` default for the sidebar, concrete slot index for `edit-section`), so one row component serves both |
| `MenuItem` / `InputSearch` / theme / i18n design system | plain elements + `title` / `addSectionLabel` props | no design system in this repo |

## Demo

`side-menu/Side menu` story: the multi-type list shell
(`FormItemEditorFormTest`, form-item-editor demo) with `renderLayout` placing
`Side` beside the list. Adds reuse the form-item-editor demo editor stack
(`FormItemEditor`, `itemName`) plus its `extra.sectionPicker` for the
multi-section case; "Add section" reuses the section-edit demo
`SectionDialog`. Try it with the default fixture (two sections, "Personal" /
"Details") to see the picker.

## Dependency rule

Imports from: `form`, `recursive-form`, `form-edit` (types) via `_deps`.

Does **not** import: `form-item-editor`, `section-edit`, `edit-section`.
The demo composes those packages for Storybook only.
