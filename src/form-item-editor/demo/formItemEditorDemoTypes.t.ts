import type { Dispatch, SetStateAction } from "react";
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

export type FlatItems = lib.FlatFormItems<TypeNames, Params, Section>;

export type ItemDraft = {
  onCommit: () => void;
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
export type FieldDraft = { item: FieldHeader; n: number };
export type HeadingDraft = { item: HeadingHeader; n: number };

export const isFieldDraft = (draft: EditingDraft): draft is FieldDraft =>
  draft.item.type === "field";

export const isHeadingDraft = (draft: EditingDraft): draft is HeadingDraft =>
  draft.item.type === "heading";

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

/** `setFormItemParam` passed into per-type editors (previous = item header). */
export type SetHeaderParam<K extends TypeNames> = <E extends ParamKey<K>>(
  item: (previous: lib.TypedFormItem<Params, K>) => [E, ParamValue<K, E>],
) => void;

/** `setFormItemParam` returned from `useItemEditor` (previous = recursive item). */
export type SetItemParam<K extends TypeNames> = <E extends ParamKey<K>>(
  item: (previous: TypedItem<K>) => [E, ParamValue<K, E>],
) => void;

export type ItemEditorRuntimeState = ItemState;

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

export type SetEditingDraft = Dispatch<SetStateAction<EditingDraft>>;

export type StoryArgs = {
  flatItems: FlatItems;
  heading: string;
};

export type DemoProps = StoryArgs & {
  updateArgs: (patch: Partial<StoryArgs>) => void;
};
