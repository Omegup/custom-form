import { describe, expect, it } from "vitest";
import { responderState } from "./responderStatus";

const answered = { meta: {}, data: { value: "x" } };

describe("responderState", () => {
  it("marks unanswered follow-ups as change", () => {
    expect(
      responderState({
        oldValue: null,
        remark: null,
        isFollowUpTree: true,
      }),
    ).toBe("change");
  });

  it("marks unlocked prior answers as change", () => {
    expect(
      responderState({
        oldValue: answered,
        remark: "",
        isFollowUpTree: false,
      }),
    ).toBe("change");
  });

  it("marks locked prior answers as old", () => {
    expect(
      responderState({
        oldValue: answered,
        remark: null,
        isFollowUpTree: false,
      }),
    ).toBe("old");
  });

  it("defaults when there is no prior answer", () => {
    expect(
      responderState({
        oldValue: null,
        remark: null,
        isFollowUpTree: false,
      }),
    ).toBe("default");
  });
});
