/**
 * DnD tree node shape for one section's item grid — school `FlatDnd.tsx`
 * `OneOfNodes<T>` (`types/edit-tree-app`), carried over `drag-drop-tree`'s
 * `TreeNode<T>` instead of a bespoke `ListTreeNode`/`ItemNodeTree` pair.
 *
 * A `"column"` node is a school `list` node (one of a section's, or a
 * panel's, columns); its children are `"item"` nodes. An `"item"` node is a
 * school `node` node (one consolidated form item); its children are the
 * `"column"` nodes of its own nested panel columns (empty for leaf items).
 * `isExpanded: true` on every node — matches school's `filterDeleted` (no
 * collapse state in this headless port, see `.cursor/rules` on scope).
 */
import type { MetaDom, ParamsDom, RecursiveFormItem, SIndexed, TreeNode } from "./_deps";

export type ColumnDndNode = {
  type: "column";
  /** Add-item flat insertion index for this column — same slot `ColumnsEdit`'s `render.addItem` uses. */
  index: number;
  sIndex: number;
};

export type ItemDndNode<
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
> = {
  type: "item";
  item: RecursiveFormItem<TypeNames, Params, MetaDom<SIndexed>>;
  parentDeleted: boolean;
};

export type DndNodeValue<
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
> = ColumnDndNode | ItemDndNode<TypeNames, Params>;

export type DndTreeNode<
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
> = TreeNode<DndNodeValue<TypeNames, Params>>;
