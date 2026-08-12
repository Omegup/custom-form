/**
 * All-in composition — Design → Fill → Update lifecycle:
 * 1. Design: school `CustomFormEditor` + `DialogsHOC` (`makeUseDialogs`) over
 *    `SectionFormItemHOC` + `WebRecursiveEdit` + Library sidebar
 * 2. Fill: `CustomFormResponderHOC` on the designed sections
 * 3. Update: `CustomFormReviewHOC` — remarks unlock answers; `+ Follow-up`
 *    dropdown attaches types (same catalog as Design)
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

type PendingRemove = {
  rm: () => void;
  item: lib.FlatNestedItem<types.TypeNames, types.Params, types.Section>;
};

const followUpSection = (): types.Section => ({
  id: "review-follow-up-section",
  deleted: false,
  title: "Follow-up items",
  description: "",
});

const followUpEntriesToFlat = (
  entries: lib.ReviewFormItemEntry<types.TypeNames, types.Params>[],
): types.FlatItems => {
  const flatten = lib.flatten<
    types.TypeNames,
    types.Params,
    types.Section,
    types.ItemMeta
  >();
  return [
    { section: followUpSection() },
    ...entries.flatMap((entry) =>
      entry.formItem
        ? flatten.formItem({
            header: entry.formItem,
            children: entry.children ?? [],
            meta: lib.branded({ index: 0, total: 0, sIndex: 0 }),
          })
        : [],
    ),
  ];
};

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
  const [focused, setFocused] = useState<lib.AutoFocusState>(null);
  const [toRemove, setToRemove] = useState<PendingRemove | null>(null);
  const flatItems = useMemo(() => followUpEntriesToFlat(entries), [entries]);
  const dialogCtx: types.Ctx = lib.branded({
    flatItems: [...designFlatItems, ...flatItems],
  });

  const setFlatItems = useCallback(
    (next: types.FlatItems) => {
      const roots = lib.consolidateSections(next)[0]?.items.flat() ?? [];
      // Don't let a DnD/layout sync wipe follow-ups that still exist in `entries`.
      if (
        roots.length === 0 &&
        entries.some((entry) => entry.formItem != null)
      ) {
        return;
      }
      const current = new Map(
        entries.flatMap((entry) =>
          entry.formItem ? [[entry.formItem.id, entry] as const] : [],
        ),
      );
      const commentOnly = entries.filter((entry) => !entry.formItem);
      setEntries([
        ...roots.map((root) => {
          const previous = current.get(root.header.id);
          return {
            ...previous,
            formItem: root.header,
            children: root.children,
            date: previous?.date ?? null,
          };
        }),
        ...commentOnly,
      ]);
    },
    [entries, setEntries],
  );

  const dialogs = useDialogs({
    flatItems,
    setFlatItems,
    ctx: dialogCtx,
  });
  const listCtx = useMemo(
    () => lib.autofocusCtx<lib.ContextDom>(lib.branded({}), focused),
    [focused],
  );
  // Entire editor is follow-up items — yellow chrome via `followUp` variant.
  const variants = useMemo(
    (): types.Variants =>
      lib.branded({ field: "followUp", heading: "followUp", panel: "followUp" }),
    [],
  );
  const setItems = (items: types.FlatItems, newCtx: types.ListCtx) => {
    if (items !== flatItems) setFlatItems(items);
    setFocused(newCtx.focused);
  };
  const sections = useMemo(() => lib.consolidateSections(flatItems), [flatItems]);
  const args = {
    items: flatItems,
    setItems,
    ctx: listCtx,
    sectionOfItem: lib.buildItemSectionDict(flatItems),
    setToRemove,
  };
  const itemActions = lib.getFormItemMoveActions(args, cloneFn, true);
  const listExtraMap = demo.buildListExtraMap(
    sections,
    itemActions,
    dialogs.openItemEdit,
  );
  const itemExtra = (id: string): types.ListExtra =>
    listExtraMap.get(id) ?? demo.emptyListExtra();
  const section = sections[0];
  if (!section) return null;

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
            setToRemove(null);
          }}
          onCancel={() => setToRemove(null)}
        />
      ) : null}
      <FollowUpSectionComponent
        ctx={listCtx}
        variants={variants}
        itemExtra={itemExtra}
        renderCard={demo.renderCard}
        args={args}
        clone={cloneFn}
        section={section}
        sIndex={0}
        jump
        setAddItem={dialogs.setItemSession}
      />
    </DialogActionsCtx.Provider>
  );
};

/**
 * Reviewer follow-ups keyed by origin id — Fill renders them under that item
 * via `SectionResponder` `followUpItems` (same placement as review appendix).
 */
const followUpsByOrigin = (
  changes: lib.AdditionalChanges<types.TypeNames, types.Params>,
): Record<string, types.ListItem[]> => {
  const map: Record<string, types.ListItem[]> = {};
  for (const [originId, change] of Object.entries(changes)) {
    const items =
      change.formItems?.flatMap((entry) =>
        entry.formItem
          ? [
              {
                header: entry.formItem,
                children: entry.children ?? [],
                meta: { index: 0, total: 1, sIndex: 0 },
              },
            ]
          : [],
      ) ?? [];
    if (items.length) map[originId] = items;
  }
  return map;
};

const defaultVariants = lib.branded<types.Variants, "variants">({
  field: "default",
  heading: "default",
  panel: "default",
});

const followUpVariants = lib.branded<types.Variants, "variants">({
  field: "followUp",
  heading: "followUp",
  panel: "followUp",
});

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
>(phases.reviewViewers, defaultVariants, followUpVariants, phases.reviewChrome);

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
  /** Write-through until Storybook args catch up after Send. */
  const [optimisticResponse, setOptimisticResponse] =
    useState<types.FormResponseDoc | null>(null);
  const doc = formResponse ?? optimisticResponse;
  const reviewChanges = formResponse?.changes ?? optimisticResponse?.changes ?? {};
  const followUpItems = useMemo(
    () => followUpsByOrigin(reviewChanges),
    [reviewChanges],
  );
  const followUpIds = useMemo(() => {
    const ids = new Set<string>();
    for (const change of Object.values(reviewChanges)) {
      for (const entry of change.formItems ?? []) {
        if (entry.formItem) ids.add(entry.formItem.id);
      }
    }
    return ids;
  }, [reviewChanges]);
  /** Unanswered follow-ups only — settled ones style like originals. */
  const unansweredFollowUpIds = useMemo(() => {
    const answered = doc ? phases.formResponseValues(doc) : {};
    const ids = new Set<string>();
    for (const id of followUpIds) {
      const res = answered[id];
      if (!res || Object.keys(res.data).length === 0) ids.add(id);
    }
    return ids;
  }, [doc, followUpIds]);
  const unlockedIds = useMemo(() => {
    const ids = new Set<string>();
    for (const [id, change] of Object.entries(reviewChanges)) {
      if (change.comment != null) ids.add(id);
    }
    return ids;
  }, [reviewChanges]);
  const resolveVariant = useCallback(
    <K extends types.TypeNames>(
      item: lib.TypedFormItem<types.Params, K>,
    ): types.Variants[K] => {
      // Yellow only while revising a change-request round.
      if (doc?.status !== "changesRequested") return defaultVariants[item.type];
      const baseId = item.id.includes(":")
        ? item.id.slice(0, item.id.lastIndexOf(":"))
        : item.id;
      const pending =
        unansweredFollowUpIds.has(item.id) ||
        unansweredFollowUpIds.has(baseId) ||
        unlockedIds.has(item.id) ||
        unlockedIds.has(baseId);
      return pending ? followUpVariants[item.type] : defaultVariants[item.type];
    },
    [doc?.status, unansweredFollowUpIds, unlockedIds],
  );

  useEffect(() => {
    if (!optimisticResponse) return;
    if (formResponse?.status === "answered") setOptimisticResponse(null);
    if (formResponse?.status === "changesRequested") setOptimisticResponse(null);
  }, [formResponse, optimisticResponse]);

  /**
   * School `CustomFormResponder`: when a FormResponse exists, pass it as `old`
   * so locked answers show and only remarked fields are editable.
   */
  const old = useMemo((): {
    values: Record<string, lib.Response>;
    changes: lib.ResponderAdditionalChanges;
  } | null => {
    if (!doc) return null;
    const responderChanges: lib.ResponderAdditionalChanges = {};
    for (const [id, entry] of Object.entries(doc.changes)) {
      if (entry.comment != null) responderChanges[id] = { comment: entry.comment };
    }
    return {
      values: phases.formResponseValues(doc),
      changes: responderChanges,
    };
  }, [doc]);

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

  /** Drop teacher unlock remarks — Send consumes them (fields lock again). */
  const withoutUnlockComments = (
    changes: lib.AdditionalChanges<types.TypeNames, types.Params>,
  ): lib.AdditionalChanges<types.TypeNames, types.Params> => {
    const next: lib.AdditionalChanges<types.TypeNames, types.Params> = {};
    for (const [id, entry] of Object.entries(changes)) {
      if (entry.comment == null) {
        next[id] = entry;
        continue;
      }
      const { comment: _comment, ...rest } = entry;
      if (Object.keys(rest).length) next[id] = rest;
    }
    return next;
  };

  /**
   * Stamp `history` for newly answered ids so Review can bold them
   * (`lastPending === history.at(-1).date` → highlight).
   */
  const withAnswerHistory = (
    prior: lib.AdditionalChanges<types.TypeNames, types.Params>,
    answeredIds: Iterable<string>,
    sendDate: Date,
  ): lib.AdditionalChanges<types.TypeNames, types.Params> => {
    const next = withoutUnlockComments(prior);
    for (const id of answeredIds) {
      const cur = next[id] ?? {};
      next[id] = {
        ...cur,
        history: [...(cur.history ?? []), { date: sendDate }],
      };
    }
    return next;
  };

  /**
   * School fill submit → `customForms.addFormResponse` (first send) or
   * update the same FormResponse on revise after `changesRequested`.
   *
   * Sendability is status-only: no FormResponse yet, or status is
   * `changesRequested`. Remarks only control which fields are editable.
   */
  const send = () => {
    const ref = formRef.current;
    if (!ref) return;
    if (doc && doc.status !== "changesRequested") return;

    const prior = doc ? phases.formResponseValues(doc) : {};
    const keys = ref.getKeys();
    // First fill needs registered fields; change-request may resend prior as-is.
    if (!doc && keys.length === 0) return;

    const keyed = Object.fromEntries(
      keys.map((k) => [k, responses[k] ?? prior[k]]),
    ) as Record<string, lib.Response>;
    if (keys.length > 0) {
      const nextErrors = ref.validate(keyed);
      setErrors(nextErrors);
      if (Object.values(nextErrors).some((e) => e != null && e !== "")) return;
    }

    const updated = keys.length > 0 ? ref.update(keyed) : {};
    const sendDate = phases.rememberDate(new Date());
    const nextValues = { ...prior, ...updated };

    const answeredIds = Object.entries(nextValues)
      .filter(([, r]) => r != null && Object.keys(r.data).length > 0)
      .map(([id]) => id);

    let nextChanges: lib.AdditionalChanges<types.TypeNames, types.Params> = {};
    if (!doc) {
      nextChanges = withAnswerHistory({}, answeredIds, sendDate);
    } else {
      const toStamp = new Set<string>();
      for (const [id, entry] of Object.entries(doc.changes)) {
        if (entry.comment != null) toStamp.add(id);
        for (const fi of entry.formItems ?? []) {
          if (fi.formItem && nextValues[fi.formItem.id]) {
            toStamp.add(fi.formItem.id);
          }
        }
      }
      nextChanges = withAnswerHistory(doc.changes, toStamp, sendDate);
    }

    const nextDoc: types.FormResponseDoc = {
      responses: phases.toFormResponseEntries(nextValues),
      changes: nextChanges,
      feedbackHistory: [
        ...(doc?.feedbackHistory ?? []),
        { status: "answered", date: sendDate.toISOString() },
      ],
      status: "answered",
    };

    setOptimisticResponse(nextDoc);
    updateArgs({ formResponse: nextDoc, responses: {} });
    setJustSent(true);
  };

  /** Empty (no FormResponse) or teacher `changesRequested` — nothing else. */
  const canSend = !doc || doc.status === "changesRequested";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <FormResponder
        ctx={fillCtx}
        header={{
          title: old ? "Revise your answers" : "Fill the form",
          description:
            followUpIds.size > 0
              ? `Includes ${followUpIds.size} reviewer follow-up field(s) under their related answers.`
              : old
                ? doc?.status === "changesRequested"
                  ? "Changes requested — edit remarked fields if you want, then Send again (resend is allowed with no edits)."
                  : "Waiting for the teacher to request changes before you can Send again."
                : "Send creates the FormResponse document (school addFormResponse).",
        }}
        sections={sections}
        responses={responses}
        old={old}
        setResponse={setResponse}
        getError={(id) => errors[id] ?? null}
        impRef={formRef}
        showDeleted={false}
        resolveVariant={resolveVariant}
        followUpItems={followUpItems}
      />
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <button
          type="button"
          onClick={() => {
            const prior = doc ? phases.formResponseValues(doc) : {};
            const keys = formRef.current?.getKeys() ?? [];
            const keyed = Object.fromEntries(
              keys.map((k) => [k, responses[k] ?? prior[k]]),
            ) as Record<string, lib.Response>;
            setErrors(formRef.current?.validate(keyed) ?? {});
          }}
        >
          Validate
        </button>
        <button
          type="button"
          onClick={send}
          disabled={!canSend}
          style={{
            background: canSend ? "#1a5fb4" : "#9aa7b8",
            color: "#fff",
            border: "none",
            padding: "6px 14px",
            borderRadius: 4,
            cursor: canSend ? "pointer" : "not-allowed",
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
  const [savedChanges, setSavedChanges] = useState(
    () => JSON.stringify(formResponse?.changes ?? {}),
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
  // Storybook re-decodes args every render — compare by value, not reference.
  const dirty =
    formResponse != null && savedChanges !== JSON.stringify(changes);

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
    setSavedChanges(JSON.stringify(changes));
    patchFormResponse({ feedbackHistory: nextHistory, status: nextStatus });
    setStatusNote("FormResponse.changes saved.");
  };

  /** School `formResponses.addFeedback` — mutates the same FormResponse. */
  const submitFeedback = (status: types.FeedbackStatus) => {
    if (!formResponse) return;
    if (formResponse.status === status) return;
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
          onClick={saveChanges}
          disabled={!dirty}
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
            setChanges(JSON.parse(savedChanges) as lib.AdditionalChanges<
              types.TypeNames,
              types.Params
            >);
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
          disabled={formResponse.status === "changesRequested"}
        >
          Request changes
        </button>
        <button
          type="button"
          onClick={() => submitFeedback("approved")}
          disabled={formResponse.status === "approved"}
          style={{
            color: formResponse.status === "approved" ? undefined : "#1b7a36",
          }}
        >
          Approve
        </button>
        <button
          type="button"
          onClick={() => submitFeedback("rejected")}
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
        responses={phases.formResponseValues(formResponse)}
        lastPending={lastPending}
        changes={changes}
        setChanges={setChanges}
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
