# form-item-editor

**Single-item edit dialog** — HOC factory for editing one form item inside a modal/panel.

Migrated from `school/components/custom-form` → `react-packages/form-item-edit-react`.

## Library scope (this package)

School’s `form-item-edit-react` is intentionally thin. Slot-tree matches that:

| File | Role |
|---|---|
| `types.ts` | `Editors`, `Editor`, `UseFormItemEditor`, `FormItemEditorProps`, validation types |
| `createFormItemEditorWrapper.tsx` | **`createFormItemEditorWrapper`** — main HOC factory |

The HOC owns:

- aggregating `impRef` validators into one `validate(value, setError)` callback for `useHook`
- picking the per-type `Editor`
- `setFormItemParam` — update one param on the draft `FlatFormItem`

Everything else is **consumer code** (demo, app UI, or a sibling package).

### Intentional differences from school

| School | Slot-tree | Why |
|---|---|---|
| `props` + `extra` only; draft in `useHook` via formik | `formItem` / `setFormItem` on props | flat edit model instead of recursive draft inside the hook |
| `recursiveFormItem`, `setFormItemSection`, `cols` on hook state | panel `n` on `FlatFormItem`; section pick deferred | flat-first demo; section editor not migrated |
| `Editor` has `render()` slot for companion sub-editors | no `render()` slot yet | **parity gap** — add when a real multi-ref editor needs it |

## Demo vs library vs deferred features

Logic in `demo/FormItemEditorDemo.tsx` and friends, and where it belongs:

### Stays in demo forever (domain / Storybook)

| Demo code | Reason |
|---|---|
| `FieldEditor`, `HeadingEditor`, `PanelEditor` (in `FormItemEditorDemo.tsx`) | Domain editors — school keeps these in `editors/`, not in `form-item-edit-react` |
| `useItemEditor` + `save` + duplicate-name check | App `useFormItemEditor` pattern (school: `legacy-front/.../useFormItemEditor.ts` + formik) |
| `EditorDialog`, field UI chrome, `FormItemEditorFormTest` | Helper — school: `renderDefaultDialog`, design-system inputs, form-edit list |
| Name `viewers` + `createFormItemByGetChild` | Same composition as `form` demo — per-type labels without a type switch |
| `otherNames` collection | Demo business rule |

### Stays in demo until **`form-edit-react`** is migrated

School home: `react-packages/form-edit-react/useDialog.tsx` (`makeUseDialogs`).

| Demo code | School equivalent | Notes |
|---|---|---|
| `EditingSession` + `openSession` | `editFormItem: EditFormItem \| null` | open/close edit target + subtree snapshot |
| `commitEditingSession` | `setEditFormItemX` in `useDialog` | `resizeColumns` + `flatten().formItem` + `flatItems.toSpliced(index, total, …)` |
| `commitDraft` / session `setFormItem` wiring | `setEditFormItem(item, cols)` passed via `extra` | glue between editor save and flat list |
| `FormItemEditorDemo` shell | `DialogUi` + `CustomFormEditor` | compose list + dialog |

`resizeColumns` already lives in **`recursive-form`** (school’s `changeCols`); the demo should import it, not reimplement it.

### Stays in demo until **`form-edit`** story integration (or `editor/` all-in)

| Demo code | Package | Notes |
|---|---|---|
| `FormItemEditorFormTest` (helper) | `form-edit` demo | consolidate, move actions, nested panel render, clone |
| `cloneFn` via `cloneFlatItems` | `form-edit` — shared `params.name` rename, no type switch |
| `extra={(item) => [{ label: "Edit", … }]}` | `form-edit` `form-item.actions` | `edit: () => setEditFormItem(q)` |

### Stays in demo / not started — other packages

| Concern | Target package | School reference |
|---|---|---|
| Formik `useFormItemEditor` (`handleSubmit`, `isError`, `setColumns`) | app UI layer | `legacy-front/.../useFormItemEditor.ts` |
| Section picker + `setFormItemSection` | `section-edit` + editor extras | `editors/selectSection.tsx` |
| Real modal chrome | app / `editor/` | `form-edit-ui/renderDefaultDialog.tsx` |
| `update` + `validate` on responses | `response/` + `form-react` | `getUseImpRefViewProps`, `CustomFormResponder` |

## Architecture

```
createFormItemEditorWrapper(editors, useHook, renderDialog)
  → React component (props: { ctx, dialogArgs, formItem, setFormItem, extra })
      1. useHook(props, { validate }) → state (e.g. save, saveError)
      2. editors[item.type].editor → per-type Editor component
      3. renderDialog(dialogArgs, state, children) → shell (title, Save/Cancel)
```

### Wiring a custom editor

1. **Define types** for your domain (`TypeNames`, `Params`, …)
2. **useHook** — `save` calls aggregated `validate`, then your commit callback
3. **Editor** — register rules on `impRef` via `useImperativeHandle`
4. **renderDialog** — modal chrome; Save calls `state.save`

### Demo pattern

`FormItemEditorDemo` composes `FormItemEditorFormTest` (form-edit demo) + the editor dialog:

1. **Edit** opens a session (`openSession`) with draft + children + flat span meta
2. **`FormItemEditor`** edits the draft via `setFormItem`
3. **`save`** validates, then `onCommit` → `commitEditingSession` (→ **`form-edit-react`** when migrated)

## Types cheat sheet

| Type | Purpose |
|---|---|
| `ItemEditExtraDom` | Branded bag on `props.extra` (`onCommit`, app rules, …) |
| `DialogArgsDom` | Branded dialog config (`title`, `onCancel`, …) |
| `FormItemEditorValidate` | `{ validate(value, setError) }` — void; errors only |
| `UseFormItemEditor` | Generic `useHook` — `<K>(props, { validate }) => { state }` |

## Dependency rule

Imports from: `form`, `recursive-form`, `move-actions` (via `_deps`).

Does **not** import: `form-edit`, `side-menu`, `section-edit`. Demo imports `form-edit` for Storybook only.
