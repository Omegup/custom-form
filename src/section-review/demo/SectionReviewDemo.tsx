/**
 * `section-review` showcase — Design → Response → Follow for one section.
 * Design remounts the form-dialogs editor. Response mounts the fill shell;
 * Follow mounts `SectionReviewHOC`.
 */
import { useCallback, useRef, useState, type Ref } from "react";
import { FormDialogsEditor } from "../../form-dialogs/demo/FormDialogsDemo";
import { sectionsFromFlat } from "../../form-dialogs/demo/formDialogsDemoFlat";
import { RequiredMark } from "../../form-edit/demo/editFormDemoHelper";
import {
  SectionResponder,
  sectionResponderCtx,
  sectionResponderVariants,
} from "../../section-responder/demo/SectionResponderDemo";
import type { SectionValidator } from "../../section-responder";
import {
  headingView,
  panelRepeatChildren,
  panelView,
} from "../../response/demo/nestedItems";
import { FollowUpDrafts } from "./followUpAdd";
import * as demo from "./sectionReviewDemoHelper";
import type * as types from "./sectionReviewDemoTypes.t";
import * as lib from "./library";

const STATUS_COLOR: Record<lib.ReviewStatus, string> = {
  normal: "#22883e",
  disabled: "#ccc",
  highlight: "#333",
};

const FOLLOW_UP_BADGE = (
  <span
    title="Added follow-up"
    aria-label="Added follow-up"
    style={{ color: "#b45309", fontSize: 12, fontWeight: 700 }}
  >
    ✚
  </span>
);

const defaultFieldVariant: types.FieldVariant = {
  border: "#ccc",
  background: "#fafafa",
  badge: null,
  shell: {},
  reviewTone: true,
};

const followUpFieldVariant: types.FieldVariant = {
  border: "#e6b800",
  background: "#fffbeb",
  badge: FOLLOW_UP_BADGE,
  shell: {
    padding: 8,
    borderRadius: 6,
    background: "#fffbeb",
    border: "1px solid #e6b800",
  },
  reviewTone: false,
};

const viewers: lib.Viewers<
  types.TypeNames,
  types.Params,
  types.Variants,
  types.FieldExtra & lib.Children,
  lib.ReviewExtra & { impRef: Ref<lib.StrictViewerMethods> },
  types.Ctx,
  string
> = {
  field: {
    viewer: ({ props: { formItem, extra, variant } }) => {
      const value = extra.response.value.data.value ?? "";
      const newlyAnswered = extra.status === "highlight";
      const mute = variant.reviewTone && extra.parentDeleted;
      const border = variant.reviewTone
        ? STATUS_COLOR[extra.status]
        : variant.border;
      return (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 4,
            fontSize: 14,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 4,
              ...variant.shell,
            }}
          >
            <span
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                fontWeight: newlyAnswered ? 700 : 400,
                color: mute ? "#777" : undefined,
              }}
            >
              {newlyAnswered ? (
                <strong>{formItem.params.name}</strong>
              ) : (
                <span>{formItem.params.name}</span>
              )}
              <RequiredMark required={formItem.params.required} />
              {variant.badge}
              {extra.icon}
            </span>
            <div
              style={{
                padding: "6px 8px",
                border: `1px solid ${border}`,
                borderRadius: 4,
                background: mute ? "#f0f0f0" : variant.background,
                fontWeight: newlyAnswered ? 700 : 400,
                color: mute ? "#666" : undefined,
              }}
            >
              {value || <em style={{ color: "#999", fontWeight: 400 }}>No answer</em>}
            </div>
          </div>
          {extra.appendix}
        </div>
      );
    },
  },
  heading: {
    viewer: headingView,
    repeatChildren: () => [""],
  },
  panel: {
    viewer: panelView,
    repeatChildren: panelRepeatChildren,
  },
};

const SectionReview = lib.SectionReviewHOC<
  types.TypeNames,
  types.Params,
  types.Variants,
  types.Ctx,
  types.Section
>(viewers, demo.sectionChrome);

const ctx = lib.branded<types.Ctx, "context">({});
const variants = lib.branded<types.Variants, "variants">(defaultFieldVariant);
const followUpVariants = lib.branded<types.Variants, "variants">(
  followUpFieldVariant,
);
const reviewVariants: Record<lib.ReviewVariantState, types.Variants> = {
  default: variants,
  change: followUpVariants,
};
const tCommon = (term: "cancel" | "save" | "delete") =>
  ({ cancel: "Cancel", save: "Save", delete: "Delete" })[term];

export const SectionReviewDemo = ({
  heading,
  phase,
  flatItems,
  section,
  responses,
  changes,
  reviewPending,
  updateArgs,
}: types.DemoProps) => {
  const fillRef = useRef<SectionValidator | null>(null);
  const [addition, setAddition] = useState<lib.Addition | null>(null);
  const [deleteCommentId, setDeleteCommentId] = useState<string | null>(null);
  const liveSection = sectionsFromFlat(flatItems)[0] ?? section;

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

  const setChanges = useCallback(
    (next: lib.AdditionalChanges<types.TypeNames, types.Params>) =>
      updateArgs({ changes: next }),
    [updateArgs],
  );

  return (
    <demo.FormContainer title={heading}>
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <demo.PhaseTabs
          phase={phase}
          onChange={(next) => updateArgs({ phase: next })}
          phases={demo.PHASES}
        />

        {phase === "design" ? (
          <FormDialogsEditor
            embedded={false}
            flatItems={flatItems}
            setFlatItems={(next) => {
              const [first] = sectionsFromFlat(next);
              updateArgs({
                flatItems: next,
                ...(first ? { section: first } : {}),
              });
            }}
          />
        ) : null}

        {phase === "response" ? (
          <SectionResponder
            ctx={sectionResponderCtx}
            multiSection={false}
            section={liveSection}
            responses={responses}
            old={null}
            setResponse={setResponse}
            getError={() => null}
            impRef={fillRef}
            variants={sectionResponderVariants}
            followUpItems={{}}
            i={0}
          />
        ) : null}

        {phase === "follow" ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 14 }}>
              <input
                type="checkbox"
                checked={reviewPending}
                onChange={(e) => updateArgs({ reviewPending: e.target.checked })}
              />
              Review round pending (highlight status)
            </label>
            <SectionReview
              ctx={ctx}
              multiSection={false}
              section={liveSection}
              responses={responses}
              lastPending={reviewPending ? demo.PENDING_DATE : null}
              changes={changes}
              setChanges={setChanges}
              setAddition={setAddition}
              setDeleteCommentId={setDeleteCommentId}
              renderFormItemsEditor={({ entries, setEntries }) => (
                <FollowUpDrafts entries={entries} setEntries={setEntries} />
              )}
              variants={reviewVariants}
              i={0}
            />
            {demo.renderReviewOverlays({
              ...lib.reviewOverlayActions({
                addition,
                deleteCommentId,
                changes,
                setChanges,
                setAddition,
                setDeleteCommentId,
              }),
              tCommon,
            })}
          </div>
        ) : null}

        <demo.PhaseJsonPanels
          phase={phase}
          section={liveSection}
          responses={responses}
          changes={changes}
        />
      </div>
    </demo.FormContainer>
  );
};
