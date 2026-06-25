/**
 * HOC factory for single-item edit dialogs.
 * Ported from school form-item-edit-react/FormItemEditor.tsx.
 * See form-item-editor/README.md for wiring guide.
 */
import { useRef, type ReactNode, type RefObject } from "react";
import type { ContextDom, ParamsDom } from "./_deps";
import type {
  DialogArgsDom,
  Editors,
  FormItemEditorProps,
  FormItemEditorValidate,
  ItemEditExtraDom,
  ItemEditStateDom,
  SetError,
  UseFormItemEditor,
  UseFormItemEditorHook,
} from "./types";

export type { UseFormItemEditor, UseFormItemEditorFor } from "./types";

export const createFormItemEditorWrapper =
  <
    TypeNames extends string,
    Params extends ParamsDom<TypeNames>,
    Context extends ContextDom,
    DialogArgs extends DialogArgsDom,
    Extra extends {
      [K in TypeNames]: ItemEditExtraDom;
    },
    State extends Record<TypeNames, ItemEditStateDom>,
  >(
    editors: Editors<
      TypeNames,
      Params,
      Context,
      DialogArgs,
      Extra,
      State & {
        [K in TypeNames]: {
          impRef: RefObject<FormItemEditorValidate<Params, K> | null>;
        };
      }
    >,
    useHook: UseFormItemEditorHook<
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
  ): string extends TypeNames
    ? <K extends TypeNames>(
        props: FormItemEditorProps<Context, DialogArgs, Extra[K]>,
      ) => ReactNode
    : (
        props: FormItemEditorProps<Context, DialogArgs, Extra[TypeNames]>,
      ) => ReactNode =>
  <K extends TypeNames>(
    props: FormItemEditorProps<Context, DialogArgs, Extra[K]>,
  ) => {
    const mainImpRef = useRef<FormItemEditorValidate<Params, K> | null>(null);

    const useGenericHook = useHook as UseFormItemEditor<
      TypeNames,
      Params,
      Context,
      DialogArgs,
      Extra,
      State
    >;

    const state = useGenericHook(props, {
      validate: (value, setError: SetError<Params[K]>) => {
        mainImpRef.current?.validate(value, setError);
      },
    });
    const { recursiveFormItem, setFormItemParam } = state;

    const { ctx, dialogArgs } = props;
    const { header: formItem } = recursiveFormItem;
    const Editor = editors[formItem.type].editor;

    const cast = <
      T extends Record<K, unknown>,
      V extends Record<K, unknown>,
      K extends string,
    >(
      x: T[K] & V[K],
    ) => x as (T & V)[K];
    type AddedState = {
      [K in TypeNames]: {
        impRef: RefObject<FormItemEditorValidate<Params, K> | null>;
      };
    };
    const newState = cast<State, AddedState, K>({
      ...state.extra,
      impRef: mainImpRef,
    });

    return renderDialog(
      dialogArgs,
      state.extra,
      <Editor
        ctx={ctx}
        state={newState}
        formItem={formItem}
        setFormItemParam={(fn) => setFormItemParam((prev) => fn(prev.header))}
        render={(renderer) =>
          renderer({
            impRef: { current: { main: mainImpRef } },
            props,
            state: { ...state, extra: newState },
          })
        }
      />,
    );
  };
