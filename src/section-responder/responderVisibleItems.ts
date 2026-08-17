import type { MetaDom, ParamsDom, RecursiveFormItem, Response } from "./_deps";

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

/** Live rows, plus deleted rows that still have answer data. */
export const usefulForFill = (
  item: { header: { id: string; deleted: boolean } },
  responses: Record<string, Response>,
): boolean => {
  if (!item.header.deleted) return true;
  const res = responses[item.header.id];
  return res != null && Object.keys(res.data).length > 0;
};
