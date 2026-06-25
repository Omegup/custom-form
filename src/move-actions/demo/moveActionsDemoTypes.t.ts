import type * as lib from "./library";

export type Item = { del: boolean; name: string };
export type Ctx = lib.AutoFocus<
  { focused: lib.AutoFocusState; deleted: "show" | "jump" | "hide" },
  boolean
>;

export type Data = {
  items: Item[];
};
export type DemoProps = {
  items: Item[];
  updateArgs: (patch: Partial<Data>) => void;
};


