import type { Dispatch, RefObject, ReactNode, SetStateAction } from "react";
import type * as lib from "./library";
import type * as formDemo from "./formDemo";

export type TypeNames = "field";
export type Params = lib.TheParams<{ field: { name: string } }>;
export type FieldParams = Params[TypeNames];
export type Ctx = lib.ContextDom;
export type EditingItem = formDemo.DemoRecursiveItem;
export type FlatItems = formDemo.FlatItems;

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

export type FieldValidate = lib.FormItemEditorValidate<Params, TypeNames>;

export type FieldEditorRuntimeState = FieldState & {
  impRef: RefObject<FieldValidate | null>;
};

export type UseFieldEditor = lib.UseFormItemEditor<
  TypeNames,
  Params,
  Ctx,
  DialogArgs,
  { field: FieldExtra },
  { field: FieldState }
>;

export type FieldExtraMap = { [K in TypeNames]: FieldExtra };
export type FieldStateMap = { [K in TypeNames]: FieldState };

export type EditorProps = lib.FormItemEditorProps<Ctx, DialogArgs, FieldExtra>;

export type FieldEditorProps = {
  formItem: { params: FieldParams };
  setFormItemParam: (item: () => ["name", FieldParams["name"]]) => void;
  state: FieldEditorRuntimeState;
  render: (ui: () => ReactNode) => ReactNode;
};

export type StoryArgs = {
  flatItems: FlatItems;
  heading: string;
};

export type DemoProps = StoryArgs & {
  updateArgs: (patch: Partial<StoryArgs>) => void;
};
