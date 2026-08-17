import type { CSSProperties, ReactNode } from "react";
import {
  INITIAL_FLAT,
  INITIAL_HEADER,
} from "../../form-review/demo/formReviewDemoHelper";
import { FormContainer } from "../../form-review/demo/formReviewDemoHelper";
import {
  PhaseTabs,
  type PhaseTab,
} from "../../section-responder/demo/sectionResponderDemoHelper";
import formResponseDemoSource from "./FormResponseDemo.tsx?raw";
import formResponseDemoTypesSource from "./formResponseDemoTypes.t.ts?raw";
import type * as types from "./formResponseDemoTypes.t";
import * as lib from "./library";

export { FormContainer, INITIAL_FLAT, INITIAL_HEADER, PhaseTabs };

const datesByIso = new Map<string, Date>();

export const rememberDate = (date: Date): Date => {
  datesByIso.set(date.toISOString(), date);
  return date;
};

export const dateFromIso = (iso: string): Date =>
  datesByIso.get(iso) ?? rememberDate(new Date(iso));

export const PHASES: PhaseTab<types.DemoPhase>[] = [
  {
    id: "design",
    label: "1. Design",
    blurb: "Same editor as form-dialogs — library, add/edit, drag-and-drop.",
  },
  {
    id: "fill",
    label: "2. Fill",
    blurb:
      "Student answers then Sends — creates/updates the FormResponse. Send is available when there is no response yet, or status is changesRequested.",
  },
  {
    id: "update",
    label: "3. Update",
    blurb:
      "Teacher view of the same FormResponse — Save remarks/follow-ups, then Request changes / Approve / Reject. 💬 opens a type dropdown.",
  },
];

const jsonPanelStyle = (active: boolean): CSSProperties => ({
  margin: 0,
  padding: 10,
  background: active ? "#eef4fb" : "#f6f7f9",
  border: active ? "1px solid #1a5fb4" : "1px solid #e0e0e0",
  borderRadius: 6,
  fontSize: 11,
  overflow: "auto",
  maxHeight: 220,
  lineHeight: 1.4,
});

export const PhaseJsonPanels = ({
  phase,
  responses,
  formResponse,
}: {
  phase: types.DemoPhase;
  responses: Record<string, lib.Response>;
  formResponse: types.FormResponseDoc | null;
}) => {
  const panels: { title: string; active: boolean; value: unknown }[] = [
    {
      title: "FormResponse",
      active: true,
      value: formResponse,
    },
  ];
  if (phase === "fill") {
    panels.push({ title: "Fill draft", active: true, value: responses });
  }
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 16 }}>
      <div
        style={{
          fontSize: 12,
          fontWeight: 600,
          color: "#444",
          letterSpacing: "0.02em",
          textTransform: "uppercase",
        }}
      >
        Document
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${panels.length}, minmax(0, 1fr))`,
          gap: 10,
        }}
      >
        {panels.map((p) => (
          <div key={p.title} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <div
              style={{
                fontSize: 12,
                fontWeight: p.active ? 700 : 500,
                color: p.active ? "#1a5fb4" : "#666",
              }}
            >
              {p.title}
            </div>
            <pre style={jsonPanelStyle(p.active)}>
              {JSON.stringify(p.value, null, 2)}
            </pre>
          </div>
        ))}
      </div>
    </div>
  );
};

const withFileHeader = (path: string, source: string) =>
  `// ── ${path} ──\n${source.trimEnd()}`;

export const FORM_RESPONSE_DEMO_SOURCE = [
  withFileHeader("formResponseDemoTypes.t.ts", formResponseDemoTypesSource),
  "",
  withFileHeader("FormResponseDemo.tsx", formResponseDemoSource),
].join("\n");

export const FOLLOW_UP_BADGE: ReactNode = (
  <span
    title="Added follow-up"
    aria-label="Added follow-up"
    style={{ color: "#b45309", fontSize: 12, fontWeight: 700 }}
  >
    ✚
  </span>
);
