import type { AdditionalChanges, ParamsDom } from "./_deps";

/** Drop teacher unlock remarks — Send consumes them (fields lock again). */
export const withoutUnlockComments = <
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
>(
  changes: AdditionalChanges<TypeNames, Params>,
): AdditionalChanges<TypeNames, Params> => {
  const next: AdditionalChanges<TypeNames, Params> = {};
  for (const [id, entry] of Object.entries(changes)) {
    if (entry.comment == null) {
      next[id] = entry;
      continue;
    }
    const { comment: _comment, ...rest } = entry;
    if (Object.keys(rest).length) next[id] = rest;
  }
  return next;
};

/** Stamp `history` for answered ids so Review can highlight this round. */
export const stampAnswerHistory = <
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
>(
  prior: AdditionalChanges<TypeNames, Params>,
  answeredIds: Iterable<string>,
  sendDate: Date,
): AdditionalChanges<TypeNames, Params> => {
  const next = withoutUnlockComments(prior);
  for (const id of answeredIds) {
    const cur = next[id] ?? {};
    next[id] = {
      ...cur,
      history: [...(cur.history ?? []), { date: sendDate }],
    };
  }
  return next;
};

/** Remark-only map for fill `old.changes` (structural `ResponderAdditionalChanges`). */
export const remarkOnlyChanges = <
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
>(
  changes: AdditionalChanges<TypeNames, Params>,
): Record<string, { comment?: string }> => {
  const next: Record<string, { comment?: string }> = {};
  for (const [id, entry] of Object.entries(changes)) {
    if (entry.comment != null) next[id] = { comment: entry.comment };
  }
  return next;
};
