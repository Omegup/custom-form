/**
 * `AdditionalChanges` writes — comment unlock + follow-up form-item rows.
 * Overlay / +Follow-up chrome calls these; they do not render.
 */
import type { ParamsDom } from "./_deps";
import type { AdditionalChanges, ReviewFormItemEntry } from "./types";

export const withComment = <
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
>(
  changes: AdditionalChanges<TypeNames, Params>,
  originId: string,
  text: string,
): AdditionalChanges<TypeNames, Params> => ({
  ...changes,
  [originId]: { ...(changes[originId] ?? {}), comment: text },
});

export const withoutComment = <
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
>(
  changes: AdditionalChanges<TypeNames, Params>,
  originId: string,
): AdditionalChanges<TypeNames, Params> => {
  const { comment: _comment, ...rest } = changes[originId] ?? {};
  const next = { ...changes };
  if (Object.keys(rest).length) next[originId] = rest;
  else delete next[originId];
  return next;
};

export const withFormItemEntry = <
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
>(
  changes: AdditionalChanges<TypeNames, Params>,
  originId: string,
  entry: ReviewFormItemEntry<TypeNames, Params>,
  replaceIndex: number | null,
): AdditionalChanges<TypeNames, Params> => {
  const current = changes[originId] ?? {};
  const formItems = current.formItems ? [...current.formItems] : [];
  if (replaceIndex != null) formItems[replaceIndex] = entry;
  else formItems.push(entry);
  return { ...changes, [originId]: { ...current, formItems } };
};

export const withUnansweredFormItems = <
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
>(
  changes: AdditionalChanges<TypeNames, Params>,
  originId: string,
  nextUnanswered: ReviewFormItemEntry<TypeNames, Params>[],
  isAnswered: (id: string) => boolean,
): AdditionalChanges<TypeNames, Params> => {
  const current = changes[originId] ?? {};
  const answeredOnly = (current.formItems ?? []).filter(
    (e) => e.formItem != null && isAnswered(e.formItem.id),
  );
  return {
    ...changes,
    [originId]: {
      ...current,
      formItems: [...answeredOnly, ...nextUnanswered],
    },
  };
};
