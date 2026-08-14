/**
 * Update phase — useFormResponseReview + CustomFormReviewHOC.
 * Follow-ups render through Design's list stack.
 */
import { useState } from "react";
import {
  defaultVariants,
  followUpVariants,
} from "../../form-item-editor/demo/itemVariants";
import { FollowUpDesignItems } from "./allInFollowUp";
import { FeedbackBar, UpdateToolbar } from "./allInFeedbackBar";
import { dateFromIso, rememberDate } from "./allInLifecycle";
import { reviewChrome } from "./allInReviewChrome";
import { reviewViewers } from "./allInReviewViewers";
import type * as types from "./allInDemoTypes.t";
import * as lib from "./library";

const FormReview = lib.CustomFormReviewHOC<
  types.TypeNames,
  types.Params,
  types.Variants,
  lib.SectionReviewContext,
  types.Section
>(reviewViewers, reviewChrome);

const reviewVariants: Record<lib.ReviewVariantState, types.Variants> = {
  default: defaultVariants,
  change: followUpVariants,
};

const reviewCtx = lib.branded<lib.SectionReviewContext, "context">({});
const tCommon = (term: "add" | "cancel" | "save" | "delete") =>
  ({ add: "Add", cancel: "Cancel", save: "Save", delete: "Delete" })[term];

export const UpdatePhase = ({
  sections,
  flatItems,
  formResponse,
  showDeleted,
  updateArgs,
}: {
  sections: types.ListSection[];
  flatItems: types.FlatItems;
  formResponse: types.FormResponseDoc | null;
  showDeleted: boolean;
  updateArgs: types.DemoProps["updateArgs"];
}) => {
  const [addition, setAddition] = useState<
    lib.Addition<types.TypeNames, types.Params> | null
  >(null);
  const [deleteCommentId, setDeleteCommentId] = useState<string | null>(null);
  const [feedbackComment, setFeedbackComment] = useState("");
  const [statusNote, setStatusNote] = useState<string | null>(null);
  const review = lib.useFormResponseReview({
    doc: formResponse,
    setDoc: (next) => updateArgs({ formResponse: next }),
    now: () => rememberDate(new Date()),
  });
  const lastPending = review.lastAnsweredIso
    ? dateFromIso(review.lastAnsweredIso)
    : null;

  if (!formResponse) {
    return (
      <p style={{ margin: 0, fontSize: 14, color: "#a40" }}>
        No FormResponse yet — use Fill → Send to create the response document.
        Update is a teacher view of that same document, not a third store.
      </p>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <UpdateToolbar
        formResponse={formResponse}
        showDeleted={showDeleted}
        lastPending={lastPending}
        statusNote={statusNote}
        review={review}
        updateArgs={updateArgs}
        onNote={setStatusNote}
      />
      <FeedbackBar
        formResponse={formResponse}
        feedbackComment={feedbackComment}
        setFeedbackComment={setFeedbackComment}
        review={review}
        onNote={setStatusNote}
      />
      <FormReview
        ctx={reviewCtx}
        header={{
          title: "Update FormResponse",
          description:
            "Same document as Fill — remarks / follow-ups / feedback live on FormResponse.changes + feedbackHistory.",
        }}
        sections={sections}
        responses={lib.formResponseValues(formResponse)}
        lastPending={lastPending}
        changes={formResponse.changes}
        setChanges={review.setChanges}
        addition={addition}
        setAddition={setAddition}
        deleteCommentId={deleteCommentId}
        setDeleteCommentId={setDeleteCommentId}
        renderFormItemsEditor={({ entries, setEntries, fallback }) =>
          entries.some((entry) => entry.formItem) ? (
            <FollowUpDesignItems
              entries={entries}
              designFlatItems={flatItems}
              setEntries={setEntries}
            />
          ) : (
            fallback
          )
        }
        variants={reviewVariants}
        tCommon={tCommon}
        showDeleted={showDeleted}
      />
    </div>
  );
};
