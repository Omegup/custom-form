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

export type FeedbackStatus = lib.FeedbackStatus;
export type FeedbackHistoryItem = lib.FeedbackHistoryItem;
export type FormResponseEntry = lib.FormResponseEntry;
export type FormResponseDoc = lib.FormResponseDoc<
  itemTypes.TypeNames,
  itemTypes.Params
>;

/** Props for `AllInEditor` — domain documents, not Storybook wire format. */
export type DemoProps = {
  flatItems: itemTypes.FlatItems;
  heading: string;
  phase: DemoPhase;
  showDeleted: boolean;
  /** Fill-session draft answers — not part of the FormResponse document. */
  responses: Record<string, lib.Response>;
  /** School FormResponse, or null before the first Send. */
  formResponse: FormResponseDoc | null;
  updateArgs: (
    patch: Partial<{
      flatItems: itemTypes.FlatItems;
      heading: string;
      phase: DemoPhase;
      showDeleted: boolean;
      responses: Record<string, lib.Response>;
      formResponse: FormResponseDoc | null;
    }>,
  ) => void;
};
