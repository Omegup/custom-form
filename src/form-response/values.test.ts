import { describe, expect, it } from "vitest";
import { emptyResponse } from "../response";
import { formResponseValues, keyedResponses } from "./values";
import type { FormResponseDoc } from "./types";
import type { TheParams } from "../form";

type TypeNames = "field";
type Params = TheParams<{ field: { name: string } }>;

const r = (data: string) => ({
  meta: {},
  data: { value: data },
});

describe("formResponseValues", () => {
  it("indexes document answers by form item id", () => {
    const doc: FormResponseDoc<TypeNames, Params> = {
      responses: [
        { formItemId: "a", response: r("1") },
        { formItemId: "b", response: r("2") },
      ],
      changes: {},
      feedbackHistory: [],
      status: "answered",
    };
    expect(formResponseValues(doc)).toEqual({ a: r("1"), b: r("2") });
  });
});

describe("keyedResponses", () => {
  it("prefers draft over prior for the given keys", () => {
    const draft = { a: r("draft-a"), c: r("draft-c") };
    const prior = { a: r("prior-a"), b: r("prior-b") };
    expect(keyedResponses(["a", "b"], draft, prior)).toEqual({
      a: r("draft-a"),
      b: r("prior-b"),
    });
  });

  it("keeps emptyResponse when that is the stored value", () => {
    const empty = emptyResponse();
    expect(keyedResponses(["a"], { a: empty }, {})).toEqual({ a: empty });
  });
});
