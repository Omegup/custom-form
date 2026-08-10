/**
 * Multi-section review shell props — school `form-response-ui/CustomFormResponses`
 * (chrome injected via {@link FormReviewChrome}; no HTML in the library).
 */
import type { ReactNode } from "react";
import type {
  AdditionalChanges,
  MetaDom,
  ParamsDom,
  Response,
  SectionMetaDom,
  SectionReviewChrome,
  SectionReviewContext,
  SectionReviewHeader,
  SectionWithItems,
} from "./_deps";

/** Optional form title data — same shape as `form-responder`'s `FormHeader`. */
export type FormHeader = {
  title: string;
  description?: string;
};

/** Host-owned presentation for the form shell + per-section chrome. */
export type FormReviewChrome<
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
> = SectionReviewChrome<TypeNames, Params> & {
  renderHeader: (header: FormHeader) => ReactNode;
  renderForm: (args: {
    header: ReactNode | null;
    sections: ReactNode;
    children?: ReactNode;
  }) => ReactNode;
};

export type CustomFormReviewProps<
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
  Context extends SectionReviewContext,
  SectionConfig extends SectionReviewHeader,
  SectionMeta extends SectionMetaDom,
  Meta extends MetaDom,
> = {
  ctx: Context;
  header?: FormHeader | null;
  sections: SectionWithItems<TypeNames, Params, SectionConfig, SectionMeta, Meta>[];
  responses: Record<string, Response>;
  lastPending: Date | null;
  changes: AdditionalChanges<TypeNames, Params>;
  setChanges: (changes: AdditionalChanges<TypeNames, Params>) => void;
  tCommon: (term: "add" | "cancel" | "save" | "delete") => string;
  showDeleted: boolean;
  children?: ReactNode;
};
