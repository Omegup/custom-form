/**
 * HOC factory for single-item edit dialogs.
 * Ported from school form-item-edit-react/FormItemEditor.tsx.
 * See form-item-editor/README.md for wiring guide.
 */
import { createRef, useRef, type ReactNode, type RefObject } from "react";
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
} from "./types";

export type { UseFormItemEditor } from "./types";

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
    props: FormItemEditorProps<Context, DialogArgs, Extra[K]>,
  ) => {
    const impRef = useRef<
      Record<string, RefObject<FormItemEditorValidate<Params, K> | null>>
    >({});
    const mainImpRef = createRef<FormItemEditorValidate<Params, K>>();
    impRef.current.main = mainImpRef;

    const state = useHook(props, {
      validate: (value, setError: SetError<Params[K]>) => {
        Object.values(impRef.current).forEach((ref) =>
          ref.current?.validate(value, setError),
        );
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
    const editorState = cast<State, AddedState, K>({
      ...state.extra,
      impRef: mainImpRef,
    });

    return renderDialog(
      dialogArgs,
      state.extra,
      <Editor
        ctx={ctx}
        state={editorState}
        formItem={formItem}
        setFormItemParam={(fn) => setFormItemParam((prev) => fn(prev.header))}
        render={(renderer) =>
          renderer({ impRef, props, state: { ...state, extra: editorState } })
        }
      />,
    );
  };
