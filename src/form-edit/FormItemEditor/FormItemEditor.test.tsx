import {
  useCallback,
  useImperativeHandle,
  useMemo,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import { branded } from "../../form/branded";
import type { ContextDom, TheParams } from "../_deps";
import type { MetaDom, RecursiveTypedFormItem } from "../../recursive-form";
import { FormItemEditHOC } from "./FormItemEditor";
import type {
  DialogArgsDom,
  EditorProps,
  FormItemEditorProps,
  FormItemEditorValidate,
  ItemEditExtraDom,
  ItemEditStateDom,
  UseFormItemEditor,
} from "./types";

// ── Domain types ──────────────────────────────────────────────────────────────

type TypeNames = "field";
type Params = TheParams<{ field: { name: string; label: string } }>;
type Ctx = ContextDom & { accent: string };
type DialogArgs = DialogArgsDom<{ onClose: () => void; title: string }>;
type FieldExtra = ItemEditExtraDom<{
  sIndex: number;
  draft: FieldItem;
  setDraft: Dispatch<SetStateAction<FieldItem>>;
}>;
type FieldState = ItemEditStateDom;

type ItemMeta = MetaDom<{ index: number }>;
type FieldItem = RecursiveTypedFormItem<TypeNames, Params, "field", ItemMeta>;

const makeItem = (params: Params["field"]): FieldItem => ({
  header: {
    id: "f1",
    type: "field",
    params,
    deleted: false,
  },
  meta: { index: 0 },
  children: [],
});

// ── useHook ───────────────────────────────────────────────────────────────────

const useFieldEditor = <K extends TypeNames>(
  props: FormItemEditorProps<Ctx, DialogArgs, FieldExtra>,
) => {
  const { draft, setDraft } = props.extra;

  const setFormItemParam = useCallback(
    <E extends keyof Params["field"]>(
      item: (previous: FieldItem) => [E, Params["field"][E]],
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
  accent,
}: {
  formItem: FieldEditorProps["formItem"];
  setFormItemParam: FieldEditorProps["setFormItemParam"];
  impRef: FieldEditorProps["state"]["impRef"];
  accent: string;
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
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <span style={{ fontSize: 12, opacity: 0.7 }}>Name (param key)</span>
        <input
          value={formItem.params.name}
          onChange={(e) =>
            setFormItemParam(() => ["name", e.target.value])
          }
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
      <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <span style={{ fontSize: 12, opacity: 0.7 }}>Label</span>
        <input
          value={formItem.params.label}
          onChange={(e) =>
            setFormItemParam(() => ["label", e.target.value])
          }
          style={{
            padding: "6px 8px",
            borderRadius: 4,
            border: `1px solid ${accent}`,
          }}
        />
      </label>
    </div>
  );
};

const FieldEditor = ({
  formItem,
  setFormItemParam,
  render,
  ctx,
}: FieldEditorProps) =>
  render(({ state: renderState }) => (
    <FieldEditorInner
      formItem={formItem}
      setFormItemParam={setFormItemParam}
      impRef={renderState.extra.impRef}
      accent={ctx.accent}
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
        border: "1px solid #ccc",
        borderRadius: 8,
        overflow: "hidden",
        maxWidth: 360,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "8px 12px",
          background: "#f2f2f2",
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

// ── Test UI ───────────────────────────────────────────────────────────────────

export const FormItemEditorTest = () => {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<FieldItem>(() =>
    makeItem({ name: "email", label: "Email address" }),
  );
  const ctx = useMemo((): Ctx => branded({ accent: "#4a90d9" }), []);

  return (
    <div
      style={{ display: "flex", flexDirection: "column", gap: 16, padding: 16 }}
    >
      <h2 style={{ margin: 0 }}>Form item editor test</h2>

      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <button
          onClick={() => setOpen(true)}
          style={{ padding: "6px 12px", borderRadius: 4 }}
        >
          Edit field
        </button>
        <span style={{ fontSize: 13, color: "#666" }}>
          Current: <strong>{draft.header.params.label}</strong> (
          {draft.header.params.name})
        </span>
      </div>

      {open && (
        <FormItemEditField
          ctx={ctx}
          dialogArgs={branded({
            title: "Edit field",
            onClose: () => setOpen(false),
          })}
          extra={branded({ sIndex: 0, draft, setDraft })}
        />
      )}

      <details>
        <summary
          style={{
            fontSize: 12,
            cursor: "pointer",
            color: "#888",
            userSelect: "none",
          }}
        >
          Item (JSON)
        </summary>
        <pre
          style={{
            marginTop: 6,
            fontSize: 11,
            background: "#f8f8f8",
            padding: 10,
            borderRadius: 4,
            overflow: "auto",
            maxHeight: 200,
          }}
        >
          {JSON.stringify(draft.header, null, 2)}
        </pre>
      </details>
    </div>
  );
};
