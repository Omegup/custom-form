import { escapeRegExp } from "lodash-es";

export const cloneName = (name: string, names: readonly string[], t: (name: string, n: string) => string) => {
    const r = Math.random().toString(36).substring(2, 15);
    const pattern = new RegExp(escapeRegExp(t(name, r)).replace(r, '( \\d+)?'), 'g');
    return t(
      name,
      names
        .flatMap((x) => [...x.matchAll(pattern)])
        .map((x) => ` ${+(x[1] || 1) + 1}`)
        .reduce((a, b) => ((+b || 0) > (+a || 0) ? b : a), ""),
    )
  }