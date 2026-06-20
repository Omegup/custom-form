import type { ParamsDom, ContextDom, MetaDom } from "./_deps";
import type { MoveActions, SetAutoFocus } from "./_deps";
import type { Clone } from "./Clone.t";
import type { FlatFormItem } from "./flat-form.t";
import type { GetActionsArgs } from "./GetActionsArgs.t";
import type { SectionDom, SectionWithItems } from "./section.t";
import type { SectionMetaDom } from "./section.t";

import { makeActions } from "./_deps";
import { getFlatItemsRawActions } from "./getFlatItemsRawActions";
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
