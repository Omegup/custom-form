import type { CSSProperties, ReactNode } from "react";
import { FieldViewerChrome, ReviewValue } from "../../demo-utils";
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
    <FieldViewerChrome
      name={name}
      required={required}
      badge={variant.badge}
      icon={extra.icon}
      appendix={extra.appendix}
      shell={variant.shell}
      muted={mute}
      emphasis={newlyAnswered}
    >
      <ReviewValue
        value={value}
        border={border}
        background={variant.background}
        mute={mute}
        emphasis={newlyAnswered}
      />
    </FieldViewerChrome>
  );
};
