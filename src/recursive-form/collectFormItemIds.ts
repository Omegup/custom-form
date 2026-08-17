import type { ParamsDom } from "../form";
import type { MetaDom } from "./Recursive.t";
import type { RecursiveFormItem } from "./RecursiveFormItem.t";

/** Every form-item id in a column grid (including nested panel children). */
export const collectFormItemIds = <
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
  Meta extends MetaDom,
>(
  columns: RecursiveFormItem<TypeNames, Params, Meta>[][],
): string[] =>
  columns.flatMap((col) =>
    col.flatMap((item) => [
      item.header.id,
      ...collectFormItemIds(item.children),
    ]),
  );
