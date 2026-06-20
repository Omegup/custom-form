import type { FlatFormItem, FlatFormItems } from "./flat-form.t";
import type { SectionDom, SetAutoFocus, SomeFormItem } from "./_deps";
import type { ContextDom, ParamsDom, RawActions } from "./_deps";
import type { GetActionsArgs } from "./GetActionsArgs.t";
import type { Clone } from "./Clone.t";

export const getFlatItemsRawActions = <
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
  Ctx extends ContextDom,
  SectionConfig extends SectionDom,
>(
  args: GetActionsArgs<TypeNames, Params, SetAutoFocus<Ctx>, SectionConfig>,
  clone: Clone<TypeNames, Params, SetAutoFocus<Ctx>, SectionConfig>,
) => {
  const { sectionOfItem, setItems, setToRemove, ctx, items } = args;
  const isDeleted = (item: SomeFormItem<TypeNames, Params>) =>
    item.deleted || sectionOfItem[item.id]?.deleted;

  const actions = (
    subItems: FlatFormItems<TypeNames, Params, SectionConfig>,
    index: number,
    min?: number,
  ): RawActions<
    FlatFormItem<TypeNames, Params, SectionConfig>,
    SetAutoFocus<Ctx>
  > => {
    return {
      highlight: (x) => {
        const id =
          "item" in x ? x.item.id : "section" in x ? x.section.id : undefined;
        return { ctx: ctx.setAutoFocus(id), item: x };
      },
      clone: () => clone(subItems, ctx),
      index,
      ctx,
      min,
      total: subItems.length,
      items,
      setItems,
      isDeleted: (q) =>
        "section" in q
          ? q.section.deleted
          : "end" in q
            ? false
            : isDeleted(q.item),
      markAsDeleted: ({ ...item }, deleted) => {
        if ("section" in item) item.section = { ...item.section, deleted };
        else if ("item" in item) item.item = { ...item.item, deleted };
        return { ctx, item };
      },
      setToRemove: (rm) => () => setToRemove({ rm }),
    };
  };
  return { actions, isDeleted };
};
