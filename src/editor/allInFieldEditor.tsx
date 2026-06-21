import {
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
  type ReactNode,
  type RefObject,
} from "react";
import { branded } from "../form/branded";
import {
  createFormItemEditorWrapper,
  type DialogArgsDom,
  type Editor,
  type EditorProps,
  type FormItemEditorProps,
  type FormItemEditorState,
  type FormItemEditorValidate,
  type ItemEditStateDom,
  type UseFormItemEditor,
} from "../form-item-editor";
import type { RecursiveTypedFormItem } from "../recursive-form";
import type { ItemEditExtraApps } from "./types";
import type {
  EditFormCtx,
  EditFormItemMeta,
  EditFormFieldParams,
  EditFormSection,
  EditFormFieldTypeNames,
} from "../form-edit/fixtures";

type DialogArgs = DialogArgsDom<{ title: string; onClose: () => void }>;

type FieldExtraMap = ItemEditExtraApps<
  EditFormFieldTypeNames,
  EditFormFieldParams,
  EditFormSection,
  EditFormItemMeta
>;

type FieldEditorState = ItemEditStateDom<{
  save: () => void;
}>;

export type AllInEditorStateMap = { field: FieldEditorState };

const useFieldEditor: UseFormItemEditor<
  EditFormFieldTypeNames,
  EditFormFieldParams,
  EditFormCtx,
  DialogArgs,
  FieldExtraMap,
  AllInEditorStateMap
> = <K extends EditFormFieldTypeNames>(
  props: FormItemEditorProps<EditFormCtx, DialogArgs, FieldExtraMap[K]>,
  { validate }: FormItemEditorValidate<EditFormFieldParams, K>,
): FormItemEditorState<
  EditFormFieldTypeNames,
  EditFormFieldParams,
  K,
  AllInEditorStateMap[K]
> => {
  const { editFormItem, setEditFormItem } = props.extra;
  const [draft, setDraft] = useState(editFormItem);

  useEffect(() => {
    setDraft(editFormItem);
  }, [editFormItem]);

  const setFormItemParam = useCallback(
    <E extends keyof EditFormFieldParams[K]>(
      item: (
        previous: RecursiveTypedFormItem<
          EditFormFieldTypeNames,
          EditFormFieldParams,
          K,
          EditFormItemMeta
        >,
      ) => [E, EditFormFieldParams[K][E]],
    ) => {
      setDraft((prev) => {
        const [key, value] = item(prev);
        return {
          ...prev,
          header: {
            ...prev.header,
            params: { ...prev.header.params, [key]: value },
          },
        };
      });
    },
    [],
  );

  const save = useCallback(() => {
    let valid = true;
    validate(draft, {
      param: () => {
        valid = false;
      },
      section: () => {
        valid = false;
      },
    });
    if (!valid) return;
    setEditFormItem(draft, draft.children.length);
    props.dialogArgs.onClose();
  }, [draft, props.dialogArgs, setEditFormItem, validate]);

  const extra: FieldEditorState = branded({ save });

  return {
    recursiveFormItem: draft,
    setFormItemParam,
    setFormItemSection: () => {},
    extra,
  };
};

type FieldEditorStateWithRef = FieldEditorState & {
  impRef: RefObject<FormItemEditorValidate<EditFormFieldParams, "field"> | null>;
};

type FieldEditorProps = EditorProps<
  EditFormFieldTypeNames,
  EditFormFieldParams,
  "field",
  EditFormCtx,
  DialogArgs,
  FieldExtraMap["field"],
  FieldEditorStateWithRef
>;

const FieldEditorInner = ({
  formItem,
  setFormItemParam,
  impRef,
}: {
  formItem: FieldEditorProps["formItem"];
  setFormItemParam: FieldEditorProps["setFormItemParam"];
  impRef: FieldEditorProps["state"]["impRef"];
}) => {
  useImperativeHandle(impRef, () => ({
    validate: (value, setError) => {
      if (!value.header.params.name.trim()) {
        setError.param("name", "Name is required");
      }
    },
  }));

  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <span style={{ fontSize: 12, opacity: 0.7 }}>Name</span>
      <input
        value={formItem.params.name}
        onChange={(e) => setFormItemParam(() => ["name", e.target.value])}
        style={{ padding: "6px 8px", borderRadius: 4, border: "1px solid #ccc" }}
      />
    </label>
  );
};

const FieldEditor: Editor<
  EditFormFieldTypeNames,
  EditFormFieldParams,
  "field",
  EditFormCtx,
  DialogArgs,
  FieldExtraMap["field"],
  FieldEditorStateWithRef
> = ({ formItem, setFormItemParam, state }) => (
  <FieldEditorInner
    formItem={formItem}
    setFormItemParam={setFormItemParam}
    impRef={state.impRef}
  />
);

export const renderFieldItemDialog = (
  dialogArgs: DialogArgs,
  state: FieldEditorState,
  children: ReactNode,
) => (
  <div
    style={{
      border: "1px solid #b8d4f0",
      borderRadius: 8,
      overflow: "hidden",
      maxWidth: 360,
      background: "#e8f4fd",
      marginBottom: 12,
    }}
  >
    <div style={{ padding: "8px 12px", background: "#d4e9f7", fontSize: 13 }}>
      <strong>{dialogArgs.title}</strong>
    </div>
    <div style={{ padding: 12, display: "flex", flexDirection: "column", gap: 10 }}>
      {children}
    </div>
    <div
      style={{
        display: "flex",
        gap: 8,
        justifyContent: "flex-end",
        padding: "8px 12px",
        borderTop: "1px solid #b8d4f0",
      }}
    >
      <button type="button" onClick={dialogArgs.onClose}>
        Cancel
      </button>
      <button type="button" onClick={state.save}>
        Save
      </button>
    </div>
  </div>
);

export const allInFieldEditorConfig = {
  editors: { field: { editor: FieldEditor } },
  useFormItemEditor: useFieldEditor,
  renderDialog: renderFieldItemDialog,
};

export const DemoFieldItemEditor = createFormItemEditorWrapper<
  EditFormFieldTypeNames,
  EditFormFieldParams,
  EditFormCtx,
  DialogArgs,
  FieldExtraMap,
  AllInEditorStateMap
>(
  allInFieldEditorConfig.editors,
  allInFieldEditorConfig.useFormItemEditor,
  renderFieldItemDialog,
);
