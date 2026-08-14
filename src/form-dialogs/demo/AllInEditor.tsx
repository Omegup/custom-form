/**
 * All-in composition — Design → Fill → Update lifecycle.
 * Library owns document ops + list session; this file wires host HTML,
 * Storybook args, and HOC chrome.
 */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
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
import {
  defaultVariants,
  followUpVariants,
} from "../../form-item-editor/demo/itemVariants";
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

const FollowUpSectionComponent = lib.SectionFormItemHOC<
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
  renderTitle: () => <strong>Follow-up items</strong>,
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

const followUpSection = (): types.Section => ({
  id: "review-follow-up-section",
  deleted: false,
  title: "Follow-up items",
  description: "",
});

const FollowUpDesignItems = ({
  entries,
  designFlatItems,
  setEntries,
}: {
  entries: lib.ReviewFormItemEntry<types.TypeNames, types.Params>[];
  designFlatItems: types.FlatItems;
  setEntries: (
    entries: lib.ReviewFormItemEntry<types.TypeNames, types.Params>[],
  ) => void;
}) => {
  const flatItems = useMemo(
    () => lib.followUpEntriesToFlat(entries, followUpSection()),
    [entries],
  );
  const setFlatItems = useCallback(
    (next: types.FlatItems) => {
      const synced = lib.syncFollowUpEntriesFromFlat(next, entries);
      if (synced) setEntries(synced);
    },
    [entries, setEntries],
  );
  const dialogCtx: types.Ctx = lib.branded({
    flatItems: [...designFlatItems, ...flatItems],
  });
  const dialogs = useDialogs({
    flatItems,
    setFlatItems,
    ctx: dialogCtx,
  });
  const session = lib.useFlatListSession({
    flatItems,
    setFlatItems,
    baseCtx: lib.branded<lib.ContextDom, "context">({}),
    clone: cloneFn,
    jump: true,
  });
  const variants = followUpVariants;
  const listExtraMap = demo.buildListExtraMap(
    session.sections,
    session.itemActions,
    dialogs.openItemEdit,
  );
  const itemExtra = (id: string): types.ListExtra =>
    listExtraMap.get(id) ?? demo.emptyListExtra();
  const section = session.sections[0];
  if (!section) return null;
  const toRemove = session.toRemove;

  return (
    <DialogActionsCtx.Provider
      value={{
        openItemEdit: dialogs.openItemEdit,
        openSectionEdit: () => {},
      }}
    >
      {dialogs.formItemDialog}
      {toRemove ? (
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
            session.setToRemove(null);
          }}
          onCancel={() => session.setToRemove(null)}
        />
      ) : null}
      <FollowUpSectionComponent
        ctx={session.listCtx}
        variants={variants}
        itemExtra={itemExtra}
        renderCard={demo.renderCard}
        args={session.args}
        clone={cloneFn}
        section={section}
        sIndex={0}
        jump
        setAddItem={dialogs.setItemSession}
      />
    </DialogActionsCtx.Provider>
  );
};

const FormResponder = lib.CustomFormResponderHOC<
  types.TypeNames,
  types.Params,
  types.Variants,
  lib.SectionResponderContext,
  types.Section
>(phases.fillViewers, phases.fillChrome);

const FormReview = lib.CustomFormReviewHOC<
  types.TypeNames,
  types.Params,
  types.Variants,
  lib.SectionReviewContext,
  types.Section
>(phases.reviewViewers, phases.reviewChrome);

const responderVariants: Record<lib.ResponderState, types.Variants> = {
  default: defaultVariants,
  old: defaultVariants,
  change: followUpVariants,
  error: defaultVariants,
};

const reviewVariants: Record<lib.ReviewVariantState, types.Variants> = {
  default: defaultVariants,
  change: followUpVariants,
};

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
  const dialogCtx: types.Ctx = lib.branded({ flatItems });
  const dialogs = useDialogs({
    flatItems,
    setFlatItems: (items) => updateArgs({ flatItems: items }),
    ctx: dialogCtx,
  });
  const session = lib.useFlatListSession({
    flatItems,
    setFlatItems: (items) => updateArgs({ flatItems: items }),
    baseCtx: lib.branded<lib.ContextDom, "context">({}),
    clone: cloneFn,
    jump: true,
  });
  const dialogActions = useMemo(
    (): DialogActions => ({
      openItemEdit: dialogs.openItemEdit,
      openSectionEdit: dialogs.openSectionEdit,
    }),
    [dialogs.openItemEdit, dialogs.openSectionEdit],
  );
  const listExtraMap = demo.buildListExtraMap(
    session.sections,
    session.itemActions,
    dialogs.openItemEdit,
  );
  const itemExtra = (id: string): types.ListExtra =>
    listExtraMap.get(id) ?? demo.emptyListExtra();
  const toRemove = session.toRemove;
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
        session.setToRemove(null);
      }}
      onCancel={() => session.setToRemove(null)}
    />
  );
  const list = (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {session.sections.map((section, sIndex) => (
        <SectionComponent
          key={section.header.id}
          ctx={session.listCtx}
          variants={defaultVariants}
          itemExtra={itemExtra}
          renderCard={demo.renderCard}
          args={session.args}
          clone={cloneFn}
          section={section}
          sIndex={sIndex}
          jump
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
  const [justSent, setJustSent] = useState(false);
  const [optimisticResponse, setOptimisticResponse] =
    useState<types.FormResponseDoc | null>(null);
  const doc = formResponse ?? optimisticResponse;
  const fill = lib.useFormResponseSend({
    doc,
    draft: responses,
    setDraft: (next) => {
      setJustSent(false);
      updateArgs({ responses: next });
    },
    sections,
    validatorRef: formRef,
    now: () => phases.rememberDate(new Date()),
  });

  useEffect(() => {
    if (!optimisticResponse) return;
    if (formResponse?.status === "answered") setOptimisticResponse(null);
    if (formResponse?.status === "changesRequested") setOptimisticResponse(null);
  }, [formResponse, optimisticResponse]);

  const send = () => {
    const next = fill.send();
    if (!next) return;
    setOptimisticResponse(next);
    updateArgs({ formResponse: next, responses: {} });
    setJustSent(true);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <FormResponder
        ctx={fillCtx}
        header={{
          title: fill.old ? "Revise your answers" : "Fill the form",
          description:
            fill.unansweredFollowUpIds.size > 0
              ? doc?.status === "changesRequested"
                ? `Answer ${fill.unansweredFollowUpIds.size} follow-up field(s) (yellow, under related answers), then Send.`
                : `Follow-up questions are under related answers — Request changes on Update to unlock Send (and yellow revise chrome).`
              : fill.old
                ? doc?.status === "changesRequested"
                  ? "Changes requested — edit remarked fields if you want, then Send again (resend is allowed with no edits)."
                  : "Waiting for the teacher to request changes before you can Send again."
                : "Send creates the FormResponse document (school addFormResponse).",
        }}
        sections={sections}
        responses={responses}
        old={fill.old}
        setResponse={fill.setResponse}
        getError={(id) => fill.errors[id] ?? null}
        impRef={formRef}
        showDeleted={false}
        variants={responderVariants}
        followUpItems={fill.followUpItems}
      />
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <button type="button" onClick={() => fill.validate()}>
          Validate
        </button>
        <button
          type="button"
          onClick={send}
          disabled={!fill.canSend}
          style={{
            background: fill.canSend ? "#1a5fb4" : "#9aa7b8",
            color: "#fff",
            border: "none",
            padding: "6px 14px",
            borderRadius: 4,
            cursor: fill.canSend ? "pointer" : "not-allowed",
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
        {doc?.status === "changesRequested" ? (
          <span style={{ fontSize: 13, color: "#666" }}>
            Changes requested — Send is available (edits optional).
          </span>
        ) : null}
        {doc && doc.status !== "changesRequested" && !justSent ? (
          <span style={{ fontSize: 13, color: "#666" }}>
            Sent — waiting for teacher feedback (Request changes unlocks Send).
          </span>
        ) : null}
      </div>
    </div>
  );
};

const UpdatePhase = ({
  sections,
  flatItems,
  formResponse,
  showDeleted,
  updateArgs,
}: {
  sections: types.ListSection[];
  flatItems: types.FlatItems;
  formResponse: types.FormResponseDoc | null;
  showDeleted: boolean;
  updateArgs: types.DemoProps["updateArgs"];
}) => {
  const [addition, setAddition] = useState<
    lib.Addition<types.TypeNames, types.Params> | null
  >(null);
  const [deleteCommentId, setDeleteCommentId] = useState<string | null>(null);
  const [feedbackComment, setFeedbackComment] = useState("");
  const [statusNote, setStatusNote] = useState<string | null>(null);
  const review = lib.useFormResponseReview({
    doc: formResponse,
    setDoc: (next) => updateArgs({ formResponse: next }),
    now: () => phases.rememberDate(new Date()),
  });
  const lastPending = review.lastAnsweredIso
    ? phases.dateFromIso(review.lastAnsweredIso)
    : null;

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
        <button
          type="button"
          onClick={() => {
            review.save();
            setStatusNote("FormResponse.changes saved.");
          }}
          disabled={!review.dirty}
          title={
            formResponse.status === "answered"
              ? "Commit remarks/follow-ups and move status answered → draft (school addAdditionalQuestions)."
              : "Commit remarks/follow-ups on FormResponse.changes (school addAdditionalQuestions)."
          }
        >
          Save changes
        </button>
        <button
          type="button"
          onClick={() => {
            review.revert();
            setStatusNote("Changes discarded.");
          }}
          disabled={!review.dirty}
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
          onClick={() => {
            review.submitFeedback(
              "changesRequested",
              feedbackComment.trim() || undefined,
            );
            setFeedbackComment("");
            setStatusNote(
              "Changes requested on FormResponse — student revises on Fill → Send.",
            );
          }}
          disabled={formResponse.status === "changesRequested"}
        >
          Request changes
        </button>
        <button
          type="button"
          onClick={() => {
            review.submitFeedback("approved");
            setFeedbackComment("");
            setStatusNote("FormResponse approved.");
          }}
          disabled={formResponse.status === "approved"}
          style={{
            color: formResponse.status === "approved" ? undefined : "#1b7a36",
          }}
        >
          Approve
        </button>
        <button
          type="button"
          onClick={() => {
            review.submitFeedback("rejected");
            setFeedbackComment("");
            setStatusNote("FormResponse rejected.");
          }}
          disabled={formResponse.status === "rejected"}
          style={{
            color: formResponse.status === "rejected" ? undefined : "#a40",
          }}
        >
          Reject
        </button>
      </div>
      <FormReview
        ctx={reviewCtx}
        header={{
          title: "Update FormResponse",
          description:
            "Same document as Fill — remarks / follow-ups / feedback live on FormResponse.changes + feedbackHistory.",
        }}
        sections={sections}
        responses={lib.formResponseValues(formResponse)}
        lastPending={lastPending}
        changes={formResponse.changes}
        setChanges={review.setChanges}
        addition={addition}
        setAddition={setAddition}
        deleteCommentId={deleteCommentId}
        setDeleteCommentId={setDeleteCommentId}
        renderFormItemsEditor={({ entries, setEntries, fallback }) =>
          entries.some((entry) => entry.formItem) ? (
            <FollowUpDesignItems
              entries={entries}
              designFlatItems={flatItems}
              setEntries={setEntries}
            />
          ) : (
            fallback
          )
        }
        variants={reviewVariants}
        tCommon={tCommon}
        showDeleted={showDeleted}
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
          flatItems={flatItems}
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
