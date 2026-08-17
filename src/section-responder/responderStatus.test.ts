import { describe, expect, it } from "vitest";
import { responderState } from "./responderStatus";

const answered = { meta: {}, data: { value: "x" } };

describe("responderState", () => {
  it("picks error first", () => {
    expect(
      responderState({
        error: "required",
        oldValue: answered,
        remark: "fix",
        isFollowUpTree: true,
      }),
    ).toBe("error");
  });

  it("marks unanswered follow-ups as change", () => {
    expect(
      responderState({
        error: null,
        oldValue: null,
        remark: null,
        isFollowUpTree: true,
      }),
    ).toBe("change");
  });

  it("marks unlocked prior answers as change", () => {
    expect(
      responderState({
        error: null,
        oldValue: answered,
        remark: "",
        isFollowUpTree: false,
      }),
    ).toBe("change");
  });

  it("marks locked prior answers as old", () => {
    expect(
      responderState({
        error: null,
        oldValue: answered,
        remark: null,
        isFollowUpTree: false,
      }),
    ).toBe("old");
  });

  it("defaults when there is no prior answer", () => {
    expect(
      responderState({
        error: null,
        oldValue: null,
        remark: null,
        isFollowUpTree: false,
      }),
    ).toBe("default");
  });
});
