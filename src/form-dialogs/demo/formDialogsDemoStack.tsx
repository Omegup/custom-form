/**
 * Design-list stack — SectionFormItemHOC + makeUseDialogs + clone.
 * FormDialogsDemo mounts this; it owns layout.
 */
import { createContext, useContext, type ReactNode } from "react";
import { WebRecursiveEdit } from "../../flat-dnd/demo/WebRecursiveEdit";
import {
  FormItemEditor,
  itemName,
} from "../../form-item-editor/demo/FormItemEditorDemo";
import { SectionDialog } from "../../section-edit/demo/SectionEditDemo";
import { MENU_ITEMS, randomId } from "../../side-menu/demo/fixtures";
import {
  renderAddFormItem,
  renderMenuItem,
  renderSide,
} from "../../side-menu/demo/sideMenuDemoHelper";
import * as demo from "./formDialogsDemoHelper";
import type * as types from "./formDialogsDemoTypes.t";
import * as lib from "./library";

export const blankSection = (id: string): types.Section => ({
  id,
  deleted: false,
  title: "",
  description: "",
});

export type DialogActions = {
  openItemEdit: (item: types.ListItem) => void;
  openSectionEdit: ((section: types.ListSection) => void) | null;
};

export const DialogActionsCtx = createContext<DialogActions>({
  openItemEdit: () => {},
  openSectionEdit: null,
});

const SectionTitle = (
  props: lib.SectionProps<
    types.TypeNames,
    types.Params,
    types.Variants,
    types.Section,
    types.BaseCtx,
    types.ListExtra
  >,
) => {
  const { openSectionEdit } = useContext(DialogActionsCtx);
  const { section } = props;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
      <strong>{section.header.title}</strong>
      {openSectionEdit && !section.header.deleted && (
        <button type="button" onClick={() => openSectionEdit(section)}>
          Edit
        </button>
      )}
    </span>
  );
};

const useRenderAddItem = lib.makeUseRenderAddItem<
  types.TypeNames,
  types.Params
>(
  (args) => (
    <lib.AddFormItem
      {...args}
      label="+ Add item"
      render={renderAddFormItem}
    />
  ),
  () => MENU_ITEMS,
  randomId,
);

export const SectionComponent = lib.SectionFormItemHOC<
  types.TypeNames,
  types.Params,
  types.Variants,
  types.Section,
  types.BaseCtx,
  types.ListExtra
>({
  viewers: demo.viewers,
  useRenderAddItem,
  renderTitle: (props) => <SectionTitle {...props} />,
  renderEdit: WebRecursiveEdit,
});

export const cloneFn: lib.Clone<
  types.TypeNames,
  types.Params,
  types.ListCtx,
  types.Section
> = (subItems, _, allItems) =>
  lib.cloneFlatItems(
    subItems,
    allItems,
    (name, n) => `${name} (copy${n})`,
    randomId,
    { rename: "first" },
  );

export type DesignSidebarArgs = {
  openItemInsert: (
    item: {
      header: types.ItemHeader;
      children: types.ListItem[][];
    },
    span: lib.FlatInsertSpan,
  ) => void;
  openSectionAdd: (section: {
    header: types.Section;
    index: number;
    total: number;
    items: types.ListItem[][];
  }) => void;
};

/** Library catalog column — Design tabs pass this; follow-up passes `null`. */
export const designSidebar = ({
  openItemInsert,
  openSectionAdd,
}: DesignSidebarArgs): ReactNode => (
  <lib.Side<types.TypeNames, types.Params, types.Section>
    title="Library"
    addSectionLabel="+ Add section"
    menuItems={MENU_ITEMS}
    random={randomId}
    blankSection={blankSection}
    render={renderSide}
    renderMenuItem={renderMenuItem}
    setAddFormItem={(item) =>
      openItemInsert(item, lib.AMBIGUOUS_INSERT_SPAN)
    }
    setAddSection={openSectionAdd}
  />
);

export const useDialogs = lib.makeUseDialogs<
  types.TypeNames,
  types.Params,
  types.Ctx,
  types.Section
>({
  renderFormItem: ({
    ctx,
    session,
    add,
    setDraft,
    setSIndex,
    sectionOptions,
    commit,
    close,
  }) => (
    <FormItemEditor
      ctx={ctx}
      dialogArgs={lib.branded({
        title: (
          <>
            {session.total === 0 ? "Add" : "Edit"} ·{" "}
            {itemName(ctx, session.draft.item)}
          </>
        ),
        onCancel: close,
      })}
      formItem={session.draft}
      setFormItem={setDraft}
      extra={lib.branded<types.ItemExtra, "item-edit-extra">({
        onCommit: commit,
        sectionPicker: add
          ? {
              sIndex: session.sIndex,
              sections: sectionOptions.map(({ index, header }) => ({
                index,
                title: header.title,
              })),
              setSIndex,
            }
          : undefined,
      })}
    />
  ),
  renderSection: ({ session, add, commit, close }) => (
    <SectionDialog
      title={add ? "Add section" : undefined}
      draft={session.draft}
      onCancel={close}
      onSave={(form) =>
        commit(
          {
            ...session.draft.header,
            title: form.title,
            description: form.description,
          },
          form.cols,
        )
      }
    />
  ),
});
