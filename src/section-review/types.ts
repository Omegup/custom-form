/**
 * Teacher/admin review types — school `types/form-response-app`
 * (`AdditionalChanges`, `ReviewExtra`) + `types/form-app/addition`
 * (`Addition`, `CommentAddition`, `QuestionAddition`), adapted for the
 * section-level review contract from `section-review-ui/SectionReview`.
 * slot-tree uses `formItem` naming throughout (school calls this a
 * "follow-up question"; we attach a follow-up form item instead).
 *
 * Chrome (section shell, item cards, comment cards, overlays) is injected via
 * {@link SectionReviewChrome} — library code emits no HTML.
 */
import type { ReactNode } from "react";
import type {
  ContextDom,
  ExtraDom,
  MetaDom,
  ParamsDom,
  RecursiveFormItem,
  Response,
  ResponseSetter,
  SectionDom,
  SectionMetaDom,
  SectionWithItems,
  SIndexed,
  SomeFormItem,
  VariantsDom,
} from "./_deps";

/** One reviewer follow-up thread entry — school `AdditionalChanges[id].questions[]`. */
export type ReviewFormItemEntry<
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
> = {
  comment?: string;
  formItem?: SomeFormItem<TypeNames, Params>;
  /** Nested columns when `formItem` is a panel — same shape as design `children`. */
  children?: RecursiveFormItem<TypeNames, Params, MetaDom<SIndexed>>[][];
  date: Date | null;
};

export type ReviewFormItemsEditorArgs<
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
> = {
  entries: ReviewFormItemEntry<TypeNames, Params>[];
  setEntries: (entries: ReviewFormItemEntry<TypeNames, Params>[]) => void;
  fallback: ReactNode;
};

/** Teacher/reviewer comments + follow-up form items keyed by item id — school `AdditionalChanges`. */
export type AdditionalChanges<
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
> = Record<
  string,
  {
    comment?: string;
    formItems?: ReviewFormItemEntry<TypeNames, Params>[];
    history?: { date: Date }[];
  }
>;

/** In-progress overlay state for editing a comment — school `CommentAddition`. */
export type CommentAddition = {
  originId: string;
  mode: "comment";
  text?: string;
};

/** In-progress overlay state for adding/editing a follow-up form item — school `QuestionAddition`. */
export type FormItemAddition<
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
> = {
  originId: string;
  mode: "formItem";
  comment?: string;
  formItem?: SomeFormItem<TypeNames, Params>;
  replace?: { index: number };
};

export type Addition<
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
> = CommentAddition | FormItemAddition<TypeNames, Params>;

/** Per-item review status driving chrome highlighting — school `ReviewExtra["status"]`. */
export type ReviewStatus = "normal" | "disabled" | "highlight";

/**
 * Review chrome states — host supplies a Variant **value** bag per state;
 * the library picks `variants[state]` (see variant-values-not-keys).
 */
export type ReviewVariantState = "default" | "change";

/**
 * Viewer bag for read-only reviewed items — school `ReviewExtra`. `response`
 * is always read-only (`setValue: null`); host layers `impRef` + `getChild`
 * around this, same as `ResponderExtra`.
 */
export type ReviewExtra = ExtraDom & {
  error: boolean | string | null;
  parentDeleted: boolean;
  index: number;
  icon: ReactNode;
  appendix: ReactNode;
  response: ResponseSetter;
  status: ReviewStatus;
};

/** Context slots school threads for i18n; theme/portal stay host-side. */
export type SectionReviewContext = ContextDom;

export type SectionReviewHeader = SectionDom & {
  title: string;
  description: string;
};

/** Args passed to {@link SectionReviewChrome.renderOverlays}. */
export type ReviewOverlayArgs<
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
> = {
  addition: Addition<TypeNames, Params> | null;
  deleteCommentId: string | null;
  setAddition: (addition: Addition<TypeNames, Params> | null) => void;
  clearDelete: () => void;
  onSubmitComment: (text: string) => void;
  onConfirmDeleteComment: () => void;
  onSubmitFormItem: (payload: {
    comment?: string;
    formItem?: SomeFormItem<TypeNames, Params>;
    children?: RecursiveFormItem<TypeNames, Params, MetaDom<SIndexed>>[][];
  }) => void;
  tCommon: (term: "add" | "cancel" | "save" | "delete") => string;
};

/**
 * Host-owned presentation — same seam as `SectionResponderChrome`. Library
 * never creates DOM tags; overlays render inline (no `createPortal`).
 */
export type SectionReviewChrome<
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
> = {
  renderSection: (args: {
    deleted: boolean;
    title: string;
    description: string;
    i: number;
    multiSection: boolean;
    /** One ReactNode per column (already a fragment of item shells). */
    columns: ReactNode[];
  }) => ReactNode;
  renderItemShell: (args: {
    id: string;
    children: ReactNode;
    action: ReactNode;
  }) => ReactNode;
  /** Plain, non-interactive note — mirrors `SectionResponderChrome.renderAppendix`. */
  renderAppendix: (comment: string) => ReactNode;
  /** Editable comment card (top-level comment, or a comment-only follow-up entry). */
  renderComment: (args: { text: string; onEdit: () => void }) => ReactNode;
  /** Wraps the comment card + follow-up form item nodes under one item. */
  renderFormItemAppendix: (nodes: ReactNode[]) => ReactNode;
  /**
   * Host-owned control to attach a follow-up under an answered item (e.g.
   * Design's `AddFormItem` dropdown). Called with a commit callback so the
   * host does not need a Library sidebar or a pending `addition` draft.
   */
  renderAddFollowUp: (args: {
    originId: string;
    onPick: (payload: {
      comment?: string;
      formItem: SomeFormItem<TypeNames, Params>;
      children?: RecursiveFormItem<
        TypeNames,
        Params,
        MetaDom<SIndexed>
      >[][];
    }) => void;
  }) => ReactNode;
  renderActionIcon: (
    kind: "lock" | "unlock" | "edit",
    onClick: () => void,
  ) => ReactNode;
  /**
   * Mark for answered follow-up items that behave as originals (step 4) —
   * host supplies chrome (e.g. ✚) without forcing pending yellow.
   */
  renderFollowUpMark: () => ReactNode;
  renderOverlays: (args: ReviewOverlayArgs<TypeNames, Params>) => ReactNode;
};

export type SectionReviewProps<
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
  Variants extends VariantsDom,
  Context extends SectionReviewContext,
  SectionConfig extends SectionReviewHeader,
  SectionMeta extends SectionMetaDom,
  Meta extends MetaDom,
> = {
  ctx: Context;
  multiSection: boolean;
  section: SectionWithItems<TypeNames, Params, SectionConfig, SectionMeta, Meta>;
  responses: Record<string, Response>;
  /** Most recent pending-review timestamp; drives `highlight` vs `disabled` status. */
  lastPending: Date | null;
  changes: AdditionalChanges<TypeNames, Params>;
  setChanges: (changes: AdditionalChanges<TypeNames, Params>) => void;
  /** Host-owned overlay draft (comment / follow-up form item) — so a sidebar catalog can fill `formItem`. */
  addition: Addition<TypeNames, Params> | null;
  setAddition: (addition: Addition<TypeNames, Params> | null) => void;
  /** Item id pending comment deletion, or null. */
  deleteCommentId: string | null;
  setDeleteCommentId: (id: string | null) => void;
  /**
   * Host may replace the stock read-only follow-up rendering with its design
   * editor. Original answered items remain in the review renderer.
   */
  renderFormItemsEditor: (
    args: ReviewFormItemsEditorArgs<TypeNames, Params>,
  ) => ReactNode;
  /** Chrome values keyed by {@link ReviewVariantState} — library picks pending vs settled. */
  variants: Record<ReviewVariantState, Variants>;
  tCommon: (term: "add" | "cancel" | "save" | "delete") => string;
  /** Section ordinal for the title (1-based display when `multiSection`). */
  i: number;
};
