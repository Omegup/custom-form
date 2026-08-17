import { describe, expect, it } from "vitest";
import type { TheParams } from "../form";
import type { Response } from "../response";
import {
  hasUnlockRemark,
  isAnsweredResponse,
  reviewItemState,
  reviewStatusFor,
  reviewVariantState,
} from "./reviewStatus";
import type { AdditionalChanges } from "./types";

type TypeNames = "field";
type Params = TheParams<{ field: { name: string } }>;
type Changes = AdditionalChanges<TypeNames, Params>;

const answered: Response = { meta: {}, data: { v: "1" } };
const empty: Response = { meta: {}, data: {} };

const wave = (sec: number) => new Date(sec * 1000);

describe("isAnsweredResponse / hasUnlockRemark", () => {
  it("treats a non-empty data map as answered", () => {
    expect(isAnsweredResponse({ a: answered }, "a")).toBe(true);
    expect(isAnsweredResponse({ a: empty }, "a")).toBe(false);
    expect(isAnsweredResponse({}, "a")).toBe(false);
  });

  it("counts an empty-string comment as an unlock remark", () => {
    const changes: Changes = { a: { comment: "" } };
    expect(hasUnlockRemark(changes, "a")).toBe(true);
    expect(hasUnlockRemark({}, "a")).toBe(false);
  });
});

describe("reviewStatusFor", () => {
  const isAnswered = (id: string) => id === "yes";

  it("returns normal when unlocked", () => {
    expect(
      reviewStatusFor({
        id: "a",
        unlocked: true,
        changes: {},
        responses: {},
        lastPending: null,
        isAnswered,
      }),
    ).toBe("normal");
  });

  it("treats a response row with a single wave as recent", () => {
    const changes: Changes = {
      a: { history: [{ date: wave(100) }] },
    };
    expect(
      reviewStatusFor({
        id: "b",
        unlocked: false,
        changes,
        responses: { b: empty },
        lastPending: null,
        isAnswered,
      }),
    ).toBe("highlight");
  });

  it("treats a response row as ancient when peers have multiple waves", () => {
    const changes: Changes = {
      a: { history: [{ date: wave(100) }] },
      c: { history: [{ date: wave(200) }] },
    };
    expect(
      reviewStatusFor({
        id: "b",
        unlocked: false,
        changes,
        responses: { b: empty },
        lastPending: null,
        isAnswered,
      }),
    ).toBe("disabled");
  });

  it("with no stamp and no response row, uses isAnswered", () => {
    expect(
      reviewStatusFor({
        id: "yes",
        unlocked: false,
        changes: {},
        responses: {},
        lastPending: null,
        isAnswered,
      }),
    ).toBe("highlight");
    expect(
      reviewStatusFor({
        id: "no",
        unlocked: false,
        changes: {},
        responses: {},
        lastPending: null,
        isAnswered,
      }),
    ).toBe("disabled");
  });

  it("uses lastPending when it matches an answer wave", () => {
    const pending = wave(200);
    const changes: Changes = {
      a: { history: [{ date: wave(100) }, { date: pending }] },
      b: { history: [{ date: wave(100) }] },
    };
    expect(
      reviewStatusFor({
        id: "a",
        unlocked: false,
        changes,
        responses: {},
        lastPending: pending,
        isAnswered,
      }),
    ).toBe("highlight");
    expect(
      reviewStatusFor({
        id: "b",
        unlocked: false,
        changes,
        responses: {},
        lastPending: pending,
        isAnswered,
      }),
    ).toBe("disabled");
  });

  it("falls back to newest wave vs older stamps", () => {
    const changes: Changes = {
      a: { history: [{ date: wave(100) }] },
      b: { history: [{ date: wave(200) }] },
    };
    expect(
      reviewStatusFor({
        id: "b",
        unlocked: false,
        changes,
        responses: {},
        lastPending: null,
        isAnswered,
      }),
    ).toBe("highlight");
    expect(
      reviewStatusFor({
        id: "a",
        unlocked: false,
        changes,
        responses: {},
        lastPending: null,
        isAnswered,
      }),
    ).toBe("disabled");
  });
});

describe("reviewVariantState", () => {
  it("is change while a remark or unanswered follow-up is pending", () => {
    const withRemark: Changes = { a: { comment: "fix" } };
    expect(
      reviewVariantState({
        id: "a",
        isUnansweredFollowUpEntry: false,
        changes: withRemark,
        isAnswered: () => true,
      }),
    ).toBe("change");
    expect(
      reviewVariantState({
        id: "a",
        isUnansweredFollowUpEntry: true,
        changes: {},
        isAnswered: () => false,
      }),
    ).toBe("change");
    expect(
      reviewVariantState({
        id: "a",
        isUnansweredFollowUpEntry: false,
        changes: {},
        isAnswered: () => true,
      }),
    ).toBe("default");
  });
});

describe("reviewItemState", () => {
  const isAnswered = (id: string) => id === "open" ? false : true;

  it("bundles unlock, unanswered follow-ups, variant, and status", () => {
    const changes: Changes = {
      a: {
        comment: "fix",
        formItems: [
          {
            formItem: {
              id: "open",
              type: "field",
              deleted: false,
              params: { name: "More" },
            },
            comment: null,
            children: null,
            date: null,
          },
        ],
      },
    };
    expect(
      reviewItemState({
        id: "a",
        changes,
        responses: { a: answered },
        lastPending: null,
        isAnswered,
      }),
    ).toEqual({
      unlocked: true,
      designingFollowUps: true,
      variant: "change",
      status: "normal",
    });
  });

  it("is settled when there is no remark and no unanswered follow-up", () => {
    expect(
      reviewItemState({
        id: "a",
        changes: {},
        responses: { a: answered },
        lastPending: null,
        isAnswered,
      }),
    ).toEqual({
      unlocked: false,
      designingFollowUps: false,
      variant: "default",
      status: "highlight",
    });
  });
});
