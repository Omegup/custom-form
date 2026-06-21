import { useMemo, useState } from "react";
import { branded } from "../form/branded";
import type { Branded, ExtraDom } from "../form";
import {
  consolidateSections,
  getFormItemMoveActions,
  type FlatFormItem,
  type GetActionsArgs,
} from "../form-edit";
import { SectionFormItemHOC } from "../edit-section";
import { makeUseDialogs } from "./makeUseDialogs";
import type { EditFormItem } from "./types";
import { EDIT_FORM_INITIAL } from "../form-edit/fixtures";
import { makeEditFormCtx } from "../form-edit/fixtures";
import { editFormClone } from "../form-edit/fixtures";
import { EDIT_FORM_MENU_ITEMS, editFormRandomId } from "../form-edit/fixtures";
import { allInFieldEditorConfig, type AllInEditorStateMap } from "./allInFieldEditor";
import { AllInSectionEditDialog } from "./allInSectionEditUi";
import { AllInSimpleSectionEdit } from "./allInSimpleSectionEdit";
import { AllInSidePanel } from "./allInSidePanel";
import type {
  EditFormCtx,
  EditFormFlatItems,
  EditFormItemMeta,
  EditFormFieldParams,
  EditFormSection,
  EditFormFieldTypeNames,
  EditFormFieldVariants,
} from "../form-edit/fixtures";
import type { RecursiveFormItem } from "../recursive-form";
import type { MoveActions } from "../move-actions/MoveActions.t";

type FieldExtra = ExtraDom;

const emptyFieldExtra = (): FieldExtra => branded({});

type AllInSectionExtra = Branded<
  {
    items: (id: string) => FieldExtra;
    onEditSection: () => void;
    onEditItem: (item: RecursiveFormItem<EditFormFieldTypeNames, EditFormFieldParams, EditFormItemMeta>) => void;
    onItemActions: (
      item: RecursiveFormItem<EditFormFieldTypeNames, EditFormFieldParams, EditFormItemMeta>,
    ) => MoveActions;
  },
  "section-extra"
>;

const VARIANTS = branded<EditFormFieldVariants, "variants">({ field: "default" });

const useDialogs = makeUseDialogs<
  EditFormFieldTypeNames,
  EditFormFieldParams,
  EditFormCtx,
  EditFormSection,
  ReturnType<typeof branded<{ title: string; onClose: () => void }, "item-edit-dialog">>,
  AllInEditorStateMap,
  EditFormItemMeta
>(allInFieldEditorConfig);

const ItemBar = ({
  a,
  onEdit,
}: {
  a: MoveActions;
  onEdit: () => void;
}) => (
  <span style={{ display: "inline-flex", gap: 4, marginTop: 4 }}>
    <button type="button" style={{ fontSize: 11 }} onClick={onEdit}>
      Edit
    </button>
    {a.up && (
      <button type="button" style={{ fontSize: 11 }} onClick={a.up}>
        ↑
      </button>
    )}
    {a.down && (
      <button type="button" style={{ fontSize: 11 }} onClick={a.down}>
        ↓
      </button>
    )}
    {a.clone && (
      <button type="button" style={{ fontSize: 11 }} onClick={a.clone}>
        Clone
      </button>
    )}
    {a.isDeleted ? (
      a.restore && (
        <button type="button" style={{ fontSize: 11 }} onClick={a.restore}>
          Restore
        </button>
      )
    ) : (
      a.remove && (
        <button type="button" style={{ fontSize: 11 }} onClick={a.remove}>
          Remove
        </button>
      )
    )}
  </span>
);

const Section = SectionFormItemHOC<
  EditFormFieldTypeNames,
  EditFormFieldParams,
  EditFormFieldVariants,
  EditFormSection,
  FieldExtra,
  EditFormCtx,
  AllInSectionExtra,
  EditFormItemMeta
>({
  viewers: {
    field: {
      viewer: ({ props }) => (
        <span style={{ opacity: props.extra.parentDeleted ? 0.45 : 1 }}>
          {props.formItem.params.name}
        </span>
      ),
    },
  },
  useMenuItems: () => EDIT_FORM_MENU_ITEMS,
  random: editFormRandomId,
  renderEdit: AllInSimpleSectionEdit,
  renderAddItem: ({ item, menuItems, random, setAddItem }) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 4, marginTop: 8 }}>
      <span style={{ fontSize: 11, opacity: 0.6 }}>Add item</span>
      {menuItems.map((menuItem) => (
        <button
          key={menuItem.title}
          type="button"
          style={{ fontSize: 12, textAlign: "left" }}
          onClick={() =>
            setAddItem(
              {
                meta: { index: item.index, total: 0, sIndex: item.sIndex },
                header: { ...menuItem.header, id: random(), deleted: false },
                children: Array.from({ length: menuItem.n ?? 0 }, () => []),
              },
              (x) => x,
            )
          }
        >
          {menuItem.icon} {menuItem.title}
        </button>
      ))}
    </div>
  ),
  renderTitle: ({ edit, extra }) => (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <strong>{edit.section.header.title}</strong>
      <button type="button" style={{ fontSize: 11 }} onClick={extra.onEditSection}>
        Edit section
      </button>
    </div>
  ),
  renderCard: (props, { item, parentDeleted }) => (view) => (
    <div
      style={{
        padding: "6px 8px",
        background: parentDeleted ? "#fee" : "#f5f5f5",
        borderRadius: 4,
        marginBottom: 4,
      }}
    >
      {view}
      <ItemBar
        a={props.extra.onItemActions(item)}
        onEdit={() => props.extra.onEditItem(item)}
      />
    </div>
  ),
});

export const AllInEditor = () => {
  const [flatItems, setFlatItems] = useState<EditFormFlatItems>(EDIT_FORM_INITIAL);
  const [focused, setFocused] = useState<EditFormCtx["focused"]>(null);
  const [editFormItem, setEditFormItem] = useState<EditFormItem<
    EditFormFieldTypeNames,
    EditFormFieldParams,
    EditFormItemMeta
  > | null>(null);
  const [editSection, setEditSection] = useState<
    ReturnType<typeof consolidateSections<EditFormFieldTypeNames, EditFormFieldParams, EditFormSection>>[number] | null
  >(null);
  const [toRemove, setToRemove] = useState<{
    rm: () => void;
    item: FlatFormItem<EditFormFieldTypeNames, EditFormFieldParams, EditFormSection>;
  } | null>(null);

  const ctx = useMemo(() => makeEditFormCtx(focused), [focused]);
  const sections = useMemo(() => consolidateSections(flatItems), [flatItems]);

  const sectionOfItem = useMemo(() => {
    const map: Record<string, EditFormSection> = {};
    let current: EditFormSection | undefined;
    for (const fi of flatItems) {
      if ("section" in fi) current = fi.section;
      else if ("item" in fi && current) map[fi.item.id] = current;
    }
    return map;
  }, [flatItems]);

  const actionsArgs: GetActionsArgs<EditFormFieldTypeNames, EditFormFieldParams, EditFormCtx, EditFormSection> = {
    items: flatItems,
    setItems: (items, newCtx) => {
      setFlatItems(items);
      setFocused(newCtx.focused);
    },
    ctx,
    sectionOfItem,
    setToRemove,
  };

  const itemActions = useMemo(
    () => getFormItemMoveActions(actionsArgs, editFormClone),
    [actionsArgs],
  );

  const dialogArgs = useMemo(
    () =>
      branded<{ title: string; onClose: () => void }, "item-edit-dialog">({
        title: editFormItem
          ? editFormItem.meta.index === -1
            ? "Add field"
            : `Edit ${editFormItem.header.params.name}`
          : "Edit field",
        onClose: () => setEditFormItem(null),
      }),
    [editFormItem],
  );

  const { deleteDialog, formItemDialog, sectionDialog } = useDialogs({
    editFormItem,
    editSection,
    ctx,
    toRemove,
    editor: {
      actions: actionsArgs,
      sections,
      setEditFormItem,
      setEditSection,
    },
    renderDelete: ({ handleClose, handleConfirm }) => (
      <div
        style={{
          display: "flex",
          gap: 8,
          alignItems: "center",
          background: "#fff3cd",
          padding: "8px 12px",
          borderRadius: 4,
          fontSize: 13,
          marginBottom: 12,
        }}
      >
        <span>Confirm removal?</span>
        <button type="button" onClick={handleConfirm}>
          Confirm
        </button>
        <button type="button" onClick={handleClose}>
          Cancel
        </button>
      </div>
    ),
    renderSection: (args) => <AllInSectionEditDialog args={args} />,
    dialogArgs,
  });

  const sidebarAddItem = (item: RecursiveFormItem<EditFormFieldTypeNames, EditFormFieldParams, EditFormItemMeta>) => {
    setEditFormItem({
      ...item,
      meta: { ...item.meta, index: -1, total: 0 },
    });
  };

  return (
    <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
      <AllInSidePanel
        setFlatItems={setFlatItems}
        focus={(id) => setFocused({ id, focused: true })}
        onAddItem={sidebarAddItem}
      />
      <div style={{ flex: 1, minWidth: 0 }}>
        {deleteDialog ? <div key="delete-dialog">{deleteDialog}</div> : null}
        {formItemDialog ? <div key="form-item-dialog">{formItemDialog}</div> : null}
        {sectionDialog ? <div key="section-dialog">{sectionDialog}</div> : null}
        {sections.map((section, i) => {
          const sectionExtra: AllInSectionExtra = branded({
            items: () => emptyFieldExtra(),
            onEditSection: () => setEditSection(section),
            onEditItem: (item) => setEditFormItem(item),
            onItemActions: (item) => itemActions(item),
          });

          return (
            <Section
              key={section.header.id}
              ctx={ctx}
              variants={VARIANTS}
              extra={sectionExtra}
              edit={{
                clone: editFormClone,
                actions: actionsArgs,
                sections,
                section,
                i,
              }}
              setAddItem={(item) => item && setEditFormItem(item)}
            />
          );
        })}
        <details style={{ marginTop: 16 }}>
          <summary style={{ cursor: "pointer", fontSize: 13 }}>Flat items (JSON)</summary>
          <pre
            style={{
              marginTop: 6,
              fontSize: 11,
              background: "#f8f8f8",
              padding: 10,
              borderRadius: 4,
              overflow: "auto",
              maxHeight: 260,
            }}
          >
            {JSON.stringify(flatItems, null, 2)}
          </pre>
        </details>
      </div>
    </div>
  );
};
