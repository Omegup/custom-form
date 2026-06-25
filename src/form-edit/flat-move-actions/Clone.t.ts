import type { ParamsDom, FlatFormItems, SectionDom } from "./_deps";

export type Clone<
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
  Ctx,
  SectionConfig extends SectionDom,
> = (
  subItems: FlatFormItems<TypeNames, Params, SectionConfig>,
  ctx: Ctx,
  allItems: FlatFormItems<TypeNames, Params, SectionConfig>,
) => FlatFormItems<TypeNames, Params, SectionConfig>;
