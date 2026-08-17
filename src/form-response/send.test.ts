import { describe, expect, it } from "vitest";
import { emptyResponse } from "../response";
import type { TheParams } from "../form";
import { withoutUnlockComments, stampAnswerHistory } from "./changes";
import { buildSend, canSend } from "./send";
import type { FormResponseDoc } from "./types";

type TypeNames = "field";
type Params = TheParams<{ field: { name: string } }>;

const now = new Date("2024-06-01T12:00:00Z");

const field = (id: string) => ({
  id,
  type: "field" as const,
  params: { name: id },
  deleted: false,
});

describe("canSend", () => {
  it("allows first send and changesRequested only", () => {
    expect(canSend(null)).toBe(true);
    expect(canSend({ status: "changesRequested" })).toBe(true);
    expect(canSend({ status: "answered" })).toBe(false);
    expect(canSend({ status: "draft" })).toBe(false);
  });
});

describe("withoutUnlockComments / stampAnswerHistory", () => {
  it("drops remarks and keeps follow-ups", () => {
    const next = withoutUnlockComments<TypeNames, Params>({
      a: { comment: "fix this", formItems: [{ comment: null, formItem: field("f"), children: null, date: null }] },
      b: { comment: "gone" },
    });
    expect(next.a?.comment).toBeUndefined();
    expect(next.a?.formItems?.[0]?.formItem?.id).toBe("f");
    expect(next.b).toBeUndefined();
  });

  it("appends a history stamp per id after stripping comments", () => {
    const next = stampAnswerHistory<TypeNames, Params>(
      { a: { comment: "x" } },
      ["a", "b"],
      now,
    );
    expect(next.a?.comment).toBeUndefined();
    expect(next.a?.history?.at(-1)?.date).toBe(now);
    expect(next.b?.history?.at(-1)?.date).toBe(now);
  });
});

describe("buildSend", () => {
  it("first send stamps every design id and writes answered history", () => {
    const doc = buildSend<TypeNames, Params>({
      doc: null,
      draft: { a: { meta: {}, data: { value: "hi" } } },
      keys: ["a"],
      updated: { a: { meta: {}, data: { value: "hi" } } },
      designIds: ["a", "b"],
      now,
    });
    expect(doc.status).toBe("answered");
    expect(doc.responses.map((r) => r.formItemId).sort()).toEqual(["a", "b"]);
    expect(doc.responses.find((r) => r.formItemId === "b")?.response).toEqual(
      emptyResponse(),
    );
    expect(doc.feedbackHistory.at(-1)?.status).toBe("answered");
    expect(doc.changes.a?.history?.at(-1)?.date).toBe(now);
    expect(doc.changes.b?.history?.at(-1)?.date).toBe(now);
  });

  it("revise stamps unlocked / edited / follow-up ids only", () => {
    const prior: FormResponseDoc<TypeNames, Params> = {
      responses: [
        { formItemId: "a", response: { meta: {}, data: { value: "old" } } },
      ],
      changes: {
        a: { comment: "please revise", history: [{ date: new Date("2024-01-01") }] },
        origin: {
          formItems: [{ comment: null, formItem: field("fu"), children: null, date: null }],
        },
      },
      feedbackHistory: [{ status: "changesRequested", date: "2024-05-01T00:00:00Z" }],
      status: "changesRequested",
    };
    const doc = buildSend<TypeNames, Params>({
      doc: prior,
      draft: { fu: { meta: {}, data: { value: "new" } } },
      keys: ["fu"],
      updated: { fu: { meta: {}, data: { value: "new" } } },
      designIds: ["a"],
      now,
    });
    expect(doc.changes.a?.comment).toBeUndefined();
    expect(doc.changes.a?.history?.at(-1)?.date).toBe(now);
    expect(doc.changes.fu?.history?.at(-1)?.date).toBe(now);
    expect(doc.status).toBe("answered");
  });
});
