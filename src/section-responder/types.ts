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
  Response,
  ResponseSetter,
  SectionDom,
  SectionMetaDom,
  SectionWithItems,
  VariantsDom,
} from "./_deps";

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

/**
 * Host-owned presentation — same seam as `SectionHOC`'s `renderTitle` /
 * `renderEdit`. Library never creates DOM tags.
 */
export type SectionResponderChrome = {
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
    onActivate?: () => void;
  }) => ReactNode;
  renderClearIcon: (onClear: () => void) => ReactNode;
  renderAppendix: (comment: string) => ReactNode;
};

export type SectionResponderProps<
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
  Variants extends VariantsDom<TypeNames>,
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
  variants: Variants;
  /** Section ordinal for the title (1-based display when `multiSection`). */
  i: number;
};
