import type { SetAutoFocus, ContextDom, MoveActions, MetaDom } from "./_deps";
import type { RecursiveTypedFormItem, ParamsDom } from "./_deps";
import type { Clone, FlatFormItem, GetActionsArgs, SectionDom } from "./_deps";

import { getFlatRawActions, makeActions } from "./_deps";
import { flatten } from "./flatten";

export const getFormItemMoveActions = <
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
  Context extends SetAutoFocus<ContextDom>,
  SectionConfig extends SectionDom,
  Meta extends MetaDom<{ index: number }>,
>(
  args: GetActionsArgs<TypeNames, Params, Context, SectionConfig>,
  clone: Clone<TypeNames, Params, Context, SectionConfig>,
) => {
  const { items } = args;
  const { actions, isDeleted } = getFlatRawActions(args, clone);
  const formItemActions = <K extends TypeNames>(
    q: RecursiveTypedFormItem<TypeNames, Params, K, Meta>,
  ): MoveActions => {
    const { index } = q.meta;
    const flat = flatten<TypeNames, Params, SectionConfig, Meta>();
    type Item = FlatFormItem<TypeNames, Params, SectionConfig>;
    return {
      ...makeActions(actions(flat.formItem(q), index)),
      ...(items
        .slice(0, index)
        .filter((p: Item) => "section" in p && !p.section.deleted).length > 1 ||
      items
        .slice(0, index)
        .find((p: Item) => ("item" in p && !isDeleted(p.item)) || "end" in p)
        ? {}
        : { up: undefined }),
    };
  };
  return formItemActions;
};
