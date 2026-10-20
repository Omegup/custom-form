import { describe, expect, it } from "vitest";
import { branded } from "../form";
import type { TheParams } from "../form";
import { collectFormItemIds } from "./collectFormItemIds";
import type { RecursiveFormItem } from "./RecursiveFormItem.t";

type TypeNames = "field" | "panel";
type Params = TheParams<{
  field: { name: string };
  panel: { name: string };
}>;
type Meta = { meta: { index: number } };

const field = (
  id: string,
  children: RecursiveFormItem<TypeNames, Params, Meta>[][] = [],
): RecursiveFormItem<TypeNames, Params, Meta> => ({
  header: { id, type: "field", params: { name: id }, deleted: false },
  children,
  meta: branded({ index: 0 }),
});

const panel = (
  id: string,
  children: RecursiveFormItem<TypeNames, Params, Meta>[][],
): RecursiveFormItem<TypeNames, Params, Meta> => ({
  header: { id, type: "panel", params: { name: id }, deleted: false },
  children,
  meta: branded({ index: 0 }),
});

describe("collectFormItemIds", () => {
  it("collects nested panel children", () => {
    expect(
      collectFormItemIds([
        [field("a"), panel("p", [[field("b"), field("c")]])],
      ]),
    ).toEqual(["a", "p", "b", "c"]);
  });
});
