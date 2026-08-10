import { useImperativeHandle, useMemo, useState, type DragEvent } from "react";
import { TreeNodeComponent } from "./Components";
import type { DnDTreeCoreProps, DnDTreeProps, DropPosition, TreeNode } from "./types";
import { applyDrop } from "./applyDrop";
import {
  collectSubtreeIds,
  findNodeById,
  insertNodeIn,
  isDescendant,
  moveNode,
  removeNode,
} from "./utils";

export const DnDTreeCore = <T,>({
  nodes,
  setNodes,
  handlersRef,
  renderComponent,
}: DnDTreeCoreProps<T>) => {
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dropTarget, setDropTarget] = useState<{
    _id: string;
    position: DropPosition;
  } | null>(null);

  const toggleExpand = (_id: string) => {
    const toggle = (list: TreeNode<T>[]): TreeNode<T>[] =>
      list.map((node) =>
        node._id === _id
          ? { ...node, isExpanded: !node.isExpanded }
          : { ...node, children: toggle(node.children) },
      );
    setNodes(toggle(nodes));
  };

  const handleDragStart = (_id: string) => setDraggedId(_id);
  const handleDragEnd = () => {
    setDraggedId(null);
    setDropTarget(null);
  };

  const handleDragOver = (targetId: string, position: DropPosition) => {
    if (draggedId === targetId) return;
    const draggedNode = draggedId ? findNodeById(nodes, draggedId) : null;
    const targetNode = findNodeById(nodes, targetId);
    if (!draggedNode || !targetNode) return;
    if (isDescendant(draggedNode, targetId)) return;
    if (targetId !== dropTarget?._id || position !== dropTarget?.position)
      setDropTarget({ _id: targetId, position });
  };

  const handleDrop = () => {
    if (!draggedId || !dropTarget) return;
    setNodes(applyDrop(nodes, draggedId, dropTarget));
    setDraggedId(null);
    setDropTarget(null);
  };

  const draggedSubtreeIds = useMemo(() => {
    if (!draggedId) return [];
    const draggedNode = findNodeById(nodes, draggedId);
    return draggedNode ? collectSubtreeIds(draggedNode) : [];
  }, [draggedId, nodes]);

  const handleDragLeave = (e: DragEvent) => {
    e.preventDefault();
    if (!e.currentTarget.contains(e.relatedTarget as Node)) setDropTarget(null);
  };

  const handleUp = (nodeId: string) => setNodes(moveNode(nodes, nodeId, "up"));
  const handleDown = (nodeId: string) => setNodes(moveNode(nodes, nodeId, "down"));

  const handleUpdateNode = (updatedNode: TreeNode<T>) => {
    const update = (list: TreeNode<T>[]): TreeNode<T>[] =>
      list.map((node) =>
        node._id === updatedNode._id ? updatedNode : { ...node, children: update(node.children) },
      );
    setNodes(update(nodes));
  };

  const handleAddChild = (parentId: string, newNode: TreeNode<T>) => {
    const addedNode = { ...newNode, parentId };
    const add = (list: TreeNode<T>[]): TreeNode<T>[] =>
      list.map((node) =>
        node._id === parentId
          ? { ...node, isExpanded: true, children: [addedNode, ...node.children] }
          : { ...node, children: add(node.children) },
      );
    setNodes(add(nodes));
  };

  const applyToAllNodes = (fn: (node: TreeNode<T>) => TreeNode<T>) => {
    const apply = (list: TreeNode<T>[]): TreeNode<T>[] =>
      list.map((node) => {
        const updated = fn(node);
        return { ...updated, children: apply(updated.children) };
      });
    setNodes(apply(nodes));
  };

  useImperativeHandle(
    handlersRef,
    () => ({
      handleUpdateNode,
      handleAddChild,
      removeNode,
      updateNodes: setNodes,
      insertNodeIn,
      applyToAllNodes,
    }),
    [handleUpdateNode, handleAddChild, setNodes, applyToAllNodes, nodes],
  );

  return (
    <>
      {nodes.map((node, index) =>
        renderComponent({
          key: node._id,
          node,
          toggleExpand,
          draggedId,
          ord: index,
          dropTarget,
          onDragStart: handleDragStart,
          onDragOver: handleDragOver,
          onDrop: handleDrop,
          draggedSubtreeIds,
          onDragEnd: handleDragEnd,
          onDragLeave: handleDragLeave,
          onUp: handleUp,
          onDown: handleDown,
          handlersRef,
        }),
      )}
    </>
  );
};

export const DnDTree = <T, Ctx>({
  ctx,
  nodes,
  setNodes,
  renderItem,
  handlersRef,
}: DnDTreeProps<T, Ctx>) => (
  <DnDTreeCore<T>
    nodes={nodes}
    setNodes={setNodes}
    handlersRef={handlersRef}
    renderComponent={({ key, ...props }) => (
      <TreeNodeComponent key={key} {...props} renderItem={renderItem} ctx={ctx} />
    )}
  />
);
