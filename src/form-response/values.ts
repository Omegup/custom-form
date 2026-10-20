import type { ParamsDom, Response } from "./_deps";
import type { FormResponseDoc, FormResponseEntry } from "./types";

export const formResponseValues = <
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
>(
  doc: FormResponseDoc<TypeNames, Params>,
): Record<string, Response> =>
  Object.fromEntries(doc.responses.map((r) => [r.formItemId, r.response]));

/** Draft-or-prior answers for the current form keys. */
export const keyedResponses = (
  keys: readonly string[],
  draft: Record<string, Response>,
  prior: Record<string, Response>,
): Record<string, Response> =>
  Object.fromEntries(keys.map((k) => [k, draft[k] ?? prior[k]]));

export const toFormResponseEntries = (
  values: Record<string, Response>,
): FormResponseEntry[] =>
  Object.entries(values).map(([formItemId, response]) => ({
    formItemId,
    response,
  }));
