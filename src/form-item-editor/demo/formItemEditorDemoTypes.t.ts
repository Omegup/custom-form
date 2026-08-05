import type { Dispatch, RefObject, SetStateAction } from "react";
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
export type ItemMeta = lib.MetaDom<{ index: number; total: number; sIndex: number }>;

export type TypedItem<K extends TypeNames> =
  lib.RecursiveTypedFormItem<TypeNames, Params, K, ItemMeta>;
export type EditingItem = TypedItem<"field"> | TypedItem<"heading">;
export type ListItem = lib.RecursiveFormItem<TypeNames, Params, ItemMeta>;

export type ItemHeader = {
  [K in TypeNames]: lib.TypedFormItem<Params, K>;
}[TypeNames];
export type FieldHeader = lib.TypedFormItem<Params, "field">;
export type HeadingHeader = lib.TypedFormItem<Params, "heading">;

export type FlatItems = lib.FlatFormItems<TypeNames, Params, Section>;

type ItemDraft = {
  draft: EditingItem;
  setDraft: Dispatch<SetStateAction<EditingItem>>;
  onCommit: () => void;
  otherNames: string[];
};

export type ItemExtra = lib.ItemEditExtraDom<ItemDraft>;
export type ItemExtraMap = { field: ItemExtra; heading: ItemExtra };

export type ItemState = lib.ItemEditStateDom<{
  save: () => void;
  saveError: string | null;
}>;
export type ItemStateMap = { field: ItemState; heading: ItemState };

export type DialogArgs = lib.DialogArgsDom<{
  title: string;
  onCancel: () => void;
}>;

export type ValidateFor<K extends TypeNames> = lib.FormItemEditorValidate<Params, K>;
export type ItemStateFor<K extends TypeNames> = lib.FormItemEditorState<
  TypeNames,
  Params,
  K,
  ItemState
>;
export type EditorProps = lib.FormItemEditorProps<
  Ctx,
  DialogArgs,
  ItemExtra
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

export type ItemEditorRuntimeState<K extends TypeNames = TypeNames> = ItemState & {
  impRef: RefObject<ValidateFor<K> | null>;
};

type EditorPropsFor<K extends TypeNames> = Omit<
  lib.EditorProps<TypeNames, Params, K, Ctx, DialogArgs, ItemExtra, ItemState>,
  "state"
> & { state: ItemEditorRuntimeState<K> };

export type FieldEditorProps = EditorPropsFor<"field">;
export type HeadingEditorProps = EditorPropsFor<"heading">;

export type SetEditingItem = Dispatch<SetStateAction<EditingItem>>;

/** Active editor kind `K` always matches `draft.header.type` at runtime. */
export type TypedDraft<K extends TypeNames> = Extract<EditingItem, TypedItem<K>>;

export const typedDraft = <K extends TypeNames>(
  draft: EditingItem,
): TypedDraft<K> => draft as TypedDraft<K>;

export const patchItemParam = <K extends TypeNames, E extends ParamKey<K>>(
  draft: TypedDraft<K>,
  key: E,
  value: ParamValue<K, E>,
): EditingItem => ({
  ...draft,
  header: {
    ...draft.header,
    params: { ...draft.header.params, [key]: value },
  },
} as EditingItem);

export const asEditingItem = (item: ListItem): EditingItem => item as EditingItem;

export const isFieldItem = (item: EditingItem): item is TypedItem<"field"> =>
  item.header.type === "field";

export type StoryArgs = {
  flatItems: FlatItems;
  heading: string;
};

export type DemoProps = StoryArgs & {
  updateArgs: (patch: Partial<StoryArgs>) => void;
};
