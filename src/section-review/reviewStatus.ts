/**
 * Per-item review chrome: `status` (highlight / disabled / normal) and
 * pending-yellow (`change` vs `default`).
 */
import type { ParamsDom, Response } from "./_deps";
import type {
  AdditionalChanges,
  ReviewStatus,
  ReviewVariantState,
} from "./types";

export const isAnsweredResponse = (
  responses: Record<string, Response>,
  id: string,
): boolean => {
  const res = responses[id];
  return res != null && Object.keys(res.data).length > 0;
};

/** Unlock remark present — including empty string (school unlock-without-text). */
export const hasUnlockRemark = <
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
>(
  changes: AdditionalChanges<TypeNames, Params>,
  id: string,
): boolean => changes[id]?.comment != null;

export const hasUnansweredFollowUps = <
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
>(
  changes: AdditionalChanges<TypeNames, Params>,
  originId: string,
  isAnswered: (id: string) => boolean,
): boolean =>
  !!changes[originId]?.formItems?.some(
    (e) => e.formItem != null && !isAnswered(e.formItem.id),
  );

export const historySec = (
  date: Date | string | number | null | undefined,
): number | null => {
  if (date == null) return null;
  const ms =
    date instanceof Date ? date.getTime() : new Date(date).getTime();
  return Number.isFinite(ms) ? Math.floor(ms / 1000) : null;
};

/** Newest answer-stamp across all items — that wave is "recent". */
export const latestAnswerSec = <
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
>(
  changes: AdditionalChanges<TypeNames, Params>,
): number | null => {
  let max: number | null = null;
  for (const entry of Object.values(changes)) {
    for (const h of entry.history ?? []) {
      const sec = historySec(h.date);
      if (sec != null && (max == null || sec > max)) max = sec;
    }
  }
  return max;
};

const waveCount = <
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
>(
  changes: AdditionalChanges<TypeNames, Params>,
): number =>
  new Set(
    Object.values(changes).flatMap((entry) =>
      (entry.history ?? [])
        .map((h) => historySec(h.date))
        .filter((s): s is number => s != null),
    ),
  ).size;

export const reviewStatusFor = <
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
>(args: {
  id: string;
  unlocked: boolean;
  changes: AdditionalChanges<TypeNames, Params>;
  responses: Record<string, Response>;
  lastPending: Date | null;
  isAnswered: (id: string) => boolean;
}): ReviewStatus => {
  if (args.unlocked) return "normal";
  const { id, changes, responses, lastPending, isAnswered } = args;
  const ms = historySec(changes[id]?.history?.at(-1)?.date);
  if (ms == null) {
    // No stamp — empty optional missed on an older send, or never submitted.
    // If a response row exists and there is only one answer wave among peers,
    // treat as recent (same first send). Multiple waves → ancient.
    if (responses[id] !== undefined) {
      return waveCount(changes) <= 1 ? "highlight" : "disabled";
    }
    return isAnswered(id) ? "highlight" : "disabled";
  }
  // Prefer lastPending when it aligns with an answer wave (student Send).
  if (lastPending != null) {
    const pendingSec = historySec(lastPending);
    if (pendingSec != null) {
      const pendingMatchesWave = Object.values(changes).some(
        (entry) => historySec(entry.history?.at(-1)?.date) === pendingSec,
      );
      if (pendingMatchesWave) {
        return pendingSec === ms ? "highlight" : "disabled";
      }
    }
  }
  const latest = latestAnswerSec(changes);
  if (latest == null) return "highlight";
  return ms === latest ? "highlight" : "disabled";
};

/**
 * Yellow only while pending: unlock remark and/or unanswered follow-ups
 * (or this row is itself an unanswered follow-up). After Send, default.
 */
export const reviewVariantState = <
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
>(args: {
  id: string;
  isUnansweredFollowUpEntry: boolean;
  changes: AdditionalChanges<TypeNames, Params>;
  isAnswered: (id: string) => boolean;
}): ReviewVariantState => {
  const pending =
    args.isUnansweredFollowUpEntry ||
    hasUnlockRemark(args.changes, args.id) ||
    hasUnansweredFollowUps(args.changes, args.id, args.isAnswered);
  return pending ? "change" : "default";
};

/** Flags + chrome picks for one reviewed item (originals and answered follow-ups). */
export const reviewItemState = <
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
>(args: {
  id: string;
  changes: AdditionalChanges<TypeNames, Params>;
  responses: Record<string, Response>;
  lastPending: Date | null;
  isAnswered: (id: string) => boolean;
}): {
  unlocked: boolean;
  designingFollowUps: boolean;
  variant: ReviewVariantState;
  status: ReviewStatus;
} => {
  const unlocked = hasUnlockRemark(args.changes, args.id);
  const designingFollowUps = hasUnansweredFollowUps(
    args.changes,
    args.id,
    args.isAnswered,
  );
  return {
    unlocked,
    designingFollowUps,
    variant: reviewVariantState({
      id: args.id,
      isUnansweredFollowUpEntry: false,
      changes: args.changes,
      isAnswered: args.isAnswered,
    }),
    status: reviewStatusFor({ ...args, unlocked }),
  };
};
