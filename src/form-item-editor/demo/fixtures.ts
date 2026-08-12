import type { FlatItems } from "./formItemEditorDemoTypes.t";

export const FORM_ITEM_EDITOR_INITIAL: FlatItems = [
  {
    section: {
      id: "s1",
      deleted: false,
      title: "Personal",
      description: "Your info",
    },
  },
  {
    item: {
      id: "h1",
      type: "heading",
      params: { name: "Contact" },
      deleted: false,
    },
    n: 0,
  },
  {
    item: {
      id: "p1",
      type: "panel",
      params: { name: "Name & email", multiple: false },
      deleted: false,
    },
    n: 2,
  },
  {
    item: {
      id: "f1",
      type: "field",
      params: { name: "Name", required: true },
      deleted: false,
    },
    n: 0,
  },
  { end: null },
  {
    item: {
      id: "f2",
      type: "field",
      params: { name: "Email", required: false },
      deleted: false,
    },
    n: 0,
  },
  { end: null },
  {
    section: {
      id: "s2",
      deleted: false,
      title: "Details",
      description: "More fields",
    },
  },
  {
    item: {
      id: "h2",
      type: "heading",
      params: { name: "Notes section" },
      deleted: false,
    },
    n: 0,
  },
  {
    item: {
      id: "f3",
      type: "field",
      params: { name: "Notes", required: false },
      deleted: false,
    },
    n: 0,
  },
];
