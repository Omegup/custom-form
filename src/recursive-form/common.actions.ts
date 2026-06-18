import type { ContextDom, ParamsDom, SectionDom, SomeFormItem } from "../form/form.model"
import type { MakeActions } from "../move-actions/MakeActions"
import type { AutoFocusCtx, Clone, GetActionsArgs } from "./edit-form"
import type { FlattenFormItem, FlattenFormItems } from "./form-tree"

export type { AutoFocusCtx, Clone, GetActionsArgs }

export const clone = <
  TypeNames extends string,
  Params extends ParamsDom<TypeNames, { name: string }>,
  SectionConfig extends SectionDom & { title: string },
>(
  formItems: FlattenFormItems<TypeNames, Params, SectionConfig>,
  t: (x: "copy") => string,
  random: () => string,
): FlattenFormItems<TypeNames, Params, SectionConfig> =>
  formItems.map(q =>
    "item" in q
      ? {
          item: {
            ...q.item,
            params: {
              ...q.item.params,
              name: `${q.item.params.name} (${t("copy")})`,
            },
            id: random(),
          },
          n: q.n,
        }
      : "section" in q
        ? {
            section: {
              ...q.section,
              title: `${q.section.title} (${t("copy")})`,
              id: random(),
            },
          }
        : q,
  )

export const getCommonActions = <
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
  Ctx extends ContextDom,
  SectionConfig extends SectionDom,
>(
  args: GetActionsArgs<TypeNames, Params, AutoFocusCtx<Ctx>, SectionConfig>,
  clone: Clone<TypeNames, Params, AutoFocusCtx<Ctx>, SectionConfig>,
) => {
  const { sectionOfItem, setItems, setToRemove, ctx, items } = args
  const isDeleted = (item: SomeFormItem<TypeNames, Params>) =>
    item.deleted || sectionOfItem[item.id]?.deleted

  const commonActions = (
    subItems: FlattenFormItems<TypeNames, Params, SectionConfig>,
    index: number,
    min?: number,
  ): MakeActions<FlattenFormItem<TypeNames, Params, SectionConfig>, AutoFocusCtx<Ctx>> => {
    return {
      highlight: x => {
        const id = "item" in x ? x.item.id : "section" in x ? x.section.id : undefined
        return { ctx: ctx.setAutoFocus(id), item: x }
      },
      clone: () => clone(subItems, ctx),
      index,
      ctx,
      min,
      total: subItems.length,
      items,
      setItems,
      isDeleted: q =>
        "section" in q ? q.section.deleted : "end" in q ? false : isDeleted(q.item),
      markAsDeleted: ({ ...item }, deleted) => {
        if ("section" in item) item.section = { ...item.section, deleted }
        else if ("item" in item) item.item = { ...item.item, deleted }
        return { ctx, item }
      },
      setToRemove: rm => () => setToRemove({ rm }),
    }
  }
  return { commonActions, isDeleted }
}
