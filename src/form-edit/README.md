# form-edit

**Edit orchestration layer** — flat form state, section consolidation, and move actions.

Pure TypeScript + a shared React demo host. Does **not** import UI feature modules
(item editor, side menu, section edit).

Migrated from `school/components/custom-form` → `ts-packages/form-edit`.

## Subfolders

### `flat/`

Flat markers ↔ consolidated tree, plus pure flat mutations.

| File | Role |
|---|---|
| `flat-form.t.ts` | `FlatFormItem` (`{ item, n }`), `FlatNestedItem` union, `FlatFormItems`, `SectionDom`, `SectionHeader` |
| `consolidate.ts` | `consolidateSections()` / `customConsolidateSections()` — flat array → `SectionWithItems[]` tree |
| `flatten.ts` | `flatten()` / `customFlat()` — recursive item/section → flat markers |
| `SectionWithItems.t.ts` | Hydrated section: `{ meta, header, items[][] }` |
| `getFlatInsertionIndex.ts` | **`getFlatInsertionIndex(sectionFlatIndex, columns, colIndex)`** — column slot → flat insertion index (used by `side-menu` add dropdowns) |
| `buildItemSectionDict.ts` | Item id → owning section dictionary |
| `applyFlatFormItem.ts` | **`applyFlatFormItem(items, editing, item, cols)`** — save an edited item span (`resizeColumns` + `flatten().formItem` + `toSpliced`); `editing.index === -1` inserts into section `sIndex` instead. Port of school `useDialog.tsx` `setEditFormItemX` |
| `openFormItemEditSession.ts` | **`openFormItemEditSession(item)`** — snapshot a consolidated item into `{ draft, children, index, total, sIndex }` (`FlatFormItemEditSession`) for a single-item edit dialog. Also **`openFormItemInsertSession(newItem, span)`** — same session shape for a *new* item (`total: 0`; pass `AMBIGUOUS_INSERT_SPAN` to append, or a concrete slot `{ index, sIndex }`). **`patchFormItemEditSession(session, updater)`** — apply a draft updater and `resizeColumns` so panel `n` stays aligned with `children` during the dialog. |

### `flat-move-actions/`

See [flat-move-actions/README.md](./flat-move-actions/README.md).

Move/clone action builders for the flat list.

| File | Role |
|---|---|
| `getFlatMoveActions.ts` | Builds raw move actions per flat entry |
| `getFormItemMoveActions.ts` | Move actions for one consolidated item |
| `getSectionMoveActions.ts` | Move actions for one section |
| `getSectionEdit.ts` | **`getSectionEdit(args, clone, section, sIndex, jump)`** — bundles a section's move actions, autofocus, and item grid (`RecursiveEditManager`) for `section-view`'s `renderEdit` (e.g. `ColumnsEdit`). Port of school `section.data.ts` |
| `RecursiveEditManager.t.ts` | `RecursiveEditManager` / `SectionNodes` — school `types/edit-tree` |
| `cloneFlatItems.ts` | Deep clone of flat subtrees with new ids |
| `GetActionsArgs.t.ts` / `Clone.t.ts` | Action-builder argument + clone callback types |

### Root files

| File | Role |
|---|---|
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
  renderAddItem={({ index, sIndex }) => (
    <AddDropdown onPick={(newItem) =>
      openItemEditor(openFormItemInsertSession(newItem, { index, sIndex }))
    } />
  )}
  renderLayout={({ sections, alert, details, setFlatItems, focus }) => (
    <>
      {alert}
      <MySidePanel setFlatItems={setFlatItems} focus={focus} />
      {sections}
      {details}
    </>
  )}
/>
```

`renderAddItem` is school's `addItem: (node: { index, sIndex }) => ReactNode`
— injected at the end of every list slot (section columns and nested panel
columns). The host (or `makeUseRenderAddItem`) receives the already-computed
span; `getFlatInsertionIndex` mirrors FlatDnd's list-node index. `renderLayout`
replaces the default stacked layout (alert / details / sections) so demos can
place a sidebar. The same two props exist on the multi-type list shell
`FormItemEditorFormTest` (form-item-editor demo), which the side-menu story
composes.

Both callbacks receive the full consolidated node: `extra(item)` gets the
recursive item with `meta` (`index` / `total` / `sIndex`), `sectionExtra(section)`
gets the `SectionWithItems` (`meta` + `header` + `items[][]`) — enough to open
`form-item-editor` / `section-edit` sessions without re-deriving spans.

Exported types: `EditFormSection`, `EditFormFlatItems`, `EditFormCtx`, `EditFormEditingItem`, …

## Flat → UI pipeline

```
flatItems
  → consolidateSections()     SectionWithItems[]
  → getSectionMoveActions()   per-section MoveActions
  → getFormItemMoveActions()  per-field MoveActions
  → render in EditFormTest
```
