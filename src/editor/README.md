# editor

Composed form editor shell — dialog orchestration and flat save helpers.

Migrated from `school/components/custom-form` → `form-edit-react` (`makeUseDialogs`, `setEditFormItemX`).

## Public API (`index.ts`)

| Export | Role |
|---|---|
| `makeUseDialogs` | Wires delete, form-item, and section dialogs |
| `applyFlatFormItem` | Save edited/new item into flat list |
| `saveSectionInFlat` | Save edited section into flat list |
| Types in `types.ts` | `EditFormItem`, `SectionEditorProps`, … |

## All-in Storybook demo

The full composed editor lives in this folder (not a separate package):

| File | Role |
|---|---|
| `AllInEditor.tsx` | Storybook + integration-test shell |
| `AllInEditor.stories.tsx` | Storybook entry |
| `AllInEditor.test.tsx` | Vitest integration tests |
| `allInFieldEditor.tsx` | Field dialog for all-in |
| `allInSectionEditUi.tsx` | Section dialog UI |
| `allInSimpleSectionEdit.tsx` | Section column layout |
| `allInSidePanel.tsx` | Library sidebar |

Shared domain fixtures: `form-edit/fixtures.ts`.

## Tests

- `applyFlatFormItem.test.ts` — unit tests for flat save
- `AllInEditor.test.tsx` — add-from-library / column-add / validation

Run: `pnpm test`
