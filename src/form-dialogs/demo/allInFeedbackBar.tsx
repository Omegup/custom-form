import type { Dispatch, SetStateAction } from "react";
import type * as types from "./allInDemoTypes.t";
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
  <div
    style={{
      display: "flex",
      flexWrap: "wrap",
      gap: 12,
      alignItems: "center",
      fontSize: 14,
    }}
  >
    <button
      type="button"
      onClick={() => {
        review.save();
        onNote("FormResponse.changes saved.");
      }}
      disabled={!review.dirty}
      title={
        formResponse.status === "answered"
          ? "Commit remarks/follow-ups and move status answered → draft (school addAdditionalQuestions)."
          : "Commit remarks/follow-ups on FormResponse.changes (school addAdditionalQuestions)."
      }
    >
      Save changes
    </button>
    <button
      type="button"
      onClick={() => {
        review.revert();
        onNote("Changes discarded.");
      }}
      disabled={!review.dirty}
    >
      Cancel
    </button>
    <label style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <input
        type="checkbox"
        checked={showDeleted}
        onChange={(e) => updateArgs({ showDeleted: e.target.checked })}
      />
      Show deleted sections
    </label>
    <span style={{ fontSize: 13, color: "#555" }}>
      FormResponse status: <code>{formResponse.status}</code>
      {lastPending ? ` · ${lastPending.toISOString().slice(0, 10)}` : ""}
    </span>
    {statusNote ? (
      <span style={{ fontSize: 13, color: "#22883e" }}>{statusNote}</span>
    ) : null}
  </div>
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
  <div
    style={{
      display: "flex",
      flexWrap: "wrap",
      gap: 8,
      alignItems: "center",
      padding: "10px 12px",
      background: "#f6f7f9",
      borderRadius: 6,
      fontSize: 13,
    }}
  >
    <span style={{ fontWeight: 600 }}>Feedback</span>
    <input
      type="text"
      value={feedbackComment}
      onChange={(e) => setFeedbackComment(e.target.value)}
      placeholder="Optional comment"
      style={{ flex: "1 1 160px", minWidth: 120, padding: "4px 8px" }}
    />
    <button
      type="button"
      onClick={() => {
        review.submitFeedback(
          "changesRequested",
          feedbackComment.trim() || undefined,
        );
        setFeedbackComment("");
        onNote("Changes requested on FormResponse — student revises on Fill → Send.");
      }}
      disabled={formResponse.status === "changesRequested"}
    >
      Request changes
    </button>
    <button
      type="button"
      onClick={() => {
        review.submitFeedback("approved");
        setFeedbackComment("");
        onNote("FormResponse approved.");
      }}
      disabled={formResponse.status === "approved"}
      style={{
        color: formResponse.status === "approved" ? undefined : "#1b7a36",
      }}
    >
      Approve
    </button>
    <button
      type="button"
      onClick={() => {
        review.submitFeedback("rejected");
        setFeedbackComment("");
        onNote("FormResponse rejected.");
      }}
      disabled={formResponse.status === "rejected"}
      style={{
        color: formResponse.status === "rejected" ? undefined : "#a40",
      }}
    >
      Reject
    </button>
  </div>
);
