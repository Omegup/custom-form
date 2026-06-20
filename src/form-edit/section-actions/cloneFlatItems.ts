import type { ParamsDom } from "./_deps";
import type { FlatFormItem, FlatFormItems, SectionDom } from "./_deps";

import { cloneName } from "./_deps";

const cloneItemName = <T extends object>(
  items: T[],
  t: (name: string, n: string) => string,
) => {
  type V<K extends string> = T extends Record<K, unknown> ? T : never;
  const is = <K extends string>(k: K, x: T): x is V<K> => k in x;
  const getItems = <K extends string>(k: K): V<K>[K][] =>
    items.flatMap((x) => (is(k, x) ? [x[k]] : []));
  return <K extends string>(k: K, q: V<K>, name: (item: V<K>[K]) => string) =>
    cloneName<V<K>[K]>(q[k], getItems(k), name, t);
};

export const cloneFlatItems = <
  TypeNames extends string,
  Params extends ParamsDom<TypeNames, { name: string }>,
  SectionConfig extends SectionDom & { title: string },
>(
  formItems: FlatFormItems<TypeNames, Params, SectionConfig>,
  t: (name: string, n: string) => string,
  random: () => string,
): FlatFormItems<TypeNames, Params, SectionConfig> => {
  const clone = cloneItemName<FlatFormItem<TypeNames, Params, SectionConfig>>(
    formItems,
    t,
  );
  return formItems.map((q) =>
    "item" in q
      ? {
          item: {
            ...q.item,
            params: {
              ...q.item.params,
              name: clone("item", q, (x) => x.params.name),
            },
            id: random(),
          },
          n: q.n,
        }
      : "section" in q
        ? {
            section: {
              ...q.section,
              title: clone("section", q, (x) => x.title),
              id: random(),
            },
          }
        : q,
  );
};
