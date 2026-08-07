# section-edit

**Section edit** — types, validation, and pure flat save for editing one section
(title / description / column count).

Migrated from `school/components/custom-form` → `react-packages/form-edit-react`
(`SectionEdit.ts` + the section `onSave` branch of `useDialog.tsx`).

## Library scope (this package)

| File | Role |
|---|---|
| `types.ts` | `Errors<T>` — generic error bag, safe for any `T` |
| `updateSectionInFlat.ts` | **`updateSectionInFlat(items, editing, header, cols)`** — `resizeColumns` + `flatten().section` + `toSpliced`; `editing.index === -1` appends a new section (school add flow). Port of school `useDialog.tsx` section `onSave` |
| `openSectionEditSession.ts` | **`openSectionEditSession(section)`** — snapshot a consolidated `SectionWithItems` into `{ draft: { header, cols }, items, index, total }` (`FlatSectionEditSession`) |

No section HOC factory here — school's `SectionEdit.ts` is validate + type
re-exports only; dialog chrome stays with the consumer (demo / app UI).

**No `validateSectionForm` here** (school has one, fixed to `title`/`description`).
Required-field validation needs to know the dialog's actual field names, and
`SectionDom` (the only thing this library knows about a section header) is
just `{ id, deleted }` — it says nothing about `title`/`description`. Two
options were tried and rejected before landing on "don't abstract it":
- Hardcoding `{ title, description }` into the library (like school) bakes in
  a host's field names as if they were universal.
- Genericizing over `Fields extends Record<string, string>` "fixed" that but
  produced a function with no real link to any section type at all — its
  `Fields` came only from the `errorMessages` argument, so nothing tied the
  validated keys back to `SectionConfig`/`SectionEditForm`. That's not type
  safety, just the same assumption moved one level down (plus an unchecked
  `Object.keys(...) as (keyof Fields)[]` cast, and a silent hazard: a host
  key named `cols` collides with the fixed `cols` field and resolves to
  `never`). A function that needs no knowledge of "section" to work isn't
  section-specific logic — it doesn't belong in this package's typed API.

`SectionDialog` (demo) now validates its own concrete `title`/`description`
fields inline — see `sectionEditDemoTypes.t.ts` (`SectionForm`) and
`SectionEditDemo.tsx`. A host with different header fields writes the same
few lines against its own type; there's nothing to reuse.

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
| Which-section picker on **insert** with >1 section (`add && sections.length !== 1`) | **done** — `form-item-editor` demo `extra.sectionPicker`, wired in `side-menu` | `editors/selectSection.tsx` |
| Moving an **existing** item to another section (drag & drop / explicit action; `selectSection.tsx`'s picker never shows once `add` is false) | `edit-section` | `recursive-edit-ui/FlatDnd` |

`updateSectionInFlat` already supports the `index === -1` insert path those
features will call.

## Save pipeline

```
openSectionEditSession(consolidated section)
  → dialog edits { title, description, cols }
  → demo validate(form)                     Errors<SectionForm> (host-owned)
  → updateSectionInFlat(items, session, header, cols)
      resizeColumns(cols, session.items)    grow/merge column grid
      flatten().section({ header, items })  section span markers
      index === -1 ? concat : toSpliced(index, total, …)
```

## Dependency rule

Imports from: `form`, `recursive-form`, `form-edit` (via `_deps`).

Does **not** import: `form-item-editor`, `side-menu`. Demo imports the
`form-edit` demo host (`EditFormTest`) for Storybook only.
