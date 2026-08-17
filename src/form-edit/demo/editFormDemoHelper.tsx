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

export const pendingRemoveCopy = <Item, Section extends { title: string }>(
  target: { item: Item } | { section: Section } | { end: null },
  itemName: (item: Item) => ReactNode,
): ReactNode => {
  if ("item" in target)
    return (
      <>
        Item <strong>{itemName(target.item)}</strong> will be removed.
      </>
    );
  if ("section" in target)
    return (
      <>
        Section <strong>{target.section.title}</strong> will be removed.
      </>
    );
  return null;
};

export const NestedSlot = ({ children }: { children: ReactNode }) => (
  <div
    style={{
      display: "flex",
      flexDirection: "row",
      gap: 6,
      marginLeft: 12,
      marginTop: 4,
      paddingLeft: 8,
      borderLeft: "2px solid #b8d4f0",
      minWidth: 0,
    }}
  >
    {children}
  </div>
);

export const SectionColumn = ({ children }: { children: ReactNode }) => (
  <div
    style={{
      padding: "6px 10px",
      display: "flex",
      flexDirection: "column",
      gap: 4,
      flex: 1,
      minWidth: 0,
    }}
  >
    {children}
  </div>
);

export const FieldRow = ({
  name,
  focused,
  actions,
  extra,
  parentDeleted = false,
}: {
  name: ReactNode;
  focused: boolean | null;
  actions: lib.MoveActions;
  extra: types.ExtraAction[];
  /** School `HandledCard`: when the parent is soft-deleted, hide child actions entirely (no Restore). */
  parentDeleted?: boolean;
}) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 8,
      width: "100%",
      boxSizing: "border-box",
      padding: "5px 8px",
      borderRadius: 4,
      border: "1px solid #eee",
      animation: focused !== null ? `pulse${focused ? 1 : 2} .2s 2` : undefined,
      background: actions.isDeleted || parentDeleted ? "#fafafa" : "white",
    }}
  >
    <span
      style={{
        flex: 1,
        minWidth: 0,
        fontSize: 13,
        opacity: actions.isDeleted || parentDeleted ? 0.55 : 1,
        textDecoration:
          actions.isDeleted || parentDeleted ? "line-through" : undefined,
      }}
    >
      {name}
    </span>
    {!parentDeleted && <MoveBar actions={actions} extra={extra} />}
  </div>
);

/** List name chrome — same labels as side-menu `itemName`. */
export const FieldLabel = ({ name }: { name: string }) => <span>{name}</span>;

/** Field-viewer required mark — compose in the field viewer, not list chrome. */
export const RequiredMark = ({ required }: { required: boolean }) =>
  required ? " *" : null;

export const HeadingLabel = ({ name }: { name: string }) => (
  <span>{`§ ${name}`}</span>
);

export const PanelLabel = ({ name }: { name: string }) => (
  <span>{`▦ ${name}`}</span>
);

/** `FieldRow` + nested-panel slot — shared `renderCard` body for list demos. */
export const renderListCard = (
  view: ReactNode,
  args: {
    focused: boolean | null;
    actions: lib.MoveActions;
    parentDeleted: boolean;
    nested: ReactNode | null;
    extra: types.ExtraAction[];
  },
) => (
  <div>
    <FieldRow
      name={view}
      focused={args.focused}
      actions={args.actions}
      extra={args.extra}
      parentDeleted={args.parentDeleted}
    />
    {args.nested != null ? <NestedSlot>{args.nested}</NestedSlot> : null}
  </div>
);

export const SectionPanel = ({
  title,
  focused,
  sectionActions,
  sectionExtra,
  headerExtra,
  columns,
}: {
  title: ReactNode;
  focused: boolean | null;
  sectionActions: lib.MoveActions;
  sectionExtra: types.ExtraAction[];
  headerExtra?: ReactNode;
  columns: ReactNode[];
}) => {
  const deleted = sectionActions.isDeleted;
  return (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: 6,
        overflow: "hidden",
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
        <strong
          style={{
            fontSize: 13,
            opacity: deleted ? 0.55 : 1,
            textDecoration: deleted ? "line-through" : undefined,
          }}
        >
          {title}
        </strong>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
          {headerExtra}
          {/* Keep Restore at full opacity — school does not fade clickable endActions. */}
          <MoveBar actions={sectionActions} extra={sectionExtra} />
        </span>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: 4,
          opacity: deleted ? 0.55 : 1,
        }}
      >
        {columns.map((column, i) => (
          <SectionColumn key={i}>{column}</SectionColumn>
        ))}
      </div>
    </div>
  );
};

export const SectionsList = ({ children }: { children: ReactNode }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
    {children}
  </div>
);

export { DemoPage as FormContainer } from "../../demo-utils";
