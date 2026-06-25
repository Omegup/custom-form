/**
 * Shared demo/test fixtures for the edit-form domain.
 * Used by module tests, Storybook all-in editor, and integration tests.
 */
import type { MetaDom , TheParams, TheVariants } from "../_deps";
import type { FlatItems } from "./editFormDemoTypes.t";

export type EditFormFieldTypeNames = "field";
export type EditFormFieldParams = TheParams<{ field: { name: string } }>;
export type EditFormFieldVariants = TheVariants<{ field: "default" }>;
export type EditFormItemMeta = MetaDom<{
  index: number;
  total: number;
  sIndex: number;
}>;
export type EditFormBaseCtx = {
  focused: { id: string; focused: boolean } | null;
};

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
