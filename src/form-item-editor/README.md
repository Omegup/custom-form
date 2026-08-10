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
| `recursiveFormItem`, `setFormItemSection`, `cols` on hook state | panel `n` on `FlatFormItem`; section pick via `extra.sectionPicker` | flat-first demo; section save lives in `section-edit` |
| `Editor` has `render()` slot for companion sub-editors, composed per-type via `question()` | no `render()` slot; `impRef` is already a plain named-ref map (`.main`, …) so an `Editor` *could* register extra validators directly | not needed yet — school needs `render()` because each type has its own Formik `useHook`; here `useItemEditor` is one hook shared by every type, so a cross-cutting rule (e.g. the section picker) is added once there instead of decorated onto each `Editor` |

## Demo vs library vs deferred features

Logic in `demo/FormItemEditorDemo.tsx` and friends, and where it belongs:

### Stays in demo forever (domain / Storybook)

| Demo code | Reason |
|---|---|
| `FieldEditor`, `HeadingEditor`, `PanelEditor` (in `FormItemEditorDemo.tsx`) | Domain editors — school keeps these in `editors/`, not in `form-item-edit-react` |
| `useItemEditor` + `save` | App `useFormItemEditor` pattern (school: `legacy-front/.../useFormItemEditor.ts` + formik) |
| `EditorDialog`, field UI chrome, `FormItemEditorFormTest` | Helper — school: `renderDefaultDialog`, design-system inputs, form-edit list |
| Name `viewers` + `createFormItemByGetChild` | Same composition as `form` demo — per-type labels without a type switch |
| `ctx.flatItems` + `isFieldNameTaken` filter in `FieldEditor` | `ctx` carries raw data only (no field-specific API); `FieldEditor` decides what it means — no context/provider infra |

### Now in **`form-edit`** (pure flat mutations, migrated)

The pure part of school `react-packages/form-edit-react/useDialog.tsx` lives in
`form-edit/flat/` — the demo imports it instead of reimplementing:

| Demo used to own | Library home | School equivalent |
|---|---|---|
| `openSession` (+ `EditingSession` shape) | `form-edit` `openFormItemEditSession` / `FlatFormItemEditSession` | `editFormItem: EditFormItem \| null` |
| `commitEditingSession` | `form-edit` `applyFlatFormItem` (edit span replace **and** `index === -1` insert) | `setEditFormItemX` in `useDialog` |

`resizeColumns` already lives in **`recursive-form`** (school’s `changeCols`); `applyFlatFormItem` calls it internally.

### Orchestrator now in **`form-dialogs`** (`makeUseDialogs`)

School home: `react-packages/form-edit-react/useDialog.tsx` (`makeUseDialogs`) —
ported as `form-dialogs/makeUseDialogs`. The composed `form-dialogs/All-in`
story runs this demo's editors through it; this demo keeps its own minimal
hand-wiring so the focused story stays a one-package showcase.

| Demo code | School equivalent | Library home |
|---|---|---|
| `session` state + `commitDraft` / `setFormItem` wiring | `makeUseDialogs` React state, `setEditFormItem(item, cols)` via `extra` | `form-dialogs` (`useDialogs` sessions + `commit`) |
| `FormItemEditorDemo` shell | `DialogUi` + `CustomFormEditor` | `form-dialogs/demo/AllInEditor.tsx` (Storybook composition) |

### Stays in demo until **`form-edit`** story integration (or `form-dialogs` All-in)

| Demo code | Package | Notes |
|---|---|---|
| `FormItemEditorFormTest` (helper) | `form-edit` demo | consolidate, move actions, nested panel render, clone |
| `cloneFn` via `cloneFlatItems` | `form-edit` — shared `params.name` rename, no type switch |
| `extra={(item) => [{ label: "Edit", … }]}` | `form-edit` `form-item.actions` | `edit: () => setEditFormItem(q)` |

### Stays in demo / not started — other packages

| Concern | Target package | School reference |
|---|---|---|
| Formik `useFormItemEditor` (`handleSubmit`, `isError`, `setColumns`) | app UI layer | `legacy-front/.../useFormItemEditor.ts` |
| Real modal chrome | app / `form-dialogs` | `form-edit-ui/renderDefaultDialog.tsx` |
| `update` + `validate` on responses | **done** — `response/` + `form/getUseImpRefViewProps` | `getUseImpRefViewProps`, `CustomFormResponder` (section shell still deferred) |

## Architecture

```
createFormItemEditorWrapper(editors, useHook, renderDialog)
  → React component (props: { ctx, dialogArgs, formItem, setFormItem, extra })
      1. useHook(props, { validate }) → state (e.g. save, isError)
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

1. **Edit** opens a session (`form-edit` `openFormItemEditSession`) with draft + children + flat span
2. **`FormItemEditor`** edits the draft via `setFormItem`
3. **`save`** validates, then `onCommit` → `form-edit` `applyFlatFormItem` (the React orchestrator is **`form-dialogs`** `makeUseDialogs`)

### Cross-cutting rule example: "which section?" (`side-menu`)

School's `editors/selectSection.tsx` is a companion sub-editor — composed
into *every* domain editor via the `question()` decorator — that shows a
section `<select>` and blocks Save until one is picked, but only for an
**insert** with more than one candidate section (`add && sections.length !== 1`,
`add = editFormItem.index === -1`). Slot inserts (`AddFormItem`) already
have a concrete index/section, so `add` is false there and nothing shows.

Slot-tree needs no `Editor`-level composition to get the same behavior,
because — unlike school — `useItemEditor` is **one hook shared by every
type**. The rule is added once, at the hook + `renderDialog`, not per-`Editor`:

```
extra.sectionPicker = { sIndex, setSIndex, sections }   // set only by side-menu, only on insert
  → useItemEditor: required + reflected in errors.sIndex/state.sectionPicker when sections.length > 1
  → renderDialog: renders <SelectSection> once, after `children`, for whichever type is open
```

`FieldEditor` / `HeadingEditor` / `PanelEditor` are unaware of any of this —
same as before the picker existed. See `side-menu/demo/SideMenuDemo.tsx`
(builds `sectionPicker.sections` via `consolidateSections`) and
`side-menu/README.md`.

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
