/**
 * HOC factory for single-item edit dialogs.
 * Ported from school form-item-edit-react/FormItemEditor.tsx.
 * See form-item-editor/README.md for wiring guide.
 */
import { createRef, useRef, type ReactNode, type RefObject } from "react";
import type { ContextDom, ParamsDom, FlatFormItem } from "./_deps";
import type {
  DialogArgsDom,
  Editors,
  FormItemEditorProps,
  FormItemEditorValidate,
  ItemEditExtraDom,
  ItemEditStateDom,
  UseFormItemEditor,
} from "./types";

export type { UseFormItemEditor } from "./types";

export const createFormItemEditorWrapper =
  <
    TypeNames extends string,
    Params extends ParamsDom<TypeNames>,
    Context extends ContextDom,
    DialogArgs extends DialogArgsDom,
    Extra extends Record<TypeNames, ItemEditExtraDom>,
    State extends Record<TypeNames, ItemEditStateDom>,
  >(
    editors: Editors<TypeNames, Params, Context, DialogArgs, Extra, State>,
    useHook: UseFormItemEditor<
      TypeNames,
      Params,
      Context,
      DialogArgs,
      Extra,
      State
    >,
    renderDialog: <K extends TypeNames>(
      extra: DialogArgs,
      state: State[K],
      children: ReactNode,
    ) => ReactNode,
  ) =>
  <K extends TypeNames>(
    props: FormItemEditorProps<
      Context,
      DialogArgs,
      Extra[K],
      TypeNames,
      Params,
      K
    >,
  ) => {
    const impRef = useRef<
      Record<
        string,
        RefObject<FormItemEditorValidate<TypeNames, Params, K> | null>
      >
    >({});
    const mainImpRef =
      createRef<FormItemEditorValidate<TypeNames, Params, K>>();
    impRef.current.main = mainImpRef;

    const hookResult = useHook<K>(props, {
      validate: (value, setError) => {
        Object.values(impRef.current).forEach((ref) =>
          ref.current?.validate(value, setError),
        );
      },
    });

    const { ctx, dialogArgs, formItem, setFormItem } = props;
    const Editor = editors[formItem.item.type].editor;

    const setFormItemParam = <E extends keyof Params[K]>(
      item: (previous: FlatFormItem<K, Params>) => [E, Params[K][E]],
    ) =>
      setFormItem((i) => {
        const [k, v] = item(i);
        const params: Params[K] = { ...i.item.params, [k]: v };
        return { ...i, item: { ...i.item, params } };
      });

    return renderDialog(
      dialogArgs,
      hookResult.state,
      <Editor
        ctx={ctx}
        hookResult={hookResult}
        impRef={impRef}
        props={props}
        flatFormItem={formItem}
        setFormItemParam={setFormItemParam}
      />,
    );
  };
