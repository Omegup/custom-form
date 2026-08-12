# form-dialogs

**Dialog orchestrator** — owns the item / section edit sessions and their
commit wiring, and renders the dialogs through host callbacks. The composed
"All-in" Storybook story lives here.

Migrated from `school/components/custom-form` → `react-packages/form-edit-react`
(`makeUseDialogs` in `useDialog.tsx`); the pure mutations were already extracted
to `form-edit/applyFlatFormItem` and `section-edit/updateSectionInFlat`, so this
package is only the React state + save glue on top of them.

> Named `form-dialogs`, not `editor` — `editor/` next to `form-item-editor/`
> would repeat the `edit-section` / `section-edit` naming confusion.

## Library scope (this package)

| File | Role |
|---|---|
| `makeUseDialogs.ts` | **`makeUseDialogs({ renderFormItem, renderSection })`** → `useDialogs({ flatItems, setFlatItems, ctx })` — sessions, open helpers, commits, dialog nodes |

The hook returns:

| Key | Role |
|---|---|
| `openItemEdit(item)` | Row "Edit" — `openFormItemEditSession` |
| `openItemInsert(item, span?)` | Sidebar insert (no span → `-1/-1`) or slot insert (concrete span) — `openFormItemInsertSession` |
| `setItemSession` | Raw setter — plug into `makeUseRenderAddItem(setItemSession)` (side-menu) |
| `openSectionEdit(section)` | Section header "Edit" — `openSectionEditSession` |
| `openSectionAdd(newSection)` | "+ Add section" — accepts `useSide.addSection`'s `NewSection` shape (`index: -1`) |
| `sectionOptions` | Live sections for the insert picker — `{ index, header }[]`, `index` is the section marker's **flat** index (school `selectSection` `value: p.index`) |
| `formItemDialog` / `sectionDialog` | `ReactNode \| null` — mount anywhere |

Commit paths (identical to what each module demo used to hand-wire):

```
item:    commit(next)          → applyFlatFormItem(flatItems, session, { header: next.item, children: session.children }, next.n) → setFlatItems → close
section: commit(header, cols)  → updateSectionInFlat(flatItems, session, header, cols)                                            → setFlatItems → close
```

## Deviations from school

| School | Here | Why |
|---|---|---|
| Factory builds `FormItemEditHOC(editors, useFormItemEditor, renderDialog)` | `renderFormItem` callback — host renders its already-built `form-item-editor` component | editors/dialog chrome are host domain; same seam school uses for `renderSection` / `renderDelete` |
| Caller owns `editFormItem` / `editSection` state, hook only renders | Hook owns both sessions and exposes open helpers | matches how every demo here already works; no `CustomFormEditor` HOC yet |
| `renderDelete` / `deleteDialog` | not orchestrated | delete confirmation already lives with the list shell (`setToRemove`, form-edit demo) |
| `SectionConfig extends SectionDom & { title; description }` | `SectionConfig extends SectionDom` only; `sectionOptions` exposes the whole `header` | display fields are host business — see `.cursor/rules/typescript-types.mdc` ("don't hardcode host field names") |
| `add: editFormItem.index === -1` | same, passed to `renderFormItem` | picker gating is orchestrator logic; picker *UI* is the host's |

## Demo

`form-dialogs/All-in` story (`demo/AllInEditor.tsx`): **`SectionFormItemHOC`**
(`section-view`) as the list shell with **`renderEdit: WebRecursiveEdit`**
(`flat-dnd/demo` — same plug-in as the flat-dnd story), with every dialog flow
wired through one `useDialogs`:

- row **Edit** → `openItemEdit`
- **Side** sidebar catalog → `openItemInsert` (section picker when >1 live section)
- in-slot **+ Add** (section & nested panel columns) → `makeUseRenderAddItem(setItemSession)`
- section header **Edit** → `openSectionEdit`; **+ Add section** → `openSectionAdd`
- drag rows to reorder within a column or into a nested panel column

Editors, dialog chrome, and fixtures are reused from the `form-item-editor`,
`section-edit`, and `side-menu` demos (Storybook-only composition). List
viewers are display-only; edits go through dialogs (not inline).

## Dependency rule

Imports from: `form`, `recursive-form`, `form-edit`, `section-edit` (via `_deps`).

Does **not** import: `form-item-editor`, `side-menu`, `section-view`, `flat-dnd`.
The demo composes those packages for Storybook only (`section-view` for the
list shell, `flat-dnd/demo/WebRecursiveEdit` for DnD, `side-menu` for catalog /
add slots, `form-item-editor` / `section-edit` for dialog chrome).
