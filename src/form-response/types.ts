/**
 * School `FormResponse` — answers + teacher follow-up on one document.
 * Created by Fill → Send; Update mutates the same record (remarks, follow-ups,
 * feedback). Distinct from `response/` (per-item `{ meta, data }` values).
 */
import type { AdditionalChanges, ParamsDom, Response } from "./_deps";

export type FeedbackStatus =
  | "answered"
  | "draft"
  | "changesRequested"
  | "approved"
  | "rejected";

export type FeedbackHistoryItem = {
  status: FeedbackStatus;
  comment?: string;
  /** ISO string in the document (JSON-serializable). */
  date: string;
};

export type FormResponseEntry = {
  formItemId: string;
  response: Response;
};

export type FormResponseDoc<
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
> = {
  responses: FormResponseEntry[];
  changes: AdditionalChanges<TypeNames, Params>;
  feedbackHistory: FeedbackHistoryItem[];
  status: FeedbackStatus;
};

/** Structural validator — same shape as section/form `validate` / `update` / `getKeys`. */
export type FormResponseValidator = {
  validate: (values: Record<string, Response>) => Record<string, string | null>;
  update: (values: Record<string, Response>) => Record<string, Response>;
  getKeys: () => string[];
};
