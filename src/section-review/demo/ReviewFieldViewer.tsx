import type { CSSProperties, ReactNode } from "react";
import { RequiredMark } from "../../form-edit/demo/editFormDemoHelper";
import type * as lib from "./library";

const STATUS_COLOR: Record<lib.ReviewStatus, string> = {
  normal: "#22883e",
  disabled: "#ccc",
  highlight: "#333",
};

export const ReviewFieldViewer = ({
  name,
  required,
  extra,
  variant,
}: {
  name: string;
  required: boolean;
  extra: {
    response: lib.ResponseSetter;
    status: lib.ReviewStatus;
    parentDeleted: boolean;
    icon: ReactNode | null;
    appendix: ReactNode | null;
  };
  variant: {
    border: string;
    background: string;
    badge: ReactNode;
    shell: CSSProperties;
    reviewTone: boolean;
  };
}) => {
  const value = extra.response.value.data.value ?? "";
  const newlyAnswered = extra.status === "highlight";
  const mute = variant.reviewTone && extra.parentDeleted;
  const border = variant.reviewTone
    ? STATUS_COLOR[extra.status]
    : variant.border;
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 4,
        fontSize: 14,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 4,
          ...variant.shell,
        }}
      >
        <span
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            fontWeight: newlyAnswered ? 700 : 400,
            color: mute ? "#777" : undefined,
          }}
        >
          {newlyAnswered ? <strong>{name}</strong> : <span>{name}</span>}
          <RequiredMark required={required} />
          {variant.badge}
          {extra.icon}
        </span>
        <div
          style={{
            padding: "6px 8px",
            border: `1px solid ${border}`,
            borderRadius: 4,
            background: mute ? "#f0f0f0" : variant.background,
            fontWeight: newlyAnswered ? 700 : 400,
            color: mute ? "#666" : undefined,
          }}
        >
          {value || (
            <em style={{ color: "#999", fontWeight: 400 }}>No answer</em>
          )}
        </div>
      </div>
      {extra.appendix}
    </div>
  );
};
