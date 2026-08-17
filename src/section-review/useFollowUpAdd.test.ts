import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { TheParams } from "../form";
import { openFormItemInsertSession, AMBIGUOUS_INSERT_SPAN } from "../form-edit";
import { patchFormItemEditSession } from "./_deps";
import { followUpPickFromSession, useFollowUpAdd } from "./useFollowUpAdd";

type TypeNames = "field" | "panel";
type Params = TheParams<{
  field: { name: string };
  panel: { name: string };
}>;

const field = (id: string, name: string) => ({
  header: {
    id,
    type: "field" as const,
    params: { name },
    deleted: false,
  },
  children: [] as never[][],
});

const panel = (id: string, name: string, cols: number) => ({
  header: {
    id,
    type: "panel" as const,
    params: { name },
    deleted: false,
  },
  children: Array.from({ length: cols }, () => []),
});

describe("followUpPickFromSession", () => {
  it("maps a field session to a pick with no nested columns", () => {
    const session = openFormItemInsertSession<TypeNames, Params>(
      field("f1", "A"),
      AMBIGUOUS_INSERT_SPAN,
    );
    expect(followUpPickFromSession(session)).toEqual({
      comment: null,
      formItem: session.draft.item,
      children: null,
    });
  });

  it("keeps panel columns on the pick", () => {
    const session = openFormItemInsertSession<TypeNames, Params>(
      panel("p1", "P", 2),
      AMBIGUOUS_INSERT_SPAN,
    );
    expect(followUpPickFromSession(session).children).toEqual([[], []]);
  });
});

describe("useFollowUpAdd", () => {
  it("commits the live session then closes", () => {
    const onPick = vi.fn();
    const { result } = renderHook(() =>
      useFollowUpAdd<TypeNames, Params>({ onPick }),
    );
    const opened = openFormItemInsertSession<TypeNames, Params>(
      field("f1", "Name"),
      AMBIGUOUS_INSERT_SPAN,
    );
    act(() => {
      result.current.setSession(opened);
    });
    act(() => {
      result.current.setDraft((draft) => ({
        ...draft,
        item: { ...draft.item, params: { name: "Updated" } },
      }));
    });
    act(() => {
      result.current.commit();
    });
    expect(onPick).toHaveBeenCalledWith({
      comment: null,
      formItem: expect.objectContaining({ params: { name: "Updated" } }),
      children: null,
    });
    expect(result.current.session).toBeNull();
  });
});

describe("patchFormItemEditSession used by follow-up add", () => {
  it("resizes panel children before pick", () => {
    const session = openFormItemInsertSession<TypeNames, Params>(
      panel("p1", "P", 1),
      AMBIGUOUS_INSERT_SPAN,
    );
    const next = patchFormItemEditSession(session, (draft) => ({
      ...draft,
      n: 2,
    }));
    expect(followUpPickFromSession(next).children).toEqual([[], []]);
  });
});
