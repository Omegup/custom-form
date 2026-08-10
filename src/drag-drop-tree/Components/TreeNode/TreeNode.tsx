import { useMemo, useState, type CSSProperties } from "react";
import type { Theme } from "../../theme";
import type { TreeNode } from "../../types";
import type { TreeNodeCoreProps, TreeNodeProps } from "./types";

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

export const Indicator = ({ theme }: { theme: Theme }) => (
  <div style={{ display: "flex", alignItems: "center", height: 0, overflow: "visible" }}>
    <div
      style={{
        width: 0,
        height: 0,
        borderTop: "5px solid transparent",
        borderBottom: "5px solid transparent",
        borderLeft: `8px solid ${theme.colors.blue}`,
      }}
    />
    <div style={{ width: "100%", height: 2, background: theme.colors.blue }} />
  </div>
);

const nodeBaseStyle = (theme: Theme): CSSProperties => ({
  display: "flex",
  alignItems: "center",
  borderRadius: 10,
  cursor: "grab",
  transition: "background 0.3s, transform 0.2s ease",
  position: "relative",
  overflow: "hidden",
  background: theme.colors.backgroundSecondary,
  border: `1px solid ${theme.colors.backgroundOverlay}`,
});

const dropInsideStyle = (theme: Theme): CSSProperties => ({
  background: `${theme.colors.blue_light}33`,
  border: `1px dashed ${theme.colors.blue}`,
});

export const TreeNodeComponent = <T, Ctx>({
  renderItem,
  isHovered: parentIsHovered,
  ...props
}: TreeNodeProps<T, Ctx> & { isHovered?: boolean }) => {
  const { theme } = props.ctx;
  const [ownHovered, setOwnHovered] = useState(false);
  const isHovered = parentIsHovered || ownHovered;
  const renderIndicator = (where: "before" | "after" | null) =>
    where ? <Indicator theme={theme} /> : null;

  return (
    <div>
      <TreeNodeCore<T, Ctx>
        {...props}
        renderChild={(child) => (
          <TreeNodeComponent<T, Ctx>
            key={child._id}
            {...props}
            node={child}
            renderItem={renderItem}
            isHovered={isHovered}
          />
        )}
        renderItem={(x) => (
          <div
            style={{
              ...nodeBaseStyle(theme),
              ...(x.state.isOver ? dropInsideStyle(theme) : {}),
              opacity: x.state.dragging ? 0.5 : 1,
            }}
          >
            {renderItem({ ...x, state: { ...x.state, isHovered } })}
          </div>
        )}
        renderDraggable={({ state: _state, children, header, node: _node, ord: _ord, ...args }) => (
          <>
            <div
              onMouseEnter={() => setOwnHovered(true)}
              onMouseLeave={() => setOwnHovered(false)}
              draggable
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 10,
                boxSizing: "border-box",
                paddingBlock: 10,
              }}
              onDragStart={args.onDragStart}
              onDragEnd={args.onDragEnd}
              onDragOver={args.onDragOver}
              onDrop={args.onDrop}
              onDragEnter={args.onDragEnter}
              onDragLeave={args.onDragLeave}
            >
              {header}
            </div>
            {children}
          </>
        )}
        renderChildren={(children) => (
          <div
            style={{
              marginLeft: 33,
              display: "flex",
              flexDirection: "column",
              boxSizing: "border-box",
            }}
          >
            {children}
          </div>
        )}
        bottomThreshold={0.8}
        topThreshold={0.2}
        renderIndicator={renderIndicator}
      />
    </div>
  );
};
