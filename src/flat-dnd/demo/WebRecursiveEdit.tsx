/**
 * Section `renderEdit` — school `FlatDnd`/`RecursiveEdit` wiring.
 * Demo wires demo-utils chrome; `drag-drop-tree` lib is headless
 * (`DnDTreeCore` + `RecursiveTreeNode`). Drop indicator chrome is local.
 */
import { useMemo, useRef, useState } from "react";
import {
  ColumnRow,
  DragItem,
  DropLine,
  EmptyDropColumn,
  SectionColumn,
  SectionPanel,
  ShowDeleted,
} from "../../demo-utils";
import { DnDTreeCore, RecursiveTreeNode, type Handlers } from "../../drag-drop-tree";
import * as lib from "./library";

type Ctx = Record<string, never>;

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
        <ShowDeleted checked={showDeleted} onChange={setShowDeleted} />
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
              renderIndicator={(where) =>
                where ? <DropLine /> : null
              }
              renderChildren={(children, node) =>
                node.type === "column" ? (
                  <>{children}</>
                ) : (
                  <ColumnRow>{children}</ColumnRow>
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
                    <EmptyDropColumn
                      {...dragHandlers}
                      onDragOver={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        treeProps.onDragOver(node._id, "inside");
                      }}
                    >
                      {render.addItem(node)}
                    </EmptyDropColumn>
                  );
                }
                return (
                  <DragItem
                    enabled={!node.item.header.deleted}
                    {...dragHandlers}
                  >
                    {render.node({
                      item: node.item,
                      children,
                      parentDeleted: node.parentDeleted,
                      index: ord,
                    })}
                  </DragItem>
                );
              }}
            />
          )}
        />,
      ]}
    />
  );
};
