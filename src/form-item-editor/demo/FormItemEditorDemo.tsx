/**
 * Demo: `createFormItemEditorWrapper` with **field**, **heading**, and **panel**.
 *
 * Same layout as other package demos (`FormDemo.tsx` / `EditFormDemo.tsx`):
 * this file is the docs source — types in `formItemEditorDemoTypes.t.ts`,
 * chrome / list shell in `formItemEditorDemoHelper.tsx`.
 */
import { useCallback, useImperativeHandle, useState, type ReactNode } from "react";
import * as demo from "./formItemEditorDemoHelper";
import * as types from "./formItemEditorDemoTypes.t";
import * as lib from "./library";

// ── Editors (domain) ──────────────────────────────────────────────────────────

const FieldEditor = ({
  flatFormItem: formItem,
  setFormItemParam,
  impRef,
  hookResult,
}: types.FieldEditorProps) => {
  useImperativeHandle(impRef.current.main, () => ({
    validate: (value, setError) => {
      const name = value.item.params.name.trim();
      if (!name) {
        setError.param("name", "Name is required");
        return;
      }
      if (name.length > demo.MAX_NAME_LEN) {
        setError.param("name", `Max ${demo.MAX_NAME_LEN} characters`);
      }
    },
  }));

  return (
    <>
      <demo.NameField
        value={formItem.item.params.name}
        error={hookResult.state.errors.header?.params.name ?? null}
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
  hookResult,
}: types.HeadingEditorProps) => {
  useImperativeHandle(impRef.current.main, () => ({
    validate: (value, setError) => {
      const name = value.item.params.name.trim();
      if (!name) {
        setError.param("name", "Heading is required");
        return;
      }
      if (name.length < demo.MIN_HEADING_LEN) {
        setError.param("name", `At least ${demo.MIN_HEADING_LEN} characters`);
      }
    },
  }));

  return (
    <>
      <demo.TextField
        label="Heading"
        value={formItem.item.params.name}
        error={hookResult.state.errors.header?.params.name ?? null}
        onChange={(name) => setFormItemParam(() => ["name", name])}
      />
      <demo.HeadingLengthHint text={formItem.item.params.name} />
    </>
  );
};

const PanelEditor = ({
  flatFormItem: formItem,
  setFormItemParam,
  props: editorProps,
  impRef,
  hookResult,
}: types.PanelEditorProps) => {
  useImperativeHandle(impRef.current.main, () => ({
    validate: (value, setError) => {
      const name = value.item.params.name.trim();
      if (!name) {
        setError.param("name", "Panel title is required");
        return;
      }
      if (name.length < demo.MIN_PANEL_TITLE_LEN) {
        setError.param(
          "name",
          `At least ${demo.MIN_PANEL_TITLE_LEN} characters`,
        );
      }
    },
  }));

  return (
    <>
      <demo.TextField
        label="Panel title"
        value={formItem.item.params.name}
        error={hookResult.state.errors.header?.params.name ?? null}
        onChange={(name) => setFormItemParam(() => ["name", name])}
      />
      <demo.PanelTitleHint title={formItem.item.params.name} />
      <demo.SelectColumns
        cols={formItem.n}
        onChange={(n) =>
          editorProps.setFormItem((prev) => ({ ...prev, n }))
        }
      />
    </>
  );
};

// ── Name viewers (like FormDemo `viewers`) ────────────────────────────────────

const nameViewers: types.NameViewers = {
  field: {
    viewer: ({ props: { formItem } }) => formItem.params.name,
  },
  heading: {
    viewer: ({ props: { formItem } }) => `§ ${formItem.params.name}`,
  },
  panel: {
    viewer: ({ props: { formItem } }) => `▦ ${formItem.params.name}`,
  },
};

const ItemName = lib.createFormItemByGetChild(nameViewers, (x) => x);

const itemName = (header: types.ItemHeader): ReactNode => (
  <ItemName
    viewProps={{
      formItem: header,
      ctx: lib.branded({}),
      variant: "default",
      extra: lib.branded({
        getChild: () => null,
      }),
    }}
    renderCard={(view) => view}
  />
);

// ── useHook + wrapper ─────────────────────────────────────────────────────────

const useItemEditor: types.UseItemEditor = <K extends types.TypeNames>(
  props: types.EditorProps<K>,
  { validate }: types.Validate<K>,
): types.ItemStateFor<K> => {
  const { onCommit, otherNames } = props.extra;
  const { formItem: draft } = props;
  const [saveError, setSaveError] = useState<string | null>(null);
  const [errors, setErrors] = useState<types.ItemValidateErrors<K>>({});

  const save = useCallback(() => {
    setSaveError(null);
    const next: types.ItemValidateErrors<K> = {};
    validate(draft, {
      param: (name, message) => {
        next.header ??= { params: {} };
        next.header.params[name] = message;
      },
      section: (message) => {
        next.sIndex ??= message;
      },
    });
    setErrors(next);
    if (next.sIndex) return;
    if (next.header?.params && Object.keys(next.header.params).length > 0) {
      return;
    }

    if (draft.item.type === "field" && "name" in draft.item.params) {
      const name = draft.item.params.name;
      if (otherNames.includes(name.trim())) {
        setSaveError(`"${name.trim()}" is already used by another field`);
        return;
      }
    }

    onCommit(draft);
  }, [draft, onCommit, otherNames, validate]);

  return {
    state: lib.branded<types.ItemState<K>, "item-edit-state">({
      save,
      saveError,
      errors,
      isError: (param) => Boolean(errors.header?.params[param]),
      isSectionError: Boolean(errors.sIndex),
    }),
  };
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
      saveError={state.saveError ?? state.errors.sIndex ?? null}
    >
      {children}
    </demo.EditorDialog>
  ),
);

const flattenItem = lib.flatten<
  types.TypeNames,
  types.Params,
  types.Section,
  types.ItemMeta
>();

const commitEditingSession = (
  flatItems: types.FlatItems,
  session: types.EditingSession,
  draft: lib.FlatFormItem<types.TypeNames, types.Params>,
): types.FlatItems => {
  const children = lib.resizeColumns(draft.n, session.children);
  const list = flattenItem.formItem({
    header: draft.item,
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

// ── Story integration ─────────────────────────────────────────────────────────

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
    <demo.FormContainer title={heading}>
      {draft && session && (
        <FormItemEditor
          ctx={lib.branded({})}
          dialogArgs={lib.branded({
            title: <>Edit · {itemName(draft.item)}</>,
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
      <demo.FormItemEditorFormTest
        flatItems={flatItems}
        updateArgs={updateArgs}
        itemName={itemName}
        extra={(item) => [
          {
            label: "Edit",
            onClick: () => setSession(openSession(item)),
          },
        ]}
      />
    </demo.FormContainer>
  );
};
