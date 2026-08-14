/**
 * Fill — useFormResponseSend + CustomFormResponderHOC.
 */
import { useEffect, useRef, useState } from "react";
import { rememberDate } from "./formResponseDemoHelper";
import type * as types from "./formResponseDemoTypes.t";
import {
  FormResponder,
  fillCtx,
  responderVariants,
} from "./formResponseFillView";
import * as lib from "./library";

const fillDescription = (
  fill: { old: unknown; unansweredFollowUpIds: Set<string> },
  doc: types.FormResponseDoc | null,
): string => {
  if (fill.unansweredFollowUpIds.size > 0) {
    return doc?.status === "changesRequested"
      ? `Answer ${fill.unansweredFollowUpIds.size} follow-up field(s), then Send.`
      : "Follow-up questions are under related answers — Request changes on Update to unlock Send.";
  }
  if (fill.old) {
    return doc?.status === "changesRequested"
      ? "Changes requested — edit remarked fields if you want, then Send again."
      : "Waiting for the teacher to request changes before you can Send again.";
  }
  return "Send creates the FormResponse document.";
};

export const FillPhase = ({
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
  const [justSent, setJustSent] = useState(false);
  const [optimisticResponse, setOptimisticResponse] =
    useState<types.FormResponseDoc | null>(null);
  const doc = formResponse ?? optimisticResponse;
  const fill = lib.useFormResponseSend({
    doc,
    draft: responses,
    setDraft: (next) => {
      setJustSent(false);
      updateArgs({ responses: next });
    },
    sections,
    validatorRef: formRef,
    now: () => rememberDate(new Date()),
  });

  useEffect(() => {
    if (!optimisticResponse) return;
    if (formResponse?.status === "answered") setOptimisticResponse(null);
    if (formResponse?.status === "changesRequested") setOptimisticResponse(null);
  }, [formResponse, optimisticResponse]);

  const send = () => {
    const next = fill.send();
    if (!next) return;
    setOptimisticResponse(next);
    updateArgs({ formResponse: next, responses: {} });
    setJustSent(true);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <FormResponder
        ctx={fillCtx}
        header={{
          title: fill.old ? "Revise your answers" : "Fill the form",
          description: fillDescription(fill, doc),
        }}
        sections={sections}
        responses={responses}
        old={fill.old}
        setResponse={fill.setResponse}
        getError={(id) => fill.errors[id] ?? null}
        impRef={formRef}
        showDeleted={false}
        variants={responderVariants}
        followUpItems={fill.followUpItems}
      />
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <button type="button" onClick={() => fill.validate()}>
          Validate
        </button>
        <button
          type="button"
          onClick={send}
          disabled={!fill.canSend}
          style={{
            background: fill.canSend ? "#1a5fb4" : "#9aa7b8",
            color: "#fff",
            border: "none",
            padding: "6px 14px",
            borderRadius: 4,
            cursor: fill.canSend ? "pointer" : "not-allowed",
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
