import type { ContextDom, ParamsDom } from "../form/form.t";
import type { FlatFormItem, FlatFormItems } from "./flat-form.t";
import type { SectionDom } from "./section.t";

export type GetActionsArgs<
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
  Ctx extends ContextDom,
  SectionConfig extends SectionDom,
> = {
  sectionOfItem: Record<string, SectionConfig>
  ctx: Ctx
  setToRemove: (x: { rm: () => void } | null) => void
  items: FlatFormItems<TypeNames, Params, SectionConfig>
  setItems: (items: FlatFormItems<TypeNames, Params, SectionConfig>, ctx: Ctx) => void
}

export type Clone<
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
  Ctx,
  SectionConfig extends SectionDom,
> = (
  items: FlatFormItems<TypeNames, Params, SectionConfig>,
  ctx: Ctx,
) => FlatFormItems<TypeNames, Params, SectionConfig>

export type { FlatFormItem as FlattenFormItem, FlatFormItems as FlattenFormItems };
