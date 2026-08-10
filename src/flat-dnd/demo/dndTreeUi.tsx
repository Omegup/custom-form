/**
 * Web HTML5 DnD engine — ported **as-is** (same component tree, same handler
 * wiring, same `TreeNode`/ops calls) from school
 * `components/drag-drop-tree/src/DnDTree.tsx` +
 * `Components/TreeNode/TreeNode.tsx` + `Components/Handle/Handle.tsx`.
 *
 * Only the styling layer changed — school uses `react-jss` + a `school-style`
 * `Theme`, neither of which is a dependency of this repo; every class-based
 * style below is the same visual intent as plain inline style objects. Logic
 * (drag/drop/move/toggle handlers, descendant rejection, indicator/threshold
 * math) is untouched, and now runs on `../../drag-drop-tree`'s ops instead of
 * school's own copy — proving that package's API is a drop-in match.
 *
 * Not ported: JSS `useStyles`, `school-style` `Theme`/`getColorWithOpacity`.
 */
import {
  useImperativeHandle,
  useMemo,
  useState,
  type CSSProperties,
  type DragEvent,
  type ReactNode,
  type RefObject,
} from "react";
import * as lib from "./library";

// ── types.ts (school `drag-drop-tree/src/types.ts`, minus `DnDTreeProps`/`RenderItem`'s `Theme`) ──

export type Handlers<T> = {
  handleUpdateNode: (updatedNode: lib.TreeNode<T>) => void;
  handleAddChild: (parentId: string, newNode: lib.TreeNode<T>) => void;
  removeNode: (nodes: lib.TreeNode<T>[], nodeId: string) => lib.TreeNode<T>[];
  updateNodes: (arg: lib.TreeNode<T>[] | ((prev: lib.TreeNode<T>[]) => lib.TreeNode<T>[])) => void;
  insertNodeIn: (
    nodes: lib.TreeNode<T>[],
    insertedNode: lib.TreeNode<T>,
    parentId: string | null,
  ) => lib.TreeNode<T>[];
  applyToAllNodes: (fn: (node: lib.TreeNode<T>) => lib.TreeNode<T>) => void;
};

type RenderItemState = { isSelected: boolean; isOver: boolean; dragging: boolean };

export type RenderItem<T, Ctx, State = RenderItemState> = (props: {
  node: lib.TreeNode<T>;
  ord: number;
  handlersRef: RefObject<Handlers<T> | undefined>;
  state: State;
  actions: {
    toggleExpand: (_id: string) => void;
    onUp: (_id: string) => void;
    onDown: (_id: string) => void;
  };
  ctx: Ctx;
}) => ReactNode;

export type DnDTreeCoreProps<T> = {
  nodes: lib.TreeNode<T>[];
  setNodes: (arg: lib.TreeNode<T>[] | ((prev: lib.TreeNode<T>[]) => lib.TreeNode<T>[])) => void;
  handlersRef: RefObject<Handlers<T> | undefined>;
  renderComponent: (args: CommonTreeNodeProps<T> & { key: string }) => ReactNode;
};

// ── Components/TreeNode/types.ts ──────────────────────────────────────────────

export type CommonTreeNodeProps<T> = {
  ord: number;
  node: lib.TreeNode<T>;
  toggleExpand: (_id: string) => void;
  draggedId: string | null;
  dropTarget: lib.DropTarget | null;
  onDragStart: (_id: string) => void;
  onDragEnd: () => void;
  onDragOver: (_id: string, pos: lib.DropPosition) => void;
  onDrop: () => void;
  onDragLeave: (e: DragEvent) => void;
  onUp: (_id: string) => void;
  onDown: (_id: string) => void;
  draggedSubtreeIds: string[];
  handlersRef: RefObject<Handlers<T> | undefined>;
};

/** `TreeNodeComponent` adds an `isHovered` flag on top of the base state (school does the same). */
export type TreeNodeProps<T, Ctx> = CommonTreeNodeProps<T> & {
  ctx: Ctx;
  renderItem: RenderItem<T, Ctx, RenderItemState & { isHovered: boolean }>;
};

export type DraggableArgs<T> = {
  onDragStart: (e: DragEvent) => void;
  onDragEnd: () => void;
  onDragOver: (e: DragEvent) => void;
  onDrop: () => void;
  onDragEnter: (e: DragEvent) => void;
  onDragLeave: (e: DragEvent) => void;
  header: ReactNode;
  children: ReactNode;
  state: RenderItemState;
  node: lib.TreeNode<T>;
  ord: number;
};

export type TreeNodeCoreProps<T, Ctx> = CommonTreeNodeProps<T> & {
  ctx: Ctx;
  renderItem: RenderItem<T, Ctx, RenderItemState>;
  renderDraggable: (args: DraggableArgs<T>) => ReactNode;
  topThreshold: number;
  bottomThreshold: number;
  renderChildren: (children: ReactNode, node: lib.TreeNode<T>) => ReactNode;
  renderIndicator: (where: "before" | "after" | null) => ReactNode;
};

// ── DnDTree.tsx `DnDTreeCore` — draggedId/dropTarget state + handlers ─────────

export const DnDTreeCore = <T,>({
  nodes,
  setNodes,
  handlersRef,
  renderComponent,
}: DnDTreeCoreProps<T>) => {
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dropTarget, setDropTarget] = useState<lib.DropTarget | null>(null);

  const toggleExpand = (_id: string) => {
    const toggle = (list: lib.TreeNode<T>[]): lib.TreeNode<T>[] =>
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

  const handleDragOver = (targetId: string, position: lib.DropPosition) => {
    if (draggedId === targetId) return;
    const draggedNode = draggedId ? lib.findNodeById(nodes, draggedId) : null;
    const targetNode = lib.findNodeById(nodes, targetId);
    if (!draggedNode || !targetNode) return;
    if (lib.isDescendant(draggedNode, targetId)) return;
    if (targetId !== dropTarget?._id || position !== dropTarget?.position)
      setDropTarget({ _id: targetId, position });
  };

  // `applyDrop` (drag-drop-tree) is exactly school's inline handleDrop body
  // (find dragged → reject dropping into its own subtree → remove + insert).
  const handleDrop = () => {
    if (!draggedId || !dropTarget) return;
    setNodes(lib.applyDrop(nodes, draggedId, dropTarget));
    setDraggedId(null);
    setDropTarget(null);
  };

  const draggedSubtreeIds = useMemo(() => {
    if (!draggedId) return [];
    const draggedNode = lib.findNodeById(nodes, draggedId);
    return draggedNode ? lib.collectSubtreeIds(draggedNode) : [];
  }, [draggedId, nodes]);

  const handleDragLeave = (e: DragEvent) => {
    e.preventDefault();
    if (!e.currentTarget.contains(e.relatedTarget as Node)) setDropTarget(null);
  };

  const handleUp = (nodeId: string) => setNodes(lib.moveNode(nodes, nodeId, "up"));
  const handleDown = (nodeId: string) => setNodes(lib.moveNode(nodes, nodeId, "down"));

  const handleUpdateNode = (updatedNode: lib.TreeNode<T>) => {
    const update = (list: lib.TreeNode<T>[]): lib.TreeNode<T>[] =>
      list.map((node) =>
        node._id === updatedNode._id ? updatedNode : { ...node, children: update(node.children) },
      );
    setNodes(update(nodes));
  };

  const handleAddChild = (parentId: string, newNode: lib.TreeNode<T>) => {
    const addedNode = { ...newNode, parentId };
    const add = (list: lib.TreeNode<T>[]): lib.TreeNode<T>[] =>
      list.map((node) =>
        node._id === parentId
          ? { ...node, isExpanded: true, children: [addedNode, ...node.children] }
          : { ...node, children: add(node.children) },
      );
    setNodes(add(nodes));
  };

  const applyToAllNodes = (fn: (node: lib.TreeNode<T>) => lib.TreeNode<T>) => {
    const apply = (list: lib.TreeNode<T>[]): lib.TreeNode<T>[] =>
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
      removeNode: lib.removeNode,
      updateNodes: setNodes,
      insertNodeIn: lib.insertNodeIn,
      applyToAllNodes,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- same intent as school: refresh the ref whenever `nodes` changes.
    [nodes],
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

// ── Components/TreeNode/TreeNode.tsx — threshold math + indicator + recursion ─

export const Indicator = () => (
  <div style={{ display: "flex", alignItems: "center", height: 0, overflow: "visible" }}>
    <div
      style={{
        width: 0,
        height: 0,
        borderTop: "5px solid transparent",
        borderBottom: "5px solid transparent",
        borderLeft: "8px solid #4a90d9",
      }}
    />
    <div style={{ width: "100%", height: 2, background: "#4a90d9" }} />
  </div>
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
  renderChild: (node: lib.TreeNode<T>, index: number) => ReactNode;
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

export const RecursiveTreeNode = <T, Ctx>(props: TreeNodeCoreProps<T, Ctx>) => (
  <TreeNodeCore<T, Ctx>
    {...props}
    renderChild={(child, ord) => (
      <RecursiveTreeNode<T, Ctx> {...props} node={child} ord={ord} key={child._id} />
    )}
  />
);

const nodeItemStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  borderRadius: 10,
  cursor: "grab",
  transition: "background 0.3s, transform 0.2s ease",
  position: "relative",
  overflow: "hidden",
  background: "#f7f8fa",
  border: "1px solid #e2e5ea",
};

const dropInsideStyle: CSSProperties = {
  background: "rgba(74, 144, 217, 0.15)",
  border: "1px dashed #4a90d9",
};

export const TreeNodeComponent = <T, Ctx>({
  renderItem,
  isHovered: parentIsHovered,
  ...props
}: TreeNodeProps<T, Ctx> & { isHovered?: boolean }) => {
  const [ownHovered, setOwnHovered] = useState(false);
  const isHovered = parentIsHovered || ownHovered;
  const renderIndicator = (where: "before" | "after" | null) => (where ? <Indicator /> : null);

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
          <div style={{ ...nodeItemStyle, ...(x.state.isOver ? dropInsideStyle : {}) }}>
            {renderItem({ ...x, state: { ...x.state, isHovered } })}
          </div>
        )}
        renderDraggable={(args) => (
          <>
            <div
              onMouseEnter={() => setOwnHovered(true)}
              onMouseLeave={() => setOwnHovered(false)}
              draggable
              style={{ display: "flex", flexDirection: "column", gap: 10, boxSizing: "border-box", paddingBlock: 10 }}
              onDragStart={args.onDragStart}
              onDragEnd={args.onDragEnd}
              onDragOver={args.onDragOver}
              onDrop={args.onDrop}
              onDragEnter={args.onDragEnter}
              onDragLeave={args.onDragLeave}
            >
              {args.header}
            </div>
            {args.children}
          </>
        )}
        renderChildren={(children) => (
          <div style={{ marginLeft: 33, display: "flex", flexDirection: "column", boxSizing: "border-box" }}>
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

// ── Components/Handle/Handle.tsx — simplified to one variant (no `Theme`) ─────
// School exports 8 theme-driven variant pairs (vertical/horizontal ×
// unselected/selected/over). Kept the same dot-grid look, collapsed to a
// single `DragHandle({ active })` since there's no design-system `Theme` here.

export const DragHandle = ({ active = false }: { active?: boolean }) => (
  <div
    style={{
      padding: "3px 5px",
      display: "grid",
      gridTemplateColumns: "repeat(2, 1fr)",
      gap: 3,
      cursor: "grab",
    }}
  >
    {[...Array(6)].map((_, i) => (
      <div
        key={i}
        style={{
          width: 4,
          height: 4,
          borderRadius: "50%",
          backgroundColor: active ? "#4a90d9" : "#9ca3af",
        }}
      />
    ))}
  </div>
);
