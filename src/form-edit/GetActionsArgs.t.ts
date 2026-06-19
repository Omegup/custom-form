import type { ContextDom, ParamsDom } from "./_deps";
import type { FlatFormItems } from "./flat-form.t";
import type { SectionDom } from "./section.t";

export type GetActionsArgs<
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
  Ctx extends ContextDom,
  SectionConfig extends SectionDom,
> = {
  sectionOfItem: Record<string, SectionConfig>;
  ctx: Ctx;
  setToRemove: (x: { rm: () => void } | null) => void;
  items: FlatFormItems<TypeNames, Params, SectionConfig>;
  setItems: (
    items: FlatFormItems<TypeNames, Params, SectionConfig>,
    ctx: Ctx,
  ) => void;
};
