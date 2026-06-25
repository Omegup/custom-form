import type { ParamsDom, ContextDom, MetaDom, SectionDom } from "./_deps";
import type { MoveActions, SetAutoFocus } from "./_deps";
import type { SectionWithItems, SectionMetaDom } from "./_deps";
import type { Clone } from "./Clone.t";
import type { GetActionsArgs } from "./GetActionsArgs.t";

import { flatten } from "./_deps";
import { getFlatMoveActions } from "./getFlatMoveActions";

export const getSectionMoveActions = <
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
  Context extends ContextDom,
  SectionConfig extends SectionDom,
  SectionMeta extends SectionMetaDom<{ index: number }>,
  Meta extends MetaDom<{ index: number }>,
>(
  args: GetActionsArgs<TypeNames, Params, SetAutoFocus<Context>, SectionConfig>,
  clone: Clone<TypeNames, Params, SetAutoFocus<Context>, SectionConfig>,
  section: SectionWithItems<
    TypeNames,
    Params,
    SectionConfig,
    SectionMeta,
    Meta
  >,
  jump: boolean,
): MoveActions => {
  const { actions } = getFlatMoveActions(args, clone);
  return actions(
    flatten<TypeNames, Params, SectionConfig, Meta>().section(section),
    section.meta.index,
    jump,
    {
      next: (i, items) =>
        items.findIndex((_, idx) => idx > i && "section" in items[idx]),
      previous: (i, items) =>
        items.findLastIndex((_, idx) => idx < i && "section" in items[idx]),
    },
    1,
  );
};
