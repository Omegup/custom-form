/**
 * `section-review` showcase — school `SectionReviewHOC`: read-only view of
 * one section's answers, with reviewer comment + follow-up-question overlays.
 */
import { useCallback, type Ref } from "react";
import * as demo from "./sectionReviewDemoHelper";
import type * as types from "./sectionReviewDemoTypes.t";
import * as lib from "./library";

const STATUS_COLOR: Record<lib.ReviewStatus, string> = {
  normal: "#22883e",
  disabled: "#ddd",
  highlight: "#f59e0b",
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
    viewer: ({ props: { formItem, extra } }) => {
      const value = extra.response.value.data.value ?? "";
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
          <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <strong>{formItem.params.name}</strong>
            {extra.icon}
          </span>
          <div
            style={{
              padding: "6px 8px",
              border: `1px solid ${STATUS_COLOR[extra.status]}`,
              borderRadius: 4,
              background: "#fafafa",
            }}
          >
            {value || <em style={{ color: "#999" }}>No answer</em>}
          </div>
          {extra.appendix}
        </div>
      );
    },
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
const variants = lib.branded<types.Variants, "variants">({ field: "default" });
const tCommon = (term: "add" | "cancel" | "save" | "delete") =>
  ({ add: "Add", cancel: "Cancel", save: "Save", delete: "Delete" })[term];

export const SectionReviewDemo = ({
  heading,
  section,
  responses,
  changes,
  reviewPending,
  updateArgs,
}: types.DemoProps) => {
  const setChanges = useCallback(
    (next: lib.AdditionalChanges<types.TypeNames, types.Params>) => updateArgs({ changes: next }),
    [updateArgs],
  );

  return (
    <demo.FormContainer title={heading}>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 14 }}>
          <input
            type="checkbox"
            checked={reviewPending}
            onChange={(e) => updateArgs({ reviewPending: e.target.checked })}
          />
          Review round pending (drives highlight status)
        </label>
        <SectionReview
          ctx={ctx}
          multiSection={false}
          section={section}
          responses={responses}
          lastPending={reviewPending ? demo.PENDING_DATE : null}
          changes={changes}
          setChanges={setChanges}
          variants={variants}
          tCommon={tCommon}
          i={0}
        />
        <pre
          style={{
            margin: 0,
            padding: 12,
            background: "#f6f7f9",
            borderRadius: 6,
            fontSize: 12,
            overflow: "auto",
          }}
        >
          {JSON.stringify(changes, null, 2)}
        </pre>
      </div>
    </demo.FormContainer>
  );
};
