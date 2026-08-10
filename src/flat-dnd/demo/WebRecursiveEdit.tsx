/**
 * Section `renderEdit` — ported **as-is** from school
 * `ui-packages/recursive-edit-ui/FlatDnd.tsx` + `RecursiveEdit.tsx`: builds
 * the DnD tree via `flat-dnd`'s `toDndTree`, drives it through
 * `dndTreeUi.DnDTreeCore`/`RecursiveTreeNode` (the copied school engine), and
 * persists any change (drop, move up/down, toggle) via `flat-dnd`'s
 * `cleanNodes` — school's `setCleanNodes = tree => setNodes(cleanNodes(tree, nodes))`.
 *
 * Deviation: school's item branch recomputes `item.children` from the live
 * dnd sub-tree on every render (`cleanNodes(node.children, node.value).children`)
 * so a still-in-progress *nested* drag repaints immediately. This repo's
 * `render.node` consumer (`createRenderEditFormItem`) never reads
 * `item.children`/`item.meta` — only `item.header` — so that recomputation is
 * dead work here; `node.item` (the `toDndTree` snapshot) is passed straight
 * through.
 */
import { useMemo, useRef, useState, type CSSProperties } from "react";
import * as dnd from "./dndTreeUi";
import * as lib from "./library";

type Ctx = Record<string, never>;

const MoveActionsBar = ({ actions }: { actions: lib.MoveActions }) => {
  const Btn = ({
    label,
    onClick,
  }: {
    label: string;
    onClick: null | undefined | (() => void);
  }) => (
    <button
      type="button"
      disabled={!onClick}
      onClick={onClick ?? undefined}
      style={{ padding: "2px 7px", fontSize: 11, opacity: onClick ? 1 : 0.3 }}
    >
      {label}
    </button>
  );
  return (
    <span style={{ display: "inline-flex", gap: 3, flexShrink: 0 }}>
      {actions.isDeleted ? (
        <Btn label="Restore" onClick={actions.restore} />
      ) : (
        <>
          <Btn label="↑" onClick={actions.up} />
          <Btn label="↓" onClick={actions.down} />
          <Btn label="Clone" onClick={actions.clone} />
          <Btn label="Remove" onClick={actions.remove} />
        </>
      )}
    </span>
  );
};

const emptyColumnStyle: CSSProperties = {
  minHeight: 28,
  border: "2px dashed #d5d8dd",
  borderRadius: 4,
};

export const WebRecursiveEdit = <
  TypeNames extends string,
  Params extends lib.ParamsDom<TypeNames>,
  SectionConfig extends lib.SectionDom,
>(
  props: lib.RecursiveEditProps<TypeNames, Params, SectionConfig>,
) => {
  const { edit, title, render } = props;
  const { item, nodes, actions } = edit;
  const [showDeleted, setShowDeleted] = useState(true);
  const handlersRef = useRef<dnd.Handlers<lib.DndNodeValue<TypeNames, Params>>>(undefined);

  const tree = useMemo(
    () => lib.toDndTree(nodes, { rootId: item.id, rootDeleted: item.deleted, showDeleted }),
    [nodes, item.id, item.deleted, showDeleted],
  );

  const setTree = (
    arg:
      | lib.DndTreeNode<TypeNames, Params>[]
      | ((prev: lib.DndTreeNode<TypeNames, Params>[]) => lib.DndTreeNode<TypeNames, Params>[]),
  ) => {
    const next = typeof arg === "function" ? arg(tree) : arg;
    edit.setNodes({ ...nodes, children: lib.cleanNodes(next) });
  };

  return (
    <section
      style={{
        opacity: item.deleted ? 0.6 : 1,
        border: "1px solid #ddd",
        borderRadius: 6,
        padding: 12,
        marginBottom: 12,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
        <div>{title}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <label style={{ fontSize: 11, color: "#666", display: "inline-flex", gap: 4, alignItems: "center" }}>
            <input
              type="checkbox"
              checked={showDeleted}
              onChange={(e) => setShowDeleted(e.target.checked)}
            />
            Show deleted
          </label>
          <MoveActionsBar actions={actions} />
        </div>
      </div>
      <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
        <dnd.DnDTreeCore<lib.DndNodeValue<TypeNames, Params>>
          nodes={tree}
          setNodes={setTree}
          handlersRef={handlersRef}
          renderComponent={({ key, ...treeProps }) => (
            <dnd.RecursiveTreeNode<lib.DndNodeValue<TypeNames, Params>, Ctx>
              key={key}
              {...treeProps}
              ctx={{}}
              bottomThreshold={0.5}
              topThreshold={0.5}
              renderIndicator={(where) => (where ? <dnd.Indicator /> : null)}
              renderChildren={(children, node) => (
                <div
                  style={{
                    display: "flex",
                    flexDirection: node.type === "column" ? "column" : "row",
                    gap: node.type === "column" ? 6 : 12,
                    flex: node.type === "item" ? 1 : undefined,
                    minWidth: 0,
                  }}
                >
                  {children}
                </div>
              )}
              renderItem={() => null}
              renderDraggable={(args) => {
                const { node, ord, children } = args;
                const dragHandlers = {
                  onDragStart: args.onDragStart,
                  onDragEnd: args.onDragEnd,
                  onDragOver: args.onDragOver,
                  onDrop: args.onDrop,
                  onDragEnter: args.onDragEnter,
                  onDragLeave: args.onDragLeave,
                };
                if (node.type === "column") {
                  if (node.children.length > 0)
                    return (
                      <>
                        {children}
                        {render.addItem(node)}
                      </>
                    );
                  return (
                    <div
                      {...dragHandlers}
                      style={emptyColumnStyle}
                      onDragOver={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        treeProps.onDragOver(node._id, "inside");
                      }}
                    >
                      {render.addItem(node)}
                    </div>
                  );
                }
                return (
                  <div draggable={!node.item.header.deleted} {...dragHandlers}>
                    {render.node({
                      item: node.item,
                      children,
                      parentDeleted: node.parentDeleted,
                      index: ord,
                    })}
                  </div>
                );
              }}
            />
          )}
        />
      </div>
    </section>
  );
};
