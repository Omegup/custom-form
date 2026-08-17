import type { ReactNode } from "react";
import { type PhaseTab } from "../../demo-utils";
import {
  INITIAL_FLAT,
  INITIAL_HEADER,
} from "../../form-review/demo/formReviewDemoHelper";
import formResponseDemoSource from "./FormResponseDemo.tsx?raw";
import formResponseDemoTypesSource from "./formResponseDemoTypes.t.ts?raw";
import type * as types from "./formResponseDemoTypes.t";

export { INITIAL_FLAT, INITIAL_HEADER };

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
      "Teacher view of the same FormResponse — Save remarks/follow-ups, then Request changes / Approve / Reject. Follow-up is a nested Design list under the origin.",
  },
];

const withFileHeader = (path: string, source: string) =>
  `// ── ${path} ──\n${source.trimEnd()}`;

export const FORM_RESPONSE_DEMO_SOURCE = [
  withFileHeader("formResponseDemoTypes.t.ts", formResponseDemoTypesSource),
  "",
  withFileHeader("FormResponseDemo.tsx", formResponseDemoSource),
].join("\n");

export const PRIOR_BADGE: ReactNode = (
  <span
    title="Prior answer"
    aria-label="Prior answer"
    style={{
      marginLeft: 6,
      fontSize: 11,
      fontWeight: 700,
      letterSpacing: "0.04em",
      textTransform: "uppercase",
      color: "#6b7280",
    }}
  >
    Prior
  </span>
);
