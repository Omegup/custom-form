import { escapeRegExp } from "lodash-es";

export const cloneName = <T>(
  item: T,
  items: readonly T[],
  name: (item: T) => string,
  t: (name: string, n: string) => string,
) => {
  const r = Math.random().toString(36).substring(2, 15);
  const pattern = new RegExp(
    escapeRegExp(t(name(item), r)).replace(r, "( \\d+)?"),
    "g",
  );
  return t(
    name(item),
    items
      .flatMap((x) => [...name(x).matchAll(pattern)])
      .map((x) => ` ${+(x[1] || 1) + 1}`)
      .reduce((a, b) => ((+b || 0) > (+a || 0) ? b : a), ""),
  );
};
