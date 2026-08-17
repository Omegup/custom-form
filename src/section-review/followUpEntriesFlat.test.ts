import { describe, expect, it } from "vitest";
import type { TheParams } from "../form";
import {
  followUpEntriesToFlat,
  syncFollowUpEntriesFromFlat,
} from "./followUpEntriesFlat";
import type { ReviewFormItemEntry } from "./types";

type TypeNames = "field";
type Params = TheParams<{ field: { name: string } }>;
type Section = { id: string; deleted: boolean; title: string };

const section = (): Section => ({
  id: "follow-up",
  deleted: false,
  title: "Follow-up items",
});

const field = (id: string, name: string) => ({
  id,
  type: "field" as const,
  params: { name },
  deleted: false,
});

const entry = (
  id: string,
  name: string,
): ReviewFormItemEntry<TypeNames, Params> => ({
  comment: null,
  formItem: field(id, name),
  children: [],
  date: null,
});

describe("followUpEntriesToFlat / syncFollowUpEntriesFromFlat", () => {
  it("round-trips form-item entries through a synthetic section", () => {
    const entries = [entry("a", "A"), entry("b", "B")];
    const flat = followUpEntriesToFlat(entries, section());
    expect(flat[0]).toEqual({ section: section() });
    const next = syncFollowUpEntriesFromFlat(flat, entries);
    expect(next?.map((e) => e.formItem?.id)).toEqual(["a", "b"]);
  });

  it("does not wipe existing entries when the tree consolidates empty", () => {
    const entries = [entry("a", "A")];
    const empty = [{ section: section() }];
    expect(syncFollowUpEntriesFromFlat(empty, entries)).toBeNull();
  });

  it("keeps comment-only rows that have no form item", () => {
    const commentOnly: ReviewFormItemEntry<TypeNames, Params> = {
      comment: "note",
      formItem: null,
      children: null,
      date: null,
    };
    const entries = [entry("a", "A"), commentOnly];
    const flat = followUpEntriesToFlat(entries, section());
    const next = syncFollowUpEntriesFromFlat(flat, entries);
    expect(next?.some((e) => e.comment === "note" && !e.formItem)).toBe(true);
  });
});
