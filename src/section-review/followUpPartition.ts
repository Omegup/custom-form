/**
 * Split an origin's follow-up rows into answered (review chrome) vs
 * unanswered (design editor). Comment-only rows count as unanswered.
 */
import type { ParamsDom } from "./_deps";
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
