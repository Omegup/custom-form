/**
 * Non-DnD `renderEdit` — school `recursive-edit-ui/RecursiveEdit.tsx` (via
 * `FlatDnd`) without the drag-and-drop layer. Walks a section's columns and
 * each item's nested panel columns, calling `render.node` for every item and
 * `render.addItem` at the end of every column (section-level and nested).
 *
 * Soft-deleted parent gate matches the existing demo walks
 * (`form-item-editor/demo/formItemEditorDemoHelper.tsx` `renderItem`,
 * `form-edit/demo/EditFormDemo.tsx`): a deleted item/section dims its whole
 * subtree (`parentDeleted` cascades) and suppresses add-item slots under it,
 * but items still render (never hidden) so move actions stay reachable.
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

const renderNode = <
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
>(
  item: RecursiveFormItem<TypeNames, Params, MetaDom<SIndexed>>,
  parentDeleted: boolean,
  render: Render<TypeNames, Params>,
): ReactNode => {
  const deleted = parentDeleted || item.header.deleted;
  const children =
    item.children.length > 0
      ? renderColumns(item.children, item.meta.index, item.meta.sIndex, deleted, render)
      : null;
  return (
    <Fragment key={item.header.id}>
      {render.node({ item, children, parentDeleted, index: item.meta.index })}
    </Fragment>
  );
};

const renderColumns = <
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
>(
  columns: RecursiveFormItem<TypeNames, Params, MetaDom<SIndexed>>[][],
  parentIndex: number,
  sIndex: number,
  parentDeleted: boolean,
  render: Render<TypeNames, Params>,
): ReactNode => (
  <>
    {columns.map((column, colIndex) => (
      <div
        key={colIndex}
        style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6, minWidth: 0 }}
      >
        {column.map((item) => renderNode(item, parentDeleted, render))}
        {!parentDeleted &&
          render.addItem({
            index: getFlatInsertionIndex(parentIndex, columns, colIndex),
            sIndex,
          })}
      </div>
    ))}
  </>
);

const MoveActionsBar = ({ actions }: { actions: MoveActions }) => (
  <div style={{ display: "flex", gap: 6 }}>
    {actions.isDeleted ? (
      <button type="button" onClick={() => actions.restore?.()} disabled={!actions.restore}>
        Restore
      </button>
    ) : (
      <>
        <button type="button" onClick={() => actions.up?.()} disabled={!actions.up}>
          ↑
        </button>
        <button type="button" onClick={() => actions.down?.()} disabled={!actions.down}>
          ↓
        </button>
        <button type="button" onClick={() => actions.clone?.()} disabled={!actions.clone}>
          Clone
        </button>
        <button type="button" onClick={() => actions.remove?.()} disabled={!actions.remove}>
          Remove
        </button>
      </>
    )}
  </div>
);

export const ColumnsEdit = <
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
  SectionConfig extends SectionDom,
>(
  props: RecursiveEditProps<TypeNames, Params, SectionConfig>,
) => {
  const { edit, title, render } = props;
  const { item, nodes, actions } = edit;
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
        <MoveActionsBar actions={actions} />
      </div>
      <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
        {renderColumns(nodes.children, nodes.index, nodes.sIndex, item.deleted, render)}
      </div>
    </section>
  );
};
