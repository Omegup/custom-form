/**
 * Builds `RawActions` for flat form entries — the input shape for `makeActions`.
 *
 * Not to be confused with `MoveActions` (nullable UI click handlers).
 * Pipeline: getFlatRawActions → actions(slice, index) → RawActions → makeActions → MoveActions
 */
import type { FlatFormItem, NextPrevious } from "./_deps";
import type { ContextDom, ParamsDom } from "./_deps";
import type { SetAutoFocus, SomeFormItem } from "./_deps";
import type { FlatFormItems, SectionDom } from "./_deps";
import type { Clone } from "./Clone.t";
import type { GetActionsArgs } from "./GetActionsArgs.t";

import { makeActions } from "./_deps";

export const getFlatMoveActions = <
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
  Context extends ContextDom,
  SectionConfig extends SectionDom,
>(
  args: GetActionsArgs<TypeNames, Params, SetAutoFocus<Context>, SectionConfig>,
  clone: Clone<TypeNames, Params, SetAutoFocus<Context>, SectionConfig>,
) => {
  const { sectionOfItem, setItems, setToRemove, ctx, items } = args;
  const isDeleted = (item: SomeFormItem<TypeNames, Params>) =>
    item.deleted || sectionOfItem[item.id]?.deleted;

  const actions = (
    subItems: FlatFormItems<TypeNames, Params, SectionConfig>,
    index: number,
    jump: boolean,
    nextPrevious?: NextPrevious<FlatFormItem<TypeNames, Params, SectionConfig>>,
    min?: number,
  ) =>
    makeActions(
      {
        jump,
        highlight: (x) => {
          const id =
            "item" in x ? x.item.id : "section" in x ? x.section.id : undefined;
          return { ctx: ctx.setAutoFocus(id), item: x };
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
      },
      nextPrevious,
    );

  return { actions, isDeleted };
};
