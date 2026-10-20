import type { ReactNode } from "react";
import type * as lib from "./library";

export type TypeNames = "field" | "panel";

export type Params = lib.TheParams<{
  field: { name: string };
  panel: { name: string };
}>;

export type Variants = lib.TheVariants<Record<string, never>>;

export type Section = {
  id: string;
  deleted: boolean;
  title: string;
  description: string;
};

export type ItemMeta = lib.MetaDom<{
  index: number;
  total: number;
  sIndex: number;
}>;

/** Inner context before `AutoFocus` wrapping — the `Context` generic passed to library factories. */
export type BaseCtx = lib.ContextDom & { focused: lib.AutoFocusState };
export type Ctx = lib.AutoFocus<BaseCtx, boolean>;

export type FlatItems = lib.FlatFormItems<TypeNames, Params, Section>;

export type ListItem = lib.RecursiveFormItem<TypeNames, Params, ItemMeta>;

/** Looked up per item id — move actions for the row's `renderCard`. */
export type ItemExtra = lib.ExtraDom & {
  actions: lib.MoveActions;
};

export type StoryArgs = {
  flatItems: FlatItems;
  heading: string;
};

export type ListProps = {
  flatItems: FlatItems;
  updateArgs: (patch: Partial<StoryArgs>) => void;
  renderLayout?: (args: { list: ReactNode; sidebar: ReactNode }) => ReactNode;
};

export type DemoProps = StoryArgs & {
  updateArgs: (patch: Partial<StoryArgs>) => void;
};
