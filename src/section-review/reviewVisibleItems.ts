import type { MetaDom, ParamsDom, RecursiveFormItem } from "./_deps";

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

/** Live rows, plus deleted rows that still have an answer. */
export const usefulForReview = (
  item: { header: { id: string; deleted: boolean } },
  isAnswered: (id: string) => boolean,
): boolean => !item.header.deleted || isAnswered(item.header.id);
