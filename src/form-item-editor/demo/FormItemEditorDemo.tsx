/**
 * Demo: form list + `createFormItemEditorWrapper` with **field**, **heading**, and **panel**.
 *
 * Boundary map (what moves where): see form-item-editor/README.md § "Demo vs library".
 *
 * - `useItemEditor` — generic `UseFormItemEditor` hook (`K extends TypeNames`)
 * - per-type `Editor` components register `validate` on `impRef` (void; errors via setError)
 * - **panel** edits title + column count `n`; save re-flattens via `resizeColumns` + `flatten`
 * - `commitEditingSession` / session state → deferred to **form-edit-react** (`makeUseDialogs`)
 */
import { useCallback, useImperativeHandle, useState } from "react";
import * as demo from "./formItemEditorDemoHelper";
import * as formDemo from "./formDemo";
import * as types from "./formItemEditorDemoTypes.t";
import * as lib from "./library";

// ── useHook — school pattern: validate for errors, then commit draft as-is ────

const useItemEditor: types.UseItemEditor = <K extends types.TypeNames>(
  props: types.EditorProps<K>,
  { validate }: types.Validate<K>,
): types.ItemStateFor => {
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

    if (draft.item.type === "field" && "name" in draft.item.params) {
      const name = draft.item.params.name;
      if (otherNames.includes(name.trim())) {
        setSaveError(`"${name.trim()}" is already used by another field`);
        return;
      }
    }

    onCommit(draft);
  }, [draft, onCommit, otherNames, validate]);

  return { state: lib.branded({ save, saveError }) };
};

// ── Editors — school-style: trim only for checks; validate returns void ───────

const FieldEditor = ({
  flatFormItem: formItem,
  setFormItemParam,
  impRef,
}: types.FieldEditorProps) => {
  const [nameError, setNameError] = useState<string | null>(null);

  useImperativeHandle(impRef.current.main, () => ({
    validate: (value, setError) => {
      const name = value.item.params.name.trim();
      if (!name) {
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
      const text = value.item.params.text.trim();
      if (!text) {
        setError.param("text", "Heading text is required");
        setTextError("Heading text is required");
        return;
      }
      if (text.length < demo.MIN_HEADING_LEN) {
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

const PanelEditor = ({
  flatFormItem: formItem,
  setFormItemParam,
  props: editorProps,
  impRef,
}: types.PanelEditorProps) => {
  const [titleError, setTitleError] = useState<string | null>(null);

  useImperativeHandle(impRef.current.main, () => ({
    validate: (value, setError) => {
      const title = value.item.params.title.trim();
      if (!title) {
        setError.param("title", "Panel title is required");
        setTitleError("Panel title is required");
        return;
      }
      if (title.length < demo.MIN_PANEL_TITLE_LEN) {
        setError.param(
          "title",
          `At least ${demo.MIN_PANEL_TITLE_LEN} characters`,
        );
        setTitleError(`At least ${demo.MIN_PANEL_TITLE_LEN} characters`);
        return;
      }
      setTitleError(null);
    },
  }));

  return (
    <>
      <demo.TextField
        label="Panel title"
        value={formItem.item.params.title}
        error={titleError}
        onChange={(title) => setFormItemParam(() => ["title", title])}
      />
      <demo.PanelTitleHint title={formItem.item.params.title} />
      <demo.SelectColumns
        cols={formItem.n}
        onChange={(n) =>
          editorProps.setFormItem((prev) => ({ ...prev, n }))
        }
      />
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
    panel: { editor: PanelEditor },
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

const dialogTitle = (item: types.ItemHeader) => {
  if (item.type === "field") return `Edit ${item.params.name}`;
  if (item.type === "heading") return `Edit heading`;
  return `Edit panel`;
};

const flattenItem = lib.flatten<
  types.TypeNames,
  types.Params,
  types.Section,
  types.ItemMeta
>();

/** Replace the item's flat span with a re-flattened subtree (handles `n` changes). */
const commitEditingSession = (
  flatItems: types.FlatItems,
  session: types.EditingSession,
  draft: lib.FlatFormItem<types.TypeNames, types.Params>,
): types.FlatItems => {
  const children = lib.resizeColumns(draft.n, session.children);
  const list = flattenItem.formItem({
    header: draft.item ,
    children,
    meta: {
      index: session.index,
      total: session.total,
      sIndex: 0,
    },
  });
  return flatItems.toSpliced(session.index, session.total, ...list);
};

const openSession = (item: types.ListItem): types.EditingSession => ({
  draft: { item: item.header, n: item.children.length },
  children: item.children,
  index: item.meta.index,
  total: item.meta.total,
});

// ── Storybook integration ─────────────────────────────────────────────────────

export const FormItemEditorDemo = ({
  heading,
  flatItems,
  updateArgs,
}: types.DemoProps) => {
  const [session, setSession] = useState<types.EditingSession | null>(null);
  const draft = session?.draft ?? null;

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

  const commitDraft = useCallback(
    (next: lib.FlatFormItem<types.TypeNames, types.Params>) => {
      if (!session) return;
      updateArgs({
        flatItems: commitEditingSession(flatItems, session, next),
      });
      setSession(null);
    },
    [session, flatItems, updateArgs],
  );

  return (
    <formDemo.FormContainer title={heading}>
      {draft && session && (
        <FormItemEditor
          ctx={lib.branded({})}
          dialogArgs={lib.branded({
            title: dialogTitle(draft.item),
            onCancel: () => setSession(null),
          })}
          formItem={draft}
          setFormItem={(updater) =>
            setSession((prev) => {
              if (!prev) return prev;
              const nextDraft =
                typeof updater === "function" ? updater(prev.draft) : updater;
              return { ...prev, draft: nextDraft };
            })
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
            onClick: () => setSession(openSession(item)),
          },
        ]}
      />
    </formDemo.FormContainer>
  );
};
