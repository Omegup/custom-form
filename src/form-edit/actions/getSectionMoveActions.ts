import type { Clone, ContextDom, FlatFormItem } from "./_deps";
import type { GetActionsArgs, ParamsDom, SectionDom } from "./_deps";
import type { SectionWithItems, MoveActions, SetAutoFocus } from "./_deps";
import { makeActions } from "./_deps";
import { getFlatItemsRawActions } from "./getFlatItemsRawActions";
import { flatten } from "./flatten";

export const getSectionMoveActions = <
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
  Ctx extends ContextDom,
  SectionConfig extends SectionDom,
>(
  args: GetActionsArgs<TypeNames, Params, SetAutoFocus<Ctx>, SectionConfig>,
  clone: Clone<TypeNames, Params, SetAutoFocus<Ctx>, SectionConfig>,
  section: SectionWithItems<TypeNames, Params, SectionConfig>,
): MoveActions => {
  const { actions } = getFlatItemsRawActions<
    TypeNames,
    Params,
    Ctx,
    SectionConfig
  >(args, clone);
  return makeActions<
    FlatFormItem<TypeNames, Params, SectionConfig>,
    {},
    SetAutoFocus<Ctx>
  >(
    actions(
      flatten<TypeNames, Params, SectionConfig>().section(section),
      section.index,
      1,
    ),
    {},
    {
      next: (i, items) =>
        items.findIndex((_, idx) => idx > i && "section" in items[idx]),
      previous: (i, items) =>
        items.findLastIndex((_, idx) => idx < i && "section" in items[idx]),
    },
  );
};
