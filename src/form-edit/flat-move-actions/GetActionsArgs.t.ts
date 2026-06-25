import type { SectionDom, ContextDom, ParamsDom } from "./_deps";
import type { FlatFormItem, FlatFormItems } from "./_deps";

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
