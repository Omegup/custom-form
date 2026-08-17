/**
 * `form-review` showcase — Design → Response → Follow walkthrough.
 * Design remounts the form-dialogs editor. Response mounts the fill shell;
 * Follow mounts `CustomFormReviewHOC`.
 */
import { useCallback, useRef, useState, type Ref } from "react";
import { DemoPage, FormTitle, PhaseJsonPanels, PhaseTabs } from "../../demo-utils";
import { FormDialogsEditor, designSidebar } from "../../form-dialogs/demo/FormDialogsDemo";
import {
  defaultVariant,
  followUpVariant,
} from "../../form-item-editor/demo/itemVariants";
import { ReviewFieldViewer } from "../../section-review/demo/ReviewFieldViewer";
import {
  FormResponder,
  formResponderCtx,
  responderVariants,
} from "../../form-responder/demo/FormResponderDemo";
import type { SectionValidator } from "../../form-responder";
import {
  headingView,
  panelRepeatChildren,
  panelView,
} from "../../response/demo/nestedItems";
import { FollowUpDrafts } from "../../section-review/demo/followUpAdd";
import { renderReviewOverlays } from "../../section-review/demo/sectionReviewDemoHelper";
import * as demo from "./formReviewDemoHelper";
import type * as types from "./formReviewDemoTypes.t";
import * as lib from "./library";

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
    viewer: ({ props: { formItem, extra, variant } }) => (
      <ReviewFieldViewer
        name={formItem.params.name}
        required={formItem.params.required}
        extra={extra}
        variant={variant}
      />
    ),
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

const variants = lib.branded<types.Variants, "variants">(defaultVariant);
const followUpVariants = lib.branded<types.Variants, "variants">(
  followUpVariant,
);
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
const tCommon = (term: "cancel" | "save" | "delete") =>
  ({ cancel: "Cancel", save: "Save", delete: "Delete" })[term];

export const FormReviewDemo = ({
  heading,
  phase,
  header,
  flatItems,
  responses,
  changes,
  reviewPending,
  showDeleted,
  updateArgs,
}: types.DemoProps) => {
  const fillRef = useRef<SectionValidator | null>(null);
  const [addition, setAddition] = useState<lib.Addition | null>(null);
  const [deleteCommentId, setDeleteCommentId] = useState<string | null>(null);
  const liveSections = lib.consolidateSections(flatItems);

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
    <DemoPage title={heading}>
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <PhaseTabs
          phase={phase}
          onChange={(next) => updateArgs({ phase: next })}
          phases={demo.PHASES}
        />

        {phase === "design" ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <FormTitle
              title={header.title}
              description={header.description}
              note={null}
            />
            <FormDialogsEditor
              sidebar={designSidebar}
              flatItems={flatItems}
              setFlatItems={(next) =>
                updateArgs({
                  flatItems: next,
                  sections: lib.consolidateSections(next),
                })
              }
            />
          </div>
        ) : null}

        {phase === "response" ? (
          <FormResponder
            ctx={formResponderCtx}
            header={header}
            sections={liveSections}
            responses={responses}
            old={null}
            setResponse={setResponse}
            getError={() => null}
            impRef={fillRef}
            showDeleted={showDeleted}
            variants={responderVariants}
            followUpItems={{}}
            children={null}
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
              sections={liveSections}
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
              showDeleted={showDeleted}
              children={null}
            />
            {renderReviewOverlays({
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

        <PhaseJsonPanels
          heading="JSON by phase"
          activeId={phase}
          panels={[
            { id: "design", title: "design · sections", value: liveSections },
            { id: "response", title: "response · answers", value: responses },
            { id: "follow", title: "follow · AdditionalChanges", value: changes },
          ]}
        />
      </div>
    </DemoPage>
  );
};
