import type { ReactNode } from "react";
import type { MoveActions } from "../move-actions/MoveActions.t";
import { columnFlatInsertIndex } from "../form-edit";
import type { RecursiveEditProps, RenderFormItemArgs } from "../edit-section";
import type {
  EditFormCtx,
  EditFormItemMeta,
  EditFormFieldParams,
  EditFormFieldTypeNames,
} from "../form-edit/fixtures";
import type { RecursiveFormItem } from "../recursive-form";

const ActionBtn = ({
  label,
  onClick,
  disabled,
}: {
  label: string;
  onClick?: () => void;
  disabled?: boolean;
}) => (
  <button
    type="button"
    disabled={disabled || !onClick}
    onClick={onClick ?? undefined}
    style={{ fontSize: 11, padding: "2px 6px" }}
  >
    {label}
  </button>
);

const ActionBar = ({ a }: { a: MoveActions }) => (
  <span style={{ display: "inline-flex", gap: 4 }}>
    <ActionBtn label="↑" onClick={a.up ?? undefined} />
    <ActionBtn label="↓" onClick={a.down ?? undefined} />
    <ActionBtn label="Clone" onClick={a.clone ?? undefined} />
    {a.isDeleted ? (
      <ActionBtn label="Restore" onClick={a.restore ?? undefined} />
    ) : (
      <ActionBtn label="Remove" onClick={a.remove ?? undefined} />
    )}
  </span>
);

const renderItemNode = (
  renderNode: (args: RenderFormItemArgs<EditFormFieldTypeNames, EditFormFieldParams, EditFormItemMeta>) => ReactNode,
  item: RecursiveFormItem<EditFormFieldTypeNames, EditFormFieldParams, EditFormItemMeta>,
  parentDeleted: boolean,
  index: number,
): ReactNode => {
  const children = item.children.flatMap((slot) =>
    slot.map((child, ci) =>
      renderItemNode(renderNode, child, parentDeleted || item.header.deleted, ci),
    ),
  );
  return renderNode({ item, children, parentDeleted, index });
};

export const AllInSimpleSectionEdit = ({
  title,
  edit,
  render,
}: RecursiveEditProps<EditFormFieldTypeNames, EditFormFieldParams, EditFormCtx, EditFormItemMeta>) => (
  <section
    style={{
      border: "1px solid #ccc",
      borderRadius: 8,
      marginBottom: 16,
      overflow: "hidden",
    }}
  >
    <div
      style={{
        padding: "8px 12px",
        background: edit.item.deleted ? "#fdd" : "#eee",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 8,
      }}
    >
      {title}
      <ActionBar a={edit.actions} />
    </div>
    <div style={{ display: "flex", gap: 8, padding: 12 }}>
      {edit.nodes.children.map((column, colIndex) => (
        <div
          key={colIndex}
          style={{
            flex: 1,
            minHeight: 80,
            border: "1px dashed #ccc",
            borderRadius: 4,
            padding: 8,
          }}
        >
          {column.map((node, ord) =>
            renderItemNode(render.node, node, edit.item.deleted, ord),
          )}
          {render.addItem({
            index: columnFlatInsertIndex(
              edit.nodes.meta.index,
              edit.nodes.children,
              colIndex,
            ),
            sIndex: edit.nodes.meta.sIndex,
          })}
        </div>
      ))}
    </div>
  </section>
);
