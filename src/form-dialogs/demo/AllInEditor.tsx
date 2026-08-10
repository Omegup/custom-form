/**
 * All-in composition — school `CustomFormEditor` + `DialogsHOC` (`DialogUi`):
 * one `makeUseDialogs` instance orchestrates every dialog flow over a
 * `section-view` list shell (`SectionFormItemHOC` + `WebRecursiveEdit` DnD):
 * - row "Edit" → item edit session
 * - sidebar catalog → ambiguous insert (`-1/-1`, section picker when >1)
 * - in-slot "+ Add" (section & nested panel columns) → concrete-span insert
 * - section header "Edit" / sidebar "+ Add section" → section session
 * - drag rows to reorder within a column or into a nested panel column
 */
import { createContext, useContext, useMemo, useState } from "react";
import { WebRecursiveEdit } from "../../flat-dnd/demo/WebRecursiveEdit";
import {
  FormItemEditor,
  itemName,
} from "../../form-item-editor/demo/FormItemEditorDemo";
import { RemoveAlert } from "../../form-item-editor/demo/formItemEditorDemoHelper";
import { SectionDialog } from "../../section-edit/demo/SectionEditDemo";
import { MENU_ITEMS, randomId } from "../../side-menu/demo/fixtures";
import {
  FormContainer,
  LayoutWithSidebar,
} from "../../side-menu/demo/sideMenuDemoHelper";
import * as demo from "./allInDemoHelper";
import type * as types from "./allInDemoTypes.t";
import * as lib from "./library";

const blankSection = (id: string): types.Section => ({
  id,
  deleted: false,
  title: "",
  description: "",
});

type DialogActions = {
  openItemEdit: (item: types.ListItem) => void;
  openSectionEdit: (section: types.ListSection) => void;
};

const DialogActionsCtx = createContext<DialogActions>({
  openItemEdit: () => {},
  openSectionEdit: () => {},
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
      {!section.header.deleted && (
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
  (args) => <lib.AddFormItem {...args} />,
  () => MENU_ITEMS,
  randomId,
);

const SectionComponent = lib.SectionFormItemHOC<
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

const cloneFn: lib.Clone<
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

const useDialogs = lib.makeUseDialogs<
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
        /** The label is host business — this demo's `Section` has `title`. */
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

type PendingRemove = {
  rm: () => void;
  item: lib.FlatNestedItem<types.TypeNames, types.Params, types.Section>;
};

export const AllInEditor = ({
  heading,
  flatItems,
  updateArgs,
}: types.DemoProps) => {
  const [focused, setFocused] = useState<lib.AutoFocusState>(null);
  const [toRemove, setToRemove] = useState<PendingRemove | null>(null);

  const dialogCtx: types.Ctx = lib.branded({ flatItems });
  const dialogs = useDialogs({
    flatItems,
    setFlatItems: (items) => updateArgs({ flatItems: items }),
    ctx: dialogCtx,
  });

  const listCtx = useMemo(
    () => lib.autofocusCtx<lib.ContextDom>(lib.branded({}), focused),
    [focused],
  );
  const variants = useMemo(
    (): types.Variants =>
      lib.branded({ field: "default", heading: "default", panel: "default" }),
    [],
  );

  const setItems = (items: types.FlatItems, newCtx: types.ListCtx) => {
    if (items !== flatItems) updateArgs({ flatItems: items });
    setFocused(newCtx.focused);
  };

  const sections = useMemo(() => lib.consolidateSections(flatItems), [flatItems]);
  const sectionOfItem = useMemo(
    () => lib.buildItemSectionDict(flatItems),
    [flatItems],
  );

  const jump = true;
  const args = {
    items: flatItems,
    setItems,
    ctx: listCtx,
    sectionOfItem,
    setToRemove,
  };
  const itemActions = lib.getFormItemMoveActions(args, cloneFn, jump);

  const dialogActions = useMemo(
    (): DialogActions => ({
      openItemEdit: dialogs.openItemEdit,
      openSectionEdit: dialogs.openSectionEdit,
    }),
    [dialogs.openItemEdit, dialogs.openSectionEdit],
  );

  const listExtraMap = demo.buildListExtraMap(
    sections,
    itemActions,
    dialogs.openItemEdit,
  );
  const itemExtra = (id: string): types.ListExtra =>
    listExtraMap.get(id) ?? demo.emptyListExtra();

  const alert = toRemove && (
    <RemoveAlert
      pending={{
        ...toRemove,
        label:
          "item" in toRemove.item
            ? itemName(dialogCtx, toRemove.item.item)
            : undefined,
      }}
      onConfirm={() => {
        toRemove.rm();
        setToRemove(null);
      }}
      onCancel={() => setToRemove(null)}
    />
  );

  const list = (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {sections.map((section, sIndex) => (
        <SectionComponent
          key={section.header.id}
          ctx={listCtx}
          variants={variants}
          itemExtra={itemExtra}
          renderCard={demo.renderCard}
          args={args}
          clone={cloneFn}
          section={section}
          sIndex={sIndex}
          jump={jump}
          setAddItem={dialogs.setItemSession}
        />
      ))}
    </div>
  );

  return (
    <DialogActionsCtx.Provider value={dialogActions}>
      <FormContainer title={heading}>
        {dialogs.formItemDialog}
        {dialogs.sectionDialog}
        <LayoutWithSidebar
          main={
            <>
              {alert}
              {list}
            </>
          }
          sidebar={
            <lib.Side<types.TypeNames, types.Params, types.Section>
              menuItems={MENU_ITEMS}
              random={randomId}
              blankSection={blankSection}
              setAddFormItem={(item) => dialogs.openItemInsert(item)}
              setAddSection={dialogs.openSectionAdd}
            />
          }
        />
      </FormContainer>
    </DialogActionsCtx.Provider>
  );
};
