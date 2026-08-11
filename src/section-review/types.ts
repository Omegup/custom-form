/**
 * Teacher/admin review types — school `types/form-response-app`
 * (`AdditionalChanges`, `ReviewExtra`) + `types/form-app/addition`
 * (`Addition`, `CommentAddition`, `QuestionAddition`), adapted for the
 * section-level review contract from `section-review-ui/SectionReview`.
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
  Response,
  ResponseSetter,
  SectionDom,
  SectionMetaDom,
  SectionWithItems,
  SomeFormItem,
  VariantsDom,
} from "./_deps";

/** One reviewer follow-up question thread entry — school `AdditionalChanges[id].questions[]`. */
export type ReviewQuestionEntry<
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
> = {
  comment?: string;
  question?: SomeFormItem<TypeNames, Params>;
  date: Date | null;
};

/** Teacher/reviewer comments + follow-up questions keyed by item id — school `AdditionalChanges`. */
export type AdditionalChanges<
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
> = Record<
  string,
  {
    comment?: string;
    questions?: ReviewQuestionEntry<TypeNames, Params>[];
    history?: { date: Date }[];
  }
>;

/** In-progress overlay state for editing a comment — school `CommentAddition`. */
export type CommentAddition = {
  originId: string;
  mode: "comment";
  text?: string;
};

/** In-progress overlay state for adding/editing a follow-up question — school `QuestionAddition`. */
export type QuestionAddition<
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
> = {
  originId: string;
  mode: "question";
  comment?: string;
  question?: SomeFormItem<TypeNames, Params>;
  replace?: { index: number };
};

export type Addition<
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
> = CommentAddition | QuestionAddition<TypeNames, Params>;

/** Per-item review status driving chrome highlighting — school `ReviewExtra["status"]`. */
export type ReviewStatus = "normal" | "disabled" | "highlight";

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
  onSubmitQuestion: (payload: {
    comment?: string;
    question?: SomeFormItem<TypeNames, Params>;
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
  /** Wraps the comment card + follow-up question nodes under one item. */
  renderQuestionAppendix: (nodes: ReactNode[]) => ReactNode;
  renderActionIcon: (
    kind: "lock" | "unlock" | "addQuestion" | "edit",
    onClick: () => void,
  ) => ReactNode;
  renderOverlays: (args: ReviewOverlayArgs<TypeNames, Params>) => ReactNode;
};

export type SectionReviewProps<
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
  Variants extends VariantsDom<TypeNames>,
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
  /** Host-owned overlay draft (comment / follow-up question) — so a sidebar catalog can fill `question`. */
  addition: Addition<TypeNames, Params> | null;
  setAddition: (addition: Addition<TypeNames, Params> | null) => void;
  /** Item id pending comment deletion, or null. */
  deleteCommentId: string | null;
  setDeleteCommentId: (id: string | null) => void;
  variants: Variants;
  tCommon: (term: "add" | "cancel" | "save" | "delete") => string;
  /** Section ordinal for the title (1-based display when `multiSection`). */
  i: number;
};
