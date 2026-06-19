import type { ContextDom, ParamsDom } from "../form/form.t"
import type { MoveActions } from "../move-actions/MoveActions.t"
import { makeActions } from "../move-actions/makeActions"
import type { Clone, GetActionsArgs } from "./edit-form"
import type { FlattenFormItems, SectionDom, SectionWithItems } from "./form-tree"
import { getCommonActions } from "./common.actions"
import { flatten } from "./recursive.utils"
import type { SetAutoFocus } from "../move-actions/autofocus.t";

export const getSectionActions = <
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
  Ctx extends ContextDom,
  SectionConfig extends SectionDom,
>(
  args: GetActionsArgs<TypeNames, Params, SetAutoFocus<Ctx>, SectionConfig>,
  clone: Clone<TypeNames, Params, SetAutoFocus<Ctx>, SectionConfig>,
  section: SectionWithItems<TypeNames, Params, SectionConfig>,
): MoveActions => {
  const { commonActions } = getCommonActions<TypeNames, Params, Ctx, SectionConfig>(args, clone)
  return makeActions<
    FlattenFormItems<TypeNames, Params, SectionConfig>[number],
    {},
    SetAutoFocus<Ctx>
  >(
    commonActions(flatten<TypeNames, Params, SectionConfig>().section(section), section.index, 1),
    {},
    {
      next: (i, items) => items.findIndex((_, idx) => idx > i && "section" in items[idx]),
      previous: (i, items) => items.findLastIndex((_, idx) => idx < i && "section" in items[idx]),
    },
  )
}
