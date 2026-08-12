/**
 * `form-review` showcase — Design → Response → Follow walkthrough.
 * Only the Follow phase mounts `CustomFormReviewHOC`; earlier phases are
 * demo-only blueprints so you can compare structure, answers, and reviewer
 * annotations side by side (JSON panels always visible).
 */
import { useCallback, useState, type ReactNode, type Ref } from "react";
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

const VARIANT_CHROME: Record<
  types.Variants["field"],
  { border: (status: lib.ReviewStatus) => string; background: string; badge: ReactNode }
> = {
  default: {
    border: (status) => STATUS_COLOR[status],
    background: "#fafafa",
    badge: null,
  },
  followUp: {
    border: () => "#e6b800",
    background: "#fffbeb",
    badge: FOLLOW_UP_BADGE,
  },
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
      const chrome = VARIANT_CHROME[variant];
      const newlyAnswered = extra.status === "highlight";
      return (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 4,
            fontSize: 14,
            opacity: extra.parentDeleted ? 0.5 : 1,
          }}
        >
          <span
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontWeight: newlyAnswered ? 700 : 400,
            }}
          >
            {newlyAnswered ? (
              <strong>{formItem.params.name}</strong>
            ) : (
              <span>{formItem.params.name}</span>
            )}
            {chrome.badge}
            {extra.icon}
          </span>
          <div
            style={{
              padding: "6px 8px",
              border: `1px solid ${chrome.border(extra.status)}`,
              borderRadius: 4,
              background: chrome.background,
              fontWeight: newlyAnswered ? 700 : 400,
            }}
          >
            {value || <em style={{ color: "#999", fontWeight: 400 }}>No answer</em>}
          </div>
          {extra.appendix}
        </div>
      );
    },
  },
};

const variants = lib.branded<types.Variants, "variants">({ field: "default" });
const followUpVariants = lib.branded<types.Variants, "variants">({
  field: "followUp",
});

const FormReview = lib.CustomFormReviewHOC<
  types.TypeNames,
  types.Params,
  types.Variants,
  types.Ctx,
  types.Section
>(viewers, variants, followUpVariants, demo.formChrome);

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
