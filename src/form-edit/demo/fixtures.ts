/**
 * Shared demo/test fixtures for the edit-form domain.
 * Used by module tests, Storybook all-in editor, and integration tests.
 */
import type { FlatItems } from "./editFormDemoTypes.t";

export const EDIT_FORM_INITIAL: FlatItems = [
  {
    section: {
      id: "s1",
      deleted: false,
      title: "Personal",
      description: "Your info",
    },
  },
  {
    item: { id: "f1", type: "field", params: { name: "Name" }, deleted: false },
    n: 0,
  },
  { end: null },
  {
    item: {
      id: "f2",
      type: "field",
      params: { name: "Email" },
      deleted: false,
    },
    n: 0,
  },
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
      id: "f3",
      type: "field",
      params: { name: "Notes" },
      deleted: false,
    },
    n: 0,
  },
];
