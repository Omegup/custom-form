/**
 * Demo: form list + `createFormItemEditorWrapper` with **field** and **heading** editors.
 *
 * - `useItemEditor` — generic `UseFormItemEditor` hook (`K extends TypeNames`)
 * - per-type `Editor` components register `validate` on `state.impRef`
 * - `render()` — optional companion UI below inputs
 */
import { useCallback, useImperativeHandle, useState } from "react";
import * as demo from "./formItemEditorDemoHelper";
import * as formDemo from "./formDemo";
import * as types from "./formItemEditorDemoTypes.t";
import * as lib from "./library";

// ── useHook — shared draft/save; field-only duplicate-name check ──────────────

const useItemEditor: types.UseItemEditor = <K extends types.TypeNames>(
  props: types.EditorProps,
  { validate }: types.ValidateFor<K>,
): types.ItemStateFor<K> => {
  const { draft, setDraft, onCommit, otherNames } = props.extra;
  const typed = types.typedDraft<K>(draft);
  const [saveError, setSaveError] = useState<string | null>(null);

  const setFormItemParam = useCallback(
    <E extends types.ParamKey<K>>(item: (
      previous: types.TypedItem<K>,
    ) => [E, types.ParamValue<K, E>]) => {
      const [key, value] = item(typed);
      setDraft(types.patchItemParam(typed, key, value));
      setSaveError(null);
    },
    [setDraft, typed],
  );

  const save = useCallback(() => {
    setSaveError(null);
    let valid = true;
    validate(
      { header: typed.header, meta: typed.meta },
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

    if (types.isFieldItem(draft)) {
      const name = draft.header.params.name.trim();
      if (otherNames.includes(name)) {
        setSaveError(`"${name}" is already used by another field`);
        return;
      }
    }

    onCommit();
  }, [draft, onCommit, otherNames, typed, validate]);

  return {
    recursiveFormItem: typed,
    setFormItemParam,
    setFormItemSection: () => {},
    extra: lib.branded({ save, saveError }),
  };
};

// ── Editors — imperative validate via impRef ──────────────────────────────────

const FieldEditor = ({
  formItem,
  setFormItemParam,
  state,
  render,
}: types.FieldEditorProps) => {
  const [nameError, setNameError] = useState<string | null>(null);

  useImperativeHandle(state.impRef, () => ({
    validate: (value, setError) => {
      if (value.header.type !== "field") return;
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
      {render(() => (
        <demo.NameLengthHint name={formItem.params.name} />
      ))}
    </>
  );
};

const HeadingEditor = ({
  formItem,
  setFormItemParam,
  state,
  render,
}: types.HeadingEditorProps) => {
  const [textError, setTextError] = useState<string | null>(null);

  useImperativeHandle(state.impRef, () => ({
    validate: (value, setError) => {
      if (value.header.type !== "heading") return;
      const text = value.header.params.text;
      if (!text.trim()) {
        setError.param("text", "Heading text is required");
        setTextError("Heading text is required");
        return;
      }
      if (text.trim().length < demo.MIN_HEADING_LEN) {
        setError.param("text", `At least ${demo.MIN_HEADING_LEN} characters`);
        setTextError(`At least ${demo.MIN_HEADING_LEN} characters`);
        return;
      }
      setTextError(null);
    },
  }));

  return (
    <>
      <demo.TextField
        label="Heading"
        value={formItem.params.text}
        error={textError}
        onChange={(text) => setFormItemParam(() => ["text", text])}
      />
      {render(() => (
        <demo.HeadingLengthHint text={formItem.params.text} />
      ))}
    </>
  );
};

const FormItemEditor = lib.createFormItemEditorWrapper<
  types.TypeNames,
  types.Params,
  types.Ctx,
  types.DialogArgs,
  types.ItemExtraMap,
  types.ItemStateMap
>(
  {
    field: { editor: FieldEditor },
    heading: { editor: HeadingEditor },
  },
  useItemEditor,
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

const dialogTitle = (item: types.EditingItem) =>
  item.header.type === "field"
    ? `Edit ${item.header.params.name}`
    : `Edit heading`;

// ── Storybook integration ─────────────────────────────────────────────────────

export const FormItemEditorDemo = ({
  heading,
  flatItems,
  updateArgs,
}: types.DemoProps) => {
  const [draft, setDraftOpen] = useState<types.EditingItem | null>(null);

  const setDraft: types.SetEditingItem = useCallback((update) => {
    setDraftOpen((prev) => {
      if (!prev) return prev;
      return typeof update === "function" ? update(prev) : update;
    });
  }, []);

  const otherNames =
    draft === null
      ? []
      : flatItems.flatMap((fi) =>
          "item" in fi &&
          fi.item.type === "field" &&
          fi.item.id !== draft.header.id
            ? [fi.item.params.name.trim()]
            : [],
        );

  const commitDraft = useCallback(() => {
    if (!draft) return;
    const header =
      draft.header.type === "field"
        ? {
            ...draft.header,
            params: {
              ...draft.header.params,
              name: draft.header.params.name.trim(),
            },
          }
        : {
            ...draft.header,
            params: {
              ...draft.header.params,
              text: draft.header.params.text.trim(),
            },
          };
    updateArgs({
      flatItems: flatItems.map((fi) =>
        "item" in fi && fi.item.id === draft.header.id
          ? { item: header, n: fi.n }
          : fi,
      ),
    });
    setDraftOpen(null);
  }, [draft, flatItems, updateArgs]);

  return (
    <formDemo.FormContainer title={heading}>
      {draft && (
        <FormItemEditor<types.TypeNames>
          ctx={lib.branded({})}
          dialogArgs={lib.branded({
            title: dialogTitle(draft),
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
      <formDemo.FormItemEditorFormTest
        flatItems={flatItems}
        updateArgs={updateArgs}
        extra={(item) => [{ label: "Edit", onClick: () => setDraftOpen(types.asEditingItem(item)) }]}
      />
    </formDemo.FormContainer>
  );
};
