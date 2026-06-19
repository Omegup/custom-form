import type { ContextDom, ParamsDom } from "../form/form.t"
import { makeActions } from "../move-actions/makeActions"
import type {  GetActionsArgs } from "./edit-form"
import type { FlattenFormItem, FlattenFormItems, RecursiveTypedFormItem, SectionDom } from "./form-tree"
import type { ActionsWithEdit, SetEditFormItem } from "./edit-form-tree"
import { getCommonActions } from "./common.actions"
import { flatten } from "./recursive.utils"
import type { SetAutoFocus } from "../move-actions/autofocus.t";

export type { ActionsWithEdit } from "./edit-form-tree"

export const getFormItemActions = <
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
  Ctx extends ContextDom,
  SectionConfig extends SectionDom,
>(
  args: GetActionsArgs<TypeNames, Params, SetAutoFocus<Ctx>, SectionConfig>,
  clone: (
    items: FlattenFormItems<TypeNames, Params, SectionConfig>,
  ) => FlattenFormItems<TypeNames, Params, SectionConfig>,
  setEditFormItem: SetEditFormItem<TypeNames, Params>,
) => {
  const { items, setItems, ctx } = args
  const { commonActions, isDeleted } = getCommonActions<TypeNames, Params, Ctx, SectionConfig>(
    args,
    clone,
  )
  const formItemActions = <K extends TypeNames>(
    q: RecursiveTypedFormItem<TypeNames, Params, K>,
  ): ActionsWithEdit => {
    const { index } = q
    const flat = flatten<TypeNames, Params, SectionConfig>()
    type Item = FlattenFormItem<TypeNames, Params, SectionConfig>
    return {
      ...makeActions(commonActions(flat.formItem(q), index), {
        edit: () => setEditFormItem(q),
        resetAutofocus: () => setItems(items, ctx.setAutoFocus()),
      }),
      ...(items.slice(0, index).filter((p: Item) => "section" in p && !p.section.deleted).length >
        1 ||
      items.slice(0, index).find((p: Item) => ("item" in p && !isDeleted(p.item)) || "end" in p)
        ? {}
        : { up: undefined }),
    }
  }
  return formItemActions
}
