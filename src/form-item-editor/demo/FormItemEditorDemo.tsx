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

/** Only `FieldEditor` interprets `ctx.flatItems` this way — plain filter, no shared API. */
const isFieldNameTaken = (
  flatItems: types.FlatItems,
  name: string,
  excludeId: string,
): boolean =>
  flatItems.some(
    (fi) =>
      "item" in fi &&
      fi.item.type === "field" &&
      fi.item.id !== excludeId &&
      fi.item.params.name.trim() === name,
  );

const FieldEditor = ({
  flatFormItem: formItem,
  setFormItemParam,
  impRef,
  hookResult,
  ctx,
}: types.FieldEditorProps) => {
  useImperativeHandle(
    impRef.current.main,
    () => ({
      validate: (value, setError) => {
        const name = value.item.params.name.trim();
        if (!name) {
          setError.param("name", "Name is required");
          return;
        }
        if (name.length > demo.MAX_NAME_LEN) {
          setError.param("name", `Max ${demo.MAX_NAME_LEN} characters`);
          return;
        }
        if (isFieldNameTaken(ctx.flatItems, name, value.item.id)) {
          setError.param(
            "name",
            `"${name}" is already used by another field`,
          );
        }
      },
    }),
    [ctx],
  );

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

/** Exported for the side-menu / edit-section demos (same editor stack). */
export const itemName = (ctx: types.Ctx, header: types.ItemHeader): ReactNode => (
  <ItemName
    viewProps={{
      formItem: header,
      ctx,
      variant: "default",
      extra: lib.branded({
        getChild: () => null,
      }),
    }}
    renderCard={(view) => view}
  />
);

// ── useHook + wrapper ─────────────────────────────────────────────────────────

/** Exported for `FormItemEditorWithSectionPicker` (side-menu demo shares this hook). */
export const useItemEditor: types.UseItemEditor = <K extends types.TypeNames>(
  props: types.EditorProps<K>,
  { validate }: types.Validate<K>,
): types.ItemStateFor<K> => {
  const { onCommit } = props.extra;
  const { formItem: draft } = props;
  const [errors, setErrors] = useState<types.ItemValidateErrors<K>>({});

  const save = useCallback(() => {
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
    onCommit(draft);
  }, [draft, onCommit, validate]);

  return {
    state: lib.branded<types.ItemState<K>, "item-edit-state">({
      save,
      errors,
      isError: (param) => Boolean(errors.header?.params[param]),
      isSectionError: Boolean(errors.sIndex),
    }),
  };
};

const renderDialog = <K extends types.TypeNames>(
  dialogArgs: types.DialogArgs,
  state: types.ItemState<K>,
  children: ReactNode,
) => (
  <demo.EditorDialog
    title={dialogArgs.title}
    onCancel={dialogArgs.onCancel}
    onSave={state.save}
    saveError={state.errors.sIndex ?? null}
  >
    {children}
  </demo.EditorDialog>
);

/** Exported for the side-menu / edit-section demos (same editor stack). */
export const FormItemEditor = lib.createFormItemEditorWrapper<
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
  renderDialog,
);

/**
 * Companion sub-editor — school `editors/selectSection.tsx` `renderSection`,
 * composed the same way school's `question()` decorator composes shared
 * concerns into every domain editor. Needs no change to the HOC itself:
 * `impRef` is already a named-ref map (`impRef.current.main`, here
 * `.section`), so any `Editor` can register extra validators and render
 * extra fields alongside the type-specific ones.
 *
 * Only relevant to **insert** sessions with more than one candidate section
 * (`extra.sectionPicker` set — side-menu "add"); a no-op otherwise (edits,
 * and `edit-section` slot inserts, which already have a concrete `index`).
 */
export const withSectionPicker = <K extends types.TypeNames>(
  Editor: (props: types.EditorPropsFor<K>) => ReactNode,
) => {
  const WithSectionPicker = (editorProps: types.EditorPropsFor<K>) => {
    const sectionRef = useRef<
      lib.FormItemEditorValidate<types.TypeNames, types.Params, K> | null
    >(null);
    editorProps.impRef.current.section = sectionRef;
    const picker = editorProps.props.extra.sectionPicker;

    useImperativeHandle(
      sectionRef,
      () => ({
        validate: (_value, setError) => {
          if (picker && picker.sections.length > 1 && picker.sIndex === -1) {
            setError.section("Pick a section");
          }
        },
      }),
      [picker],
    );

    return (
      <>
        <Editor {...editorProps} />
        {picker && picker.sections.length > 1 && (
          <demo.SelectSection
            sections={picker.sections}
            value={picker.sIndex}
            error={editorProps.hookResult.state.errors.sIndex ?? null}
            onChange={picker.setSIndex}
          />
        )}
      </>
    );
  };
  return WithSectionPicker;
};

/** Ready-made wrapper for insert flows that may need to ask "which section?" (side-menu). */
export const FormItemEditorWithSectionPicker = lib.createFormItemEditorWrapper<
  types.TypeNames,
  types.Params,
  types.Ctx,
  types.DialogArgs,
  types.ItemExtraMap,
  types.ItemStateMap
>(
  {
    field: { editor: withSectionPicker(FieldEditor) },
    heading: { editor: withSectionPicker(HeadingEditor) },
    panel: { editor: withSectionPicker(PanelEditor) },
  },
  useItemEditor,
  renderDialog,
);

// ── Story integration ─────────────────────────────────────────────────────────

export const FormItemEditorDemo = ({
  heading,
  flatItems,
  updateArgs,
}: types.DemoProps) => {
  const [session, setSession] = useState<types.EditingSession | null>(null);
  const draft = session?.draft ?? null;
  const ctx: types.Ctx = lib.branded({ flatItems });

  const commitDraft = useCallback(
    (next: lib.FlatFormItem<types.TypeNames, types.Params>) => {
      if (!session) return;
      updateArgs({
        flatItems: lib.applyFlatFormItem(
          flatItems,
          session,
          { header: next.item, children: session.children },
          next.n,
        ),
      });
      setSession(null);
    },
    [session, flatItems, updateArgs],
  );

  return (
    <demo.FormContainer title={heading}>
      {draft && session && (
        <FormItemEditor
          ctx={ctx}
          dialogArgs={lib.branded({
            title: <>Edit · {itemName(ctx, draft.item)}</>,
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
            onCommit: commitDraft,
          })}
        />
      )}
      <demo.FormItemEditorFormTest
        flatItems={flatItems}
        updateArgs={updateArgs}
        itemName={(header) => itemName(ctx, header)}
        extra={(item) => [
          {
            label: "Edit",
            onClick: () => setSession(lib.openFormItemEditSession(item)),
          },
        ]}
      />
    </demo.FormContainer>
  );
};
