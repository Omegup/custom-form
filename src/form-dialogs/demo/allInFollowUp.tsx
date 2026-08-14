/**
 * Follow-up entries as a design list — same stack as Design, synced back
 * onto ReviewFormItemEntry[].
 */
import { useCallback, useMemo } from "react";
import { itemName } from "../../form-item-editor/demo/FormItemEditorDemo";
import { RemoveAlert } from "../../form-item-editor/demo/formItemEditorDemoHelper";
import { followUpVariants } from "../../form-item-editor/demo/itemVariants";
import * as demo from "./allInDemoHelper";
import type * as types from "./allInDemoTypes.t";
import {
  DialogActionsCtx,
  FollowUpSectionComponent,
  cloneFn,
  useDialogs,
} from "./allInDesignStack";
import * as lib from "./library";

const followUpSection = (): types.Section => ({
  id: "review-follow-up-section",
  deleted: false,
  title: "Follow-up items",
  description: "",
});

export const FollowUpDesignItems = ({
  entries,
  designFlatItems,
  setEntries,
}: {
  entries: lib.ReviewFormItemEntry<types.TypeNames, types.Params>[];
  designFlatItems: types.FlatItems;
  setEntries: (
    entries: lib.ReviewFormItemEntry<types.TypeNames, types.Params>[],
  ) => void;
}) => {
  const flatItems = useMemo(
    () => lib.followUpEntriesToFlat(entries, followUpSection()),
    [entries],
  );
  const setFlatItems = useCallback(
    (next: types.FlatItems) => {
      const synced = lib.syncFollowUpEntriesFromFlat(next, entries);
      if (synced) setEntries(synced);
    },
    [entries, setEntries],
  );
  const dialogCtx: types.Ctx = lib.branded({
    flatItems: [...designFlatItems, ...flatItems],
  });
  const dialogs = useDialogs({ flatItems, setFlatItems, ctx: dialogCtx });
  const session = lib.useFlatListSession({
    flatItems,
    setFlatItems,
    baseCtx: lib.branded<lib.ContextDom, "context">({}),
    clone: cloneFn,
    jump: true,
  });
  const listExtraMap = demo.buildListExtraMap(
    session.sections,
    session.itemActions,
    dialogs.openItemEdit,
  );
  const itemExtra = (id: string): types.ListExtra =>
    listExtraMap.get(id) ?? demo.emptyListExtra();
  const section = session.sections[0];
  if (!section) return null;
  const toRemove = session.toRemove;

  return (
    <DialogActionsCtx.Provider
      value={{
        openItemEdit: dialogs.openItemEdit,
        openSectionEdit: () => {},
      }}
    >
      {dialogs.formItemDialog}
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
      <FollowUpSectionComponent
        ctx={session.listCtx}
        variants={followUpVariants}
        itemExtra={itemExtra}
        renderCard={demo.renderCard}
        args={session.args}
        clone={cloneFn}
        section={section}
        sIndex={0}
        jump
        setAddItem={dialogs.setItemSession}
      />
    </DialogActionsCtx.Provider>
  );
};
