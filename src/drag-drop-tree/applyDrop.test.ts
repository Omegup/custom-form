import { describe, expect, it } from "vitest";
import type { TreeNode } from "./types";
import { applyDrop } from "./applyDrop";
import { findNodeById } from "./utils";

type Leaf = { label: string };

const node = (
  _id: string,
  label: string,
  children: TreeNode<Leaf>[] = [],
): TreeNode<Leaf> => ({ _id, label, children });

const tree = (): TreeNode<Leaf>[] => [
  node("a", "A", [node("a1", "A1"), node("a2", "A2")]),
  node("b", "B"),
  node("c", "C"),
];

describe("applyDrop", () => {
  it("moves a node before another at the top level", () => {
    const result = applyDrop(tree(), "c", { _id: "a", position: "before" });
    expect(result.map((n) => n._id)).toEqual(["c", "a", "b"]);
  });

  it("moves a node after another at the top level", () => {
    const result = applyDrop(tree(), "a", { _id: "c", position: "after" });
    expect(result.map((n) => n._id)).toEqual(["b", "c", "a"]);
  });

  it("moves a top-level node inside another, nesting it", () => {
    const result = applyDrop(tree(), "b", { _id: "c", position: "inside" });
    expect(result.map((n) => n._id)).toEqual(["a", "c"]);
    const c = findNodeById(result, "c")!;
    expect(c.children.map((n) => n._id)).toEqual(["b"]);
  });

  it("moves a nested node out to the top level", () => {
    const result = applyDrop(tree(), "a1", { _id: "b", position: "after" });
    expect(result.map((n) => n._id)).toEqual(["a", "b", "a1", "c"]);
    const a = findNodeById(result, "a")!;
    expect(a.children.map((n) => n._id)).toEqual(["a2"]);
  });

  it("rejects dropping a node into its own descendant (no-op)", () => {
    const original = tree();
    const result = applyDrop(original, "a", { _id: "a1", position: "after" });
    expect(result).toEqual(original);
  });

  it("rejects dropping a node onto itself (no-op)", () => {
    const original = tree();
    const result = applyDrop(original, "a", { _id: "a", position: "inside" });
    expect(result).toEqual(original);
  });

  it("is a no-op when the dragged id is missing", () => {
    const original = tree();
    const result = applyDrop(original, "missing", { _id: "b", position: "after" });
    expect(result).toBe(original);
  });
});
