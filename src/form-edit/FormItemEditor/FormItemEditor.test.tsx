import {
  useCallback,
  useImperativeHandle,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import { branded } from "../../form/branded";
import type { TheParams } from "../_deps";
import type { MetaDom, RecursiveTypedFormItem } from "../../recursive-form";
import {
  EditFormTest,
  type EditFormCtx,
  type EditFormEditingItem,
  type EditFormEditorProps,
} from "../EditForm.test";
import { FormItemEditHOC } from "./FormItemEditor";
import type {
  DialogArgsDom,
  EditorProps,
  FormItemEditorProps,
  ItemEditExtraDom,
  ItemEditStateDom,
  UseFormItemEditor,
} from "./types";

// ── Domain types ──────────────────────────────────────────────────────────────

type TypeNames = "field";
type Params = TheParams<{ field: { name: string } }>;
type Ctx = EditFormCtx;
type DialogArgs = DialogArgsDom<{ onClose: () => void; title: string }>;
type FieldExtra = ItemEditExtraDom<{
  draft: EditFormEditingItem;
  setDraft: Dispatch<SetStateAction<EditFormEditingItem>>;
}>;
type FieldState = ItemEditStateDom;

type ItemMeta = MetaDom<{ index: number; total: number; sIndex: number }>;

// ── useHook ───────────────────────────────────────────────────────────────────

const useFieldEditor = <K extends TypeNames>(
  props: FormItemEditorProps<Ctx, DialogArgs, FieldExtra>,
) => {
  const { draft, setDraft } = props.extra;

  const setFormItemParam = useCallback(
    <E extends keyof Params["field"]>(
      item: (previous: EditFormEditingItem) => [E, Params["field"][E]],
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
    [setDraft],
  );

  const setFormItemSection = useCallback((_sIndex: number) => {}, []);

  return {
    recursiveFormItem: draft as RecursiveTypedFormItem<
      TypeNames,
      Params,
      K,
      ItemMeta
    >,
    setFormItemParam,
    setFormItemSection,
    extra: branded({}) as FieldState,
  };
};

// ── Editor ────────────────────────────────────────────────────────────────────

type FieldEditorProps = EditorProps<
  TypeNames,
  Params,
  "field",
  Ctx,
  DialogArgs,
  FieldExtra,
  FieldState & {
    impRef: import("react").RefObject<
      import("./types").FormItemEditorValidate<Params, "field"> | null
    >;
  }
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
  const [nameError, setNameError] = useState<string | null>(null);

  useImperativeHandle(impRef, () => ({
    validate: (value, setError) => {
      const name = value.header.params.name.trim();
      if (!name) {
        setError.param("name", "Name is required");
        setNameError("Name is required");
      } else {
        setNameError(null);
      }
    },
  }));

  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <span style={{ fontSize: 12, opacity: 0.7 }}>Name</span>
      <input
        value={formItem.params.name}
        onChange={(e) => setFormItemParam(() => ["name", e.target.value])}
        style={{
          padding: "6px 8px",
          borderRadius: 4,
          border: `1px solid ${nameError ? "#c00" : "#ccc"}`,
        }}
      />
      {nameError && (
        <span style={{ color: "#c00", fontSize: 12 }}>{nameError}</span>
      )}
    </label>
  );
};

const FieldEditor = ({
  formItem,
  setFormItemParam,
  render,
}: FieldEditorProps) =>
  render(({ state: renderState }) => (
    <FieldEditorInner
      formItem={formItem}
      setFormItemParam={setFormItemParam}
      impRef={renderState.extra.impRef}
    />
  ));

const FormItemEdit = FormItemEditHOC(
  { field: { editor: FieldEditor } },
  useFieldEditor as UseFormItemEditor<
    TypeNames,
    Params,
    Ctx,
    DialogArgs,
    { field: FieldExtra },
    { field: FieldState }
  >,
  (dialogArgs, _state, children) => (
    <div
      style={{
        border: "1px solid #b8d4f0",
        borderRadius: 8,
        overflow: "hidden",
        maxWidth: 360,
        background: "#e8f4fd",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "8px 12px",
          background: "#d4e9f7",
          fontSize: 13,
        }}
      >
        <strong>{dialogArgs.title}</strong>
        <button
          onClick={dialogArgs.onClose}
          style={{ border: "none", background: "none", cursor: "pointer" }}
        >
          ✕
        </button>
      </div>
      <div style={{ padding: 12 }}>{children}</div>
    </div>
  ),
);

type FormItemEditFieldProps = FormItemEditorProps<Ctx, DialogArgs, FieldExtra>;
const FormItemEditField = FormItemEdit as (
  props: FormItemEditFieldProps,
) => React.ReactNode;

const EditFormFieldEditor = ({
  draft,
  setDraft,
  ctx,
  onClose,
}: EditFormEditorProps) => (
  <FormItemEditField
    ctx={ctx}
    dialogArgs={branded({
      title: `Edit ${draft.header.params.name}`,
      onClose,
    })}
    extra={branded({ draft, setDraft })}
  />
);

// ── Test UI ───────────────────────────────────────────────────────────────────

export const FormItemEditorTest = () => (
  <EditFormTest Editor={EditFormFieldEditor} />
);
