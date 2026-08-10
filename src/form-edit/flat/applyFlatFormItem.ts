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

  // Append after the last *top-level* item's full span (including soft-deleted
  // panels). Same end index as FlatDnd list nodes (`index + total`).
  // School's flat `justAfter` (`!item.deleted`) can nest inside a deleted
  // panel because its children stay live; column-add never does that because
  // the slot index already skips the whole subtree via meta.total.
  const section = consolidateSections(items).find(
    (s) => s.meta.index === sectionIndex,
  );
  const lastTop = section?.items.flatMap((col) => col).at(-1);
  const insertAt = lastTop
    ? lastTop.meta.index + lastTop.meta.total
    : sectionIndex + 1;
  return items.toSpliced(insertAt, 0, ...list);
};
