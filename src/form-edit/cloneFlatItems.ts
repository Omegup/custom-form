import type { ParamsDom } from "./_deps";

import type { FlatFormItem, FlatFormItems } from "./flat-raw-actions";
import type { SectionDom } from "./flat-raw-actions";

import { cloneName } from "./_deps";

const cloneItemName = <T extends object>(
  allItems: T[],
  t: (name: string, n: string) => string,
) => {
  type V<K extends string> = T extends Record<K, unknown> ? T : never;
  const is = <K extends string>(k: K, x: T): x is V<K> => k in x;
  const getItems = <K extends string>(k: K): V<K>[K][] =>
    allItems.flatMap((x) => (is(k, x) ? [x[k]] : []));
  return <K extends string>(k: K, q: V<K>, name: (item: V<K>[K]) => string) =>
    cloneName<V<K>[K]>(q[k], getItems(k), name, t);
};

export const cloneFlatItems = <
  TypeNames extends string,
  Params extends ParamsDom<TypeNames, { name: string }>,
  SectionConfig extends SectionDom & { title: string },
>(
  subItems: FlatFormItems<TypeNames, Params, SectionConfig>,
  allItems: FlatFormItems<TypeNames, Params, SectionConfig>,
  t: (name: string, n: string) => string,
  random: () => string,
  mode: {rename: 'all' | 'first'},
): FlatFormItems<TypeNames, Params, SectionConfig> => {
  const clone = cloneItemName<FlatFormItem<TypeNames, Params, SectionConfig>>(
    allItems,
    t,
  );
  return subItems.map((q, i) =>
    "item" in q
      ? {
          item: {
            ...q.item,
            params: {
              ...q.item.params,
              name: mode.rename === 'first' && i > 0
                ? q.item.params.name
                : clone("item", q, (x) => x.params.name),
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
