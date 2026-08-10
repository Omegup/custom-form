import { describe, expect, it, vi } from "vitest";
import type { MetaDom, RecursiveFormItem, SectionNodes, SIndexed, TheParams } from "./_deps";
import { cleanNodes } from "./cleanNodes";
import { commitDrop } from "./commitDrop";
import type { DndTreeNode } from "./types";
import { toDndTree } from "./toDndTree";

type TypeNames = "field" | "panel";
type Params = TheParams<{
  field: { name: string };
  panel: { name: string };
}>;
type Meta = MetaDom<SIndexed>;
type Item = RecursiveFormItem<TypeNames, Params, Meta>;

const field = (
  id: string,
  index: number,
  opts: { deleted?: boolean } = {},
): Item => ({
  header: { id, type: "field", params: { name: id }, deleted: opts.deleted ?? false },
  meta: { index, total: 1, sIndex: 0 },
  children: [],
});

const panel = (
  id: string,
  index: number,
  total: number,
  children: Item[][],
  opts: { deleted?: boolean } = {},
): Item => ({
  header: { id, type: "panel", params: { name: id }, deleted: opts.deleted ?? false },
  meta: { index, total, sIndex: 0 },
  children,
});

const sectionNodes = (children: Item[][]): SectionNodes<TypeNames, Params> => ({
  index: 0,
  total: 1 + children.flat().reduce((n, item) => n + item.meta.total, 0),
  sIndex: 0,
  children,
});

const asColumn = (node: DndTreeNode<TypeNames, Params>) => {
  if (node.type !== "column") throw new Error(`expected a column node, got ${node.type}`);
  return node;
};

const asItem = (node: DndTreeNode<TypeNames, Params>) => {
  if (node.type !== "item") throw new Error(`expected an item node, got ${node.type}`);
  return node;
};

const itemIds = (column: DndTreeNode<TypeNames, Params>) =>
  column.children.map((n) => n._id);

describe("toDndTree", () => {
  it("builds one column node per section column, each item as a child", () => {
    const nodes = sectionNodes([[field("f1", 1), field("f2", 2)]]);
    const tree = toDndTree(nodes, { rootId: "s1", rootDeleted: false, showDeleted: true });
    expect(tree).toHaveLength(1);
    expect(itemIds(tree[0]!)).toEqual(["f1", "f2"]);
  });

  it("sets each column's add-item index via getFlatInsertionIndex (after the column's full span)", () => {
    const nodes = sectionNodes([[field("f1", 1)], [field("f2", 2)]]);
    const tree = toDndTree(nodes, { rootId: "s1", rootDeleted: false, showDeleted: true });
    expect(asColumn(tree[0]!).index).toBe(2);
    expect(asColumn(tree[1]!).index).toBe(3);
  });

  it("recurses into a panel's nested columns as the item node's children", () => {
    const nested = panel("p1", 1, 3, [[field("f1", 2)]]);
    const nodes = sectionNodes([[nested]]);
    const tree = toDndTree(nodes, { rootId: "s1", rootDeleted: false, showDeleted: true });
    const panelNode = tree[0]!.children[0]!;
    expect(panelNode._id).toBe("p1");
    expect(panelNode.children).toHaveLength(1);
    expect(itemIds(panelNode.children[0]!)).toEqual(["f1"]);
  });

  it("cascades parentDeleted onto nested items when a panel is deleted", () => {
    const nested = panel("p1", 1, 3, [[field("f1", 2)]], { deleted: true });
    const nodes = sectionNodes([[nested]]);
    const tree = toDndTree(nodes, { rootId: "s1", rootDeleted: false, showDeleted: true });
    const panelNode = asItem(tree[0]!.children[0]!);
    expect(panelNode.parentDeleted).toBe(false);
    const fieldNode = asItem(panelNode.children[0]!.children[0]!);
    expect(fieldNode.parentDeleted).toBe(true);
  });

  it("cascades parentDeleted from a deleted section root", () => {
    const nodes = sectionNodes([[field("f1", 1)]]);
    const tree = toDndTree(nodes, { rootId: "s1", rootDeleted: true, showDeleted: true });
    const itemNode = asItem(tree[0]!.children[0]!);
    expect(itemNode.parentDeleted).toBe(true);
  });

  describe("showDeleted", () => {
    it("keeps deleted items in the tree when true", () => {
      const nodes = sectionNodes([[field("f1", 1, { deleted: true }), field("f2", 2)]]);
      const tree = toDndTree(nodes, { rootId: "s1", rootDeleted: false, showDeleted: true });
      expect(itemIds(tree[0]!)).toEqual(["f1", "f2"]);
    });

    it("drops deleted items from the tree when false", () => {
      const nodes = sectionNodes([[field("f1", 1, { deleted: true }), field("f2", 2)]]);
      const tree = toDndTree(nodes, { rootId: "s1", rootDeleted: false, showDeleted: false });
      expect(itemIds(tree[0]!)).toEqual(["f2"]);
    });
  });
});

describe("cleanNodes", () => {
  it("round-trips toDndTree output back to the original column grid (ignoring meta)", () => {
    const nested = panel("p1", 1, 3, [[field("f1", 2)]]);
    const children: Item[][] = [[field("f0", 0), nested]];
    const tree = toDndTree(sectionNodes(children), {
      rootId: "s1",
      rootDeleted: false,
      showDeleted: true,
    });
    const result = cleanNodes(tree);
    const strip = (items: Item[][]): unknown =>
      items.map((col) => col.map((item) => ({ header: item.header, children: strip(item.children) })));
    expect(strip(result)).toEqual(strip(children));
  });

  it("reflects reordering applied to the dnd tree", () => {
    const children: Item[][] = [[field("f1", 1), field("f2", 2)]];
    const tree = toDndTree(sectionNodes(children), {
      rootId: "s1",
      rootDeleted: false,
      showDeleted: true,
    });
    const [col0] = tree;
    const reordered = [{ ...col0!, children: [col0!.children[1]!, col0!.children[0]!] }];
    const result = cleanNodes(reordered);
    expect(result[0]!.map((item) => item.header.id)).toEqual(["f2", "f1"]);
  });
});

describe("commitDrop", () => {
  const makeEdit = (children: Item[][]) => {
    const nodes = sectionNodes(children);
    const setNodes = vi.fn();
    const edit = {
      item: { id: "s1", deleted: false },
      autofocus: null,
      resetAutofocus: () => {},
      actions: { up: null, down: null, clone: null, remove: null, restore: null, isDeleted: false },
      nodes,
      setNodes,
    };
    return { edit, setNodes };
  };

  it("reorders two items within the same column", () => {
    const { edit, setNodes } = makeEdit([[field("f1", 1), field("f2", 2)]]);
    commitDrop(edit, {
      draggedId: "f2",
      target: { _id: "f1", position: "before" },
      showDeleted: true,
    });
    expect(setNodes).toHaveBeenCalledTimes(1);
    const written = setNodes.mock.calls[0]![0] as SectionNodes<TypeNames, Params>;
    expect(written.children[0]!.map((item) => item.header.id)).toEqual(["f2", "f1"]);
    // Keeps the section's own index/total/sIndex untouched.
    expect(written.index).toBe(edit.nodes.index);
    expect(written.sIndex).toBe(edit.nodes.sIndex);
  });

  it("moves an item into an empty nested panel column", () => {
    const nested = panel("p1", 2, 1, [[]]);
    const { edit, setNodes } = makeEdit([[field("f1", 1), nested]]);
    const [nestedColumnId] = toDndTree(edit.nodes, {
      rootId: "s1",
      rootDeleted: false,
      showDeleted: true,
    })[0]!.children[1]!.children.map((c) => c._id);

    commitDrop(edit, {
      draggedId: "f1",
      target: { _id: nestedColumnId!, position: "inside" },
      showDeleted: true,
    });

    const written = setNodes.mock.calls[0]![0] as SectionNodes<TypeNames, Params>;
    expect(written.children[0]!.map((item) => item.header.id)).toEqual(["p1"]);
    const movedPanel = written.children[0]![0]!;
    expect(movedPanel.children[0]!.map((item) => item.header.id)).toEqual(["f1"]);
  });

  it("is a no-op when dropping a node into its own descendant", () => {
    const nested = panel("p1", 1, 2, [[field("f1", 2)]]);
    const { edit, setNodes } = makeEdit([[nested]]);
    commitDrop(edit, {
      draggedId: "p1",
      target: { _id: "f1", position: "after" },
      showDeleted: true,
    });
    const written = setNodes.mock.calls[0]![0] as SectionNodes<TypeNames, Params>;
    expect(written.children[0]!.map((item) => item.header.id)).toEqual(["p1"]);
    expect(written.children[0]![0]!.children[0]!.map((item) => item.header.id)).toEqual(["f1"]);
  });
});
