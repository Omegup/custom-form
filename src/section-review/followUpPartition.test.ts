import { describe, expect, it } from "vitest";
import type { TheParams } from "../form";
import { followUpEntryAsItem, partitionFollowUpEntries } from "./followUpPartition";
import type { ReviewFormItemEntry } from "./types";

type TypeNames = "field";
type Params = TheParams<{ field: { name: string } }>;

const field = (id: string): ReviewFormItemEntry<TypeNames, Params> => ({
  comment: null,
  formItem: { id, type: "field", params: { name: id }, deleted: false },
  children: [],
  date: null,
});

describe("partitionFollowUpEntries", () => {
  it("splits answered, unanswered, and comment-only rows", () => {
    const commentOnly: ReviewFormItemEntry<TypeNames, Params> = {
      comment: "note",
      formItem: null,
      children: null,
      date: null,
    };
    const entries = [field("done"), commentOnly, field("open")];
    const { answered, unanswered } = partitionFollowUpEntries(
      entries,
      (id) => id === "done",
    );
    expect(answered.map((e) => e.formItem?.id)).toEqual(["done"]);
    expect(unanswered.map(({ entry, sourceIndex }) => [entry.formItem?.id ?? entry.comment, sourceIndex])).toEqual([
      ["note", 1],
      ["open", 2],
    ]);
  });

  it("turns an answered entry into a review tree item", () => {
    const children = [
      [
        {
          header: field("child").formItem!,
          children: [],
          meta: { index: 0, total: 1, sIndex: 0 },
        },
      ],
    ];
    const entry: ReviewFormItemEntry<TypeNames, Params> = {
      ...field("done"),
      children,
    };
    expect(followUpEntryAsItem(entry)).toEqual({
      header: entry.formItem,
      children,
      meta: { index: 0, total: 1, sIndex: 0 },
    });
    expect(followUpEntryAsItem({
      comment: "note",
      formItem: null,
      children: null,
      date: null,
    })).toBeNull();
  });
});
