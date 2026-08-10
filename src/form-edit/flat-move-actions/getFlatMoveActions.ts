/**
 * Builds `RawActions` for flat form entries — the input shape for `makeActions`.
 *
 * Not to be confused with `MoveActions` (nullable UI click handlers).
 * Pipeline: getFlatRawActions → actions(slice, index) → RawActions → makeActions → MoveActions
 */
import type { FlatFormItem, MetaDom, NextPrevious, RecursiveFormItem } from "./_deps";
import type { ContextDom, ParamsDom } from "./_deps";
import type { SetAutoFocus } from "./_deps";
import type { FlatFormItems, SectionDom } from "./_deps";
import type { Clone } from "./Clone.t";
import type { GetActionsArgs } from "./GetActionsArgs.t";

import { consolidateSections, type SIndexed } from "../flat/consolidate";
import { makeActions } from "./_deps";

const markSpan = <T>(items: readonly T[], index: number, total: number, into: Set<T>) => {
  for (let i = index; i < index + total && i < items.length; i++) into.add(items[i]!);
};

/**
 * Flat entries under a soft-deleted self or ancestor (section *or* item/panel).
 *
 * School only checks `item.deleted || section.deleted` — a soft-deleted
 * panel's children stay `deleted: false`, so move `jump` stops on the first
 * live child instead of skipping the whole panel. Reuses `consolidateSections`
 * (already tracks each node's full flat span via `meta.total`) to mark every
 * flat entry — header, children, `end` markers — under such an ancestor.
 */
const getDeletedFlatEntries = <
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
  SectionConfig extends SectionDom,
>(
  items: FlatFormItems<TypeNames, Params, SectionConfig>,
): Set<FlatFormItem<TypeNames, Params, SectionConfig>> => {
  const deleted = new Set<FlatFormItem<TypeNames, Params, SectionConfig>>();
  const walk = (
    columns: RecursiveFormItem<TypeNames, Params, MetaDom<SIndexed>>[][],
    parentDeleted: boolean,
  ) => {
    for (const col of columns)
      for (const node of col) {
        const nodeDeleted = parentDeleted || node.header.deleted;
        if (nodeDeleted) markSpan(items, node.meta.index, node.meta.total, deleted);
        else walk(node.children, false);
      }
  };
  for (const section of consolidateSections(items)) {
    const sectionDeleted = section.header.deleted;
    if (sectionDeleted)
      markSpan(items, section.meta.index, section.meta.total, deleted);
    else walk(section.items, false);
  }
  return deleted;
};

export const getFlatMoveActions = <
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
  Context extends ContextDom,
  SectionConfig extends SectionDom,
>(
  args: GetActionsArgs<TypeNames, Params, SetAutoFocus<Context>, SectionConfig>,
  clone: Clone<TypeNames, Params, SetAutoFocus<Context>, SectionConfig>,
) => {
  const { setItems, setToRemove, ctx, items } = args;
  const deletedEntries = getDeletedFlatEntries(items);
  const isDeleted = (q: FlatFormItem<TypeNames, Params, SectionConfig>) =>
    deletedEntries.has(q);

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
        isDeleted,
        markAsDeleted: ({ ...item }, deletedFlag) => {
          if ("section" in item)
            item.section = { ...item.section, deleted: deletedFlag };
          else if ("item" in item)
            item.item = { ...item.item, deleted: deletedFlag };
          return { ctx, item };
        },
        setToRemove: (rm, item) => () => setToRemove({ rm, item }),
      },
      nextPrevious,
    );

  return { actions, isDeleted };
};
