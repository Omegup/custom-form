/**
 * Build a RecursiveEditManager for one consolidated section.
 * Ported from school ts-packages/form-edit/section.data.ts.
 */
import type { ContextDom, ParamsDom } from "../../form";
import type { MetaDom } from "../../recursive-form";
import type { AutoFocus } from "../../move-actions/autofocus.t";
import type { SectionDom } from "../flat-raw-actions";
import type { RecursiveEditManager } from "./RecursiveEditManager.t";
import type { SectionEditArgs } from "./SectionEditArgs.t";
import type { SectionEditNodes } from "./SectionEditNodes.t";
import type { SectionMetaDom } from "./SectionWithItems.t";
import { flatten } from "./flatten";
import { getSectionMoveActions } from "./getSectionMoveActions";

export const getSectionEdit = <
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
  Context extends AutoFocus<ContextDom, unknown>,
  SectionConfig extends SectionDom,
  SectionMeta extends SectionMetaDom<{ index: number; total: number }>,
  Meta extends MetaDom<{ index: number; total: number; sIndex: number }>,
>(
  args: SectionEditArgs<
    TypeNames,
    Params,
    Context,
    SectionConfig,
    SectionMeta,
    Meta
  >,
  ctx: Context,
): RecursiveEditManager<TypeNames, Params, Meta, SectionConfig> => {
  const { section, clone, actions, i, sections } = args;
  const { autoFocused, setAutoFocus } = ctx;
  const nodes: SectionEditNodes<TypeNames, Params, Meta> = {
    meta: { index: section.meta.index, total: section.meta.total, sIndex: i },
    header: null,
    children: section.items,
  };
  const setNodes = (next: SectionEditNodes<TypeNames, Params, Meta>) =>
    actions.setItems(
      sections
        .toSpliced(i, 1, { ...section, items: next.children })
        .flatMap(flatten<TypeNames, Params, SectionConfig, Meta>().section),
      actions.ctx,
    );

  return {
    autofocus: autoFocused(section.header.id),
    resetAutofocus: () => setAutoFocus(),
    actions: getSectionMoveActions(actions, clone, section),
    nodes,
    setNodes,
    item: section.header,
  };
};
