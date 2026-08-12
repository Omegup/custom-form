/**
 * Thin wrapper of school `DnDTreeCore.handleDrop`'s body — find dragged node,
 * reject dropping into its own subtree, else remove + reinsert at `target`.
 * The host owns `draggedId`/hover `target` as local UI state and calls this
 * once on drop; no side effects here.
 */
import type { DropTarget, TreeNode } from "./types";
import { findNodeById, isDescendant, removeNode, insertNode } from "./utils";

export const applyDrop = <T>(
  nodes: TreeNode<T>[],
  draggedId: string,
  target: DropTarget,
): TreeNode<T>[] => {
  const draggedNode = findNodeById(nodes, draggedId);
  if (!draggedNode) return nodes;
  if (isDescendant(draggedNode, target._id)) return nodes;
  const removed = removeNode(nodes, draggedId);
  return insertNode(removed, draggedNode, target);
};
