/**
 * Fill-path section types — school `types/form-response-app` (`ResponderExtra`,
 * `ResponderAdditionalChanges`) + the section-level validator contract from
 * `section-responder-ui/SectionResponder`.
 *
 * Chrome (title, layout, clear control, appendix) is injected via
 * {@link SectionResponderChrome} — library code emits no HTML.
 */
import type { ReactNode, Ref } from "react";
import type {
  ContextDom,
  ExtraDom,
  MetaDom,
  ParamsDom,
  RecursiveFormItem,
  Response,
  ResponseSetter,
  SectionDom,
  SectionLayoutChrome,
  SectionMetaDom,
  SectionWithItems,
  VariantsDom,
} from "./_deps";

/**
 * Fill chrome states — host supplies a Variant **value** bag per state;
 * the library picks `variants[state]` (see variant-values-not-keys).
 */
export type ResponderState = "default" | "old" | "change" | "error";

/** Teacher/reviewer comments keyed by item id — school `ResponderAdditionalChanges`. */
export type ResponderAdditionalChanges = Record<string, { comment?: string }>;

/**
 * Viewer bag for fillable items — school `ResponderExtra`.
 * Host layers `impRef` + `getChild` around this; `getUseImpRefViewProps` swaps
 * Strict → ViewerMethods on the way in.
 */
export type ResponderExtra = ExtraDom & {
  error: boolean | string | null;
  parentDeleted: boolean;
  index: number;
  icon: ReactNode;
  appendix: ReactNode;
  response: ResponseSetter;
};

export type SectionValidator = {
  validate: (values: Record<string, Response>) => Record<string, string | null>;
  update: (values: Record<string, Response>) => Record<string, Response>;
  getKeys: () => string[];
};

/** Context slots school threads for i18n; theme/portal stay host-side. */
export type SectionResponderContext = ContextDom & {
  t: (term: "fieldRequired") => string;
};

export type SectionResponderHeader = SectionDom & {
  title: string;
  description: string;
};

/** Item-walk chrome — clear control, remark, follow-up group. */
export type FillChrome = {
  renderClearIcon: (onClear: () => void) => ReactNode;
  renderAppendix: (comment: string) => ReactNode;
  /**
   * Host wraps reviewer follow-ups that sit under their origin item
   * (indent / yellow rail — same placement as review appendix).
   */
  renderFollowUpGroup: (args: {
    originId: string;
    items: ReactNode;
  }) => ReactNode;
};

/**
 * Host-owned presentation — same seam as `SectionHOC`'s `renderTitle` /
 * `renderEdit`. Library never creates DOM tags.
 */
export type SectionResponderChrome = FillChrome & SectionLayoutChrome;

export type SectionResponderProps<
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
  Variants extends VariantsDom,
  Context extends SectionResponderContext,
  SectionConfig extends SectionResponderHeader,
  SectionMeta extends SectionMetaDom,
  Meta extends MetaDom,
> = {
  ctx: Context;
  multiSection: boolean;
  section: SectionWithItems<TypeNames, Params, SectionConfig, SectionMeta, Meta>;
  responses: Record<string, Response>;
  old: {
    values: Record<string, Response>;
    changes: ResponderAdditionalChanges;
  } | null;
  setResponse: (id: string, response?: Response) => void;
  getError: (id: string) => string | null;
  impRef: Ref<SectionValidator>;
  /** Chrome values keyed by {@link ResponderState} — library picks by fill status. */
  variants: Record<ResponderState, Variants>;
  /**
   * Reviewer follow-ups keyed by **origin** item id (same keys as
   * `AdditionalChanges`). Rendered under each origin — not merged into the
   * design tree. Empty record when none.
   */
  followUpItems: Record<
    string,
    RecursiveFormItem<TypeNames, Params, Meta>[]
  >;
  /** Section ordinal for the title (1-based display when `multiSection`). */
  i: number;
};
