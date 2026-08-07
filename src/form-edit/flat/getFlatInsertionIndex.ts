/**
 * Flat index for inserting into a section column (add-item slot).
 *
 * Mirrors school recursive-edit-ui/FlatDnd list-node index, but skips
 * soft-deleted trailing items in the target columns — same rule as
 * `applyFlatFormItem`'s `justAfter` (school useDialog insert path), so a
 * new item never lands after deleted siblings at the bottom of a column.
 */
import type { MetaDom, ParamsDom, RecursiveFormItem } from "./_deps";

export const getFlatInsertionIndex = <
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
  Meta extends MetaDom<{ index: number; total: number }>,
>(
  sectionFlatIndex: number,
  columns: RecursiveFormItem<TypeNames, Params, Meta>[][],
  colIndex: number,
): number => {
  let lastLive: RecursiveFormItem<TypeNames, Params, Meta> | undefined;
  let lastLiveCol = -1;
  for (let c = 0; c <= colIndex; c++) {
    for (const child of columns[c] ?? []) {
      if (!child.header.deleted) {
        lastLive = child;
        lastLiveCol = c;
      }
    }
  }
  if (!lastLive) return sectionFlatIndex + colIndex + 1;
  return (
    lastLive.meta.index + lastLive.meta.total + (colIndex - lastLiveCol)
  );
};
