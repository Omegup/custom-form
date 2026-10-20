/**
 * Review follow-up chrome — Design's `AddFormItem` + nested `FormDialogsEditor`.
 * Session/commit and entries↔flat bind live in the section-review library.
 */
import { Fragment } from "react";
import { CornerSlot, DropdownMenu, FollowUpRail, FollowUpTrigger } from "../../demo-utils";
import { AMBIGUOUS_INSERT_SPAN } from "../../form-edit";
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
  <DropdownMenu
    open={open}
    align="end"
    trigger={
      <FollowUpTrigger onClick={toggle} label={label} />
    }
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
  </DropdownMenu>
);

export const FollowUpAdd = ({
  onPick,
}: {
  onPick: (payload: ReviewFollowUpPick<types.TypeNames, types.Params>) => void;
}) => {
  const add = lib.useFollowUpAdd({ onPick });
  const ctx = editorLib.branded<editorTypes.Ctx, "context">({
    flatItems: [],
  });

  return (
    <>
      <CornerSlot>
        <AddFormItem
          span={AMBIGUOUS_INSERT_SPAN}
          menuItems={MENU_ITEMS}
          random={randomId}
          label="Ask follow-up"
          render={renderFollowUpIconAdd}
          setAddItem={add.setSession}
        />
      </CornerSlot>
      {add.session ? (
        <FormItemEditor
          ctx={ctx}
          dialogArgs={editorLib.branded({
            title: <>Add · {itemName(ctx, add.session.draft.item)}</>,
            onCancel: add.close,
          })}
          formItem={add.session.draft}
          setFormItem={add.setDraft}
          extra={editorLib.branded<editorTypes.ItemExtra, "item-edit-extra">({
            onCommit: add.commit,
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
}) => {
  const list = lib.followUpDraftsList(entries, setEntries, FOLLOW_UP_SECTION);
  return (
    <FollowUpRail
      border="#e6b800"
      background="#fffbeb"
      label={null}
    >
      <FormDialogsEditor
        sidebar={null}
        flatItems={list.flatItems}
        setFlatItems={list.setFlatItems}
      />
    </FollowUpRail>
  );
};
