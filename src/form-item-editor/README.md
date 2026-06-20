# form-item-editor

**Single-item edit dialog** — HOC factory for editing one form item inside a modal/panel.

Migrated from `school/components/custom-form` → `react-packages/form-item-edit-react`.

## Files

| File | Role |
|---|---|
| `types.ts` | `Editors`, `Editor`, `UseFormItemEditor`, `FormItemEditorProps`, validation types |
| `createFormItemEditorWrapper.tsx` | **`createFormItemEditorWrapper`** — main HOC factory |
| `FormItemEditor.test.tsx` | Demo: `EditFormTest` + field edit dialog (`FormItemEditorTest`) |

## Architecture

```
createFormItemEditorWrapper(editors, useHook, renderDialog)
  → React component (props: { ctx, dialogArgs, extra })
      1. useHook(props, { validate }) → state (recursiveFormItem, setFormItemParam, …)
      2. editors[item.type].editor → per-type Editor component
      3. renderDialog(dialogArgs, state, children) → shell (title, Save/Cancel)
```

### Wiring a custom editor

1. **Define types** for your domain (`TypeNames`, `Params`, `FieldExtra`, …)
2. **useHook** — reads/writes draft from `props.extra`, returns `FormItemEditorState`
3. **Editor** — renders fields; calls `render()` to register imperative refs for validation
4. **renderDialog** — your modal chrome (must wire `onSave` / `onCancel` in `dialogArgs`)

### Demo pattern

`FormItemEditor.test.tsx` does **not** import edit logic into `form-edit`.
It passes `extra` + `renderLayout` to `EditFormTest` and handles save by patching `flatItems`.

## Types cheat sheet

| Type | Purpose |
|---|---|
| `ItemEditExtraDom` | Branded bag passed via `props.extra` (holds draft + setDraft in demo) |
| `DialogArgsDom` | Branded dialog config (`title`, `onSave`, `onCancel`) |
| `FormItemEditorValidate` | `{ validate(value, setError) }` — passed to useHook, aggregated via refs |
| `EditorExtraMap` | `{ [K in TypeNames]: ItemEditExtraDom<...> }` — one extra shape per item type |

## Dependency rule

Imports from: `form`, `recursive-form`.
Does **not** import: `form-edit`, `side-menu`, `section-edit`.
