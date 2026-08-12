import { describe, expect, it } from "vitest";
import type { TreeNode } from "./types";
import {
  collectSubtreeIds,
  findNodeById,
  insertNode,
  insertNodeIn,
  isDescendant,
  moveNode,
  removeNode,
} from "./utils";

type Leaf = { label: string };

const node = (
  _id: string,
  label: string,
  children: TreeNode<Leaf>[] = [],
): TreeNode<Leaf> => ({ _id, label, children });

const tree = (): TreeNode<Leaf>[] => [
  node("a", "A", [node("a1", "A1"), node("a2", "A2", [node("a2a", "A2a")])]),
  node("b", "B"),
  node("c", "C"),
];

describe("findNodeById", () => {
  it("finds a top-level node", () => {
    expect(findNodeById(tree(), "b")?.label).toBe("B");
  });

  it("finds a nested node", () => {
    expect(findNodeById(tree(), "a2a")?.label).toBe("A2a");
  });

  it("returns null when missing", () => {
    expect(findNodeById(tree(), "missing")).toBeNull();
  });
});

describe("isDescendant", () => {
  it("is true for the node itself", () => {
    const a = findNodeById(tree(), "a")!;
    expect(isDescendant(a, "a")).toBe(true);
  });

  it("is true for a nested descendant", () => {
    const a = findNodeById(tree(), "a")!;
    expect(isDescendant(a, "a2a")).toBe(true);
  });

  it("is false for an unrelated node", () => {
    const a = findNodeById(tree(), "a")!;
    expect(isDescendant(a, "b")).toBe(false);
  });
});

describe("collectSubtreeIds", () => {
  it("collects the node and all descendant ids", () => {
    const a = findNodeById(tree(), "a")!;
    expect(collectSubtreeIds(a)).toEqual(["a", "a1", "a2", "a2a"]);
  });

  it("collects just the id for a leaf", () => {
    const b = findNodeById(tree(), "b")!;
    expect(collectSubtreeIds(b)).toEqual(["b"]);
  });
});

describe("removeNode", () => {
  it("removes a top-level node", () => {
    const result = removeNode(tree(), "b");
    expect(result.map((n) => n._id)).toEqual(["a", "c"]);
  });

  it("removes a nested node, keeping its siblings", () => {
    const result = removeNode(tree(), "a1");
    const a = findNodeById(result, "a")!;
    expect(a.children.map((n) => n._id)).toEqual(["a2"]);
  });

  it("removing the whole subtree drops its descendants too", () => {
    const result = removeNode(tree(), "a");
    expect(findNodeById(result, "a2a")).toBeNull();
  });

  it("is a no-op when the id is not present", () => {
    const original = tree();
    expect(removeNode(original, "missing")).toEqual(original);
  });

  it("does not mutate the input", () => {
    const original = tree();
    removeNode(original, "b");
    expect(original.map((n) => n._id)).toEqual(["a", "b", "c"]);
  });
});

describe("insertNode", () => {
  it("inserts before the target at the top level", () => {
    const result = insertNode(tree(), node("x", "X"), { _id: "b", position: "before" });
    expect(result.map((n) => n._id)).toEqual(["a", "x", "b", "c"]);
  });

  it("inserts after the target at the top level", () => {
    const result = insertNode(tree(), node("x", "X"), { _id: "b", position: "after" });
    expect(result.map((n) => n._id)).toEqual(["a", "b", "x", "c"]);
  });

  it("inserts inside the target, prepending to its children", () => {
    const result = insertNode(tree(), node("x", "X"), { _id: "a", position: "inside" });
    const a = findNodeById(result, "a")!;
    expect(a.children.map((n) => n._id)).toEqual(["x", "a1", "a2"]);
  });

  it("inserts before/after a nested node", () => {
    const result = insertNode(tree(), node("x", "X"), { _id: "a1", position: "after" });
    const a = findNodeById(result, "a")!;
    expect(a.children.map((n) => n._id)).toEqual(["a1", "x", "a2"]);
  });
});

describe("insertNodeIn", () => {
  it("prepends at the root when parentId is null", () => {
    const result = insertNodeIn(tree(), node("x", "X"), null);
    expect(result.map((n) => n._id)).toEqual(["x", "a", "b", "c"]);
  });

  it("inserts as the first child of the given parent", () => {
    const result = insertNodeIn(tree(), node("x", "X"), "a");
    const a = findNodeById(result, "a")!;
    expect(a.children.map((n) => n._id)).toEqual(["x", "a1", "a2"]);
  });
});

describe("moveNode", () => {
  it("moves a top-level node up", () => {
    const result = moveNode(tree(), "b", "up");
    expect(result.map((n) => n._id)).toEqual(["b", "a", "c"]);
  });

  it("moves a top-level node down", () => {
    const result = moveNode(tree(), "b", "down");
    expect(result.map((n) => n._id)).toEqual(["a", "c", "b"]);
  });

  it("is a no-op moving the first node up", () => {
    const result = moveNode(tree(), "a", "up");
    expect(result.map((n) => n._id)).toEqual(["a", "b", "c"]);
  });

  it("is a no-op moving the last node down", () => {
    const result = moveNode(tree(), "c", "down");
    expect(result.map((n) => n._id)).toEqual(["a", "b", "c"]);
  });

  it("moves a nested node within its own siblings", () => {
    const result = moveNode(tree(), "a2", "up");
    const a = findNodeById(result, "a")!;
    expect(a.children.map((n) => n._id)).toEqual(["a2", "a1"]);
  });

  it("is a no-op for an unknown id", () => {
    const original = tree();
    expect(moveNode(original, "missing", "up")).toEqual(original);
  });
});
