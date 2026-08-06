/**
 * Save an edited or new form item into a flat edit list.
 * Ported from school form-edit-react/useDialog.tsx `setEditFormItemX`
 * (pure part only — no setItems / autofocus ctx).
 */
import type { MetaDom, ParamsDom, RecursiveFormItem, SomeFormItem } from "./_deps";
import { resizeColumns } from "./_deps";
import type { SIndexed } from "./consolidate";
import type { FlatFormItems, SectionDom } from "./flat-form.t";
import { flatten } from "./flatten";

/**
 * Flat span being edited. `index === -1` switches to the insert path:
 * the item is appended to section `sIndex` (`sIndex === -1` → first
 * non-deleted section).
 */
export type FlatEditSpan = SIndexed;

/** Flat index of the `sIndex`-th section marker (`-1` → first non-deleted). */
const sectionFlatIndex = <
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
  SectionConfig extends SectionDom,
>(
  items: FlatFormItems<TypeNames, Params, SectionConfig>,
  sIndex: number,
): number => {
  if (sIndex === -1)
    return items.findIndex((fi) => "section" in fi && !fi.section.deleted);
  let count = -1;
  for (let i = 0; i < items.length; i++) {
    const fi = items[i]!;
    if ("section" in fi && ++count === sIndex) return i;
  }
  return -1;
};

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

  const sectionIndex = sectionFlatIndex(items, editing.sIndex);
  const nextSectionOrMinus1 = items.findIndex(
    (fi, i) => i > sectionIndex && "section" in fi,
  );
  const nextSection =
    nextSectionOrMinus1 === -1 ? items.length : nextSectionOrMinus1;
  const justAfter = items.findLastIndex(
    (fi, i) =>
      i < nextSection &&
      ("section" in fi || ("item" in fi && !fi.item.deleted)),
  );
  return items.toSpliced(justAfter + 1, 0, ...list);
};
