import {
  withFileHeader,
  AppendixStack,
  CommentCard,
  CommentComposer,
  ConfirmPrompt,
  FollowUpBadge,
  ItemShell,
  OverlayBox,
  type PhaseTab,
  ReviewLock,
  ReviewStatusNote,
  SectionFrame,
} from "../../demo-utils";
import { FollowUpAdd } from "./followUpAdd";
import sectionReviewDemoSource from "./SectionReviewDemo.tsx?raw";
import sectionReviewDemoTypesSource from "./sectionReviewDemoTypes.t.ts?raw";
import type * as types from "./sectionReviewDemoTypes.t";
import * as lib from "./library";

export { SectionFrame };

export const tCommon = (term: "cancel" | "save" | "delete") =>
  ({ cancel: "Cancel", save: "Save", delete: "Delete" })[term];

/** Stable reference so `lastPending === history.at(-1).date` can match by identity. */
export const PENDING_DATE = new Date("2024-01-15T00:00:00Z");

export const PHASES: PhaseTab<types.DemoPhase>[] = [
  {
    id: "design",
    label: "1. Design",
    blurb: "Same editor as form-dialogs — library, add/edit, drag-and-drop. This story reviews the first section.",
  },
  {
    id: "response",
    label: "2. Response",
    blurb: "Student answers this section (multiple panels get + Add). No reviewer comments yet.",
  },
  {
    id: "follow",
    label: "3. Follow",
    blurb:
      "Teacher reviews: lock/unlock comments, nested Design list under the origin (add/edit/move follow-ups), status highlighting.",
  },
];

export const sectionChrome: lib.SectionReviewChrome<types.TypeNames, types.Params> = {
  renderSection: (args) => (
    <SectionFrame
      {...args}
      note={<ReviewStatusNote />}
    />
  ),
  renderItemShell: ({ children, action }) => (
    <ItemShell action={action}>{children}</ItemShell>
  ),
  renderComment: ({ text, onEdit }) => (
    <CommentCard text={text} onEdit={onEdit} />
  ),
  renderFormItemAppendix: (nodes) => <AppendixStack>{nodes}</AppendixStack>,
  renderAddFollowUp: ({ onPick }) => <FollowUpAdd onPick={onPick} />,
  renderActionIcon: (kind, onClick) => (
    <ReviewLock kind={kind} onClick={onClick} />
  ),
  renderFollowUpMark: () => <FollowUpBadge />,
};

/** Host-mounted overlay chrome — not part of `SectionReviewHOC`. */
export const renderReviewOverlays = ({
  addition,
  deleteCommentId,
  setAddition,
  clearDelete,
  onSubmitComment,
  onConfirmDeleteComment,
  tCommon,
}: lib.ReviewOverlayArgs) => {
  if (deleteCommentId) {
    return (
      <OverlayBox>
        <ConfirmPrompt
          message="Remove this comment?"
          confirmLabel={tCommon("delete")}
          cancelLabel={tCommon("cancel")}
          onConfirm={onConfirmDeleteComment}
          onCancel={clearDelete}
        />
      </OverlayBox>
    );
  }

  if (addition) {
    return (
      <OverlayBox>
        <CommentComposer
          value={addition.text ?? ""}
          onChange={(text) => setAddition({ ...addition, text })}
          onSave={() => onSubmitComment(addition.text ?? "")}
          onCancel={() => setAddition(null)}
          saveLabel={tCommon("save")}
          cancelLabel={tCommon("cancel")}
        />
      </OverlayBox>
    );
  }

  return null;
};

const field = (id: string, name: string, required: boolean): types.ListItem => ({
  header: lib.branded({
    id,
    type: "field",
    deleted: false,
    params: { name, required },
  }),
  meta: {},
  children: [],
});

export const INITIAL_SECTION: types.ListSection = {
  meta: { index: 0, total: 4 },
  header: {
    id: "s1",
    deleted: false,
    title: "Personal",
    description: "Identity the reviewer will assess.",
  },
  items: [
    [
      field("name", "Full name", true),
      field("email", "Email", true),
      field("note", "Note (optional)", false),
    ],
  ],
};

export const INITIAL_FLAT = lib.flattenSections([INITIAL_SECTION]);

export const INITIAL_RESPONSES: Record<string, lib.Response> = {
  name: { meta: {}, data: { value: "Ada Lovelace" } },
  email: { meta: {}, data: { value: "ada@analytical.engine" } },
  // note intentionally empty
};

export const INITIAL_CHANGES: lib.AdditionalChanges<types.TypeNames, types.Params> = {
  name: {
    history: [{ date: PENDING_DATE }],
  },
  email: {
    comment: "Please use your institutional address.",
  },
  note: {
    comment: "Please add a short note.",
    formItems: [
      {
        comment: "Which topic did you struggle with?",
        formItem: lib.branded({
          id: "note-followup-0",
          type: "field",
          deleted: false,
          params: { name: "Topic", required: false },
        }),
        children: null,
        date: PENDING_DATE,
      },
    ],
  },
};


export const SECTION_REVIEW_DEMO_SOURCE = [
  withFileHeader(
    "section-review/demo/sectionReviewDemoTypes.t.ts",
    sectionReviewDemoTypesSource,
  ),
  withFileHeader("section-review/demo/SectionReviewDemo.tsx", sectionReviewDemoSource),
].join("\n\n");
