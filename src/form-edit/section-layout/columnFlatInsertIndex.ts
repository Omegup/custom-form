/**
 * Flat index for inserting into a section column (add-item slot).
 * Mirrors school recursive-edit-ui/FlatDnd filterDeleted list-node index.
 */
import type { ParamsDom } from "../../form";
import type { MetaDom, RecursiveFormItem } from "../../recursive-form";

export const columnFlatInsertIndex = <
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
  Meta extends MetaDom<{ index: number; total: number }>,
>(
  sectionFlatIndex: number,
  columns: RecursiveFormItem<TypeNames, Params, Meta>[][],
  colIndex: number,
): number => {
  let lastIndex = sectionFlatIndex;
  for (let c = 0; c <= colIndex; c++) {
    const column = columns[c] ?? [];
    const lastChild = column.at(-1);
    lastIndex = lastChild
      ? lastChild.meta.index + lastChild.meta.total
      : lastIndex + 1;
  }
  return lastIndex;
};
