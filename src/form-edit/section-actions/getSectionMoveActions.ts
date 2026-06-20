import type { ParamsDom, ContextDom, MetaDom, SectionDom } from "./_deps";
import type { MoveActions, SetAutoFocus, Clone } from "./_deps";
import type { FlatFormItem, GetActionsArgs } from "./_deps";
import type { SectionWithItems, SectionMetaDom } from "./SectionWithItems.t";

import { makeActions, getFlatItemsRawActions } from "./_deps";
import { flatten } from "./flatten";

export const getSectionMoveActions = <
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
  Ctx extends ContextDom,
  SectionConfig extends SectionDom,
  SectionMeta extends SectionMetaDom<{ index: number }>,
  Meta extends MetaDom<{ index: number }>,
>(
  args: GetActionsArgs<TypeNames, Params, SetAutoFocus<Ctx>, SectionConfig>,
  clone: Clone<TypeNames, Params, SetAutoFocus<Ctx>, SectionConfig>,
  section: SectionWithItems<
    TypeNames,
    Params,
    SectionConfig,
    SectionMeta,
    Meta
  >,
): MoveActions => {
  const { actions } = getFlatItemsRawActions<
    TypeNames,
    Params,
    Ctx,
    SectionConfig
  >(args, clone);
  return makeActions<
    FlatFormItem<TypeNames, Params, SectionConfig>,
    SetAutoFocus<Ctx>
  >(
    actions(
      flatten<TypeNames, Params, SectionConfig, Meta>().section(section),
      section.meta.index,
      1,
    ),
    {
      next: (i, items) =>
        items.findIndex((_, idx) => idx > i && "section" in items[idx]),
      previous: (i, items) =>
        items.findLastIndex((_, idx) => idx < i && "section" in items[idx]),
    },
  );
};
