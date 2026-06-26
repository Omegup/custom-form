import type { Dispatch, RefObject, ReactNode, SetStateAction } from "react";
import type * as lib from "./library";

export type TypeNames = "field" | "heading";
export type Params = lib.TheParams<{
  field: { name: string };
  heading: { text: string };
}>;
export type Section = {
  id: string;
  deleted: boolean;
  title: string;
  description: string;
};
export type ItemHeader = {
  [K in TypeNames]: lib.TypedFormItem<Params, K>;
}[TypeNames];
export type Ctx = lib.ContextDom;
export type ItemMeta = lib.MetaDom<{ index: number; total: number; sIndex: number }>;
export type EditingItem = lib.RecursiveFormItem<
  TypeNames,
  Params,
  ItemMeta
>;
export type FlatItems = lib.FlatFormItems<TypeNames, Params, Section>;

type ItemDraft = {
  draft: EditingItem;
  setDraft: Dispatch<SetStateAction<EditingItem>>;
  onCommit: () => void;
};

export type ItemExtra = lib.ItemEditExtraDom<
  ItemDraft & { otherNames: string[] }
>;

export type ItemState = lib.ItemEditStateDom<{
  save: () => void;
  saveError: string | null;
}>;

export type DialogArgs = lib.DialogArgsDom<{
  title: string;
  onCancel: () => void;
}>;

export type ItemValidate<K extends TypeNames = TypeNames> =
  lib.FormItemEditorValidate<Params, K>;

export type ItemEditorRuntimeState<K extends TypeNames = TypeNames> =
  ItemState & {
    impRef: RefObject<ItemValidate<K> | null>;
  };

export type UseItemEditor = lib.UseFormItemEditor<
  TypeNames,
  Params,
  Ctx,
  DialogArgs,
  ItemExtraMap,
  ItemStateMap
>;

export type ItemExtraMap = { field: ItemExtra; heading: ItemExtra };
export type ItemStateMap = { field: ItemState; heading: ItemState };

export type EditorProps<K extends TypeNames> = lib.FormItemEditorProps<
  Ctx,
  DialogArgs,
  ItemExtraMap[K]
>;

export type FieldEditorProps = {
  formItem: lib.TypedFormItem<Params, "field">;
  setFormItemParam: (item: () => ["name", string]) => void;
  state: ItemEditorRuntimeState<"field">;
  render: (ui: () => ReactNode) => ReactNode;
};

export type HeadingEditorProps = {
  formItem: lib.TypedFormItem<Params, "heading">;
  setFormItemParam: (item: () => ["text", string]) => void;
  state: ItemEditorRuntimeState<"heading">;
  render: (ui: () => ReactNode) => ReactNode;
};

export type StoryArgs = {
  flatItems: FlatItems;
  heading: string;
};

export type DemoProps = StoryArgs & {
  updateArgs: (patch: Partial<StoryArgs>) => void;
};
