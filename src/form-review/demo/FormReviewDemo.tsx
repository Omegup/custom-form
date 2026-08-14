/**
 * `form-review` showcase — Design → Response → Follow walkthrough.
 * Only the Follow phase mounts `CustomFormReviewHOC`; earlier phases are
 * demo-only blueprints so you can compare structure, answers, and reviewer
 * annotations side by side (JSON panels always visible).
 */
import { useCallback, useState, type Ref } from "react";
import * as demo from "./formReviewDemoHelper";
import type * as types from "./formReviewDemoTypes.t";
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
};

const variants = lib.branded<types.Variants, "variants">({
  field: defaultFieldVariant,
});
const followUpVariants = lib.branded<types.Variants, "variants">({
  field: followUpFieldVariant,
});
const reviewVariants: Record<lib.ReviewVariantState, types.Variants> = {
  default: variants,
  change: followUpVariants,
};

const FormReview = lib.CustomFormReviewHOC<
  types.TypeNames,
  types.Params,
  types.Variants,
  types.Ctx,
  types.Section
>(viewers, demo.formChrome);

const ctx = lib.branded<types.Ctx, "context">({});
const tCommon = (term: "add" | "cancel" | "save" | "delete") =>
  ({ add: "Add", cancel: "Cancel", save: "Save", delete: "Delete" })[term];

export const FormReviewDemo = ({
  heading,
  phase,
  header,
  sections,
  responses,
  changes,
  reviewPending,
  showDeleted,
  updateArgs,
}: types.DemoProps) => {
  const [addition, setAddition] = useState<
    lib.Addition<types.TypeNames, types.Params> | null
  >(null);
  const [deleteCommentId, setDeleteCommentId] = useState<string | null>(null);

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
        />

        {phase === "design" ? (
          <demo.DesignView header={header} sections={sections} />
        ) : null}

        {phase === "response" ? (
          <demo.ResponseView
            header={header}
            sections={sections}
            responses={responses}
          />
        ) : null}

        {phase === "follow" ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 16,
                fontSize: 14,
              }}
            >
              <label style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <input
                  type="checkbox"
                  checked={reviewPending}
                  onChange={(e) =>
                    updateArgs({ reviewPending: e.target.checked })
                  }
                />
                Review round pending (highlight status)
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <input
                  type="checkbox"
                  checked={showDeleted}
                  onChange={(e) =>
                    updateArgs({ showDeleted: e.target.checked })
                  }
                />
                Show deleted sections
              </label>
            </div>
            <FormReview
              ctx={ctx}
              header={header}
              sections={sections}
              responses={responses}
              lastPending={reviewPending ? demo.PENDING_DATE : null}
              changes={changes}
              setChanges={setChanges}
              addition={addition}
              setAddition={setAddition}
              deleteCommentId={deleteCommentId}
              setDeleteCommentId={setDeleteCommentId}
              renderFormItemsEditor={({ fallback }) => fallback}
              variants={reviewVariants}
              tCommon={tCommon}
              showDeleted={showDeleted}
            />
          </div>
        ) : null}

        <demo.PhaseJsonPanels
          phase={phase}
          sections={sections}
          responses={responses}
          changes={changes}
        />
      </div>
    </demo.FormContainer>
  );
};
