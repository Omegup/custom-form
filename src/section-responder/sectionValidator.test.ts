import { describe, expect, it } from "vitest";
import { emptyResponse } from "../response";
import type { StrictViewerMethods } from "./_deps";
import { sectionValidator } from "./sectionValidator";

describe("sectionValidator", () => {
  const methods: StrictViewerMethods = {
    validate: (value) => (value?.data.value ? null : "required"),
    update: (value) => value ?? emptyResponse(),
  };

  it("collects errors from registered items", () => {
    const next = sectionValidator({ a: methods, b: null });
    expect(next.validate({ a: emptyResponse() })).toEqual({ a: "required" });
    expect(
      next.validate({ a: { meta: {}, data: { value: "ok" } } }),
    ).toEqual({});
  });

  it("updates only registered items", () => {
    const next = sectionValidator({ a: methods, b: null });
    const values = { a: emptyResponse(), z: emptyResponse() };
    expect(next.update(values)).toEqual(values);
  });

  it("lists keys that still have a validator", () => {
    expect(sectionValidator({ a: methods, b: null }).getKeys()).toEqual(["a"]);
  });
});
