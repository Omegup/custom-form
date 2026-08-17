import type { ReactNode, Ref } from "react";
import type {
  ExtraDom,
  MetaDom,
  ParamsDom,
  RecursiveFormItem,
  Response,
  SomeFormItem,
  StrictViewerMethods,
  VariantsDom,
} from "./_deps";
import type {
  ResponderAdditionalChanges,
  ResponderExtra,
  ResponderState,
  SectionResponderChrome,
} from "./types";

export type FillChrome = Pick<
  SectionResponderChrome,
  | "renderItemShell"
  | "renderClearIcon"
  | "renderAppendix"
  | "renderFollowUpGroup"
>;

export type FillItemExtra = ExtraDom &
  ResponderExtra & {
    getChild: (suffix: string) => ReactNode;
    impRef: Ref<StrictViewerMethods> | null;
  };

export type FillLive<
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
  Variants extends VariantsDom,
  Meta extends MetaDom,
> = {
  responses: Record<string, Response>;
  setResponse: (id: string, response?: Response) => void;
  getError: (id: string) => string | null;
  old: {
    values: Record<string, Response>;
    changes: ResponderAdditionalChanges;
  } | null;
  variants: Record<ResponderState, Variants>;
  followUpItems: Record<
    string,
    RecursiveFormItem<TypeNames, Params, Meta>[]
  >;
  validators: Record<string, StrictViewerMethods | null>;
  renderFormItem: (args: {
    formItem: SomeFormItem<TypeNames, Params>;
    variant: Variants;
    extra: FillItemExtra;
  }) => ReactNode;
};

export type FillWalk<
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
  Variants extends VariantsDom,
  Meta extends MetaDom,
> = {
  chrome: FillChrome;
  live: FillLive<TypeNames, Params, Variants, Meta>;
};
