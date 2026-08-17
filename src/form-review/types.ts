/**
 * Multi-section review shell props — school `form-response-ui/CustomFormResponses`
 * (chrome injected via {@link FormReviewChrome}; no HTML in the library).
 */
import type { ReactNode } from "react";
import type {
  Addition,
  AdditionalChanges,
  FormHeader,
  FormLayoutChrome,
  MetaDom,
  ParamsDom,
  Response,
  ReviewVariantState,
  SectionHeader,
  SectionMetaDom,
  SectionReviewChrome,
  SectionReviewContext,
  SectionWithItems,
  ReviewFormItemsEditorArgs,
  VariantsDom,
} from "./_deps";

export type { FormHeader };

/** Host-owned presentation for the form shell + per-section chrome. */
export type FormReviewChrome<
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
> = SectionReviewChrome<TypeNames, Params> & FormLayoutChrome;

export type CustomFormReviewProps<
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
  Variants extends VariantsDom,
  Context extends SectionReviewContext,
  SectionConfig extends SectionHeader,
  SectionMeta extends SectionMetaDom,
  Meta extends MetaDom,
> = {
  ctx: Context;
  header: FormHeader | null;
  sections: SectionWithItems<TypeNames, Params, SectionConfig, SectionMeta, Meta>[];
  responses: Record<string, Response>;
  lastPending: Date | null;
  changes: AdditionalChanges<TypeNames, Params>;
  setChanges: (changes: AdditionalChanges<TypeNames, Params>) => void;
  setAddition: (addition: Addition | null) => void;
  setDeleteCommentId: (id: string | null) => void;
  renderFormItemsEditor: (
    args: ReviewFormItemsEditorArgs<TypeNames, Params>,
  ) => ReactNode;
  /** Chrome values keyed by {@link ReviewVariantState} — library picks pending vs settled. */
  variants: Record<ReviewVariantState, Variants>;
  showDeleted: boolean;
  children: ReactNode | null;
};
