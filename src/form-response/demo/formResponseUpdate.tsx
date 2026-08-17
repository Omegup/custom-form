/**
 * Update — useFormResponseReview + CustomFormReviewHOC.
 */
import { useState } from "react";
import { EmptyNotice, UpdateColumn } from "../../demo-utils";
import { dateFromIso, rememberDate } from "./formResponseDemoHelper";
import type * as types from "./formResponseDemoTypes.t";
import { FeedbackBar, UpdateToolbar } from "./formResponseToolbar";
import { FollowUpDrafts } from "../../section-review/demo/followUpAdd";
import { renderReviewOverlays } from "../../section-review/demo/sectionReviewDemoHelper";
import {
  FormReview,
  reviewCtx,
  reviewVariants,
  tCommon,
} from "./formResponseUpdateView";
import * as lib from "./library";

export const UpdatePhase = ({
  sections,
  formResponse,
  showDeleted,
  updateArgs,
}: {
  sections: types.ListSection[];
  formResponse: types.FormResponseDoc | null;
  showDeleted: boolean;
  updateArgs: types.DemoProps["updateArgs"];
}) => {
  const [addition, setAddition] = useState<lib.Addition | null>(null);
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
      <EmptyNotice>
        No FormResponse yet — use Fill → Send to create the response document.
        Update is a teacher view of that same document, not a third store.
      </EmptyNotice>
    );
  }

  return (
    <UpdateColumn>
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
        setAddition={setAddition}
        setDeleteCommentId={setDeleteCommentId}
        renderFormItemsEditor={({ entries, setEntries }) => (
          <FollowUpDrafts entries={entries} setEntries={setEntries} />
        )}
        variants={reviewVariants}
        showDeleted={showDeleted}
        children={null}
      />
      {renderReviewOverlays({
        ...lib.reviewOverlayActions({
          addition,
          deleteCommentId,
          changes: formResponse.changes,
          setChanges: review.setChanges,
          setAddition,
          setDeleteCommentId,
        }),
        tCommon,
      })}
    </UpdateColumn>
  );
};
