/**
 * All-in composition — Design → Fill → Update lifecycle:
 * 1. Design: school `CustomFormEditor` + `DialogsHOC` (`makeUseDialogs`) over
 *    `SectionFormItemHOC` + `WebRecursiveEdit` + Library sidebar
 * 2. Fill: `CustomFormResponderHOC` on the designed sections
 * 3. Update: `CustomFormReviewHOC` — remarks unlock answers; Library sidebar
 *    picks follow-up question types (same catalog as Design)
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
  t: () => "Required",
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
  updateArgs,
}: {
  sections: types.ListSection[];
  responses: Record<string, lib.Response>;
  updateArgs: types.DemoProps["updateArgs"];
}) => {
  const formRef = useRef<lib.SectionValidator | null>(null);
  const [errors, setErrors] = useState<Record<string, string | null>>({});

  const setResponse = useCallback(
    (id: string, next?: lib.Response) => {
      if (next === undefined) {
        const { [id]: _, ...rest } = responses;
        updateArgs({ responses: rest });
        return;
      }
      updateArgs({ responses: { ...responses, [id]: next } });
    },
    [responses, updateArgs],
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <FormResponder
        ctx={fillCtx}
        header={{
          title: "Fill the form",
          description: "Answers become the Update-phase review input.",
        }}
        sections={sections}
        responses={responses}
        old={null}
        setResponse={setResponse}
        getError={(id) => errors[id] ?? null}
        impRef={formRef}
        showDeleted={false}
      />
      <button
        type="button"
        style={{ alignSelf: "flex-start" }}
        onClick={() => setErrors(formRef.current?.validate(responses) ?? {})}
      >
        Validate
      </button>
    </div>
  );
};

const UpdatePhase = ({
  sections,
  responses,
  changes,
  reviewPending,
  showDeleted,
  updateArgs,
}: {
  sections: types.ListSection[];
  responses: Record<string, lib.Response>;
  changes: lib.AdditionalChanges<types.TypeNames, types.Params>;
  reviewPending: boolean;
  showDeleted: boolean;
  updateArgs: types.DemoProps["updateArgs"];
}) => {
  const [addition, setAddition] = useState<
    lib.Addition<types.TypeNames, types.Params> | null
  >(null);
  const [deleteCommentId, setDeleteCommentId] = useState<string | null>(null);

  const setChanges = useCallback(
    (next: lib.AdditionalChanges<types.TypeNames, types.Params>) =>
      updateArgs({ changes: next }),
    [updateArgs],
  );

  const pickFollowUpType = (
    newItem: { header: lib.SomeFormItem<types.TypeNames, types.Params> },
  ) => {
    if (!addition || addition.mode !== "question") return;
    const header = newItem.header;
    setAddition({
      ...addition,
      question: {
        ...header,
        params: {
          ...header.params,
          name: header.params.name || header.type,
        },
      },
    });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 16, fontSize: 14 }}>
        <label style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <input
            type="checkbox"
            checked={reviewPending}
            onChange={(e) => updateArgs({ reviewPending: e.target.checked })}
          />
          Review round pending (highlight status)
        </label>
        <label style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <input
            type="checkbox"
            checked={showDeleted}
            onChange={(e) => updateArgs({ showDeleted: e.target.checked })}
          />
          Show deleted sections
        </label>
      </div>
      {addition?.mode === "question" && !addition.question ? (
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
              title: "Update / review",
              description:
                "Remarks unlock answers. Use 💬 then the Library to attach typed follow-ups.",
            }}
            sections={sections}
            responses={responses}
            lastPending={reviewPending ? phases.PENDING_DATE : null}
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
              if (addition?.mode === "question") {
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
  changes,
  reviewPending,
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
          updateArgs={updateArgs}
        />
      ) : null}
      {phase === "update" ? (
        <UpdatePhase
          sections={sections}
          responses={responses}
          changes={changes}
          reviewPending={reviewPending}
          showDeleted={showDeleted}
          updateArgs={updateArgs}
        />
      ) : null}
      <phases.PhaseJsonPanels
        phase={phase}
        flatItems={flatItems}
        responses={responses}
        changes={changes}
      />
    </FormContainer>
  );
};
