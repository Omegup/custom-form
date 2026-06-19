import type { ParamsDom } from "../form/form.t";
import type { FlatFormItems } from "./flat-form.t";
import type { SectionDom } from "./section.t";


export type Clone<
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
  Ctx,
  SectionConfig extends SectionDom,
> = (
  items: FlatFormItems<TypeNames, Params, SectionConfig>,
  ctx: Ctx,
) => FlatFormItems<TypeNames, Params, SectionConfig>
