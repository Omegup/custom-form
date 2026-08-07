import type * as types from "./sideMenuDemoTypes.t";

/** Shared catalog — also imported by the edit-section demo. */
export const MENU_ITEMS: types.DemoMenuItem[] = [
  { title: "Field", icon: "✎", header: { type: "field", params: { name: "" } } },
  {
    title: "Heading",
    icon: "§",
    header: { type: "heading", params: { name: "" } },
  },
  {
    title: "Panel (2 columns)",
    icon: "▦",
    n: 2,
    header: { type: "panel", params: { name: "" } },
  },
];

export const randomId = () => `id_${Math.random().toString(36).slice(2, 7)}`;
