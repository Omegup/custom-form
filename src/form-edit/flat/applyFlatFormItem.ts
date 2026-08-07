/**
 * Save an edited or new form item into a flat edit list.
 * Ported from school form-edit-react/useDialog.tsx `setEditFormItemX`
 * (pure part only — no setItems / autofocus ctx).
 */
import type { MetaDom, ParamsDom, RecursiveFormItem, SomeFormItem } from "./_deps";
import { resizeColumns } from "./_deps";
import { consolidateSections, type SIndexed } from "./consolidate";
import type { FlatFormItems, SectionDom } from "./flat-form.t";
import { flatten } from "./flatten";

/**
 * Flat span being edited. `index === -1` switches to the insert path:
 * the item is appended to section `sIndex` (`sIndex === -1` → first
 * non-deleted section).
 *
 * When set (side-menu section picker), `sIndex` is the section marker's
 * **flat** index — school `SectionWithItems.index` / `selectSection`
 * `value: p.index` — not the section ordinal.
 */
export type FlatEditSpan = SIndexed;

export const applyFlatFormItem = <
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
  SectionConfig extends SectionDom,
>(
  items: FlatFormItems<TypeNames, Params, SectionConfig>,
  editing: FlatEditSpan,
  item: {
    header: SomeFormItem<TypeNames, Params>;
    children: RecursiveFormItem<TypeNames, Params, MetaDom<SIndexed>>[][];
  },
  cols: number,
): FlatFormItems<TypeNames, Params, SectionConfig> => {
  const children = resizeColumns(cols, item.children);
  const list = flatten<
    TypeNames,
    Params,
    SectionConfig,
    MetaDom<SIndexed>
  >().formItem({ header: item.header, children, meta: editing });

  if (editing.index !== -1)
    return items.toSpliced(editing.index, editing.total, ...list);

  // School useDialog `setEditFormItemX` insert path:
  // sIndex is already a flat section index; -1 → first non-deleted section.
  const sectionIndex =
    editing.sIndex === -1
      ? items.findIndex((fi) => "section" in fi && !fi.section.deleted)
      : editing.sIndex;

  // Append after the last *top-level* live item's full span — not after the
  // last non-deleted flat entry. School's `justAfter` only checks
  // `!item.deleted`, so live children nested under a soft-deleted panel still
  // match and the insert lands *inside* that panel (before its closing `end`).
  // Using consolidate meta.total skips the whole deleted panel subtree.
  const section = consolidateSections(items).find(
    (s) => s.meta.index === sectionIndex,
  );
  const lastLive = section?.items
    .flatMap((col) => col)
    .filter((i) => !i.header.deleted)
    .at(-1);
  const insertAt = lastLive
    ? lastLive.meta.index + lastLive.meta.total
    : sectionIndex + 1;
  return items.toSpliced(insertAt, 0, ...list);
};
