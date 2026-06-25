import type { ContextDom, FlatFormItem } from "./_deps";
import type { MetaDom, MoveActions, RecursiveTypedFormItem } from "./_deps";
import type { ParamsDom, SectionDom, SetAutoFocus } from "./_deps";

import { flatten } from "./_deps";
import type { Clone } from "./Clone.t";
import type { GetActionsArgs } from "./GetActionsArgs.t";
import { getFlatMoveActions } from "./getFlatMoveActions";

export const getFormItemMoveActions = <
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
  Context extends ContextDom,
  SectionConfig extends SectionDom,
  Meta extends MetaDom<{ index: number }>,
>(
  args: GetActionsArgs<TypeNames, Params, SetAutoFocus<Context>, SectionConfig>,
  clone: Clone<TypeNames, Params, SetAutoFocus<Context>, SectionConfig>,
  jump: boolean,
) => {
  const { items } = args;
  const { actions, isDeleted } = getFlatMoveActions(args, clone);
  const isIgnored = jump ? isDeleted : () => false;
  const formItemActions = <K extends TypeNames>(
    q: RecursiveTypedFormItem<TypeNames, Params, K, Meta>,
  ): MoveActions => {
    const { index } = q.meta;
    const flat = flatten<TypeNames, Params, SectionConfig, Meta>();
    type Item = FlatFormItem<TypeNames, Params, SectionConfig>;
    return {
      ...actions(flat.formItem(q), index, jump),
      ...(items
        .slice(0, index)
        .filter((p: Item) => "section" in p && !p.section.deleted).length > 1 ||
      items
        .slice(0, index)
        .find((p: Item) => ("item" in p && !isIgnored(p.item)) || "end" in p)
        ? {}
        : { up: undefined }),
    };
  };
  return formItemActions;
};
