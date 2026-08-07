import type { FlatItems } from "./sectionViewDemoTypes.t";

export const SECTION_VIEW_INITIAL: FlatItems = [
  {
    section: {
      id: "s1",
      deleted: false,
      title: "Contact",
      description: "",
    },
  },
  {
    item: { id: "f1", type: "field", params: { name: "Name" }, deleted: false },
    n: 0,
  },
  {
    item: { id: "p1", type: "panel", params: { name: "Name & email" }, deleted: false },
    n: 2,
  },
  {
    item: { id: "f2", type: "field", params: { name: "First" }, deleted: false },
    n: 0,
  },
  { end: null },
  {
    item: { id: "f3", type: "field", params: { name: "Email" }, deleted: false },
    n: 0,
  },
  { end: null },
  {
    section: {
      id: "s2",
      deleted: false,
      title: "Details",
      description: "",
    },
  },
  {
    item: { id: "f4", type: "field", params: { name: "Notes" }, deleted: false },
    n: 0,
  },
];
