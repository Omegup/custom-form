/**
 * Review follow-up — Design's `AddFormItem` + nested `FormDialogsEditor`.
 * Shared by section-review, form-review, and form-response demos.
 */
import { Fragment, useRef, useState } from "react";
import { FormDialogsEditor } from "../../form-dialogs/demo/FormDialogsDemo";
import type * as dialogTypes from "../../form-dialogs/demo/formDialogsDemoTypes.t";
import {
  FormItemEditor,
  itemName,
} from "../../form-item-editor/demo/FormItemEditorDemo";
import type * as editorTypes from "../../form-item-editor/demo/formItemEditorDemoTypes.t";
import * as editorLib from "../../form-item-editor/demo/library";
import { AddFormItem, type AddFormItemRenderArgs } from "../../side-menu";
import { MENU_ITEMS, randomId } from "../../side-menu/demo/fixtures";
import { renderMenuItem } from "../../side-menu/demo/sideMenuDemoHelper";
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

/** Empty follow-up: top icon + same catalog as Design. `+ Add item` is the list slot. */
const renderFollowUpIconAdd = ({
  open,
  label,
  toggle,
  items,
}: AddFormItemRenderArgs) => (
  <div style={{ position: "relative" }}>
    <button
      type="button"
      aria-label={label}
      aria-expanded={open}
      onClick={toggle}
      style={{
        border: "none",
        background: "transparent",
        cursor: "pointer",
        fontSize: 14,
        lineHeight: 1,
      }}
    >
      💬
    </button>
    {open ? (
      <div
        style={{
          position: "absolute",
          right: 0,
          zIndex: 2,
          display: "flex",
          flexDirection: "column",
          gap: 4,
          minWidth: 140,
          padding: 6,
          background: "#fff",
          border: "1px solid #ddd",
          borderRadius: 4,
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
        }}
      >
        {items.map((item) => (
          <Fragment key={item.key}>
            {renderMenuItem({
              title: item.title,
              icon: item.icon,
              onSelect: item.onSelect,
            })}
          </Fragment>
        ))}
      </div>
    ) : null}
  </div>
);

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
      <div style={{ position: "absolute", top: 0, right: 0 }}>
        <AddFormItem
          span={FOLLOW_UP_SPAN}
          menuItems={MENU_ITEMS}
          random={randomId}
          label="Ask follow-up"
          render={renderFollowUpIconAdd}
          setAddItem={setSession}
        />
      </div>
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
