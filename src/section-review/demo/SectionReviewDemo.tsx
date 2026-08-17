/**
 * `section-review` showcase — Design → Response → Follow for one section.
 * Design remounts the form-dialogs editor. Response mounts the fill shell;
 * Follow mounts `SectionReviewHOC`.
 */
import { useCallback, useRef, useState, type Ref } from "react";
import { BlockStack, DemoPage, PhaseBody, PhaseJsonPanels, PhaseTabs, ToolbarCheck } from "../../demo-utils";
import { FormDialogsEditor, designSidebar } from "../../form-dialogs/demo/FormDialogsDemo";
import {
  defaultVariant,
  followUpVariant,
} from "../../form-item-editor/demo/itemVariants";
import { ReviewFieldViewer } from "./ReviewFieldViewer";
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

const SectionReview = lib.SectionReviewHOC<
  types.TypeNames,
  types.Params,
  types.Variants,
  types.Ctx,
  types.Section
>(viewers, demo.sectionChrome);

const ctx = lib.branded<types.Ctx, "context">({});
const variants = lib.branded<types.Variants, "variants">(defaultVariant);
const followUpVariants = lib.branded<types.Variants, "variants">(
  followUpVariant,
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
  const liveSection = lib.consolidateSections(flatItems)[0] ?? section;

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
      <PhaseBody>
        <PhaseTabs
          phase={phase}
          onChange={(next) => updateArgs({ phase: next })}
          phases={demo.PHASES}
        />

        {phase === "design" ? (
          <FormDialogsEditor
            sidebar={designSidebar}
            flatItems={flatItems}
            setFlatItems={(next) => {
              const [first] = lib.consolidateSections(next);
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
          <BlockStack>
            <ToolbarCheck
              checked={reviewPending}
              onChange={(checked) => updateArgs({ reviewPending: checked })}
            >
              Review round pending (highlight status)
            </ToolbarCheck>
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
          </BlockStack>
        ) : null}

        <PhaseJsonPanels
          heading="JSON by phase"
          activeId={phase}
          panels={[
            { id: "design", title: "design · section", value: liveSection },
            { id: "response", title: "response · answers", value: responses },
            { id: "follow", title: "follow · AdditionalChanges", value: changes },
          ]}
        />
      </PhaseBody>
    </DemoPage>
  );
};
