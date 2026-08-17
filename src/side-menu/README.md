# side-menu

**Library catalog** — searchable sidebar (`Side`) *and* in-slot add dropdown
(`AddFormItem`), both fed by the same `MenuItemDefinition` list.

Migrated from `school/components/custom-form` → `react-packages/form-edit-react`
(`useSide`, `MenuItemDefinition`, `makeUseRenderAddItem`) + `section-edit-ui`
(`FormMenuItem`, `AddFormItem`).

School's `CustomFormEditor` composes **both** entry points together from one
`useMenuItems()` catalog — the sidebar is the ambiguous insert; the slot
dropdown is the concrete-span insert. They belong in the same package.

## Library scope (this package)

| File | Role |
|---|---|
| `MenuItemDefinition.t.ts` | Catalog entry `{ title, icon?, n?, header: { type, params } }` |
| `createBlankFormItem.ts` | **`createBlankFormItem(definition, random)`** → `NewFormItem` (`header` with fresh id + `deleted: false`, `children: n × []`); school `FormMenuItem` `mapMenu` |
| `useSide.ts` | **`useSide({ menuItems, setAddFormItem, setAddSection, blankSection, random })`** — accent-insensitive search filter, `renderMenuItems`, `addSection` emitting a `NewSection` (`index: -1`); port of school `useSide` |
| `FormMenuItem.tsx` | Catalog row **logic** — `render({ title, icon, onSelect })`; click emits `createBlankFormItem` |
| `Side.tsx` | Sidebar **logic** — `useSide` + `render` / `renderMenuItem` (no HTML) |
| `AddFormItem.tsx` | In-slot add **logic** — open state + insert session; host `render` owns dropdown chrome |
| `makeUseRenderAddItem.ts` | **`makeUseRenderAddItem(renderAddItem, useMenuItems, random)(setAddItem)`** → `(span) => ReactNode` — school factory; list shell injects it at every list slot |

## Two add flows (school parity)

**Sidebar** — ambiguous insert; dialog may ask which section:

```
FormMenuItem click (Side)
  → createBlankFormItem(definition, random)
  → openFormItemInsertSession(newItem, AMBIGUOUS_INSERT_SPAN)   total: 0
  → form-item-editor (+ sectionPicker when >1 section)
  → applyFlatFormItem(…)
```

**In-slot** — concrete span; no section picker (school FlatDnd `render.addItem`):

```
AddFormItem pick (section or nested panel column)
  → openFormItemInsertSession(newItem, { index, sIndex })   total: 0
  → form-item-editor (no picker)
  → applyFlatFormItem(…)  inserts at that flat index
```

The list shell computes `index` via `getFlatInsertionIndex` (same formula as
FlatDnd list-node indexes) for section columns *and* nested panel columns.

"+ Add section" emits `NewSection`
(`{ header: blankSection(random()), index: -1, items: [[]], total: 0 }`); the
consumer opens the section-edit dialog and saves via `updateSectionInFlat`
(`index === -1` → append).

## Deviations from school

| School | Here | Why |
|---|---|---|
| `addSection` hardcodes the `AppSection` blank header | `blankSection(id)` factory param | `SectionConfig` is generic in this repo |
| `FormMenuItem` click payload carries `index/sIndex: -1` | payload is `NewFormItem` (header + children only) | the consumer attaches the span (`AMBIGUOUS_INSERT_SPAN` for the sidebar, concrete slot index for `AddFormItem`), so one row component serves both |
| `MenuItem` / `InputSearch` / theme / i18n design system | **no HTML in library** — host `render` / `renderMenuItem` (demo chrome) | host-agnostic; see `.cursor/rules/no-html-outside-demo.mdc` |

## Demo

`side-menu/Side menu` story: multi-type list shell (`FormItemEditorFormTest`)
with `renderLayout` placing `Side` beside the list **and** `renderAddItem`
from `makeUseRenderAddItem` (section + nested panel columns). Same editor
stack as form-item-editor; slot inserts skip the section picker
(`session.index !== -1`). "Add section" reuses section-edit's `SectionDialog`.

## Dependency rule

Imports from: `form`, `recursive-form`, `form-edit` (via `_deps`).

Does **not** import: `form-item-editor`, `section-edit`.
The demo composes those packages for Storybook only.
