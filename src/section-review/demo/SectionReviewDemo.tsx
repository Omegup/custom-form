/**
 * `section-review` showcase — Design → Response → Follow for one section.
 * Design remounts the form-dialogs editor. Response mounts the fill shell;
 * Follow mounts `SectionReviewHOC`.
 */
import { useCallback, useRef, useState } from "react";
import { patchResponse } from "../../response/demo/patchResponse";
import { BlockStack, DemoPage, FollowControls, PhaseBody, PhaseJsonPanels, PhaseTabs } from "../../demo-utils";
import { FormDialogsEditor, designSidebar } from "../../form-dialogs/demo/FormDialogsDemo";
import {
  SectionResponder,
  sectionResponderCtx,
  sectionResponderVariants,
} from "../../section-responder/demo/SectionResponderDemo";
import type { SectionValidator } from "../../section-responder";
import { FollowUpDrafts } from "./followUpAdd";
import { reviewVariants, reviewViewers } from "./reviewViewers";
import * as demo from "./sectionReviewDemoHelper";
import type * as types from "./sectionReviewDemoTypes.t";
import * as lib from "./library";

const SectionReview = lib.SectionReviewHOC<
  types.TypeNames,
  types.Params,
  types.Variants,
  types.Ctx,
  types.Section
>(reviewViewers, demo.sectionChrome);

const ctx = lib.branded<types.Ctx, "context">({});

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
      updateArgs({ responses: patchResponse(responses, id, next) });
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
            <FollowControls
              reviewPending={reviewPending}
              onReviewPending={(checked) =>
                updateArgs({ reviewPending: checked })
              }
              showDeleted={null}
              onShowDeleted={null}
            />
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
              tCommon: demo.tCommon,
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
