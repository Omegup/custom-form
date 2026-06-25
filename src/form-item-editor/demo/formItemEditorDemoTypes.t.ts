import type { Dispatch, SetStateAction } from "react";
import type * as lib from "./library";

export type Params = lib.TheParams<{ field: { name: string } }>;
export type EditingItem = lib.DemoRecursiveItem;
export type FlatItems = lib.FlatItems;

export type FieldExtra = lib.ItemEditExtraDom<{
  draft: EditingItem;
  setDraft: Dispatch<SetStateAction<EditingItem>>;
  /** Other field names in the form — checked in `useHook` before commit. */
  otherNames: string[];
  onCommit: () => void;
}>;

export type FieldState = lib.ItemEditStateDom<{
  save: () => void;
  saveError: string | null;
}>;

export type DialogArgs = lib.DialogArgsDom<{
  title: string;
  onCancel: () => void;
}>;

export type StoryArgs = {
  flatItems: FlatItems;
  heading: string;
};

export type DemoProps = StoryArgs & {
  updateArgs: (patch: Partial<StoryArgs>) => void;
};
