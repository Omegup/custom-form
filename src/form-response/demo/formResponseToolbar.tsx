import type { Dispatch, SetStateAction } from "react";
import { FeedbackPanel, ReviewToolbar } from "../../demo-utils";
import type * as types from "./formResponseDemoTypes.t";
import type * as lib from "./library";

type Review = {
  dirty: boolean;
  save: () => void;
  revert: () => void;
  submitFeedback: (status: lib.FeedbackStatus, comment?: string) => void;
};

export const UpdateToolbar = ({
  formResponse,
  showDeleted,
  lastPending,
  statusNote,
  review,
  updateArgs,
  onNote,
}: {
  formResponse: types.FormResponseDoc;
  showDeleted: boolean;
  lastPending: Date | null;
  statusNote: string | null;
  review: Review;
  updateArgs: types.DemoProps["updateArgs"];
  onNote: (note: string) => void;
}) => (
  <ReviewToolbar
    dirty={review.dirty}
    onSave={() => {
      review.save();
      onNote("FormResponse.changes saved.");
    }}
    onRevert={() => {
      review.revert();
      onNote("Changes discarded.");
    }}
    showDeleted={showDeleted}
    onShowDeleted={(checked) => updateArgs({ showDeleted: checked })}
    statusLine={`FormResponse status: ${formResponse.status}${
      lastPending ? ` · ${lastPending.toISOString().slice(0, 10)}` : ""
    }`}
    statusNote={statusNote}
  />
);

export const FeedbackBar = ({
  formResponse,
  feedbackComment,
  setFeedbackComment,
  review,
  onNote,
}: {
  formResponse: types.FormResponseDoc;
  feedbackComment: string;
  setFeedbackComment: Dispatch<SetStateAction<string>>;
  review: Review;
  onNote: (note: string) => void;
}) => (
  <FeedbackPanel
    comment={feedbackComment}
    onComment={setFeedbackComment}
    canRequest={formResponse.status !== "changesRequested"}
    canApprove={formResponse.status !== "approved"}
    canReject={formResponse.status !== "rejected"}
    onRequest={() => {
      review.submitFeedback(
        "changesRequested",
        feedbackComment.trim() || undefined,
      );
      setFeedbackComment("");
      onNote("Changes requested — student revises on Fill → Send.");
    }}
    onApprove={() => {
      review.submitFeedback("approved");
      setFeedbackComment("");
      onNote("FormResponse approved.");
    }}
    onReject={() => {
      review.submitFeedback("rejected");
      setFeedbackComment("");
      onNote("FormResponse rejected.");
    }}
  />
);
