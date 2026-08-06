import type { Dispatch, SetStateAction, ReactNode } from "react";
import type * as lib from "./library";

export type TypeNames = "field" | "heading" | "panel";

/**
 * Shared `name` on every type — school `ParamsDom<…, { name: string }>` /
 * `cloneFlatItems` rename without a type switch. Extra display belongs in viewers.
 */
export type Params = lib.TheParams<{
  field: { name: string };
  heading: { name: string };
  panel: { name: string };
}>;

export type Variants = lib.TheVariants<{
  field: "default";
  heading: "default";
  panel: "default";
}>;

export type Section = {
  id: string;
  deleted: boolean;
  title: string;
  description: string;
};

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

/**
 * Ambient context — raw form data every editor gets, no type-specific API.
 * `FieldEditor` reads `flatItems` itself to check name uniqueness; other
 * editors ignore it (same pattern as `accent` in the `form` demo ctx).
 */
export type Ctx = lib.ContextDom & { flatItems: FlatItems };

export type ItemMeta = lib.MetaDom<{
  index: number;
  total: number;
  sIndex: number;
}>;

export type ItemDraft = {
  /** Called after validate succeeds — commits the current draft as-is. */
  onCommit: <K extends TypeNames>(draft: lib.FlatFormItem<K, Params>) => void;
};

export type ItemExtra = lib.ItemEditExtraDom<ItemDraft>;
export type ItemExtraMap = { [K in TypeNames]: ItemExtra };

/**
 * Validate error bag — same shape as school formik validate
 * (`useFormItemEditor.ts`: `{ header?: { params: Errors<Params[K]> }; sIndex?: string }`).
 */
export type ItemValidateErrors<K extends TypeNames> = {
  header?: { params: lib.Errors<Params[K]> };
  sIndex?: string;
};

/** Per-type edit state — school `ItemEditStateApp` (`isError` / `isSectionError`). */
export type ItemState<K extends TypeNames> = lib.ItemEditStateDom<{
  save: () => void;
  isError: (param: keyof Params[K]) => boolean;
  isSectionError: boolean;
  errors: ItemValidateErrors<K>;
}>;

export type ItemStateMap = { [K in TypeNames]: ItemState<K> };

export type EditingDraft = lib.FlatFormItem<TypeNames, Params>;

/** Open edit session — draft for the editor + subtree needed to re-flatten when `n` changes. */
export type EditingSession = {
  draft: EditingDraft;
  children: ListItem[][];
  index: number;
  total: number;
};
export type DialogArgs = lib.DialogArgsDom<{
  title: ReactNode;
  onCancel: () => void;
}>;

export type NameExtra = lib.ExtraDom;

export type NameViewers = lib.Viewers<
  TypeNames,
  Params,
  Variants,
  NameExtra & lib.Children,
  NameExtra,
  Ctx,
  string
>;

export type Validate<K extends TypeNames> = lib.FormItemEditorValidate<
  TypeNames,
  Params,
  K
>;
export type ItemStateFor<K extends TypeNames> = lib.EditorHookResult<ItemState<K>>;
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
  ItemState<K>
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
