/**
 * Demo: EditFormTest + per-field edit dialog via createFormItemEditorWrapper.
 * Wires extra → open editor → patch flatItems on save.
 */
import {
  useCallback,
  useImperativeHandle,
  useState,
  type Dispatch,
  type ReactNode,
  type RefObject,
  type SetStateAction,
} from "react";
import { branded } from "./_deps";
import type { TheParams } from "./_deps";
import type { MetaDom, RecursiveTypedFormItem } from "./_deps";
import {
    container,
  EditFormTest,
  type EditFormCtx,
  type EditFormEditingItem,
} from "../form-edit/EditForm.test";
import { createFormItemEditorWrapper } from "./createFormItemEditorWrapper";
import type {
  DialogArgsDom,
  EditorProps,
  FormItemEditorProps,
  FormItemEditorValidate,
  FormItemEditorState,
  ItemEditExtraDom,
  ItemEditStateDom,
  UseFormItemEditor,
} from "./types";

// ── Domain types ──────────────────────────────────────────────────────────────

type TypeNames = "field";
type Params = TheParams<{ field: { name: string } }>;
type Ctx = EditFormCtx;
type DialogArgs = DialogArgsDom<{
  onSave: () => void;
  onCancel: () => void;
  title: string;
}>;
type EditorExtraMap = {
  [K in TypeNames]: ItemEditExtraDom<{
    draft: RecursiveTypedFormItem<TypeNames, Params, K, MetaDom>;
    setDraft: Dispatch<
      SetStateAction<RecursiveTypedFormItem<TypeNames, Params, K, MetaDom>>
    >;
  }>;
};
type FieldExtra = EditorExtraMap["field"];
type FieldState = ItemEditStateDom;
type EditorStateMap = { field: FieldState };
type FieldEditorState = FieldState & {
  impRef: RefObject<FormItemEditorValidate<Params, "field"> | null>;
};

const emptyFieldState = (): FieldState => branded({});

// ── Helpers ───────────────────────────────────────────────────────────────────

const makeFieldExtra = (
  draft: FieldExtra["draft"],
  setDraft: Dispatch<SetStateAction<FieldExtra["draft"] | null>>,
): FieldExtra =>
  branded({
    draft,
    setDraft(updater) {
      setDraft((prev) => {
        const current = prev ?? draft;
        return typeof updater === "function" ? updater(current) : updater;
      });
    },
  });

// ── useHook ───────────────────────────────────────────────────────────────────

const useFieldEditor: UseFormItemEditor<
  TypeNames,
  Params,
  Ctx,
  DialogArgs,
  EditorExtraMap,
  EditorStateMap
> = <K extends TypeNames>(
  props: FormItemEditorProps<Ctx, DialogArgs, EditorExtraMap[K]>,
  _args: FormItemEditorValidate<Params, K>,
): FormItemEditorState<
  TypeNames,
  Params,
  K,
  EditorStateMap[K]
> => {
  const { draft, setDraft } = props.extra;

  const setFormItemParam = useCallback(
    <E extends keyof Params[K]>(
      item: (
        previous: RecursiveTypedFormItem<TypeNames, Params, K, MetaDom>,
      ) => [E, Params[K][E]],
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
    recursiveFormItem: draft,
    setFormItemParam,
    setFormItemSection,
    extra: emptyFieldState(),
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
  FieldEditorState
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
  state,
}: FieldEditorProps) => (
  <FieldEditorInner
    formItem={formItem}
    setFormItemParam={setFormItemParam}
    impRef={state.impRef}
  />
);

const FormItemEditorWrapper: (
  props: FormItemEditorProps<Ctx, DialogArgs, FieldExtra>,
) => ReactNode = createFormItemEditorWrapper<
  TypeNames,
  Params,
  Ctx,
  DialogArgs,
  EditorExtraMap,
  EditorStateMap
>(
  { field: { editor: FieldEditor } },
  useFieldEditor,
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
          padding: "8px 12px",
          background: "#d4e9f7",
          fontSize: 13,
        }}
      >
        <strong>{dialogArgs.title}</strong>
      </div>
      <div style={{ padding: 12 }}>{children}</div>
      <div
        style={{
          display: "flex",
          gap: 8,
          justifyContent: "flex-end",
          padding: "8px 12px",
          borderTop: "1px solid #b8d4f0",
        }}
      >
        <button
          onClick={dialogArgs.onCancel}
          style={{ padding: "4px 12px", borderRadius: 4 }}
        >
          Cancel
        </button>
        <button
          onClick={dialogArgs.onSave}
          style={{ padding: "4px 12px", borderRadius: 4 }}
        >
          Save
        </button>
      </div>
    </div>
  ),
);

// ── Test UI ───────────────────────────────────────────────────────────────────

export const FormItemEditorTest = () => {
  const [draft, setDraft] = useState<FieldExtra["draft"] | null>(null);

  const openEditor = (item: EditFormEditingItem) => setDraft(item);

  const cancelEditor = useCallback(() => setDraft(null), []);

  return container(
    "Form item editor",
    <EditFormTest
      extra={(item) => [{ label: "Edit", onClick: () => openEditor(item) }]}
      renderLayout={({ sections, alert, details, ctx, setFlatItems }) => (
        <>
          {alert}
          {draft && (
            <FormItemEditorWrapper
              ctx={ctx}
              dialogArgs={branded({
                title: `Edit ${draft.header.params.name}`,
                onSave: () => {
                  setFlatItems((prev) =>
                    prev.map((fi) =>
                      "item" in fi && fi.item.id === draft.header.id
                        ? { item: draft.header, n: fi.n }
                        : fi,
                    ),
                  );
                  setDraft(null);
                },
                onCancel: cancelEditor,
              })}
              extra={makeFieldExtra(draft, setDraft)}
            />
          )}
          {sections}
          {details}
        </>
      )}
    />
  );
};
