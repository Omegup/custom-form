import type { ContextDom, ParamsDom, SomeFormItem } from "../form/form.t"
import type { AutoFocus } from "../move-actions/autofocus.t";
import type { Recursive } from "../Recursive.t"
import type { RecursiveEditManager, SectionEditArgs } from "./edit-form-tree.t"
import type { SectionDom, SectionWithItems } from "./section.t"
import { flatten } from "./actions/flatten"
import { getSectionMoveActions } from "./actions/getSectionMoveActions"

export const getSectionEdit = <
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
  Ctx extends ContextDom,
  SectionConfig extends SectionDom,
>(
  args: SectionEditArgs<TypeNames, Params, AutoFocus<Ctx, unknown>, SectionConfig>,
  ctx: AutoFocus<Ctx, unknown>,
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
    actions: getSectionMoveActions(actions, clone, section),
    nodes,
    setNodes,
    item: section.header,
  }
}
