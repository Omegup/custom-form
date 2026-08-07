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

/** One choice in the section picker — school `sections.map(p => ({ value: p.index, label: p.header.title }))`. */
export type SectionOption = { index: number; title: string };

/**
 * Present only on **insert** sessions (`index === -1` — side-menu "add",
 * school `add: editFormItem.index === -1`); undefined for edits and for
 * slot inserts (`edit-section`, which already has a concrete `index`).
 * `withSectionPicker` (below) reads this to render/validate the section
 * `<select>` when there is more than one non-deleted section to choose from.
 */
export type SectionPicker = {
  sIndex: number;
  setSIndex: (sIndex: number) => void;
  sections: SectionOption[];
};

export type ItemDraft = {
  /** Called after validate succeeds — commits the current draft as-is. */
  onCommit: <K extends TypeNames>(draft: lib.FlatFormItem<K, Params>) => void;
  sectionPicker?: SectionPicker;
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

/** Open edit session — `form-edit` shape: draft + subtree + flat span. */
export type EditingSession = lib.FlatFormItemEditSession<TypeNames, Params>;
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

/** Per-type `Editor` component props — school `EditorProps` (props/state/impRef bag). */
export type EditorPropsFor<K extends TypeNames> = lib.EditorProps<
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

/** Consolidated section as rendered by the list shell — meta carries the flat span. */
export type ListSection = lib.SectionWithItems<
  TypeNames,
  Params,
  Section,
  lib.SectionMetaDom<lib.Indexed>,
  ItemMeta
>;

/** Column "+ add" slot handed to `renderAddItem` (see form-edit `EditFormTest`). */
export type AddItemSlot = {
  section: ListSection;
  /** Section ordinal — `sIndex` for insert sessions. */
  sIndex: number;
  colIndex: number;
  /** Flat index where a new item lands at the end of this column. */
  insertionIndex: number;
};

/** Rendered blocks handed to `renderLayout` so demos can add a sidebar. */
export type ListLayoutArgs = {
  alert: ReactNode;
  details: ReactNode;
  sections: ReactNode;
  setFlatItems: Dispatch<SetStateAction<FlatItems>>;
  focus: (id: string) => void;
};

export type StoryArgs = {
  flatItems: FlatItems;
  heading: string;
};

export type DemoProps = StoryArgs & {
  updateArgs: (patch: Partial<StoryArgs>) => void;
};
