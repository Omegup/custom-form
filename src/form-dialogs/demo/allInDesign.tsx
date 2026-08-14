/**
 * Design phase — useDialogs + useFlatListSession + Side + SectionFormItemHOC.
 */
import { useMemo } from "react";
import { itemName } from "../../form-item-editor/demo/FormItemEditorDemo";
import { RemoveAlert } from "../../form-item-editor/demo/formItemEditorDemoHelper";
import { defaultVariants } from "../../form-item-editor/demo/itemVariants";
import { MENU_ITEMS, randomId } from "../../side-menu/demo/fixtures";
import {
  LayoutWithSidebar,
  renderMenuItem,
  renderSide,
} from "../../side-menu/demo/sideMenuDemoHelper";
import * as demo from "./allInDemoHelper";
import type * as types from "./allInDemoTypes.t";
import {
  DialogActionsCtx,
  SectionComponent,
  blankSection,
  cloneFn,
  useDialogs,
  type DialogActions,
} from "./allInDesignStack";
import * as lib from "./library";

export const DesignPhase = ({
  flatItems,
  updateArgs,
}: {
  flatItems: types.FlatItems;
  updateArgs: types.DemoProps["updateArgs"];
}) => {
  const dialogCtx: types.Ctx = lib.branded({ flatItems });
  const setFlatItems = (items: types.FlatItems) => updateArgs({ flatItems: items });
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
      openSectionEdit: dialogs.openSectionEdit,
    }),
    [dialogs.openItemEdit, dialogs.openSectionEdit],
  );
  const listExtraMap = demo.buildListExtraMap(
    session.sections,
    session.itemActions,
    dialogs.openItemEdit,
  );
  const itemExtra = (id: string): types.ListExtra =>
    listExtraMap.get(id) ?? demo.emptyListExtra();
  const toRemove = session.toRemove;

  return (
    <DialogActionsCtx.Provider value={dialogActions}>
      {dialogs.formItemDialog}
      {dialogs.sectionDialog}
      <LayoutWithSidebar
        main={
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
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
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
            </div>
          </>
        }
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
    </DialogActionsCtx.Provider>
  );
};
