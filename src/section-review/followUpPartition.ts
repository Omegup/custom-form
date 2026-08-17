/**
 * Split an origin's follow-up rows into answered (review chrome) vs
 * unanswered (design editor). Comment-only rows count as unanswered.
 */
import type { MetaDom, ParamsDom, RecursiveFormItem, SIndexed } from "./_deps";
import type { ReviewFormItemEntry } from "./types";

export type PartitionedFollowUps<
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
> = {
  answered: ReviewFormItemEntry<TypeNames, Params>[];
  unanswered: {
    entry: ReviewFormItemEntry<TypeNames, Params>;
    sourceIndex: number;
  }[];
};

export const partitionFollowUpEntries = <
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
>(
  entries: ReviewFormItemEntry<TypeNames, Params>[],
  isAnswered: (id: string) => boolean,
): PartitionedFollowUps<TypeNames, Params> => {
  const answered: ReviewFormItemEntry<TypeNames, Params>[] = [];
  const unanswered: PartitionedFollowUps<TypeNames, Params>["unanswered"] = [];
  entries.forEach((entry, index) => {
    if (entry.formItem != null && isAnswered(entry.formItem.id)) {
      answered.push(entry);
    } else {
      unanswered.push({ entry, sourceIndex: index });
    }
  });
  return { answered, unanswered };
};

/** Answered follow-up row as a review tree item. Comment-only rows have no header. */
export const followUpEntryAsItem = <
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
>(
  entry: ReviewFormItemEntry<TypeNames, Params>,
): RecursiveFormItem<TypeNames, Params, MetaDom<SIndexed>> | null => {
  if (!entry.formItem) return null;
  return {
    header: entry.formItem,
    children: entry.children ?? [],
    meta: { index: 0, total: 1, sIndex: 0 },
  };
};
