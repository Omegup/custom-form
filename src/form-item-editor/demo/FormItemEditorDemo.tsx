/**
 * Demo: `createFormItemEditorWrapper` with **field**, **heading**, and **panel**.
 *
 * Same layout as other package demos (`FormDemo.tsx` / `EditFormDemo.tsx`):
 * this file is the docs source — types in `formItemEditorDemoTypes.t.ts`,
 * chrome / list shell in `formItemEditorDemoHelper.tsx`.
 */
import {
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  type ReactNode,
} from "react";
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
    viewer: ({ props: { formItem } }) => (
      <>
        {formItem.params.name}
        {formItem.params.required ? " *" : ""}
      </>
    ),
  },
  heading: {
    viewer: ({ props: { formItem } }) => `§ ${formItem.params.name}`,
  },
  panel: {
    viewer: ({ props: { formItem } }) => `▦ ${formItem.params.name}`,
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

/** Review follow-up — same `FormItemEditor` stack as Design (field / heading / panel). */
export const FollowUpFormItemEditor = ({
  formItem,
  initialComment = "",
  initialChildren = [],
  flatItems,
  panelN,
  menuItems,
  randomId,
  renderAddFormItemSlot,
  onSubmit,
  onCancel,
}: {
  formItem: lib.SomeFormItem<types.TypeNames, types.Params>;
  initialComment?: string;
  initialChildren?: types.ListItem[][];
  flatItems: types.FlatItems;
  panelN: number;
  menuItems: lib.MenuItemDefinition<types.TypeNames, types.Params>[];
  randomId: () => string;
  renderAddFormItemSlot: (
    args: lib.AddFormItemSlotArgs<types.TypeNames, types.Params> & { label: string },
  ) => ReactNode;
  onSubmit: (payload: {
    comment?: string;
    formItem: lib.SomeFormItem<types.TypeNames, types.Params>;
    children?: types.ListItem[][];
  }) => void;
  onCancel: () => void;
}) => {
  const [comment, setComment] = useState(initialComment);
  const [session, setSession] = useState<{
    draft: lib.FlatFormItem<types.TypeNames, types.Params>;
    children: types.ListItem[][];
  }>(() => ({
    draft: { item: formItem, n: formItem.type === "panel" ? panelN : 0 },
    children: lib.resizeColumns(
      formItem.type === "panel" ? panelN : 0,
      initialChildren,
    ),
  }));
  const [childSession, setChildSession] =
    useState<lib.FlatFormItemEditSession<types.TypeNames, types.Params> | null>(
      null,
    );
  const sessionRef = useRef(session);
  sessionRef.current = session;

  useEffect(() => {
    const n = formItem.type === "panel" ? panelN : 0;
    setSession({
      draft: { item: formItem, n },
      children: lib.resizeColumns(n, initialChildren),
    });
    setComment(initialComment);
    setChildSession(null);
  }, [formItem, panelN, initialChildren, initialComment]);

  const ctx = lib.branded<types.Ctx, "context">({ flatItems });
  const { draft, children } = session;

  const commitChild = (
    next: lib.FlatFormItem<types.TypeNames, types.Params>,
    editing: lib.FlatFormItemEditSession<types.TypeNames, types.Params>,
  ) => {
    const col = editing.sIndex;
    const listItem: types.ListItem = {
      header: next.item,
      children:
        next.item.type === "panel"
          ? lib.resizeColumns(next.n, editing.children)
          : [],
      meta: lib.branded({ index: 0, total: 0, sIndex: col }),
    };
    setSession((prev) => {
      const cols = lib.resizeColumns(prev.draft.n, prev.children);
      const column = [...(cols[col] ?? [])];
      if (editing.total === 0) {
        column.push({
          ...listItem,
          meta: lib.branded({
            index: column.length,
            total: 0,
            sIndex: col,
          }),
        });
      } else {
        column[editing.index] = listItem;
      }
      cols[col] = column;
      return { ...prev, children: cols };
    });
    setChildSession(null);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <label style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 14 }}>
        <span>Follow-up comment</span>
        <textarea
          rows={2}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
      </label>
      <FormItemEditor
        ctx={ctx}
        dialogArgs={lib.branded({
          title: <>Follow-up · {itemName(ctx, draft.item)}</>,
          onCancel,
        })}
        formItem={draft}
        setFormItem={(updater) =>
          setSession((prev) => {
            const nextDraft =
              typeof updater === "function" ? updater(prev.draft) : updater;
            return {
              draft: nextDraft,
              children: lib.resizeColumns(nextDraft.n, prev.children),
            };
          })
        }
        extra={lib.branded<types.ItemExtra, "item-edit-extra">({
          onCommit: () =>
            onSubmit({
              comment: comment.trim() || undefined,
              formItem: sessionRef.current.draft.item,
              children:
                sessionRef.current.draft.item.type === "panel"
                  ? sessionRef.current.children
                  : undefined,
            }),
        })}
      />
      {draft.item.type === "panel" ? (
        <div style={{ display: "flex", gap: 12, marginTop: 4 }}>
          {Array.from({ length: draft.n }, (_, col) => (
            <div
              key={col}
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                gap: 6,
                minWidth: 0,
                padding: 8,
                border: "1px dashed #ccc",
                borderRadius: 4,
              }}
            >
              <span style={{ fontSize: 12, fontWeight: 600, color: "#666" }}>
                Column {col + 1}
              </span>
              {(children[col] ?? []).map((item) => (
                <div key={item.header.id} style={{ fontSize: 13 }}>
                  {itemName(ctx, item.header)}
                </div>
              ))}
              {renderAddFormItemSlot({
                span: { index: -1, sIndex: col },
                menuItems,
                random: randomId,
                label: "+ Add item",
                setAddItem: setChildSession,
              })}
            </div>
          ))}
        </div>
      ) : null}
      {childSession ? (
        <FormItemEditor
          ctx={ctx}
          dialogArgs={lib.branded({
            title: (
              <>
                {childSession.total === 0 ? "Add" : "Edit"} ·{" "}
                {itemName(ctx, childSession.draft.item)}
              </>
            ),
            onCancel: () => setChildSession(null),
          })}
          formItem={childSession.draft}
          setFormItem={(updater) =>
            setChildSession((prev) => {
              if (!prev) return prev;
              const nextDraft =
                typeof updater === "function" ? updater(prev.draft) : updater;
              return { ...prev, draft: nextDraft };
            })
          }
          extra={lib.branded<types.ItemExtra, "item-edit-extra">({
            onCommit: (next) =>
              setChildSession((editing) => {
                if (!editing) return null;
                commitChild(next, editing);
                return null;
              }),
          })}
        />
      ) : null}
    </div>
  );
};

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
