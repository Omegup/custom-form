/**
 * All-in composition — Design → Fill → Update lifecycle:
 * 1. Design: school `CustomFormEditor` + `DialogsHOC` (`makeUseDialogs`) over
 *    `SectionFormItemHOC` + `WebRecursiveEdit` + Library sidebar
 * 2. Fill: `CustomFormResponderHOC` on the designed sections
 * 3. Update: `CustomFormReviewHOC` — remarks unlock answers; Library sidebar
 *    picks follow-up form item types (same catalog as Design)
 */
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";
import { WebRecursiveEdit } from "../../flat-dnd/demo/WebRecursiveEdit";
import {
  FormItemEditor,
  itemName,
} from "../../form-item-editor/demo/FormItemEditorDemo";
import { RemoveAlert } from "../../form-item-editor/demo/formItemEditorDemoHelper";
import { SectionDialog } from "../../section-edit/demo/SectionEditDemo";
import { MENU_ITEMS, randomId } from "../../side-menu/demo/fixtures";
import {
  FormContainer,
  LayoutWithSidebar,
  renderAddFormItem,
  renderMenuItem,
  renderSide,
} from "../../side-menu/demo/sideMenuDemoHelper";
import { columnsChrome } from "../../section-view/demo/sectionViewDemoHelper";
import * as demo from "./allInDemoHelper";
import * as phases from "./allInPhases";
import type * as types from "./allInDemoTypes.t";
import * as lib from "./library";

const blankSection = (id: string): types.Section => ({
  id,
  deleted: false,
  title: "",
  description: "",
});

type DialogActions = {
  openItemEdit: (item: types.ListItem) => void;
  openSectionEdit: (section: types.ListSection) => void;
};

const DialogActionsCtx = createContext<DialogActions>({
  openItemEdit: () => {},
  openSectionEdit: () => {},
});

const SectionTitle = (
  props: lib.SectionProps<
    types.TypeNames,
    types.Params,
    types.Variants,
    types.Section,
    types.BaseCtx,
    types.ListExtra
  >,
) => {
  const { openSectionEdit } = useContext(DialogActionsCtx);
  const { section } = props;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
      <strong>{section.header.title}</strong>
      {!section.header.deleted && (
        <button type="button" onClick={() => openSectionEdit(section)}>
          Edit
        </button>
      )}
    </span>
  );
};

const useRenderAddItem = lib.makeUseRenderAddItem<
  types.TypeNames,
  types.Params
>(
  (args) => (
    <lib.AddFormItem
      {...args}
      label="+ Add item"
      render={renderAddFormItem}
    />
  ),
  () => MENU_ITEMS,
  randomId,
);

const SectionComponent = lib.SectionFormItemHOC<
  types.TypeNames,
  types.Params,
  types.Variants,
  types.Section,
  types.BaseCtx,
  types.ListExtra
>({
  viewers: demo.viewers,
  useRenderAddItem,
  columnsChrome,
  renderTitle: (props) => <SectionTitle {...props} />,
  renderEdit: WebRecursiveEdit,
});

const cloneFn: lib.Clone<
  types.TypeNames,
  types.Params,
  types.ListCtx,
  types.Section
> = (subItems, _, allItems) =>
  lib.cloneFlatItems(
    subItems,
    allItems,
    (name, n) => `${name} (copy${n})`,
    randomId,
    { rename: "first" },
  );

const useDialogs = lib.makeUseDialogs<
  types.TypeNames,
  types.Params,
  types.Ctx,
  types.Section
>({
  renderFormItem: ({
    ctx,
    session,
    add,
    setDraft,
    setSIndex,
    sectionOptions,
    commit,
    close,
  }) => (
    <FormItemEditor
      ctx={ctx}
      dialogArgs={lib.branded({
        title: (
          <>
            {session.total === 0 ? "Add" : "Edit"} ·{" "}
            {itemName(ctx, session.draft.item)}
          </>
        ),
        onCancel: close,
      })}
      formItem={session.draft}
      setFormItem={setDraft}
      extra={lib.branded<types.ItemExtra, "item-edit-extra">({
        onCommit: commit,
        sectionPicker: add
          ? {
              sIndex: session.sIndex,
              sections: sectionOptions.map(({ index, header }) => ({
                index,
                title: header.title,
              })),
              setSIndex,
            }
          : undefined,
      })}
    />
  ),
  renderSection: ({ session, add, commit, close }) => (
    <SectionDialog
      title={add ? "Add section" : undefined}
      draft={session.draft}
      onCancel={close}
      onSave={(form) =>
        commit(
          {
            ...session.draft.header,
            title: form.title,
            description: form.description,
          },
          form.cols,
        )
      }
    />
  ),
});

type PendingRemove = {
  rm: () => void;
  item: lib.FlatNestedItem<types.TypeNames, types.Params, types.Section>;
};

const fillVariants = lib.branded<types.Variants, "variants">({
  field: "default",
  heading: "default",
  panel: "default",
});

const FormResponder = lib.CustomFormResponderHOC<
  types.TypeNames,
  types.Params,
  types.Variants,
  lib.SectionResponderContext,
  types.Section
>(phases.fillViewers, fillVariants, phases.fillChrome);

const FormReview = lib.CustomFormReviewHOC<
  types.TypeNames,
  types.Params,
  types.Variants,
  lib.SectionReviewContext,
  types.Section
>(phases.reviewViewers, fillVariants, phases.reviewChrome);

const fillCtx = lib.branded<lib.SectionResponderContext, "context">({
  t: (term) => (term === "fieldRequired" ? "This field is required" : term),
});
const reviewCtx = lib.branded<lib.SectionReviewContext, "context">({});
const tCommon = (term: "add" | "cancel" | "save" | "delete") =>
  ({ add: "Add", cancel: "Cancel", save: "Save", delete: "Delete" })[term];

const DesignPhase = ({
  flatItems,
  updateArgs,
}: {
  flatItems: types.FlatItems;
  updateArgs: types.DemoProps["updateArgs"];
}) => {
  const [focused, setFocused] = useState<lib.AutoFocusState>(null);
  const [toRemove, setToRemove] = useState<PendingRemove | null>(null);

  const dialogCtx: types.Ctx = lib.branded({ flatItems });
  const dialogs = useDialogs({
    flatItems,
    setFlatItems: (items) => updateArgs({ flatItems: items }),
    ctx: dialogCtx,
  });

  const listCtx = useMemo(
    () => lib.autofocusCtx<lib.ContextDom>(lib.branded({}), focused),
    [focused],
  );
  const variants = useMemo(
    (): types.Variants =>
      lib.branded({ field: "default", heading: "default", panel: "default" }),
    [],
  );

  const setItems = (items: types.FlatItems, newCtx: types.ListCtx) => {
    if (items !== flatItems) updateArgs({ flatItems: items });
    setFocused(newCtx.focused);
  };

  const sections = useMemo(() => lib.consolidateSections(flatItems), [flatItems]);
  const sectionOfItem = useMemo(
    () => lib.buildItemSectionDict(flatItems),
    [flatItems],
  );

  const jump = true;
  const args = {
    items: flatItems,
    setItems,
    ctx: listCtx,
    sectionOfItem,
    setToRemove,
  };
  const itemActions = lib.getFormItemMoveActions(args, cloneFn, jump);

  const dialogActions = useMemo(
    (): DialogActions => ({
      openItemEdit: dialogs.openItemEdit,
      openSectionEdit: dialogs.openSectionEdit,
    }),
    [dialogs.openItemEdit, dialogs.openSectionEdit],
  );

  const listExtraMap = demo.buildListExtraMap(
    sections,
    itemActions,
    dialogs.openItemEdit,
  );
  const itemExtra = (id: string): types.ListExtra =>
    listExtraMap.get(id) ?? demo.emptyListExtra();

  const alert = toRemove && (
    <RemoveAlert
      pending={{
        ...toRemove,
        label:
          "item" in toRemove.item
            ? itemName(dialogCtx, toRemove.item.item)
            : undefined,
      }}
      onConfirm={() => {
        toRemove.rm();
        setToRemove(null);
      }}
      onCancel={() => setToRemove(null)}
    />
  );

  const list = (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {sections.map((section, sIndex) => (
        <SectionComponent
          key={section.header.id}
          ctx={listCtx}
          variants={variants}
          itemExtra={itemExtra}
          renderCard={demo.renderCard}
          args={args}
          clone={cloneFn}
          section={section}
          sIndex={sIndex}
          jump={jump}
          setAddItem={dialogs.setItemSession}
        />
      ))}
    </div>
  );

  return (
    <DialogActionsCtx.Provider value={dialogActions}>
      {dialogs.formItemDialog}
      {dialogs.sectionDialog}
      <LayoutWithSidebar
        main={
          <>
            {alert}
            {list}
          </>
        }
        sidebar={
          <lib.Side<types.TypeNames, types.Params, types.Section>
            title="Library"
            addSectionLabel="+ Add section"
            menuItems={MENU_ITEMS}
            random={randomId}
            blankSection={blankSection}
            render={renderSide}
            renderMenuItem={renderMenuItem}
            setAddFormItem={(item) => dialogs.openItemInsert(item)}
            setAddSection={dialogs.openSectionAdd}
          />
        }
      />
    </DialogActionsCtx.Provider>
  );
};

const FillPhase = ({
  sections,
  responses,
  formResponse,
  updateArgs,
}: {
  sections: types.ListSection[];
  responses: Record<string, lib.Response>;
  formResponse: types.FormResponseDoc | null;
  updateArgs: types.DemoProps["updateArgs"];
}) => {
  const formRef = useRef<lib.SectionValidator | null>(null);
  const [errors, setErrors] = useState<Record<string, string | null>>({});
  const [justSent, setJustSent] = useState(false);

  /**
   * School `CustomFormResponder`: when a FormResponse exists, pass it as `old`
   * so locked answers show and only remarked fields are editable.
   */
  const old = useMemo((): {
    values: Record<string, lib.Response>;
    changes: lib.ResponderAdditionalChanges;
  } | null => {
    if (!formResponse) return null;
    const responderChanges: lib.ResponderAdditionalChanges = {};
    for (const [id, entry] of Object.entries(formResponse.changes)) {
      if (entry.comment != null) responderChanges[id] = { comment: entry.comment };
    }
    return {
      values: phases.formResponseValues(formResponse),
      changes: responderChanges,
    };
  }, [formResponse]);

  const setResponse = useCallback(
    (id: string, next?: lib.Response) => {
      setJustSent(false);
      if (next === undefined) {
        const { [id]: _, ...rest } = responses;
        updateArgs({ responses: rest });
        return;
      }
      updateArgs({ responses: { ...responses, [id]: next } });
    },
    [responses, updateArgs],
  );

  /**
   * School formik onSubmit → `customForms.addFormResponse` (first send) or
   * update the same FormResponse on revise. Matches Meteor insert:
   * `changes: {}` on create; no per-item `history` stamp (that is review-side).
   * Fill draft (`responses` args) stays formik session state — not overwritten.
   */
  const send = () => {
    const ref = formRef.current;
    if (!ref) return;
    const keyed = Object.fromEntries(
      ref.getKeys().map((k) => [k, responses[k]]),
    ) as Record<string, lib.Response>;
    const nextErrors = ref.validate(keyed);
    setErrors(nextErrors);
    if (Object.values(nextErrors).some((e) => e != null && e !== "")) return;

    const updated = ref.update(keyed);
    const sendDate = phases.rememberDate(new Date());
    // Revise: merge unlocked updates into prior answers (getKeys is only editable).
    const nextValues = {
      ...(formResponse ? phases.formResponseValues(formResponse) : {}),
      ...updated,
    };

    const nextDoc: types.FormResponseDoc = {
      responses: phases.toFormResponseEntries(nextValues),
      // School addFormResponse sets `changes: {}`; keep teacher remarks on revise.
      changes: formResponse?.changes ?? {},
      feedbackHistory: [
        ...(formResponse?.feedbackHistory ?? []),
        { status: "answered", date: sendDate.toISOString() },
      ],
      status: "answered",
    };

    updateArgs({ formResponse: nextDoc });
    setJustSent(true);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <FormResponder
        ctx={fillCtx}
        header={{
          title: old ? "Revise your answers" : "Fill the form",
          description: old
            ? "Locked fields keep the prior FormResponse answer. Remarks unlock fields for revise — then Send again."
            : "Send creates the FormResponse document (school addFormResponse).",
        }}
        sections={sections}
        responses={responses}
        old={old}
        setResponse={setResponse}
        getError={(id) => errors[id] ?? null}
        impRef={formRef}
        showDeleted={false}
      />
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <button
          type="button"
          onClick={() => setErrors(formRef.current?.validate(responses) ?? {})}
        >
          Validate
        </button>
        <button
          type="button"
          onClick={send}
          style={{
            background: "#1a5fb4",
            color: "#fff",
            border: "none",
            padding: "6px 14px",
            borderRadius: 4,
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          Send
        </button>
        {justSent ? (
          <span style={{ fontSize: 13, color: "#22883e" }}>
            FormResponse saved — open Update to review the same document.
          </span>
        ) : null}
        {formResponse && !justSent ? (
          <span style={{ fontSize: 13, color: "#666" }}>
            FormResponse on file — revise unlocked fields, then Send again.
          </span>
        ) : null}
      </div>
    </div>
  );
};

const UpdatePhase = ({
  sections,
  formResponse,
  showDeleted,
  updateArgs,
}: {
  sections: types.ListSection[];
  formResponse: types.FormResponseDoc | null;
  showDeleted: boolean;
  updateArgs: types.DemoProps["updateArgs"];
}) => {
  const [addition, setAddition] = useState<
    lib.Addition<types.TypeNames, types.Params> | null
  >(null);
  const [deleteCommentId, setDeleteCommentId] = useState<string | null>(null);
  const [savedChanges, setSavedChanges] = useState(
    formResponse?.changes ?? {},
  );
  const [feedbackComment, setFeedbackComment] = useState("");
  const [statusNote, setStatusNote] = useState<string | null>(null);

  const patchFormResponse = useCallback(
    (patch: Partial<types.FormResponseDoc>) => {
      if (!formResponse) return;
      updateArgs({ formResponse: { ...formResponse, ...patch } });
    },
    [formResponse, updateArgs],
  );

  const setChanges = useCallback(
    (next: lib.AdditionalChanges<types.TypeNames, types.Params>) =>
      patchFormResponse({ changes: next }),
    [patchFormResponse],
  );

  const changes = formResponse?.changes ?? {};
  const feedbackHistory = formResponse?.feedbackHistory ?? [];
  const lastFeedback = feedbackHistory.at(-1) ?? null;
  const lastPending = lastFeedback
    ? phases.dateFromIso(lastFeedback.date)
    : null;
  const dirty = formResponse != null && savedChanges !== changes;

  /**
   * School `formResponses.addAdditionalQuestions` — persist teacher
   * remarks / follow-ups on the same FormResponse; if status was
   * `answered`, also push `draft`.
   */
  const saveChanges = () => {
    if (!formResponse) return;
    const nextHistory = [...feedbackHistory];
    let nextStatus = formResponse.status;
    if (formResponse.status === "answered") {
      const draftDate = phases.rememberDate(new Date());
      nextHistory.push({ status: "draft", date: draftDate.toISOString() });
      nextStatus = "draft";
    }
    setSavedChanges(changes);
    patchFormResponse({ feedbackHistory: nextHistory, status: nextStatus });
    setStatusNote("FormResponse.changes saved.");
  };

  /** School `formResponses.addFeedback` — mutates the same FormResponse. */
  const submitFeedback = (status: types.FeedbackStatus) => {
    if (!formResponse) return;
    const date = phases.rememberDate(new Date());
    const comment = feedbackComment.trim() || undefined;
    patchFormResponse({
      status,
      feedbackHistory: [
        ...feedbackHistory,
        { status, comment, date: date.toISOString() },
      ],
    });
    setFeedbackComment("");
    setStatusNote(
      status === "changesRequested"
        ? "Changes requested on FormResponse — student revises on Fill → Send."
        : status === "approved"
          ? "FormResponse approved."
          : "FormResponse rejected.",
    );
  };

  const pickFollowUpType = (newItem: {
    header: lib.SomeFormItem<types.TypeNames, types.Params>;
  }) => {
    if (!addition || addition.mode !== "formItem") return;
    const header = newItem.header;
    setAddition({
      ...addition,
      formItem: lib.withFormItemName(header, header.params.name || header.type),
    });
  };

  if (!formResponse) {
    return (
      <p style={{ margin: 0, fontSize: 14, color: "#a40" }}>
        No FormResponse yet — use Fill → Send to create the response document.
        Update is a teacher view of that same document, not a third store.
      </p>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 12,
          alignItems: "center",
          fontSize: 14,
        }}
      >
        <button type="button" onClick={saveChanges} disabled={!dirty}>
          Save changes
        </button>
        <button
          type="button"
          onClick={() => {
            setChanges(savedChanges);
            setStatusNote("Changes discarded.");
          }}
          disabled={!dirty}
        >
          Cancel
        </button>
        <label style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <input
            type="checkbox"
            checked={showDeleted}
            onChange={(e) => updateArgs({ showDeleted: e.target.checked })}
          />
          Show deleted sections
        </label>
        <span style={{ fontSize: 13, color: "#555" }}>
          FormResponse status: <code>{formResponse.status}</code>
          {lastPending ? ` · ${lastPending.toISOString().slice(0, 10)}` : ""}
        </span>
        {statusNote ? (
          <span style={{ fontSize: 13, color: "#22883e" }}>{statusNote}</span>
        ) : null}
      </div>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 8,
          alignItems: "center",
          padding: "10px 12px",
          background: "#f6f7f9",
          borderRadius: 6,
          fontSize: 13,
        }}
      >
        <span style={{ fontWeight: 600 }}>Feedback</span>
        <input
          type="text"
          value={feedbackComment}
          onChange={(e) => setFeedbackComment(e.target.value)}
          placeholder="Optional comment"
          style={{ flex: "1 1 160px", minWidth: 120, padding: "4px 8px" }}
        />
        <button
          type="button"
          onClick={() => submitFeedback("changesRequested")}
        >
          Request changes
        </button>
        <button
          type="button"
          onClick={() => submitFeedback("approved")}
          style={{ color: "#1b7a36" }}
        >
          Approve
        </button>
        <button
          type="button"
          onClick={() => submitFeedback("rejected")}
          style={{ color: "#a40" }}
        >
          Reject
        </button>
      </div>
      {addition?.mode === "formItem" && !addition.formItem ? (
        <p
          style={{
            margin: 0,
            padding: "8px 12px",
            background: "#f0f5fb",
            border: "1px solid #1a5fb4",
            borderRadius: 6,
            fontSize: 13,
          }}
        >
          Follow-up for item <code>{addition.originId}</code> — pick a type in the
          Library sidebar.
        </p>
      ) : null}
      <LayoutWithSidebar
        main={
          <FormReview
            ctx={reviewCtx}
            header={{
              title: "Update FormResponse",
              description:
                "Same document as Fill — remarks / follow-ups / feedback live on FormResponse.changes + feedbackHistory.",
            }}
            sections={sections}
            responses={phases.formResponseValues(formResponse)}
            lastPending={lastPending}
            changes={changes}
            setChanges={setChanges}
            addition={addition}
            setAddition={setAddition}
            deleteCommentId={deleteCommentId}
            setDeleteCommentId={setDeleteCommentId}
            tCommon={tCommon}
            showDeleted={showDeleted}
          />
        }
        sidebar={
          <lib.Side<types.TypeNames, types.Params, types.Section>
            title="Library"
            addSectionLabel="+ Add section"
            menuItems={MENU_ITEMS}
            random={randomId}
            blankSection={blankSection}
            render={renderSide}
            renderMenuItem={renderMenuItem}
            setAddFormItem={(item) => {
              if (addition?.mode === "formItem") {
                pickFollowUpType(item);
              }
            }}
            setAddSection={() => {
              /* sections are designed in Design phase only */
            }}
          />
        }
      />
    </div>
  );
};

export const AllInEditor = ({
  heading,
  phase,
  flatItems,
  responses,
  formResponse,
  showDeleted,
  updateArgs,
}: types.DemoProps) => {
  const sections = useMemo(
    () => lib.consolidateSections(flatItems) as types.ListSection[],
    [flatItems],
  );

  return (
    <FormContainer title={heading}>
      <phases.PhaseTabs
        phase={phase}
        onChange={(next) => updateArgs({ phase: next })}
      />
      {phase === "design" ? (
        <DesignPhase flatItems={flatItems} updateArgs={updateArgs} />
      ) : null}
      {phase === "fill" ? (
        <FillPhase
          sections={sections}
          responses={responses}
          formResponse={formResponse}
          updateArgs={updateArgs}
        />
      ) : null}
      {phase === "update" ? (
        <UpdatePhase
          sections={sections}
          formResponse={formResponse}
          showDeleted={showDeleted}
          updateArgs={updateArgs}
        />
      ) : null}
      <phases.PhaseJsonPanels
        phase={phase}
        flatItems={flatItems}
        responses={responses}
        formResponse={formResponse}
      />
    </FormContainer>
  );
};
