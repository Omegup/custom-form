import type { ContextDom, ParamsDom, SectionDom } from "../form/form.t"
import type { FlattenFormItem, FlattenFormItems } from "./form-tree"

export type GetActionsArgs<
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
  Ctx extends ContextDom,
  SectionConfig extends SectionDom,
> = {
  sectionOfItem: Record<string, SectionConfig>
  ctx: Ctx
  setToRemove: (x: { rm: () => void } | null) => void
  items: FlattenFormItems<TypeNames, Params, SectionConfig>
  setItems: (items: FlattenFormItems<TypeNames, Params, SectionConfig>, ctx: Ctx) => void
}

export type Clone<
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
  Ctx,
  SectionConfig extends SectionDom,
> = (
  items: FlattenFormItems<TypeNames, Params, SectionConfig>,
  ctx: Ctx,
) => FlattenFormItems<TypeNames, Params, SectionConfig>

export type { FlattenFormItem, FlattenFormItems }
