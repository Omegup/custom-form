/**
 * Non-DnD `renderEdit` — school `recursive-edit-ui/RecursiveEdit.tsx` (via
 * `FlatDnd`) without the drag-and-drop layer. Walks a section's columns and
 * each item's nested panel columns, calling `render.node` for every item and
 * `render.addItem` at the end of every column (section-level and nested).
 *
 * Soft-deleted parent gate matches the existing demo walks
 * (`form-edit/demo/EditFormDemo.tsx`): a deleted item/section dims its whole
 * subtree (`parentDeleted` cascades) and suppresses add-item slots under it,
 * but items still render (never hidden) so move actions stay reachable.
 *
 * All presentation is injected via {@link ColumnsEditChrome} — this module
 * emits no HTML (see `.cursor/rules/no-html-outside-demo.mdc`).
 */
import { Fragment, type ReactNode } from "react";
import type {
  MetaDom,
  MoveActions,
  ParamsDom,
  RecursiveFormItem,
  SectionDom,
  SIndexed,
} from "./_deps";
import { getFlatInsertionIndex } from "./_deps";
import type { RecursiveEditProps } from "./types";

type Render<TypeNames extends string, Params extends ParamsDom<TypeNames>> =
  RecursiveEditProps<TypeNames, Params, SectionDom>["render"];

/**
 * Host-owned presentation for the non-DnD section layout.
 * `createColumnsEdit(chrome)` returns a `renderEdit` suitable for `SectionHOC`.
 */
export type ColumnsEditChrome = {
  renderSection: (args: {
    deleted: boolean;
    title: ReactNode;
    actions: MoveActions;
    /** One node per column (items + add slot) — host wraps the row. */
    columns: ReactNode[];
  }) => ReactNode;
  /** Nested panel columns (section columns are wrapped by `renderSection`). */
  renderColumn: (args: { children: ReactNode }) => ReactNode;
};

const renderNode = <
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
>(
  item: RecursiveFormItem<TypeNames, Params, MetaDom<SIndexed>>,
  parentDeleted: boolean,
  render: Render<TypeNames, Params>,
  chrome: ColumnsEditChrome,
): ReactNode => {
  const deleted = parentDeleted || item.header.deleted;
  const children =
    item.children.length > 0
      ? renderColumns(
          item.children,
          item.meta.index,
          item.meta.sIndex,
          deleted,
          render,
          chrome,
        )
      : null;
  return (
    <Fragment key={item.header.id}>
      {render.node({ item, children, parentDeleted, index: item.meta.index })}
    </Fragment>
  );
};

const columnContents = <
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
>(
  columns: RecursiveFormItem<TypeNames, Params, MetaDom<SIndexed>>[][],
  parentIndex: number,
  sIndex: number,
  parentDeleted: boolean,
  render: Render<TypeNames, Params>,
  chrome: ColumnsEditChrome,
): ReactNode[] =>
  columns.map((column, colIndex) => (
    <>
      {column.map((item) => renderNode(item, parentDeleted, render, chrome))}
      {!parentDeleted &&
        render.addItem({
          index: getFlatInsertionIndex(parentIndex, columns, colIndex),
          sIndex,
        })}
    </>
  ));

const renderColumns = <
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
>(
  columns: RecursiveFormItem<TypeNames, Params, MetaDom<SIndexed>>[][],
  parentIndex: number,
  sIndex: number,
  parentDeleted: boolean,
  render: Render<TypeNames, Params>,
  chrome: ColumnsEditChrome,
): ReactNode => (
  <>
    {columnContents(
      columns,
      parentIndex,
      sIndex,
      parentDeleted,
      render,
      chrome,
    ).map((children, colIndex) => (
      <Fragment key={colIndex}>{chrome.renderColumn({ children })}</Fragment>
    ))}
  </>
);

/** Build a `renderEdit` from host chrome — no HTML in the library. */
export const createColumnsEdit =
  (chrome: ColumnsEditChrome) =>
  <
    TypeNames extends string,
    Params extends ParamsDom<TypeNames>,
    SectionConfig extends SectionDom,
  >(
    props: RecursiveEditProps<TypeNames, Params, SectionConfig>,
  ): ReactNode => {
    const { edit, title, render } = props;
    const { item, nodes, actions } = edit;
    return chrome.renderSection({
      deleted: item.deleted,
      title,
      actions,
      columns: columnContents(
        nodes.children,
        nodes.index,
        nodes.sIndex,
        item.deleted,
        render,
        chrome,
      ),
    });
  };
