/** Form item editor types — see form-item-editor/README.md. */
import type React from "react";
import type { Branded, ContextDom, ParamsDom, TypedFormItem } from "./_deps";
import type { Header, MetaDom, RecursiveTypedFormItem } from "./_deps";

export type Errors<Params> = { [P in keyof Params]?: string };
export type DialogArgsDom<T = {}> = Branded<T, "item-edit-dialog">;
export type ItemEditExtraDom<T = {}> = Branded<T, "item-edit-extra">;
export type ItemEditStateDom<T = {}> = Branded<T, "item-edit-state">;

export type FormItemEditorProps<
  Context extends ContextDom,
  DialogArgs extends DialogArgsDom,
  Extra extends ItemEditExtraDom,
> = {
  ctx: Context;
  dialogArgs: DialogArgs;
  extra: Extra;
};

export type FormItemEditorState<
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
  K extends TypeNames,
  Extra extends ItemEditStateDom,
> = {
  recursiveFormItem: RecursiveTypedFormItem<TypeNames, Params, K, MetaDom>;
  setFormItemParam: <E extends keyof Params[K]>(
    item: (
      previous: RecursiveTypedFormItem<TypeNames, Params, K, MetaDom>,
    ) => [E, Params[K][E]],
  ) => void;
  setFormItemSection: (sIndex: number) => void;
  extra: Extra;
};

export type SetError<Param> = {
  param: (name: keyof Param, error: string) => void;
  section: (error: string) => void;
};

export type FormItemEditorValidate<
  Params extends ParamsDom<K>,
  K extends string,
> = {
  validate: (
    value: Header<TypedFormItem<Params, K>, MetaDom>,
    setError: SetError<Params[K]>,
  ) => void;
};

export type RenderFunctionArgs<
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
  K extends TypeNames,
  Context extends ContextDom,
  DialogArgs extends DialogArgsDom,
  Extra extends ItemEditExtraDom,
  State extends ItemEditStateDom,
> = {
  props: FormItemEditorProps<Context, DialogArgs, Extra>;
  state: FormItemEditorState<TypeNames, Params, K, State>;
  impRef: React.MutableRefObject<
    Record<string, React.RefObject<FormItemEditorValidate<Params, K> | null>>
  >;
};

export type RenderFunctionData<
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
  K extends TypeNames,
  Context extends ContextDom,
  DialogArgs extends DialogArgsDom,
  Extra extends ItemEditExtraDom,
  State extends ItemEditStateDom,
  Data,
> = (
  args: RenderFunctionArgs<
    TypeNames,
    Params,
    K,
    Context,
    DialogArgs,
    Extra,
    State
  >,
) => Data;

export type RenderFunction<
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
  K extends TypeNames,
  Context extends ContextDom,
  DialogArgs extends DialogArgsDom,
  Extra extends ItemEditExtraDom,
  State extends ItemEditStateDom,
> = RenderFunctionData<
  TypeNames,
  Params,
  K,
  Context,
  DialogArgs,
  Extra,
  State,
  React.ReactNode
>;

export type EditorProps<
  out TypeNames extends string,
  in out Params extends ParamsDom<TypeNames>,
  in out K extends TypeNames,
  out Context extends ContextDom,
  out DialogArgs extends DialogArgsDom,
  out Extra extends ItemEditExtraDom,
  out State extends ItemEditStateDom,
> = {
  formItem: TypedFormItem<Params, K>;
  ctx: Context;
  state: State;
  setFormItemParam: <E extends keyof Params[K]>(
    item: (previous: TypedFormItem<Params, K>) => [E, Params[K][E]],
  ) => void;
  render: (
    fct: RenderFunction<
      TypeNames,
      Params,
      K,
      Context,
      DialogArgs,
      Extra,
      State
    >,
  ) => React.ReactNode;
};
export type Editor<
  in TypeNames extends string,
  in out Params extends ParamsDom<TypeNames>,
  in out K extends TypeNames,
  in Context extends ContextDom,
  in DialogArgs extends DialogArgsDom,
  in Extra extends ItemEditExtraDom,
  in State extends ItemEditStateDom,
> = (
  props: EditorProps<TypeNames, Params, K, Context, DialogArgs, Extra, State>,
) => React.ReactNode;

export type Editors<
  in TypeNames extends string,
  in out Params extends ParamsDom<TypeNames>,
  in Context extends ContextDom,
  in DialogArgs extends DialogArgsDom,
  in Extra extends Record<TypeNames, ItemEditExtraDom>,
  in State extends Record<TypeNames, ItemEditStateDom>,
> = {
  [K in TypeNames]: {
    editor: Editor<
      TypeNames,
      Params,
      K,
      Context,
      DialogArgs,
      Extra[K],
      State[K]
    >;
  };
};

export type UseFormItemEditor<
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
  Context extends ContextDom,
  DialogArgs extends DialogArgsDom,
  Extra extends Record<TypeNames, ItemEditExtraDom>,
  State extends Record<TypeNames, ItemEditStateDom>,
> = <K extends TypeNames>(
  props: FormItemEditorProps<Context, DialogArgs, Extra[K]>,
  args: FormItemEditorValidate<Params, K>,
  k?: K,
) => FormItemEditorState<TypeNames, Params, K, State[K]>;
