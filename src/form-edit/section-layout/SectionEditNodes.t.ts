import type { ParamsDom } from "../../form";
import type { MetaDom, RecursiveFormItem } from "../../recursive-form";

/** In-section edit tree root — null header, columns of form items. */
export type SectionEditNodes<
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
  Meta extends MetaDom<{ index: number; total: number; sIndex: number }>,
> = {
  meta: Meta["meta"];
  header: null;
  children: RecursiveFormItem<TypeNames, Params, Meta>[][];
};
