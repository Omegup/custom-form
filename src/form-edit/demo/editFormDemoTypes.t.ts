import type { Dispatch, ReactNode, SetStateAction } from "react";
import type * as lib from "./library";

export type TypeNames = "field";
export type Params = lib.TheParams<{ field: { name: string } }>;
export type Section = {
  id: string;
  deleted: boolean;
  title: string;
  description: string;
};

export type DemoClone = lib.Clone<TypeNames, Params, unknown, Section>;

export type FlatItems = lib.FlatFormItems<TypeNames, Params, Section>;
export type EditFormSideArgs = {
  setFlatItems: Dispatch<SetStateAction<FlatItems>>;
  focus: (id: string) => void;
};

type BaseCtx = { focused: { id: string; focused: boolean } | null };
export type EditFormCtx = lib.AutoFocus<lib.ContextDom & BaseCtx, boolean>;

type ItemMeta = lib.MetaDom<{ index: number; total: number; sIndex: number }>;
export type DemoRecursiveItem = lib.RecursiveTypedFormItem<
  TypeNames,
  Params,
  "field",
  ItemMeta
>;

/** Consolidated section as rendered by EditFormTest — meta carries the flat span. */
export type DemoSection = lib.SectionWithItems<
  TypeNames,
  Params,
  Section,
  lib.SectionMetaDom<lib.Indexed>,
  ItemMeta
>;

export type EditorArgs = {
  draft: DemoRecursiveItem;
  setDraft: Dispatch<SetStateAction<DemoRecursiveItem>>;
  ctx: EditFormCtx;
  onSave: () => void;
  onCancel: () => void;
};

export type ExtraAction = { label: string; onClick: () => void };

/** Column "+ add" slot handed to `renderAddItem`. */
export type AddItemSlot = {
  section: DemoSection;
  /** Section ordinal — `sIndex` for insert sessions. */
  sIndex: number;
  colIndex: number;
  /** Flat index where a new item lands at the end of this column. */
  insertionIndex: number;
};

/** Rendered blocks handed to `renderLayout` so demos can add a sidebar. */
export type EditFormLayoutArgs = EditFormSideArgs & {
  alert: ReactNode;
  details: ReactNode;
  sections: ReactNode;
};

export type EditFormTestProps = {
  flatItems: FlatItems;
  updateArgs: (patch: Partial<Data>) => void;
  extra?: (item: DemoRecursiveItem) => ExtraAction[];
  sectionExtra?: (section: DemoSection) => ExtraAction[];
  renderAddItem?: (slot: AddItemSlot) => ReactNode;
  renderLayout?: (args: EditFormLayoutArgs) => ReactNode;
};

export type Data = {
  flatItems: FlatItems;
};

export type StoryArgs = Data & {
  heading: string;
};

export type DemoProps = StoryArgs & {
  updateArgs: (patch: Partial<StoryArgs>) => void;
};

export type PendingRemove = {
  rm: () => void;
  item: lib.FlatNestedItem<TypeNames, Params, Section>;
};
