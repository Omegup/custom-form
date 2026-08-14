import type { ParamsDom } from "./_deps";
import type { FeedbackHistoryItem, FeedbackStatus, FormResponseDoc } from "./types";

/** Persist teacher remarks/follow-ups; `answered` → append `draft`. */
export const saveAdditionalQuestions = <
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
>(
  doc: FormResponseDoc<TypeNames, Params>,
  now: Date,
): FormResponseDoc<TypeNames, Params> => {
  if (doc.status !== "answered") return doc;
  return {
    ...doc,
    status: "draft",
    feedbackHistory: [
      ...doc.feedbackHistory,
      { status: "draft", date: now.toISOString() },
    ],
  };
};

export const appendFeedback = <
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
>(
  doc: FormResponseDoc<TypeNames, Params>,
  status: FeedbackStatus,
  comment: string | undefined,
  now: Date,
): FormResponseDoc<TypeNames, Params> => {
  if (doc.status === status) return doc;
  return {
    ...doc,
    status,
    feedbackHistory: [
      ...doc.feedbackHistory,
      { status, comment, date: now.toISOString() },
    ],
  };
};

/** ISO date of the latest `answered` feedback entry, or null. */
export const lastAnsweredAt = (
  history: FeedbackHistoryItem[],
): string | null => {
  for (let i = history.length - 1; i >= 0; i--) {
    if (history[i]!.status === "answered") return history[i]!.date;
  }
  return null;
};
