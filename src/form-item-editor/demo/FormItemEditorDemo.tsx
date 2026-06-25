/**
 * Demo: EditFormTest + `createFormItemEditorWrapper`.
 *
 * Wiring shown here:
 * 1. `useHook` — draft state; `save` calls `validate` then `onCommit`
 * 2. `Editor` — `useImperativeHandle(state.impRef)` registers field rules
 * 3. `render()` — optional slot for companion UI (length hint below the input)
 */
import { useCallback, useImperativeHandle, useState} from "react";
import type { RefObject, ReactNode, SetStateAction } from "react";
import * as demo from "./formItemEditorDemoHelper";
import * as types from "./formItemEditorDemoTypes.t";
import * as lib from "./library";

// ── useHook — draft edits + save gated by validate ────────────────────────────

const useFieldEditor: lib.UseFormItemEditorFor<
  "field",
  types.Params,
  lib.ContextDom,
  types.DialogArgs,
  types.FieldExtra,
  types.FieldState,
  "field"
> = (props, { validate }) => {
  const { draft, setDraft, otherNames, onCommit } = props.extra;
  const [saveError, setSaveError] = useState<string | null>(null);

  const setFormItemParam = useCallback(
    <E extends keyof types.Params["field"]>(item: (
      previous: types.EditingItem,
    ) => [E, types.Params["field"][E]]) => {
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
      setSaveError(null);
    },
    [setDraft],
  );

  const save = useCallback(() => {
    setSaveError(null);
    let valid = true;
    validate(
      { header: draft.header, meta: draft.meta },
      {
        param: () => {
          valid = false;
        },
        section: () => {
          valid = false;
        },
      },
    );
    if (!valid) return;

    const name = draft.header.params.name.trim();
    if (otherNames.includes(name)) {
      setSaveError(`"${name}" is already used by another field`);
      return;
    }

    onCommit();
  }, [draft, onCommit, otherNames, validate]);

  return {
    recursiveFormItem: draft,
    setFormItemParam,
    setFormItemSection: () => {},
    extra: lib.branded({ save, saveError }),
  };
};

// ── Editor — register rules on impRef; companion UI via render() ──────────────

const FieldEditor = ({
  formItem,
  setFormItemParam,
  state,
  render,
}: {
  formItem: { params: { name: string } };
  setFormItemParam: (item: () => ["name", string]) => void;
  state: types.FieldState & {
    impRef: RefObject<lib.FormItemEditorValidate<types.Params, "field"> | null>;
  };
  render: (ui: () => ReactNode) => ReactNode;
}) => {
  const [nameError, setNameError] = useState<string | null>(null);

  useImperativeHandle(state.impRef, () => ({
    validate: (value, setError) => {
      const name = value.header.params.name;
      if (!name.trim()) {
        setError.param("name", "Name is required");
        setNameError("Name is required");
        return;
      }
      if (name.length > demo.MAX_NAME_LEN) {
        setError.param("name", `Max ${demo.MAX_NAME_LEN} characters`);
        setNameError(`Max ${demo.MAX_NAME_LEN} characters`);
        return;
      }
      setNameError(null);
    },
  }));

  return (
    <>
      <demo.NameField
        value={formItem.params.name}
        error={nameError}
        onChange={(name) => setFormItemParam(() => ["name", name])}
      />
      {render(() => <demo.NameLengthHint name={formItem.params.name} />)}
    </>
  );
};

const FormItemEditor = lib.createFormItemEditorWrapper<
  "field",
  types.Params,
  lib.ContextDom,
  types.DialogArgs,
  { field: types.FieldExtra },
  { field: types.FieldState }
>(
  { field: { editor: FieldEditor } },
  useFieldEditor,
  (dialogArgs, state, children) => (
    <demo.EditorDialog
      title={dialogArgs.title}
      onCancel={dialogArgs.onCancel}
      onSave={state.save}
      saveError={state.saveError}
    >
      {children}
    </demo.EditorDialog>
  ),
);

// ── Storybook integration ─────────────────────────────────────────────────────

export const FormItemEditorDemo = ({
  heading,
  flatItems,
  updateArgs,
}: types.DemoProps) => {
  const [draft, setDraftOpen] = useState<types.EditingItem | null>(null);

  const setDraft = useCallback((update: SetStateAction<types.EditingItem>) => {
    setDraftOpen((prev) => {
      if (!prev) return prev;
      return typeof update === "function" ? update(prev) : update;
    });
  }, []);

  const otherNames =
    draft === null
      ? []
      : flatItems.flatMap((fi) =>
          "item" in fi && fi.item.id !== draft.header.id
            ? [fi.item.params.name.trim()]
            : [],
        );

  const commitDraft = useCallback(() => {
    if (!draft) return;
    const trimmed = {
      ...draft.header,
      params: { ...draft.header.params, name: draft.header.params.name.trim() },
    };
    updateArgs({
      flatItems: flatItems.map((fi) =>
        "item" in fi && fi.item.id === draft.header.id
          ? { item: trimmed, n: fi.n }
          : fi,
      ),
    });
    setDraftOpen(null);
  }, [draft, flatItems, updateArgs]);

  return (
    <lib.FormContainer title={heading}>
      {draft && (
        <FormItemEditor
          ctx={lib.branded({})}
          dialogArgs={lib.branded({
            title: `Edit ${draft.header.params.name}`,
            onCancel: () => setDraftOpen(null),
          })}
          extra={lib.branded({
            draft,
            setDraft,
            otherNames,
            onCommit: commitDraft,
          })}
        />
      )}
      <lib.EditFormTest
        flatItems={flatItems}
        updateArgs={updateArgs}
        extra={(item) => [
          { label: "Edit", onClick: () => setDraftOpen(item) },
        ]}
      />
    </lib.FormContainer>
  );
};
