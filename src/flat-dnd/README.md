# flat-dnd

**Section item grid ↔ DnD tree** — pure conversion between `form-edit`'s
`SectionNodes` and [`drag-drop-tree`](../drag-drop-tree/)'s `TreeNode<T>` shape.
No React — the web demo wires this into `drag-drop-tree`'s **headless** React
engine (`DnDTreeCore` + `RecursiveTreeNode`) and owns the HTML chrome.

Migrated from `school/components/custom-form` →
`ui-packages/recursive-edit-ui/FlatDnd.tsx` (`filterDeleted` / `cleanNodes` only).

## Library scope (this package)

| File | Role |
|---|---|
| `types.ts` | `ColumnDndNode`, `ItemDndNode`, `DndTreeNode` — school `OneOfNodes<T>` on `TreeNode<T>` |
| `toDndTree.ts` | `SectionNodes` → DnD column/item tree (`filterDeleted`) |
| `cleanNodes.ts` | DnD tree → `SectionNodes['children']` |
| `commitDrop.ts` | `toDndTree` → `applyDrop` → `cleanNodes` → `edit.setNodes` |

**Does not import** `drag-drop-tree`'s React components — only pure ops via `_deps`.

## Demo (`flat-dnd/Flat dnd` story)

Minimal school-style integration:

1. builds the tree with `toDndTree`
2. passes it to headless `DnDTreeCore` + `RecursiveTreeNode` (same as school's `FlatDnd`)
3. supplies HTML via `renderDraggable` / `renderChildren` / `renderIndicator`
4. writes back with `cleanNodes` on every `setNodes` (school's `setCleanNodes`)

See `demo/WebRecursiveEdit.tsx`. Stock school chrome (`Indicator`, `Handle*`,
`TreeNodeComponent`, `DnDTree`) also lives under `drag-drop-tree/demo/` if a
host wants that look without reinventing it.

`section-view`'s `SectionFormItemHOC` is composed in the demo with
`renderEdit: WebRecursiveEdit` — the same plug-in seam as `ColumnsEdit`.
`form-dialogs` reuses the same `WebRecursiveEdit` for the design list.

## Scope: one section at a time

Same as school: one `DnDTreeCore` per `RecursiveEditManager` / section.
Cross-section moves use sidebar/dialog insert (`side-menu`, `form-dialogs`), not drag.

## Dependency rule

Imports: `drag-drop-tree` (ops), `form-edit`, `form`, `recursive-form`.
Does **not** import `section-view` — demo composes it for Storybook only.
