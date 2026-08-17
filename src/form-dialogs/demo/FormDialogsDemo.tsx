/**
 * form-dialogs showcase — `makeUseDialogs` + `useFlatListSession`.
 */
import type { ReactNode } from "react";
import { useMemo } from "react";
import { DemoPage, SidebarLayout, ConfirmBanner } from "../../demo-utils";
import { itemName } from "../../form-item-editor/demo/FormItemEditorDemo";
import { SectionsList, pendingRemoveCopy } from "../../form-edit/demo/editFormDemoHelper";
import { defaultVariants } from "../../form-item-editor/demo/itemVariants";
import * as demo from "./formDialogsDemoHelper";
import type * as types from "./formDialogsDemoTypes.t";
import {
  DialogActionsCtx,
  SectionComponent,
  cloneFn,
  designSidebar,
  useDialogs,
  type DesignSidebarArgs,
  type DialogActions,
} from "./formDialogsDemoStack";
import * as lib from "./library";

/** Nestable design editor — host owns the page title and sidebar chrome. */
export const FormDialogsEditor = ({
  flatItems,
  setFlatItems,
  sidebar,
}: {
  flatItems: types.FlatItems;
  setFlatItems: (items: types.FlatItems) => void;
  sidebar: ((args: DesignSidebarArgs) => ReactNode) | null;
}) => {
  const dialogCtx: types.Ctx = lib.branded({ flatItems });
  const dialogs = useDialogs({ flatItems, setFlatItems, ctx: dialogCtx });
  const session = lib.useFlatListSession({
    flatItems,
    setFlatItems,
    baseCtx: lib.branded<lib.ContextDom, "context">({}),
    clone: cloneFn,
    jump: true,
  });
  const dialogActions = useMemo(
    (): DialogActions => ({
      openItemEdit: dialogs.openItemEdit,
      openSectionEdit: sidebar ? dialogs.openSectionEdit : null,
    }),
    [dialogs.openItemEdit, dialogs.openSectionEdit, sidebar],
  );
  const extras = lib.extrasByItemId(session.sections, (item) =>
    lib.branded<types.ListExtra, "viewer-extra">({
      actions: session.itemActions(item),
      onEdit: () => dialogs.openItemEdit(item),
    }),
  );
  const itemExtra = (id: string): types.ListExtra =>
    extras.get(id) ?? demo.emptyListExtra();
  const toRemove = session.toRemove;

  const list = (
    <>
      {toRemove ? (
        <ConfirmBanner
          onConfirm={() => {
            toRemove.rm();
            session.setToRemove(null);
          }}
          onCancel={() => session.setToRemove(null)}
        >
          {pendingRemoveCopy(toRemove.item, (item) =>
            itemName(dialogCtx, item),
          )}
        </ConfirmBanner>
      ) : null}
      <SectionsList>
        {session.sections.map((section, sIndex) => (
          <SectionComponent
            key={section.header.id}
            ctx={session.listCtx}
            variants={defaultVariants}
            itemExtra={itemExtra}
            renderCard={demo.renderCard}
            args={session.args}
            clone={cloneFn}
            section={section}
            sIndex={sIndex}
            jump
            setAddItem={dialogs.setItemSession}
          />
        ))}
      </SectionsList>
    </>
  );

  return (
    <DialogActionsCtx.Provider value={dialogActions}>
      {dialogs.formItemDialog}
      {sidebar ? dialogs.sectionDialog : null}
      {sidebar ? (
        <SidebarLayout
          main={list}
          sidebar={sidebar({
            openItemInsert: dialogs.openItemInsert,
            openSectionAdd: dialogs.openSectionAdd,
          })}
        />
      ) : (
        list
      )}
    </DialogActionsCtx.Provider>
  );
};

export { designSidebar };

export const FormDialogsDemo = ({
  heading,
  flatItems,
  updateArgs,
}: types.DemoProps) => (
  <DemoPage title={heading}>
    <FormDialogsEditor
      sidebar={designSidebar}
      flatItems={flatItems}
      setFlatItems={(items) => updateArgs({ flatItems: items })}
    />
  </DemoPage>
);
