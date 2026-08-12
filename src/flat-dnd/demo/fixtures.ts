import type { FlatItems } from "./flatDndDemoTypes.t";

/** Two sections, a nested 2-column panel, and a deleted field — enough surface
 * to drag within a column, across sections, into a nested panel column, and
 * to see the soft-delete gate (deleted rows aren't draggable). */
export const FLAT_DND_INITIAL: FlatItems = [
  {
    section: { id: "s1", deleted: false, title: "Contact", description: "" },
  },
  { item: { id: "f1", type: "field", params: { name: "Name" }, deleted: false }, n: 0 },
  { item: { id: "f2", type: "field", params: { name: "Email" }, deleted: false }, n: 0 },
  {
    item: { id: "p1", type: "panel", params: { name: "Address" }, deleted: false },
    n: 2,
  },
  { item: { id: "f3", type: "field", params: { name: "Street" }, deleted: false }, n: 0 },
  { end: null },
  { item: { id: "f4", type: "field", params: { name: "City" }, deleted: false }, n: 0 },
  { end: null },
  { item: { id: "f5", type: "field", params: { name: "Old field" }, deleted: true }, n: 0 },
  {
    section: { id: "s2", deleted: false, title: "Details", description: "" },
  },
  { item: { id: "f6", type: "field", params: { name: "Notes" }, deleted: false }, n: 0 },
];
