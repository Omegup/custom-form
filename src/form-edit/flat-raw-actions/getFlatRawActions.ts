/**
 * Builds `RawActions` for flat form entries — the input shape for `makeActions`.
 *
 * Not to be confused with `MoveActions` (nullable UI click handlers).
 * Pipeline: getFlatRawActions → actions(slice, index) → RawActions → makeActions → MoveActions
 */
import type { ContextDom, ParamsDom, RawActions } from "./_deps";
import type { SetAutoFocus, SomeFormItem } from "./_deps";
import type { Clone } from "./Clone.t";
import type { FlatFormItem, FlatFormItems } from "./flat-form.t";
import type { GetActionsArgs } from "./GetActionsArgs.t";
import type { SectionDom } from "./section.t";

export const getFlatRawActions = <
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
  Context extends SetAutoFocus<ContextDom>,
  SectionConfig extends SectionDom,
>(
  args: GetActionsArgs<TypeNames, Params, Context, SectionConfig>,
  clone: Clone<TypeNames, Params, Context, SectionConfig>,
) => {
  const { sectionOfItem, setItems, setToRemove, ctx, items } = args;
  const isDeleted = (item: SomeFormItem<TypeNames, Params>) =>
    item.deleted || sectionOfItem[item.id]?.deleted;

  const actions = (
    subItems: FlatFormItems<TypeNames, Params, SectionConfig>,
    index: number,
    min?: number,
  ): RawActions<FlatFormItem<TypeNames, Params, SectionConfig>, Context> => {
    return {
      highlight: (x) => {
        const id =
          "item" in x ? x.item.id : "section" in x ? x.section.id : undefined;
        return { ctx: ctx.setAutoFocus(id) as Context, item: x };
      },
      clone: () => clone(subItems, ctx, items),
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
      setToRemove: (rm, item) => () => setToRemove({ rm, item }),
    };
  };
  return { actions, isDeleted };
};
