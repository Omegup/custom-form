/**
 * Multi-section fill shell props — school `form-responder-ui/CustomFormResponder`
 * (chrome injected via {@link FormResponderChrome}; no HTML in the library).
 */
import type { ReactNode, Ref } from "react";
import type {
  MetaDom,
  ParamsDom,
  RecursiveFormItem,
  Response,
  ResponderAdditionalChanges,
  ResponderState,
  SectionMetaDom,
  SectionResponderChrome,
  SectionResponderContext,
  SectionResponderHeader,
  SectionValidator,
  SectionWithItems,
  VariantsDom,
} from "./_deps";

/** Optional form title data — stand-in for school's `FormHeader`. */
export type FormHeader = {
  title: string;
  description?: string;
};

/** Host-owned presentation for the form shell + per-section chrome. */
export type FormResponderChrome = SectionResponderChrome & {
  renderHeader: (header: FormHeader) => ReactNode;
  renderForm: (args: {
    header: ReactNode | null;
    sections: ReactNode;
    children?: ReactNode;
  }) => ReactNode;
};

export type CustomFormResponderProps<
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
  Variants extends VariantsDom,
  Context extends SectionResponderContext,
  SectionConfig extends SectionResponderHeader,
  SectionMeta extends SectionMetaDom,
  Meta extends MetaDom,
> = {
  ctx: Context;
  header?: FormHeader | null;
  old: {
    values: Record<string, Response>;
    changes: ResponderAdditionalChanges;
  } | null;
  getError: (id: string) => string | null;
  sections: SectionWithItems<
    TypeNames,
    Params,
    SectionConfig,
    SectionMeta,
    Meta
  >[];
  responses: Record<string, Response>;
  setResponse: (id: string, response?: Response) => void;
  /** Form-level validator — same shape as section (`SectionValidator`). */
  impRef: Ref<SectionValidator>;
  showDeleted: boolean;
  /** Chrome values keyed by {@link ResponderState} — library picks by fill status. */
  variants: Record<ResponderState, Variants>;
  /**
   * Reviewer follow-ups keyed by origin item id — forwarded to each
   * `SectionResponder`. Empty record when none.
   */
  followUpItems: Record<
    string,
    RecursiveFormItem<TypeNames, Params, Meta>[]
  >;
  children?: ReactNode;
};
