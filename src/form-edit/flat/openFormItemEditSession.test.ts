import { describe, expect, it } from "vitest";
import {
  AMBIGUOUS_INSERT_SPAN,
  openFormItemInsertSession,
  patchFormItemEditSession,
} from "./openFormItemEditSession";

const panel = (id: string, name: string, cols: number) => ({
  header: {
    id,
    type: "panel" as const,
    params: { name },
    deleted: false,
  },
  children: Array.from({ length: cols }, () => []),
});

describe("patchFormItemEditSession", () => {
  it("writes a next draft value", () => {
    const session = openFormItemInsertSession(
      {
        header: {
          id: "f1",
          type: "field",
          params: { name: "A" },
          deleted: false,
        },
        children: [],
      },
      AMBIGUOUS_INSERT_SPAN,
    );
    const next = patchFormItemEditSession(session, {
      ...session.draft,
      item: { ...session.draft.item, params: { name: "B" } },
    });
    expect(next.draft.item.params).toEqual({ name: "B" });
    expect(next.children).toEqual([]);
  });

  it("resizes children when the updater changes n", () => {
    const session = openFormItemInsertSession(panel("p1", "P", 1), AMBIGUOUS_INSERT_SPAN);
    const next = patchFormItemEditSession(session, (draft) => ({
      ...draft,
      n: 3,
    }));
    expect(next.draft.n).toBe(3);
    expect(next.children).toEqual([[], [], []]);
  });
});
