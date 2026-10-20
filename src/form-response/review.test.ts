import { describe, expect, it } from "vitest";
import type { TheParams } from "../form";
import { appendFeedback, lastAnsweredAt, saveAdditionalQuestions } from "./review";
import type { FormResponseDoc } from "./types";

type TypeNames = "field";
type Params = TheParams<{ field: { name: string } }>;

const now = new Date("2024-06-02T12:00:00Z");

const doc = (
  status: FormResponseDoc<TypeNames, Params>["status"],
): FormResponseDoc<TypeNames, Params> => ({
  responses: [],
  changes: { a: { comment: "x" } },
  feedbackHistory: [{ status: "answered", date: "2024-06-01T00:00:00Z" }],
  status,
});

describe("saveAdditionalQuestions", () => {
  it("moves answered → draft and appends history", () => {
    const next = saveAdditionalQuestions(doc("answered"), now);
    expect(next.status).toBe("draft");
    expect(next.feedbackHistory.at(-1)).toEqual({
      status: "draft",
      date: now.toISOString(),
    });
  });

  it("is a no-op when status is not answered", () => {
    const start = doc("draft");
    expect(saveAdditionalQuestions(start, now)).toBe(start);
  });
});

describe("appendFeedback / lastAnsweredAt", () => {
  it("appends a feedback entry and sets status", () => {
    const next = appendFeedback(doc("answered"), "changesRequested", "please", now);
    expect(next.status).toBe("changesRequested");
    expect(next.feedbackHistory.at(-1)).toEqual({
      status: "changesRequested",
      comment: "please",
      date: now.toISOString(),
    });
  });

  it("is a no-op when status is unchanged", () => {
    const start = doc("approved");
    expect(appendFeedback(start, "approved", undefined, now)).toBe(start);
  });

  it("returns the latest answered ISO date", () => {
    expect(
      lastAnsweredAt([
        { status: "answered", date: "a" },
        { status: "draft", date: "b" },
        { status: "answered", date: "c" },
        { status: "changesRequested", date: "d" },
      ]),
    ).toBe("c");
    expect(lastAnsweredAt([])).toBeNull();
  });
});
