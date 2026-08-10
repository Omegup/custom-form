/**
 * Headless recursive tree node — structure + drag hit-testing via render props.
 * Host owns HTML (see `drag-drop-tree/demo` or `flat-dnd/demo/WebRecursiveEdit`).
 */
import { useMemo } from "react";
import type { TreeNode } from "../../types";
import type { TreeNodeCoreProps } from "./types";

export const RecursiveTreeNode = <T, Ctx>(props: TreeNodeCoreProps<T, Ctx>) => (
  <TreeNodeCore<T, Ctx>
    {...props}
    renderChild={(child, ord) => (
      <RecursiveTreeNode<T, Ctx> {...props} node={child} ord={ord} key={child._id} />
    )}
  />
);

export const TreeNodeCore = <T, Ctx>({
  node,
  ord,
  toggleExpand,
  draggedId,
  dropTarget,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDragLeave,
  onDrop,
  draggedSubtreeIds,
  onDown,
  onUp,
  ctx,
  renderItem,
  handlersRef,
  renderDraggable,
  renderChildren,
  bottomThreshold,
  topThreshold,
  renderIndicator,
  renderChild,
}: TreeNodeCoreProps<T, Ctx> & {
  renderChild: (node: TreeNode<T>, index: number) => React.ReactNode;
}) => {
  const { isOver, before, after } = useMemo(
    () => ({
      isOver:
        dropTarget?._id === node._id && dropTarget?.position === "inside" && draggedId !== node._id,
      before: dropTarget?._id === node._id && dropTarget?.position === "before",
      after: dropTarget?._id === node._id && dropTarget?.position === "after",
    }),
    [dropTarget, draggedId, node._id],
  );
  const dragging = draggedSubtreeIds.includes(node._id);
  const state = { isSelected: node._id === draggedId, isOver, dragging };

  return (
    <>
      {renderIndicator(before ? "before" : null)}
      {renderDraggable({
        onDragStart: (e) => {
          e.stopPropagation();
          onDragStart(node._id);
        },
        onDragEnd,
        onDragOver: (e) => {
          e.preventDefault();
          e.stopPropagation();
          const box = e.currentTarget.getBoundingClientRect();
          const offset = e.clientY - box.top;
          if (offset < box.height * topThreshold) onDragOver(node._id, "before");
          else if (offset >= box.height * bottomThreshold) onDragOver(node._id, "after");
          else onDragOver(node._id, "inside");
        },
        state,
        node,
        ord,
        onDrop,
        onDragEnter: (e) => e.preventDefault(),
        onDragLeave,
        header: renderItem({
          ord,
          handlersRef,
          ctx,
          node,
          state,
          actions: { toggleExpand, onUp, onDown },
        }),
        children:
          node.children.length > 0 && node.isExpanded
            ? renderChildren(node.children.map(renderChild), node)
            : null,
      })}
      {renderIndicator(after ? "after" : null)}
    </>
  );
};
