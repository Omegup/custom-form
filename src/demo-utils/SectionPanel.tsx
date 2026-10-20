import type { ReactNode } from "react";
import "./pulse.css";
import { Inline } from "./Inline";
import { MoveBar, type ExtraAction, type MoveActionsChrome } from "./MoveBar";
import { SectionColumn } from "./SectionColumn";

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
  sectionActions: MoveActionsChrome;
  sectionExtra: ExtraAction[];
  headerExtra: ReactNode | null;
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
        <Inline gap={10} align="center">
          {headerExtra}
          <MoveBar actions={sectionActions} extra={sectionExtra} />
        </Inline>
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
