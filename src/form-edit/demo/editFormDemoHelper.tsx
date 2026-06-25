import type { ReactNode } from "react";
import * as lib from "./library";
import * as types from "./editFormDemoTypes.t";
import editFormDemoSource from "./EditFormDemo.tsx?raw";
import editFormDemoTypesSource from "./editFormDemoTypes.t.ts?raw";
import "./animation.css";

// ── Storybook docs (`?raw` of types + integration) ────────────────────────────

const withFileHeader = (path: string, source: string) =>
  `// ── ${path} ──\n${source.trimEnd()}`;

export const EDIT_FORM_DEMO_SOURCE = [
  withFileHeader("editFormDemoTypes.t.ts", editFormDemoTypesSource),
  "",
  withFileHeader("EditFormDemo.tsx", editFormDemoSource),
].join("\n");

// ── Layout chrome (not part of the form-edit API) ─────────────────────────────

const Btn = ({
  label,
  onClick,
}: {
  label: string;
  onClick: null | undefined | (() => void);
}) => (
  <button
    disabled={!onClick}
    onClick={onClick ?? undefined}
    style={{ padding: "2px 7px", fontSize: 11, opacity: onClick ? 1 : 0.3 }}
  >
    {label}
  </button>
);

export const MoveBar = ({
  actions,
  extra,
}: {
  actions: lib.MoveActions;
  extra: types.ExtraAction[];
}) => (
  <span style={{ display: "inline-flex", gap: 3 }}>
    {actions.isDeleted ? (
      <Btn label="Restore" onClick={actions.restore} />
    ) : (
      <>
        <Btn label="↑" onClick={actions.up} />
        <Btn label="↓" onClick={actions.down} />
        <Btn label="Clone" onClick={actions.clone} />
        <Btn label="Remove" onClick={actions.remove} />
        {extra.map(({ label, onClick }) => (
          <Btn key={label} label={label} onClick={onClick} />
        ))}
      </>
    )}
  </span>
);

export const RemoveAlert = ({
  pending,
  onConfirm,
  onCancel,
}: {
  pending: types.PendingRemove;
  onConfirm: () => void;
  onCancel: () => void;
}) => (
  <div
    style={{
      display: "flex",
      gap: 8,
      alignItems: "center",
      background: "#fff3cd",
      padding: "8px 12px",
      borderRadius: 4,
      fontSize: 13,
    }}
  >
    <span>
      {"item" in pending.item ? (
        <>
          Item <strong>{pending.item.item.params.name} </strong>
        </>
      ) : "section" in pending.item ? (
        <>
          Section <strong>{pending.item.section.title} </strong>
        </>
      ) : null}
      will be removed.
    </span>
    <button onClick={onConfirm}>Confirm</button>
    <button onClick={onCancel}>Cancel</button>
  </div>
);

export const FieldRow = ({
  name,
  focused,
  actions,
  extra,
}: {
  name: string;
  focused: boolean | null;
  actions: lib.MoveActions;
  extra: types.ExtraAction[];
}) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "5px 8px",
      borderRadius: 4,
      border: "1px solid #eee",
      animation: focused !== null ? `pulse${focused ? 1 : 2} .2s 2` : undefined,
      background: actions.isDeleted ? "#fafafa" : "white",
    }}
  >
    <span
      style={{
        fontSize: 13,
        opacity: actions.isDeleted ? 0.55 : 1,
        textDecoration: actions.isDeleted ? "line-through" : undefined,
      }}
    >
      {name}
    </span>
    <MoveBar actions={actions} extra={extra} />
  </div>
);

export const SectionPanel = ({
  title,
  focused,
  sectionActions,
  sectionExtra,
  columns,
}: {
  title: string;
  focused: boolean | null;
  sectionActions: lib.MoveActions;
  sectionExtra: types.ExtraAction[];
  columns: ReactNode[];
}) => (
  <div
    style={{
      border: "1px solid #ddd",
      borderRadius: 6,
      overflow: "hidden",
      opacity: sectionActions.isDeleted ? 0.45 : 1,
    }}
  >
    <div
      style={{
        background: "#f2f2f2",
        padding: "6px 10px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        animation:
          focused !== null ? `pulse${focused ? 1 : 2} .2s 2` : undefined,
      }}
    >
      <strong style={{ fontSize: 13 }}>{title}</strong>
      <MoveBar actions={sectionActions} extra={sectionExtra} />
    </div>
    <div style={{ display: "flex", flexDirection: "row", gap: 4 }}>
      {columns.map((column, i) => (
        <div
          key={i}
          style={{
            padding: "6px 10px",
            display: "flex",
            flexDirection: "column",
            gap: 4,
            flex: 1,
          }}
        >
          {column}
        </div>
      ))}
    </div>
  </div>
);

export const SectionsList = ({ children }: { children: ReactNode }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
    {children}
  </div>
);

export const FormContainer = ({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) => (
  <div
    style={{ display: "flex", flexDirection: "column", gap: 16, padding: 16 }}
  >
    <h2 style={{ margin: 0 }}>{title}</h2>
    {children}
  </div>
);
