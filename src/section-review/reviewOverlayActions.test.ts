import { describe, expect, it } from "vitest";
import type { TheParams } from "../form";
import { reviewOverlayActions } from "./reviewOverlayActions";
import type { AdditionalChanges, Addition } from "./types";

type TypeNames = "field";
type Params = TheParams<{ field: { name: string } }>;

describe("reviewOverlayActions", () => {
  it("writes a comment and clears the draft", () => {
    const addition: Addition = {
      originId: "a",
      text: "fix",
    };
    let changes: AdditionalChanges<TypeNames, Params> = {};
    let draft: Addition | null = addition;
    const actions = reviewOverlayActions({
      addition,
      deleteCommentId: null,
      changes,
      setChanges: (next) => {
        changes = next;
      },
      setAddition: (next) => {
        draft = next;
      },
      setDeleteCommentId: () => {},
    });
    actions.onSubmitComment("fix");
    expect(changes.a?.comment).toBe("fix");
    expect(draft).toBeNull();
  });

  it("removes a remark and clears deleteCommentId", () => {
    let changes: AdditionalChanges<TypeNames, Params> = {
      a: { comment: "fix" },
    };
    let deleteCommentId: string | null = "a";
    const actions = reviewOverlayActions({
      addition: null,
      deleteCommentId: "a",
      changes,
      setChanges: (next) => {
        changes = next;
      },
      setAddition: () => {},
      setDeleteCommentId: (id) => {
        deleteCommentId = id;
      },
    });
    actions.onConfirmDeleteComment();
    expect(changes).toEqual({});
    expect(deleteCommentId).toBeNull();
  });
});
