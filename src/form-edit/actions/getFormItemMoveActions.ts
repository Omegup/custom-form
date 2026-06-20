import type { SetAutoFocus, ContextDom, MoveActions, MetaDom } from "./_deps";
import type { RecursiveTypedFormItem, ParamsDom } from "./_deps";
import type { Clone } from "./Clone.t";
import type { FlatFormItem } from "./flat-form.t";
import type { GetActionsArgs } from "./GetActionsArgs.t";
import type { SectionDom } from "./section.t";

import { makeActions } from "./_deps";
import { getFlatItemsRawActions } from "./getFlatItemsRawActions";
import { flatten } from "./flatten";

export const getFormItemMoveActions = <
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
  Ctx extends ContextDom,
  SectionConfig extends SectionDom,
  Meta extends MetaDom<{ index: number }>,
>(
  args: GetActionsArgs<TypeNames, Params, SetAutoFocus<Ctx>, SectionConfig>,
  clone: Clone<TypeNames, Params, SetAutoFocus<Ctx>, SectionConfig>,
) => {
  const { items } = args;
  const { actions, isDeleted } = getFlatItemsRawActions<
    TypeNames,
    Params,
    Ctx,
    SectionConfig
  >(args, clone);
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
