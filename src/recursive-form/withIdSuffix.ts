import type { ParamsDom } from "../form";
import type { MetaDom } from "./Recursive.t";
import type { RecursiveFormItem } from "./RecursiveFormItem.t";

export const withIdSuffix = <
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
  Meta extends MetaDom,
>(
  item: RecursiveFormItem<TypeNames, Params, Meta>,
  idSuffix: string,
): RecursiveFormItem<TypeNames, Params, Meta> =>
  idSuffix
    ? { ...item, header: { ...item.header, id: item.header.id + idSuffix } }
    : item;
