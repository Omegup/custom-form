import type { AutoFocus } from "../autofocus.t";

export type Item = { del: boolean; name: string };

export type AutoFocusState = { id: string; value: boolean } | null;

export type Ctx = AutoFocus<{ autofocus: AutoFocusState }, boolean>;

export type Data = {
  items: Item[];
};

export type StoryArgs = Data;
