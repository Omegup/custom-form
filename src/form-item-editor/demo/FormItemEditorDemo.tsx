/**
 * Demo: `createFormItemEditorWrapper` with **field**, **heading**, and **panel**.
 *
 * Same layout as other package demos (`FormDemo.tsx` / `EditFormDemo.tsx`):
 * this file is the docs source — types in `formItemEditorDemoTypes.t.ts`,
 * chrome / list shell in `formItemEditorDemoHelper.tsx`.
 */
import {
  useCallback,
  useImperativeHandle,
  useState,
  type ReactNode,
} from "react";
import { DemoPage, RequiredMark, SelectColumns } from "../../demo-utils";
import {
  FieldLabel,
  HeadingLabel,
  PanelLabel,
} from "../../form-edit/demo/editFormDemoHelper";
import * as demo from "./formItemEditorDemoHelper";
import * as types from "./formItemEditorDemoTypes.t";
import { defaultVariants } from "./itemVariants";
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
        multiline={false}
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
        multiline={false}
        onChange={(name) => setFormItemParam(() => ["name", name])}
      />
      <demo.PanelTitleHint title={formItem.item.params.name} />
      <SelectColumns
        cols={formItem.n}
        onChange={(n) =>
          editorProps.setFormItem((prev) => ({ ...prev, n }))
        }
        options={demo.PANEL_COL_OPTIONS}
        legend="Columns (n)"
      />
    </>
  );
};

// ── Name viewers (like FormDemo `viewers`) ────────────────────────────────────

const nameViewers: types.NameViewers = {
  field: {
    viewer: ({ props: { formItem } }) => (
      <>
        <FieldLabel name={formItem.params.name} />
        <RequiredMark required={formItem.params.required} />
      </>
    ),
  },
  heading: {
    viewer: ({ props: { formItem } }) => (
      <HeadingLabel name={formItem.params.name} />
    ),
  },
  panel: {
    viewer: ({ props: { formItem } }) => (
      <PanelLabel name={formItem.params.name} />
    ),
  },
};

const ItemName = lib.createFormItemByGetChildPlain(nameViewers);

/** Exported for the side-menu demo (same editor stack). */
export const itemName = (ctx: types.Ctx, header: types.ItemHeader): ReactNode => (
  <ItemName
    viewProps={{
      formItem: header,
      ctx,
      variant: defaultVariants,
      extra: lib.branded({
        getChild: () => null,
      }),
    }}
    renderCard={(view) => view}
  />
);

// ── useHook + wrapper ─────────────────────────────────────────────────────────

/**
 * Shared hook for every type (unlike school's per-type Formik `useFormItemEditor`),
 * so a cross-cutting concern like "which section?" (school's `renderSection`
 * companion sub-editor, composed into each domain editor via `question()`)
 * is added **once here** instead of decorated onto each `Editor` — no
 * `impRef` composition needed. Only active for insert sessions with more
 * than one candidate section (`extra.sectionPicker` set by side-menu);
 * a no-op for edits and for `AddFormItem` slot inserts, which already have
 * a concrete `index`/section.
 *
 * Built via a generic factory: assigning the hook body directly to
 * `types.UseItemEditor` fails once `Params[K]` keys differ across K
 * (`isError`'s param is contravariant — field has `"required"`, heading/panel
 * do not). Checking the body under unbound `TN`/`P` escapes that (see
 * `.cursor/rules/typescript-types.mdc` “Generic factories can escape
 * indexed-access assignability”).
 */
const makeUseItemEditor: types.MakeUseItemEditor =
  <TN extends string, P extends lib.ParamsDom<TN>>() =>
  <K extends TN>(
    props: lib.FormItemEditorProps<
      types.Ctx,
      types.DialogArgs,
      types.HookExtra<TN, P>,
      TN,
      P,
      K
    >,
    { validate }: lib.FormItemEditorValidate<TN, P, K>,
  ) => {
    const { onCommit, sectionPicker } = props.extra;
    const { formItem: draft } = props;
    const [errors, setErrors] = useState<
      types.HookStateFields<P, K>["errors"]
    >({});

    const save = useCallback(() => {
      const next: types.HookStateFields<P, K>["errors"] = {};
      validate(draft, {
        param: (name, message) => {
          next.header ??= { params: {} };
          next.header.params[name] = message;
        },
        section: (message) => {
          next.sIndex ??= message;
        },
      });
      if (
        sectionPicker &&
        sectionPicker.sections.length > 1 &&
        sectionPicker.sIndex === -1
      ) {
        next.sIndex ??= "Pick a section";
      }
      setErrors(next);
      if (next.sIndex) return;
      if (next.header?.params && Object.keys(next.header.params).length > 0) {
        return;
      }
      onCommit(draft);
    }, [draft, onCommit, validate, sectionPicker]);

    return {
      state: lib.branded<types.HookStateFields<P, K>, "item-edit-state">({
        save,
        errors,
        isError: (param) => Boolean(errors.header?.params[param]),
        isSectionError: Boolean(errors.sIndex),
        sectionPicker,
      }),
    };
  };

const useItemEditor = makeUseItemEditor<types.TypeNames, types.Params>();

const renderDialog = <K extends types.TypeNames>(
  dialogArgs: types.DialogArgs,
  state: types.ItemState<K>,
  children: ReactNode,
) => {
  const picker = state.sectionPicker;
  const showPicker = Boolean(picker && picker.sections.length > 1);
  return (
    <demo.EditorDialog
      title={dialogArgs.title}
      onCancel={dialogArgs.onCancel}
      onSave={state.save}
      saveError={showPicker ? null : state.errors.sIndex ?? null}
    >
      {children}
      {picker && showPicker && (
        <demo.SelectSection
          sections={picker.sections}
          value={picker.sIndex}
          error={state.errors.sIndex ?? null}
          onChange={picker.setSIndex}
        />
      )}
    </demo.EditorDialog>
  );
};

/**
 * Exported for the side-menu demo (same editor stack).
 * Pass `sectionPicker` on `extra` (side-menu "add") to ask which section a
 * new item belongs to; omit it (edits, `AddFormItem` slot inserts) and the
 * form behaves exactly as before.
 */
export const FormItemEditor = lib.createFormItemEditorWrapper<
  types.TypeNames,
  types.Params,
  types.Ctx,
  types.DialogArgs,
  types.ItemExtraMap,
  types.ItemStateMap
>(
  {
    field: { editor: demo.wrapWithRequired(FieldEditor) },
    heading: { editor: HeadingEditor },
    panel: { editor: demo.wrapWithMultiple(PanelEditor) },
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
    <DemoPage title={heading}>
      {draft && session && (
        <FormItemEditor
          ctx={ctx}
          dialogArgs={lib.branded({
            title: <>Edit · {itemName(ctx, draft.item)}</>,
            onCancel: () => setSession(null),
          })}
          formItem={draft}
          setFormItem={(updater) =>
            setSession((prev) => prev && lib.patchFormItemEditSession(prev, updater))
          }
          extra={lib.branded<types.ItemExtra, "item-edit-extra">({
            onCommit: commitDraft,
          })}
        />
      )}
      <demo.FormItemEditorFormTest
        flatItems={flatItems}
        updateArgs={updateArgs}
        extra={(item) => [
          {
            label: "Edit",
            onClick: () => setSession(lib.openFormItemEditSession(item)),
          },
        ]}
      />
    </DemoPage>
  );
};
