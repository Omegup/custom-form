/**
 * Review follow-up — Design's `AddFormItem` + nested `FormDialogsEditor`.
 * Shared by section-review, form-review, and form-response demos.
 */
import { useRef, useState } from "react";
import { FormDialogsEditor } from "../../form-dialogs/demo/FormDialogsDemo";
import type * as dialogTypes from "../../form-dialogs/demo/formDialogsDemoTypes.t";
import {
  FormItemEditor,
  itemName,
} from "../../form-item-editor/demo/FormItemEditorDemo";
import type * as editorTypes from "../../form-item-editor/demo/formItemEditorDemoTypes.t";
import * as editorLib from "../../form-item-editor/demo/library";
import { AddFormItem } from "../../side-menu";
import { MENU_ITEMS, randomId } from "../../side-menu/demo/fixtures";
import { renderAddFormItem } from "../../side-menu/demo/sideMenuDemoHelper";
import type { ReviewFollowUpPick, ReviewFormItemEntry } from "../types";
import * as lib from "./library";
import type * as types from "./sectionReviewDemoTypes.t";

const FOLLOW_UP_SPAN = { index: -1, sIndex: -1 };

const FOLLOW_UP_SECTION: dialogTypes.Section = {
  id: "follow-up",
  deleted: false,
  title: "Follow-up",
  description: "",
};

export const FollowUpAdd = ({
  onPick,
}: {
  onPick: (payload: ReviewFollowUpPick<types.TypeNames, types.Params>) => void;
}) => {
  const [session, setSession] = useState<editorTypes.EditingSession | null>(
    null,
  );
  const sessionRef = useRef(session);
  sessionRef.current = session;
  const ctx = editorLib.branded<editorTypes.Ctx, "context">({
    flatItems: [],
  });

  return (
    <>
      <AddFormItem
        span={FOLLOW_UP_SPAN}
        menuItems={MENU_ITEMS}
        random={randomId}
        label="+ Add item"
        render={renderAddFormItem}
        setAddItem={setSession}
      />
      {session ? (
        <FormItemEditor
          ctx={ctx}
          dialogArgs={editorLib.branded({
            title: <>Add · {itemName(ctx, session.draft.item)}</>,
            onCancel: () => setSession(null),
          })}
          formItem={session.draft}
          setFormItem={(updater) =>
            setSession((prev) => {
              if (!prev) return prev;
              const nextDraft =
                typeof updater === "function" ? updater(prev.draft) : updater;
              return {
                ...prev,
                draft: nextDraft,
                children: editorLib.resizeColumns(nextDraft.n, prev.children),
              };
            })
          }
          extra={editorLib.branded<editorTypes.ItemExtra, "item-edit-extra">({
            onCommit: () => {
              const current = sessionRef.current;
              if (!current) return;
              onPick({
                comment: null,
                formItem: current.draft.item,
                children:
                  current.children.length > 0 ? current.children : null,
              });
              setSession(null);
            },
          })}
        />
      ) : null}
    </>
  );
};

export const FollowUpDrafts = ({
  entries,
  setEntries,
}: {
  entries: ReviewFormItemEntry<types.TypeNames, types.Params>[];
  setEntries: (
    entries: ReviewFormItemEntry<types.TypeNames, types.Params>[],
  ) => void;
}) => (
  <div
    style={{
      marginTop: 8,
      marginLeft: 8,
      padding: "8px 8px 8px 12px",
      borderLeft: "3px solid #e6b800",
      background: "#fffbeb",
      borderRadius: "0 6px 6px 0",
    }}
  >
    <FormDialogsEditor
      embedded={true}
      flatItems={lib.followUpEntriesToFlat(entries, FOLLOW_UP_SECTION)}
      setFlatItems={(next) => {
        const synced = lib.syncFollowUpEntriesFromFlat(next, entries);
        if (synced == null) return;
        setEntries(synced);
      }}
    />
  </div>
);
