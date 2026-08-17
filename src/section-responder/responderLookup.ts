import type { MetaDom, ParamsDom, RecursiveFormItem } from "./_deps";
import { itemIdBase } from "./_deps";

/** Prefer the instance id, then the unsuffixed design id. */
export const oldById = <T>(
  bag: Record<string, T> | undefined,
  id: string,
): T | null => bag?.[id] ?? bag?.[itemIdBase(id)] ?? null;

/**
 * Follow-ups are keyed by the origin id used at review time (may include
 * a panel instance suffix). Match exact, base, or any key with the same
 * base — do **not** re-suffix follow-up ids (they already belong to that
 * origin instance; re-suffixing broke answer keys under panels).
 */
export const followUpsForOrigin = <
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
  Meta extends MetaDom,
>(
  followUpItems: Record<string, RecursiveFormItem<TypeNames, Params, Meta>[]>,
  originId: string,
): RecursiveFormItem<TypeNames, Params, Meta>[] => {
  const exact = followUpItems[originId];
  if (exact && exact.length) return exact;
  const base = itemIdBase(originId);
  const byBase = followUpItems[base];
  if (byBase && byBase.length) return byBase;
  for (const [key, items] of Object.entries(followUpItems)) {
    if (items.length && itemIdBase(key) === base) return items;
  }
  return [];
};
