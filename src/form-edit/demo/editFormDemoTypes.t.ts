import type { Dispatch, SetStateAction } from "react";
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

export type EditorArgs = {
  draft: DemoRecursiveItem;
  setDraft: Dispatch<SetStateAction<DemoRecursiveItem>>;
  ctx: EditFormCtx;
  onSave: () => void;
  onCancel: () => void;
};

export type ExtraAction = { label: string; onClick: () => void };

export type EditFormTestProps = {
  flatItems: FlatItems;
  updateArgs: (patch: Partial<Data>) => void;
  extra?: (item: DemoRecursiveItem) => ExtraAction[];
  sectionExtra?: (section: Section, meta: { cols: number }) => ExtraAction[];
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
  item: lib.FlatFormItem<TypeNames, Params, Section>;
};
