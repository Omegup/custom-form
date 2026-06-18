import type { MoveActions } from "../move-actions/MoveActions"
import type { ContextDom, ParamsDom, SectionDom } from "../form/form.model"
import type { RecursiveFormItem, RecursiveTypedFormItem, SectionWithItems } from "./form-tree"
import type { AutoFocusCtx, Clone, GetActionsArgs } from "./edit-form"
import type { Recursive } from "../Recursive"

export type RecursiveEditManager<T> = {
  resetAutofocus: () => void
  autofocus: unknown
  item: { deleted: boolean; id: string }
  nodes: Recursive<T, null>
  actions: MoveActions
  setNodes: (nodes: Recursive<T, null>) => void
}

export type ActionsWithEdit = MoveActions & {
  edit: () => void
  resetAutofocus: () => void
}

export type EditFormItem<
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
> = RecursiveFormItem<TypeNames, Params> | null

export type SetEditFormItem<TypeNames extends string, Params extends ParamsDom<TypeNames>> = (
  x: EditFormItem<TypeNames, Params>,
) => void

export type TypedEditFormItem<
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
  K extends TypeNames,
> = RecursiveTypedFormItem<TypeNames, Params, K> | null

export type TypedSetEditFormItem<
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
  K extends TypeNames,
> = (x: TypedEditFormItem<TypeNames, Params, K>) => void

export type SectionEditArgs<
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
  Ctx extends ContextDom,
  SectionConfig extends SectionDom,
> = {
  clone: Clone<TypeNames, Params, AutoFocusCtx<Ctx>, SectionConfig>
  actions: GetActionsArgs<TypeNames, Params, AutoFocusCtx<Ctx>, SectionConfig>
  sections: SectionWithItems<TypeNames, Params, SectionConfig>[]
  section: SectionWithItems<TypeNames, Params, SectionConfig>
  i: number
}
