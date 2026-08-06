import type { Dispatch, SetStateAction } from "react";
import type * as lib from "./library";

export type TypeNames = "field" | "heading" | "panel";
export type Params = lib.TheParams<{
  field: { name: string };
  heading: { text: string };
  panel: { title: string };
}>;
export type Section = {
  id: string;
  deleted: boolean;
  title: string;
  description: string;
};

export type Ctx = lib.ContextDom;
export type ItemMeta = lib.MetaDom<{
  index: number;
  total: number;
  sIndex: number;
}>;

export type TypedItem<K extends TypeNames> = lib.FlatFormItem<K, Params>;
export type ListItem = lib.RecursiveFormItem<TypeNames, Params, ItemMeta>;

export type ItemHeader = {
  [K in TypeNames]: lib.TypedFormItem<Params, K>;
}[TypeNames];
export type FieldHeader = lib.TypedFormItem<Params, "field">;
export type HeadingHeader = lib.TypedFormItem<Params, "heading">;
export type PanelHeader = lib.TypedFormItem<Params, "panel">;

export type FlatItems = lib.FlatFormItems<TypeNames, Params, Section>;
export type FlatEntry = FlatItems[number];

export type ItemDraft = {
  /** Called after validate succeeds — commits the current draft as-is. */
  onCommit: <K extends TypeNames>(draft: lib.FlatFormItem<K, Params>) => void;
  otherNames: string[];
};

export type ItemExtra = lib.ItemEditExtraDom<ItemDraft>;
export type ItemExtraMap = { [K in TypeNames]: ItemExtra };

export type ItemState = lib.ItemEditStateDom<{
  save: () => void;
  saveError: string | null;
}>;
export type ItemStateMap = { [K in TypeNames]: ItemState };

export type EditingDraft = lib.FlatFormItem<TypeNames, Params>;

/** Open edit session — draft for the editor + subtree needed to re-flatten when `n` changes. */
export type EditingSession = {
  draft: EditingDraft;
  children: ListItem[][];
  index: number;
  total: number;
};
export type DialogArgs = lib.DialogArgsDom<{
  title: string;
  onCancel: () => void;
}>;

export type Validate<K extends TypeNames> = lib.FormItemEditorValidate<
  TypeNames,
  Params,
  K
>;
export type ItemStateFor = lib.EditorHookResult<ItemState>;
export type EditorProps<K extends TypeNames> = lib.FormItemEditorProps<
  Ctx,
  DialogArgs,
  ItemExtra,
  TypeNames,
  Params,
  K
>;
export type UseItemEditor = lib.UseFormItemEditor<
  TypeNames,
  Params,
  Ctx,
  DialogArgs,
  ItemExtraMap,
  ItemStateMap
>;

export type ParamKey<K extends TypeNames> = keyof Params[K];
export type ParamValue<
  K extends TypeNames,
  E extends ParamKey<K>,
> = Params[K][E];

type EditorPropsFor<K extends TypeNames> = lib.EditorProps<
  TypeNames,
  Params,
  K,
  Ctx,
  DialogArgs,
  ItemExtra,
  ItemState
>;

export type FieldEditorProps = EditorPropsFor<"field">;
export type HeadingEditorProps = EditorPropsFor<"heading">;
export type PanelEditorProps = EditorPropsFor<"panel">;

export type SetEditingSession = Dispatch<SetStateAction<EditingSession | null>>;

export type StoryArgs = {
  flatItems: FlatItems;
  heading: string;
};

export type DemoProps = StoryArgs & {
  updateArgs: (patch: Partial<StoryArgs>) => void;
};
