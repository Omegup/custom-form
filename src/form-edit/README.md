# form-edit

**Edit orchestration layer** — flat form state, section consolidation, and move actions.

Pure TypeScript + a shared React demo host. Does **not** import UI feature modules
(item editor, side menu, section edit).

Migrated from `school/components/custom-form` → `ts-packages/form-edit`.

## Subfolders

### `flat-raw-actions/`

See [flat-raw-actions/README.md](./flat-raw-actions/README.md).

`RawActions` builders for the flat list (input to `makeActions`, not UI handlers).

| File | Role |
|---|---|
| `flat-form.t.ts` | `FlatFormItem`, `FlatFormItems` union types |
| `section.t.ts` | `SectionDom` base (`{ id, deleted }`) |
| `getFlatRawActions.ts` | Builds `RawActions` per flat entry for `makeActions` |
| `GetActionsArgs.t.ts` | `{ items, setItems, ctx, sectionOfItem, setToRemove }` |
| `Clone.t.ts` | Clone callback type for deep-copying item subtrees |

### `section-layout/`

See [section-layout/README.md](./section-layout/README.md).

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
| `EditFormHost.tsx` | Re-exports **`EditFormTest`** from `demo/` (see below) |
| `demo/EditFormDemo.tsx` | **`EditFormTest`** + Storybook `EditFormDemo` integration |
| `demo/editFormDemoHelper.tsx` | Fixtures, layout chrome, docs `?raw` source |
| `demo/editFormDemoTypes.t.ts` | Demo types (`EditFormTestProps`, `StoryArgs`, …) |
| `EditForm.stories.tsx` | Storybook entry with controls |

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
