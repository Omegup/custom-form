/**
 * Flat index for inserting into a section column (add-item slot).
 * Mirrors school recursive-edit-ui/FlatDnd filterDeleted list-node index.
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
  const lastNonEmptyColumnIndex = columns
    .slice(0, colIndex + 1)
    .findLastIndex((column) => column.length > 0);
  if (lastNonEmptyColumnIndex === -1) return sectionFlatIndex + colIndex + 1;
  const lastChild = columns[lastNonEmptyColumnIndex].at(-1)!;
  return (
    lastChild.meta.index +
    lastChild.meta.total +
    (colIndex - lastNonEmptyColumnIndex)
  );
};
