import { describe, expect, it } from "vitest";
import type { TheParams } from "../form";
import type { MetaDom, RecursiveFormItem } from "../recursive-form";
import { idInSectionTree, sectionOwnsOverlay } from "./sectionOwnsOverlay";
import type { AdditionalChanges } from "./types";

type TypeNames = "field";
type Params = TheParams<{ field: { name: string } }>;
type Meta = MetaDom<{ index: number; total: number; sIndex: number }>;
type Item = RecursiveFormItem<TypeNames, Params, Meta>;

const item = (id: string, children: Item[][] = []): Item => ({
  header: {
    id,
    type: "field",
    params: { name: id },
    deleted: false,
  },
  children,
  meta: { index: 0, total: 1, sIndex: 0 },
});

describe("idInSectionTree / sectionOwnsOverlay", () => {
  const slots = [[item("a", [[item("a1")]]), item("b")]];

  it("finds nested ids in the section tree", () => {
    expect(idInSectionTree("a1", slots)).toBe(true);
    expect(idInSectionTree("z", slots)).toBe(false);
  });

  it("owns a follow-up attached to an origin in this section", () => {
    const changes: AdditionalChanges<TypeNames, Params> = {
      a: {
        formItems: [
          {
            formItem: {
              id: "fu",
              type: "field",
              params: { name: "fu" },
              deleted: false,
            },
            children: [],
            date: null,
          },
        ],
      },
    };
    expect(sectionOwnsOverlay("fu", slots, changes)).toBe(true);
    expect(sectionOwnsOverlay("other", slots, changes)).toBe(false);
  });
});
