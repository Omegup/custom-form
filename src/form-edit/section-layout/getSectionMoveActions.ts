import type { ParamsDom, ContextDom, MetaDom, SectionDom } from "./_deps";
import type { MoveActions, Clone, SetAutoFocus } from "./_deps";
import type { FlatFormItem, GetActionsArgs } from "./_deps";
import type { SectionWithItems, SectionMetaDom } from "./SectionWithItems.t";

import { makeActions, getFlatRawActions } from "./_deps";
import { flatten } from "./flatten";

export const getSectionMoveActions = <
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
  Context extends SetAutoFocus<ContextDom>,
  SectionConfig extends SectionDom,
  SectionMeta extends SectionMetaDom<{ index: number }>,
  Meta extends MetaDom<{ index: number }>,
>(
  args: GetActionsArgs<TypeNames, Params, Context, SectionConfig>,
  clone: Clone<TypeNames, Params, Context, SectionConfig>,
  section: SectionWithItems<
    TypeNames,
    Params,
    SectionConfig,
    SectionMeta,
    Meta
  >,
): MoveActions => {
  const { actions } = getFlatRawActions(args, clone);
  return makeActions<FlatFormItem<TypeNames, Params, SectionConfig>, Context>(
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
