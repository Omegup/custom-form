import { describe, expect, it } from "vitest";
import { emptyResponse } from "./emptyResponse";

describe("emptyResponse", () => {
  it("returns empty meta and data maps", () => {
    expect(emptyResponse()).toEqual({ meta: {}, data: {} });
  });

  it("returns a fresh object each call", () => {
    const a = emptyResponse();
    const b = emptyResponse();
    expect(a).not.toBe(b);
    a.data.x = "1";
    expect(b.data).toEqual({});
  });
});
