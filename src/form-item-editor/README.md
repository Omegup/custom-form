# form-item-editor

**Single-item edit dialog** — HOC factory for editing one form item inside a modal/panel.

Migrated from `school/components/custom-form` → `react-packages/form-item-edit-react`.

## Files

| File | Role |
|---|---|
| `types.ts` | `Editors`, `Editor`, `UseFormItemEditor`, `FormItemEditorProps`, validation types |
| `createFormItemEditorWrapper.tsx` | **`createFormItemEditorWrapper`** — main HOC factory |
| `demo/FormItemEditorDemo.tsx` | Storybook integration: `EditFormTest` + field edit dialog |
| `demo/formItemEditorDemoHelper.tsx` | Layout chrome, docs `?raw` source |
| `demo/formItemEditorDemoTypes.t.ts` | Demo types |
| `FormItemEditor.stories.tsx` | Storybook entry with `useArgs` |

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

`FormItemEditorDemo` composes onto `EditFormTest` from `form-edit`:

1. **`extra`** on `EditFormTest` — opens the editor with the selected item as `draft`
2. **`useHook`** — owns draft edits via `setFormItemParam`; **`save`** calls `validate` then `onCommit`
3. **`Editor`** — registers field rules on `state.impRef` (`useImperativeHandle`)
4. **`render()`** — optional slot for companion UI (character counter in the demo)
5. **`renderDialog`** — Save button calls `state.save` (not a raw `onSave` in `dialogArgs`)

Try clearing the name, typing more than 30 characters, or reusing another field's name — Save stays blocked until validation passes.

## Types cheat sheet

| Type | Purpose |
|---|---|
| `ItemEditExtraDom` | Branded bag passed via `props.extra` (holds draft + setDraft in demo) |
| `DialogArgsDom` | Branded dialog config (`title`, `onSave`, `onCancel`) |
| `FormItemEditorValidate` | `{ validate(value, setError) }` — passed to useHook, aggregated via refs |
| `UseFormItemEditorFor` | Non-generic hook type for single-item-type apps (demo) |
| `UseFormItemEditorHook` | Picks `UseFormItemEditor` vs `UseFormItemEditorFor` from `TypeNames` |

## Dependency rule

Imports from: `form`, `recursive-form`.
Does **not** import: `form-edit`, `side-menu`, `section-edit` (demo imports `form-edit` for Storybook only).
