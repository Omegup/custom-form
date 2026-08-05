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
  props: types.EditorProps<K>,
  { validate }: types.Validate<K>,
): lib.EditorHookResult<types.ItemState> => {
  const { onCommit, otherNames } = props.extra;
  const { formItem: draft } = props;
  const [saveError, setSaveError] = useState<string | null>(null);

  const save = useCallback(() => {
    setSaveError(null);
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

    onCommit();
  }, [draft, onCommit, otherNames, validate]);

  return { state: lib.branded({ save, saveError }) };
};

// ── Editors — imperative validate via impRef ──────────────────────────────────

const FieldEditor = ({
  flatFormItem: formItem,
  setFormItemParam,
  impRef,
}: types.FieldEditorProps) => {
  const [nameError, setNameError] = useState<string | null>(null);

  useImperativeHandle(impRef.current.main, () => ({
    validate: (value, setError) => {
      const name = value.item.params.name;
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
        value={formItem.item.params.name}
        error={nameError}
        onChange={(name) => setFormItemParam(() => ["name", name])}
      />
      <demo.NameLengthHint name={formItem.item.params.name} />
    </>
  );
};

const HeadingEditor = ({
  flatFormItem: formItem,
  setFormItemParam,
  impRef,
}: types.HeadingEditorProps) => {
  const [textError, setTextError] = useState<string | null>(null);

  useImperativeHandle(impRef.current.main, () => ({
    validate: (value, setError) => {
      const text = value.item.params.text;
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
        value={formItem.item.params.text}
        error={textError}
        onChange={(text) => setFormItemParam(() => ["text", text])}
      />
      <demo.HeadingLengthHint text={formItem.item.params.text} />
    </>
  );
};

const FormItemEditor = lib.createFormItemEditorWrapper<
  types.TypeNames,
  types.Params,
  types.Ctx,
  types.DialogArgs,
  { [K in types.TypeNames]: types.ItemExtra },
  { [K in types.TypeNames]: types.ItemState }
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

const dialogTitle = (item: lib.SomeFormItem<types.TypeNames, types.Params>) =>
  item.type === "field" ? `Edit ${item.params.name}` : `Edit heading`;

// ── Storybook integration ─────────────────────────────────────────────────────

export const FormItemEditorDemo = ({
  heading,
  flatItems,
  updateArgs,
}: types.DemoProps) => {
  const [draft, setDraftOpen] = useState<{
    item: lib.SomeFormItem<types.TypeNames, types.Params>;
    n: number;
  } | null>(null);

  const otherNames =
    draft === null
      ? []
      : flatItems.flatMap((fi) =>
          "item" in fi &&
          fi.item.type === "field" &&
          fi.item.id !== draft.item.id
            ? [fi.item.params.name.trim()]
            : [],
        );

  const commitDraft = useCallback(() => {
    if (!draft) return;
    const old = flatItems
      .map((fi, i)=>({...fi, i}))
      .filter((fi) => "item" in fi)
      .find((fi) => fi.item.id === draft.item.id);
    if (!old) return;
    const diff = draft.n - old.n;
    const copy = [...flatItems]
    if(diff) {
      let remaining = Math.min(draft.n, old.n)
      for(var j = old.i + 1; remaining && j < flatItems.length; j++) {
        const item = flatItems[j]
        if('end' in item) {
          remaining-- 
        } 
        if('item' in item) {
          remaining += item.n
        }
      }
      if(diff > 0) copy.splice(old.i + 1, diff)
    }
    updateArgs({
      flatItems: flatItems.map((fi): types.FlatItems[0] =>
        "item" in fi && fi.item.id === draft.item.id ? draft : fi,
      ),
    });
    setDraftOpen(null);
  }, [draft, flatItems, updateArgs]);

  return (
    <formDemo.FormContainer title={heading}>
      {draft && (
        <FormItemEditor
          ctx={lib.branded({})}
          dialogArgs={lib.branded({
            title: dialogTitle(draft.item),
            onCancel: () => setDraftOpen(null),
          })}
          formItem={draft}
          setFormItem={(updater) =>
            typeof updater === "function"
              ? setDraftOpen((prev) => (prev ? updater(prev) : null))
              : setDraftOpen(updater)
          }
          extra={lib.branded<types.ItemExtra, "item-edit-extra">({
            otherNames,
            onCommit: commitDraft,
          })}
        />
      )}
      <formDemo.FormItemEditorFormTest
        flatItems={flatItems}
        updateArgs={updateArgs}
        extra={(item) => [
          {
            label: "Edit",
            onClick: () =>
              setDraftOpen({ item: item.header, n: item.children.length }),
          },
        ]}
      />
    </formDemo.FormContainer>
  );
};
