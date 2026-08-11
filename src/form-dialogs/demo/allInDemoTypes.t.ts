/**
 * Demo domain = form-item-editor demo types (`field` / `heading` / `panel`)
 * so the same editor stack serves the All-in story.
 *
 * School data model — **two documents only**:
 * 1. **CustomForm** (design) → `flatItems`
 * 2. **FormResponse** → `formResponse` (`responses` + `changes` +
 *    `feedbackHistory` + `status`) — null until first Send
 *
 * Design / Fill / Update are **views** over those docs, not separate stores.
 * Teacher Update mutates the same FormResponse (remarks, follow-ups, feedback).
 */
import type * as itemTypes from "../../form-item-editor/demo/formItemEditorDemoTypes.t";
import type * as lib from "./library";

export type {
  TypeNames,
  Params,
  Variants,
  Section,
  FlatItems,
  Ctx,
  ItemExtra,
  ItemHeader,
  ListItem,
  ListSection,
  ItemMeta,
} from "../../form-item-editor/demo/formItemEditorDemoTypes.t";

/** Inner context before `AutoFocus` wrapping — passed as `Context` to `SectionFormItemHOC`. */
export type BaseCtx = lib.ContextDom & { focused: lib.AutoFocusState };

/** List autofocus ctx — what `SectionFormItemHOC` / move actions consume. */
export type ListCtx = lib.AutoFocus<BaseCtx, boolean>;

/**
 * Per-item viewer extra for the list shell (not the dialog's `ItemExtra`).
 * Move actions + Edit open-handler; display label comes from the form item.
 */
export type ListExtra = lib.ExtraDom & {
  actions: lib.MoveActions;
  onEdit: () => void;
};

/** Design → Fill → Update walkthrough stage (UI only — not a document). */
export type DemoPhase = "design" | "fill" | "update";

/** Teacher / student round statuses — school `FormResponseStatus`. */
export type FeedbackStatus =
  | "answered"
  | "draft"
  | "changesRequested"
  | "approved"
  | "rejected";

export type FeedbackHistoryItem = {
  status: FeedbackStatus;
  comment?: string;
  /** ISO string so Storybook args stay JSON-serializable. */
  date: string;
};

/**
 * School `FormResponse` — answers + teacher follow-up live on **one** document.
 * Created by Fill → Send (`customForms.addFormResponse`); Update / feedback
 * methods mutate this same record (`addAdditionalQuestions`, `addFeedback`).
 */
export type FormResponseDoc = {
  responses: Record<string, lib.Response>;
  changes: lib.AdditionalChanges<itemTypes.TypeNames, itemTypes.Params>;
  feedbackHistory: FeedbackHistoryItem[];
  status: FeedbackStatus;
};

export type StoryArgs = {
  /** School CustomForm design (sections / items as flat edit list). */
  flatItems: itemTypes.FlatItems;
  heading: string;
  phase: DemoPhase;
  /**
   * Fill-session draft answers (school formik values) — not a persisted doc
   * until Send writes / updates `formResponse`.
   */
  responses: Record<string, lib.Response>;
  /** School FormResponse, or null before the first Send. */
  formResponse: FormResponseDoc | null;
  showDeleted: boolean;
};

export type DemoProps = StoryArgs & {
  updateArgs: (patch: Partial<StoryArgs>) => void;
};
