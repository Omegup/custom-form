import { describe, expect, it } from "vitest";
import type { TheParams } from "../form";
import {
  withComment,
  withFormItemEntry,
  withoutComment,
  withUnansweredFormItems,
} from "./reviewChanges";
import type { AdditionalChanges, ReviewFormItemEntry } from "./types";

type TypeNames = "field";
type Params = TheParams<{ field: { name: string } }>;
type Changes = AdditionalChanges<TypeNames, Params>;

const field = (id: string): ReviewFormItemEntry<TypeNames, Params> => ({
  formItem: { id, type: "field", params: { name: id }, deleted: false },
  children: [],
  date: null,
});

describe("withComment / withoutComment", () => {
  it("sets a remark on a new origin", () => {
    const next = withComment<TypeNames, Params>({}, "a", "fix");
    expect(next.a?.comment).toBe("fix");
  });

  it("drops the origin when the remark was the only field", () => {
    const changes: Changes = { a: { comment: "fix" } };
    expect(withoutComment(changes, "a")).toEqual({});
  });

  it("keeps follow-ups when removing the remark", () => {
    const changes: Changes = { a: { comment: "fix", formItems: [field("f")] } };
    const next = withoutComment(changes, "a");
    expect(next.a?.comment).toBeUndefined();
    expect(next.a?.formItems).toHaveLength(1);
  });
});

describe("withFormItemEntry / withUnansweredFormItems", () => {
  it("appends when replaceIndex is null", () => {
    const next = withFormItemEntry<TypeNames, Params>({}, "a", field("f"), null);
    expect(next.a?.formItems?.map((e) => e.formItem?.id)).toEqual(["f"]);
  });

  it("replaces at replaceIndex", () => {
    const changes = withFormItemEntry<TypeNames, Params>(
      {},
      "a",
      field("f"),
      null,
    );
    const next = withFormItemEntry(changes, "a", field("g"), 0);
    expect(next.a?.formItems?.map((e) => e.formItem?.id)).toEqual(["g"]);
  });

  it("keeps answered rows when rewriting unanswered", () => {
    const answered = field("done");
    const pending = field("open");
    const changes: Changes = { a: { formItems: [answered, pending] } };
    const next = withUnansweredFormItems(
      changes,
      "a",
      [field("new")],
      (id) => id === "done",
    );
    expect(next.a?.formItems?.map((e) => e.formItem?.id)).toEqual([
      "done",
      "new",
    ]);
  });
});
