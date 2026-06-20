import type { ParamsDom } from "../form";
import type { MetaDom } from "./Recursive.t";
import type { RecursiveFormItem } from "./RecursiveFormItem.t";

/** Resize a column slot grid — append empty slots or merge trailing ones. */
export const resizeColumns = <
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
  Meta extends MetaDom,
>(
  cols: number,
  source: RecursiveFormItem<TypeNames, Params, Meta>[][],
): RecursiveFormItem<TypeNames, Params, Meta>[][] => {
  const items = source.slice();
  const diff = cols - items.length;
  if (diff > 0) items.push(...Array.from({ length: diff }, () => []));
  if (diff < 0)
    items.splice(cols - 1, 1 - diff, items.slice(cols - 1).flat());
  return items;
};
