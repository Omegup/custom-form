# form-edit

**Edit orchestration layer** — flat form state, section consolidation, and move actions.

Pure TypeScript + a shared React demo host. Does **not** import UI feature modules
(item editor, side menu, section edit).

Migrated from `school/components/custom-form` → `ts-packages/form-edit`.

## Subfolders

### `flat-item-raw-actions/`

See [flat-item-raw-actions/README.md](./flat-item-raw-actions/README.md).

Low-level mutations on the flat item array.

| File | Role |
|---|---|
| `flat-form.t.ts` | `FlatFormItem`, `FlatFormItems` union types |
| `section.t.ts` | `SectionDom` base (`{ id, deleted }`) |
| `getFlatItemsRawActions.ts` | Produces up/down/clone/remove/restore fns for flat entries |
| `GetActionsArgs.t.ts` | `{ items, setItems, ctx, sectionOfItem, setToRemove }` |
| `Clone.t.ts` | Clone callback type for deep-copying item subtrees |

### `section-actions/`

See [section-actions/README.md](./section-actions/README.md).

Section-aware wrappers + tree ↔ flat conversion.

| File | Role |
|---|---|
| `flatten.ts` | `flatten()` / `customFlat()` — recursive item → flat markers |
| `getFormItemMoveActions.ts` | Move actions for one consolidated item |
| `getSectionMoveActions.ts` | Move actions for one section |
| `SectionWithItems.t.ts` | Hydrated section: `{ meta, header, items[][] }` |

### Root files

| File | Role |
|---|---|
| `consolidateSections.ts` | Flat array → `SectionWithItems[]` tree |
| `cloneFlatItems.ts` | Deep clone of flat subtrees with new ids |
| `EditForm.test.tsx` | **`EditFormTest`** — shared demo host (see below) |

## EditFormTest

Central interactive demo. Owns:

- `flatItems` state (canonical edit representation)
- `consolidateSections` → rendered section/field list
- Move action bars on sections and fields
- Delete confirmation banner

**Feature modules inject behavior via props**, not imports:

```tsx
<EditFormTest
  extra={(item) => [{ label: "Edit", onClick: () => openItemEditor(item) }]}
  sectionExtra={(s) => [{ label: "Edit", onClick: () => openSectionEditor(s) }]}
  renderLayout={({ sections, alert, details, setFlatItems, setFocused, ctx }) => (
    <>
      {alert}
      <MySidePanel setFlatItems={setFlatItems} focus={(id) => setFocused({ id, focused: true })} />
      {sections}
      {details}
    </>
  )}
/>
```

Exported types: `EditFormSection`, `EditFormFlatItems`, `EditFormCtx`, `EditFormEditingItem`, …

## Flat → UI pipeline

```
flatItems
  → consolidateSections()     SectionWithItems[]
  → getSectionMoveActions()   per-section MoveActions
  → getFormItemMoveActions()  per-field MoveActions
  → render in EditFormTest
```
