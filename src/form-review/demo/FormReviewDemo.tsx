/**
 * `form-review` showcase — school `CustomFormResponsesHOC`: multi-section
 * read-only review with reviewer comment + follow-up-question overlays.
 */
import { useCallback, type Ref } from "react";
import * as demo from "./formReviewDemoHelper";
import type * as types from "./formReviewDemoTypes.t";
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

const variants = lib.branded<types.Variants, "variants">({ field: "default" });

const FormReview = lib.CustomFormReviewHOC<
  types.TypeNames,
  types.Params,
  types.Variants,
  types.Ctx,
  types.Section
>(viewers, variants, demo.formChrome);

const ctx = lib.branded<types.Ctx, "context">({});
const tCommon = (term: "add" | "cancel" | "save" | "delete") =>
  ({ add: "Add", cancel: "Cancel", save: "Save", delete: "Delete" })[term];

export const FormReviewDemo = ({
  heading,
  header,
  sections,
  responses,
  changes,
  reviewPending,
  showDeleted,
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
        <FormReview
          ctx={ctx}
          header={header}
          sections={sections}
          responses={responses}
          lastPending={reviewPending ? demo.PENDING_DATE : null}
          changes={changes}
          setChanges={setChanges}
          tCommon={tCommon}
          showDeleted={showDeleted}
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
