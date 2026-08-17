/**
 * form-dialogs showcase — `makeUseDialogs` + `useFlatListSession`
 * replace the hand-wired sessions in the side-menu demo.
 */
import { useMemo } from "react";
import { itemName } from "../../form-item-editor/demo/FormItemEditorDemo";
import { RemoveAlert } from "../../form-item-editor/demo/formItemEditorDemoHelper";
import { SectionsList } from "../../form-edit/demo/editFormDemoHelper";
import { defaultVariants } from "../../form-item-editor/demo/itemVariants";
import { MENU_ITEMS, randomId } from "../../side-menu/demo/fixtures";
import {
  FormContainer,
  LayoutWithSidebar,
  renderMenuItem,
  renderSide,
} from "../../side-menu/demo/sideMenuDemoHelper";
import * as demo from "./formDialogsDemoHelper";
import type * as types from "./formDialogsDemoTypes.t";
import {
  DialogActionsCtx,
  SectionComponent,
  blankSection,
  cloneFn,
  useDialogs,
  type DialogActions,
} from "./formDialogsDemoStack";
import * as lib from "./library";

/** Nestable design editor — host owns the page title (`FormContainer`). */
export const FormDialogsEditor = ({
  flatItems,
  setFlatItems,
  embedded,
}: {
  flatItems: types.FlatItems;
  setFlatItems: (items: types.FlatItems) => void;
  /** No library sidebar or section-edit — nested follow-up list under a field. */
  embedded: boolean;
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
      openSectionEdit: embedded ? null : dialogs.openSectionEdit,
    }),
    [dialogs.openItemEdit, dialogs.openSectionEdit, embedded],
  );
  const listExtraMap = demo.buildListExtraMap(
    session.sections,
    session.itemActions,
    dialogs.openItemEdit,
  );
  const itemExtra = (id: string): types.ListExtra =>
    listExtraMap.get(id) ?? demo.emptyListExtra();
  const toRemove = session.toRemove;

  const list = (
    <>
      {toRemove ? (
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
            session.setToRemove(null);
          }}
          onCancel={() => session.setToRemove(null)}
        />
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
      {embedded ? null : dialogs.sectionDialog}
      {embedded ? (
        list
      ) : (
        <LayoutWithSidebar
          main={list}
          sidebar={
            <lib.Side<types.TypeNames, types.Params, types.Section>
              title="Library"
              addSectionLabel="+ Add section"
              menuItems={MENU_ITEMS}
              random={randomId}
              blankSection={blankSection}
              render={renderSide}
              renderMenuItem={renderMenuItem}
              setAddFormItem={(item) => dialogs.openItemInsert(item)}
              setAddSection={dialogs.openSectionAdd}
            />
          }
        />
      )}
    </DialogActionsCtx.Provider>
  );
};

export const FormDialogsDemo = ({
  heading,
  flatItems,
  updateArgs,
}: types.DemoProps) => (
  <FormContainer title={heading}>
    <FormDialogsEditor
      embedded={false}
      flatItems={flatItems}
      setFlatItems={(items) => updateArgs({ flatItems: items })}
    />
  </FormContainer>
);
