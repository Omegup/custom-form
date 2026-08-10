/**
 * Pure tree ops — school `components/drag-drop-tree/src/utils.ts`, ported
 * field-for-field so school's DnD UI components work against these unmodified.
 * `removeNode` avoids school's `.filter(Boolean) as TreeNode<T>[]` cast
 * (`.cursor/rules/typescript-types.mdc`) via `flatMap`; same behavior.
 */
import type { Direction, DropTarget, TreeNode } from "./types";

export const findNodeById = <T>(
  nodes: TreeNode<T>[],
  _id: string,
): TreeNode<T> | null => {
  for (const node of nodes) {
    if (node._id === _id) return node;
    const found = findNodeById(node.children, _id);
    if (found) return found;
  }
  return null;
};

export const isDescendant = <T>(parent: TreeNode<T>, childId: string): boolean =>
  parent._id === childId ||
  parent.children.some((child) => isDescendant(child, childId));

export const collectSubtreeIds = <T>(node: TreeNode<T>): string[] => [
  node._id,
  ...node.children.flatMap(collectSubtreeIds),
];

export const removeNode = <T>(
  nodes: TreeNode<T>[],
  removeId: string,
): TreeNode<T>[] =>
  nodes.flatMap((node) =>
    node._id === removeId
      ? []
      : [{ ...node, children: removeNode(node.children, removeId) }],
  );

export const insertNode = <T>(
  nodes: TreeNode<T>[],
  insertedNode: TreeNode<T> | null,
  target: DropTarget,
): TreeNode<T>[] =>
  nodes.flatMap((node) => {
    if (!insertedNode) return [node];

    if (node._id === target._id) {
      if (target.position === "inside")
        return [
          {
            ...node,
            isExpanded: true,
            children: [{ ...insertedNode, parentId: node._id }, ...node.children],
          },
        ];
      if (target.position === "before")
        return [{ ...insertedNode, parentId: node.parentId ?? null }, node];
      if (target.position === "after")
        return [node, { ...insertedNode, parentId: node.parentId ?? null }];
    }

    return [{ ...node, children: insertNode(node.children, insertedNode, target) }];
  });

export const insertNodeIn = <T>(
  nodes: TreeNode<T>[],
  insertedNode: TreeNode<T>,
  parentId: string | null,
): TreeNode<T>[] =>
  parentId
    ? insertNode(nodes, insertedNode, { _id: parentId, position: "inside" })
    : [insertedNode, ...nodes];

export const moveNode = <T>(
  nodes: TreeNode<T>[],
  nodeId: string,
  direction: Direction,
): TreeNode<T>[] => {
  if (nodes.length === 0) return nodes;

  const index = nodes.findIndex((node) => node._id === nodeId);
  if (index !== -1) {
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= nodes.length) return nodes;
    const reordered = [...nodes];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(newIndex, 0, moved!);
    return reordered;
  }

  return nodes.map((node) => ({
    ...node,
    children: moveNode(node.children, nodeId, direction),
  }));
};
