import type { AdditionalChanges, ParamsDom, Response } from "./_deps";
import { emptyResponse } from "./_deps";
import { stampAnswerHistory } from "./changes";
import type { FeedbackStatus, FormResponseDoc } from "./types";
import { formResponseValues, toFormResponseEntries } from "./values";

export const canSend = (doc: { status: FeedbackStatus } | null): boolean =>
  !doc || doc.status === "changesRequested";

export type BuildSendArgs<
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
> = {
  doc: FormResponseDoc<TypeNames, Params> | null;
  draft: Record<string, Response>;
  keys: string[];
  updated: Record<string, Response>;
  designIds: string[];
  now: Date;
};

export const buildSend = <
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
>({
  doc,
  draft,
  keys,
  updated,
  designIds,
  now,
}: BuildSendArgs<TypeNames, Params>): FormResponseDoc<TypeNames, Params> => {
  const prior = doc ? formResponseValues(doc) : {};
  const nextValues = { ...prior, ...updated };
  const roundIds = [...new Set([...keys, ...designIds])];
  for (const id of roundIds) {
    if (nextValues[id] == null) {
      nextValues[id] = draft[id] ?? prior[id] ?? emptyResponse();
    }
  }

  let nextChanges;
  if (!doc) {
    const emptyChanges: AdditionalChanges<TypeNames, Params> = {};
    nextChanges = stampAnswerHistory(emptyChanges, roundIds, now);
  } else {
    const toStamp = new Set<string>(keys);
    for (const [id, entry] of Object.entries(doc.changes)) {
      if (entry.comment != null) toStamp.add(id);
      for (const fi of entry.formItems ?? []) {
        if (!fi.formItem) continue;
        if (fi.formItem.id in nextValues || keys.includes(fi.formItem.id)) {
          toStamp.add(fi.formItem.id);
        }
      }
    }
    for (const id of Object.keys(updated)) toStamp.add(id);
    nextChanges = stampAnswerHistory(doc.changes, toStamp, now);
  }

  return {
    responses: toFormResponseEntries(nextValues),
    changes: nextChanges,
    feedbackHistory: [
      ...(doc?.feedbackHistory ?? []),
      { status: "answered", date: now.toISOString() },
    ],
    status: "answered",
  };
};
