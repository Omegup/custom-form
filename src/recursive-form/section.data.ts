import type { ContextDom, ParamsDom, SectionDom, SomeFormItem } from "../form/form.t"
import type { Recursive } from "../Recursive"
import type { AutoFocusCtx, Clone, GetActionsArgs } from "./edit-form"
import type { RecursiveEditManager, SectionEditArgs } from "./edit-form-tree"
import type { SectionWithItems } from "./form-tree"
import { flatten } from "./recursive.utils"
import { getSectionActions } from "./section.actions"

export type { SectionEditArgs } from "./edit-form-tree"

export const getSectionEdit = <
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
  Ctx extends ContextDom,
  SectionConfig extends SectionDom,
>(
  args: SectionEditArgs<TypeNames, Params, AutoFocusCtx<Ctx>, SectionConfig>,
  ctx: AutoFocusCtx<Ctx>,
): RecursiveEditManager<SomeFormItem<TypeNames, Params>> => {
  const { section, clone, actions, i, sections } = args
  const { autoFocused, setAutoFocus } = ctx
  const nodes: Recursive<SomeFormItem<TypeNames, Params>, null> = {
    children: section.items,
    index: section.index,
    sIndex: i,
    header: null,
    total: section.total,
  }
  const setNodes = (nodes: Recursive<SomeFormItem<TypeNames, Params>, null>) =>
    actions.setItems(
      sections
        .toSpliced(i, 1, { ...section, items: nodes.children } as SectionWithItems<TypeNames, Params, SectionConfig>)
        .flatMap(flatten<TypeNames, Params, SectionConfig>().section),
      actions.ctx,
    )

  return {
    autofocus: autoFocused(section.header.id),
    resetAutofocus: () => setAutoFocus(),
    actions: getSectionActions(actions, clone, section),
    nodes,
    setNodes,
    item: section.header,
  }
}
