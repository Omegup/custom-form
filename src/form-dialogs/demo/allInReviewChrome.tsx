/**
 * Update/review chrome — follow-ups use Design's AddFormItem dropdown.
 */
import { MENU_ITEMS, randomId } from "../../side-menu/demo/fixtures";
import { renderAddFormItem } from "../../side-menu/demo/sideMenuDemoHelper";
import type * as types from "./allInDemoTypes.t";
import { renderMutedSection } from "./allInPanel";
import {
  actionButtonStyle,
  renderActionIcon,
  renderOverlays,
} from "./allInReviewOverlays";
import * as lib from "./library";

export const reviewChrome: lib.FormReviewChrome<types.TypeNames, types.Params> = {
  renderHeader: (header) => (
    <div style={{ marginBottom: 4 }}>
      <h2 style={{ margin: "0 0 4px", fontSize: 22, fontWeight: 600 }}>
        {header.title}
      </h2>
      {header.description ? (
        <p style={{ margin: 0, color: "#555", fontSize: 14 }}>
          {header.description}
        </p>
      ) : null}
      <p style={{ margin: "8px 0 0", fontSize: 12, color: "#888", fontStyle: "italic" }}>
        Remark unlocks a field (🔓). Use <strong>+ Follow-up</strong> on an answer
        to attach a Field / Heading / Panel (same dropdown as Design). After the
        student sends again, <strong>new</strong> marks this round&apos;s answers
        and <strong>earlier</strong> marks prior sends.
      </p>
    </div>
  ),
  renderForm: ({ header, sections, children }) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {header}
      {sections}
      {children}
    </div>
  ),
  renderSection: renderMutedSection,
  renderItemShell: ({ children, action }) => (
    <div
      style={{
        display: "flex",
        gap: 8,
        alignItems: "flex-start",
        padding: "4px 0",
      }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>{children}</div>
      {action ? <div style={{ flexShrink: 0 }}>{action}</div> : null}
    </div>
  ),
  renderAppendix: (comment) => (
    <div
      style={{
        marginTop: 4,
        padding: 8,
        background: "#fff3cd",
        borderLeft: "4px solid #ffc107",
        color: "#856404",
        fontSize: 12,
      }}
    >
      👉 {comment}
    </div>
  ),
  renderComment: ({ text, onEdit }) => (
    <div
      style={{
        marginTop: 4,
        padding: 8,
        background: "#e7f1ff",
        borderLeft: "4px solid #4285f4",
        fontSize: 13,
        display: "flex",
        justifyContent: "space-between",
        gap: 8,
      }}
    >
      <span>💬 {text}</span>
      <button
        type="button"
        aria-label="Edit comment"
        onClick={onEdit}
        style={actionButtonStyle}
      >
        ✎
      </button>
    </div>
  ),
  renderFormItemAppendix: (nodes) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 4 }}>
      {nodes}
    </div>
  ),
  renderAddFollowUp: ({ onPick }) => (
    <lib.AddFormItem<types.TypeNames, types.Params>
      span={{ index: -1, sIndex: -1 }}
      menuItems={MENU_ITEMS}
      random={randomId}
      setAddItem={(session) =>
        onPick({ formItem: session.draft.item, children: session.children })
      }
      label="+ Follow-up"
      render={renderAddFormItem}
    />
  ),
  renderActionIcon,
  renderFollowUpMark: () => (
    <span
      title="Answered follow-up"
      aria-label="Answered follow-up"
      style={{ color: "#b45309", fontSize: 12, fontWeight: 700, lineHeight: 1 }}
    >
      ✚
    </span>
  ),
  renderOverlays,
};
