import type { ReactNode } from "react";
import type {
  ExtraDom,
  ParamsDom,
  Response,
  SomeFormItem,
  VariantsDom,
} from "./_deps";
import type {
  AdditionalChanges,
  Addition,
  ReviewChrome,
  ReviewExtra,
  ReviewFormItemsEditorArgs,
  ReviewVariantState,
} from "./types";

export type ReviewItemExtra = ExtraDom &
  ReviewExtra & {
    getChild: (suffix: string) => ReactNode;
    impRef: null;
  };

export type ReviewLive<
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
  Variants extends VariantsDom,
> = {
  responses: Record<string, Response>;
  changes: AdditionalChanges<TypeNames, Params>;
  setChanges: (changes: AdditionalChanges<TypeNames, Params>) => void;
  setAddition: (addition: Addition | null) => void;
  setDeleteCommentId: (id: string | null) => void;
  lastPending: Date | null;
  variants: Record<ReviewVariantState, Variants>;
  renderFormItemsEditor: (
    args: ReviewFormItemsEditorArgs<TypeNames, Params>,
  ) => ReactNode;
  renderFormItem: (args: {
    formItem: SomeFormItem<TypeNames, Params>;
    variant: Variants;
    extra: ReviewItemExtra;
  }) => ReactNode;
};

export type ReviewWalk<
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
  Variants extends VariantsDom,
> = {
  chrome: ReviewChrome<TypeNames, Params>;
  live: ReviewLive<TypeNames, Params, Variants>;
  isAnswered: (id: string) => boolean;
};
