import type { ContextDom, ParamsDom } from "./_deps";
import type { SectionDom } from "./section.t";
import type { FlatFormItem, FlatFormItems } from "./flat-form.t";

export type GetActionsArgs<
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
  Ctx extends ContextDom,
  SectionConfig extends SectionDom,
> = {
  sectionOfItem: Record<string, SectionConfig>;
  ctx: Ctx;
  setToRemove: (
    x: {
      rm: () => void;
      item: FlatFormItem<TypeNames, Params, SectionConfig>;
    } | null,
  ) => void;
  items: FlatFormItems<TypeNames, Params, SectionConfig>;
  setItems: (
    items: FlatFormItems<TypeNames, Params, SectionConfig>,
    ctx: Ctx,
  ) => void;
};
