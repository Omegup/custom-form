# section-edit

**Section edit** — types, validation, and pure flat save for editing one section
(title / description / column count).

Migrated from `school/components/custom-form` → `react-packages/form-edit-react`
(`SectionEdit.ts` + the section `onSave` branch of `useDialog.tsx`).

## Library scope (this package)

| File | Role |
|---|---|
| `types.ts` | `SectionEditForm` (`{ title, description, cols }`), `Errors` |
| `validateSectionForm.ts` | **`validateSectionForm(errors)(values)`** — required non-empty trimmed title + description. Port of school `SectionEdit.ts` |
| `updateSectionInFlat.ts` | **`updateSectionInFlat(items, editing, header, cols)`** — `resizeColumns` + `flatten().section` + `toSpliced`; `editing.index === -1` appends a new section (school add flow). Port of school `useDialog.tsx` section `onSave` |
| `openSectionEditSession.ts` | **`openSectionEditSession(section)`** — snapshot a consolidated `SectionWithItems` into `{ draft: { header, cols }, items, index, total }` (`FlatSectionEditSession`) |

No section HOC factory here — school's `SectionEdit.ts` is validate + type
re-exports only; dialog chrome stays with the consumer (demo / app UI).

## Demo vs library vs deferred features

### Stays in demo (Storybook)

| Demo code | Reason |
|---|---|
| `SectionDialog` + local `form` state in `SectionEditDemo.tsx` | App dialog hook — school injects `useSectionEditDialog` (formik) via `form-edit-ui` `SectionEditDialogHOC` |
| `EditorDialog`, `TextField`, `SelectSectionColumns` chrome | school `form-edit-ui` design-system components (`DefaultFormDialog`, `Input`, `Textarea`, `SelectColumns`) |
| `sectionExtra` "Edit" wiring on `EditFormTest` | school `CustomFormEditor` `setEditSection` glue |

### Deferred — later packages

| Concern | Target package | School reference |
|---|---|---|
| React dialog orchestrator (`makeUseDialogs` `sectionDialog`) | `editor/` | `form-edit-react/useDialog.tsx` |
| Section HOC / viewers | `edit-section` | `SectionHOC`, `SectionFormItemHOC`, `section-edit-ui` |
| Add-item column slots | **done** — `edit-section` (MVP) | `AddFormItem`, `makeUseRenderAddItem` |
| "Add section" sidebar entry (`index === -1` open path) | **done** — `side-menu` (`useSide.addSection` → this package's dialog + `updateSectionInFlat`) | `useSide.addSection` |
| Moving items between sections (`setFormItemSection`) | `edit-section` + editor extras | `editors/selectSection.tsx` |

`updateSectionInFlat` already supports the `index === -1` insert path those
features will call.

## Save pipeline

```
openSectionEditSession(consolidated section)
  → dialog edits { title, description, cols }
  → validateSectionForm(errors)(form)       Errors<SectionEditForm>
  → updateSectionInFlat(items, session, header, cols)
      resizeColumns(cols, session.items)    grow/merge column grid
      flatten().section({ header, items })  section span markers
      index === -1 ? concat : toSpliced(index, total, …)
```

## Dependency rule

Imports from: `form`, `recursive-form`, `form-edit` (via `_deps`).

Does **not** import: `form-item-editor`, `side-menu`. Demo imports the
`form-edit` demo host (`EditFormTest`) for Storybook only.
