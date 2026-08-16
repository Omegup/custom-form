/**
 * Section `renderEdit` — school `FlatDnd`/`RecursiveEdit` wiring.
 * Demo owns all HTML; `drag-drop-tree` lib is headless (`DnDTreeCore` +
 * `RecursiveTreeNode`). Drop indicator chrome is local.
 */
import { useMemo, useRef, useState, type CSSProperties } from "react";
import { DnDTreeCore, RecursiveTreeNode, type Handlers } from "../../drag-drop-tree";
import { SectionColumn, SectionPanel } from "../../form-edit/demo/editFormDemoHelper";
import * as lib from "./library";

type Ctx = Record<string, never>;

const INDICATOR_COLOR = "#4a90d9";

const Indicator = ({ color }: { color: string }) => (
  <div style={{ display: "flex", alignItems: "center", height: 0, overflow: "visible" }}>
    <div
      style={{
        width: 0,
        height: 0,
        borderTop: "5px solid transparent",
        borderBottom: "5px solid transparent",
        borderLeft: `8px solid ${color}`,
      }}
    />
    <div style={{ width: "100%", height: 2, background: color }} />
  </div>
);

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
  const handlersRef = useRef<Handlers<lib.DndNodeValue<TypeNames, Params>>>(undefined);

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
    <SectionPanel
      title={title}
      focused={edit.autofocus}
      sectionActions={actions}
      sectionExtra={[]}
      headerExtra={
        <label style={{ fontSize: 11, color: "#666", display: "inline-flex", gap: 4, alignItems: "center" }}>
          <input
            type="checkbox"
            checked={showDeleted}
            onChange={(e) => setShowDeleted(e.target.checked)}
          />
          Show deleted
        </label>
      }
      columns={[
        <DnDTreeCore<lib.DndNodeValue<TypeNames, Params>>
          key={item.id}
          nodes={tree}
          setNodes={setTree}
          handlersRef={handlersRef}
          renderComponent={({ key, ...treeProps }) => (
            <RecursiveTreeNode<lib.DndNodeValue<TypeNames, Params>, Ctx>
              key={key}
              {...treeProps}
              ctx={{}}
              bottomThreshold={0.5}
              topThreshold={0.5}
              renderIndicator={(where) => (where ? <Indicator color={INDICATOR_COLOR} /> : null)}
              renderChildren={(children, node) =>
                node.type === "column" ? (
                  <>{children}</>
                ) : (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      gap: 12,
                      flex: 1,
                      minWidth: 0,
                    }}
                  >
                    {children}
                  </div>
                )
              }
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
                      <SectionColumn>
                        {children}
                        {render.addItem(node)}
                      </SectionColumn>
                    );
                  return (
                    <div
                      {...dragHandlers}
                      style={{ ...emptyColumnStyle, flex: 1, minWidth: 0 }}
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
        />,
      ]}
    />
  );
};
