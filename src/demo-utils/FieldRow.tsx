import type { ReactNode } from "react";
import "./pulse.css";
import { MoveBar, type ExtraAction, type MoveActionsChrome } from "./MoveBar";

export const FieldRow = ({
  name,
  focused,
  actions,
  extra,
  parentDeleted,
}: {
  name: ReactNode;
  focused: boolean | null;
  actions: MoveActionsChrome;
  extra: ExtraAction[];
  parentDeleted: boolean;
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
