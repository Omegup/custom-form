/**
 * Pure drag-and-drop tree shape — school `components/drag-drop-tree/src/types.ts`
 * (tree shape only, no React/JSS/HTML5 event types). Kept field-for-field
 * compatible with school's `TreeNode<T>` (`isExpanded?`, `parentId?`) so the
 * real school DnD UI components (`DnDTreeCore`, `TreeNodeComponent`, `Handle`)
 * can be dropped into a host demo unmodified against these ops.
 */

export type TreeNode<T> = T & {
  _id: string;
  isExpanded?: boolean;
  children: TreeNode<T>[];
  parentId?: string | null;
};

export type DropPosition = "inside" | "before" | "after" | null;

/** `{ _id, position }` of a hover/drop target — the host owns the `| null` (no target) as local UI state. */
export type DropTarget = { _id: string; position: DropPosition };

export type Direction = "up" | "down";
