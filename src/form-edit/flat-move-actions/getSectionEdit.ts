/**
 * Section-level edit manager — school `ts-packages/form-edit/section.data.ts`
 * `getSectionEdit`. Bundles a consolidated section's move actions, autofocus,
 * and item grid for a `section-view` `renderEdit` implementation (e.g.
 * `ColumnsEdit`).
 *
 * Deviation from school: `setNodes` rewrites the flat list directly via
 * `flatten().section` + `toSpliced` at the section's own span (same pattern
 * as `section-edit/updateSectionInFlat`) instead of rebuilding the whole
 * flat list from a `sections` array — column count never changes here, only
 * item content/order within the section's existing columns.
 */
import type {
  AutoFocus,
  ContextDom,
  Indexed,
  MetaDom,
  ParamsDom,
  SectionDom,
  SectionMetaDom,
  SectionWithItems,
  SIndexed,
} from "./_deps";
import type { Clone } from "./Clone.t";
import type { GetActionsArgs } from "./GetActionsArgs.t";
import type { RecursiveEditManager } from "./RecursiveEditManager.t";

import { flatten } from "./_deps";
import { getSectionMoveActions } from "./getSectionMoveActions";

export const getSectionEdit = <
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
  Context extends ContextDom,
  SectionConfig extends SectionDom,
>(
  args: GetActionsArgs<
    TypeNames,
    Params,
    AutoFocus<Context, boolean>,
    SectionConfig
  >,
  clone: Clone<TypeNames, Params, AutoFocus<Context, boolean>, SectionConfig>,
  section: SectionWithItems<
    TypeNames,
    Params,
    SectionConfig,
    SectionMetaDom<Indexed>,
    MetaDom<SIndexed>
  >,
  /** This section's ordinal position among consolidated sections. */
  sIndex: number,
  jump: boolean,
): RecursiveEditManager<TypeNames, Params, SectionConfig> => {
  const { items, setItems, ctx } = args;
  return {
    item: section.header,
    autofocus: ctx.autoFocused(section.header.id),
    resetAutofocus: () => setItems(items, ctx.setAutoFocus()),
    actions: getSectionMoveActions(args, clone, section, jump),
    nodes: {
      index: section.meta.index,
      total: section.meta.total,
      sIndex,
      children: section.items,
    },
    setNodes: (nodes) => {
      const list = flatten<TypeNames, Params, SectionConfig, MetaDom<SIndexed>>().section(
        { header: section.header, items: nodes.children },
      );
      setItems(
        items.toSpliced(section.meta.index, section.meta.total, ...list),
        ctx,
      );
    },
  };
};
