import type { ReactNode } from "react";
import { Row } from "./Row";

export const ConfirmPrompt = ({
  message,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
}: {
  message: ReactNode;
  confirmLabel: string;
  cancelLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
}) => (
  <>
    <p style={{ margin: "0 0 8px" }}>{message}</p>
    <Row gap={8} align="center" wrap={false} fontSize={null}>
      <button type="button" onClick={onConfirm}>
        {confirmLabel}
      </button>
      <button type="button" onClick={onCancel}>
        {cancelLabel}
      </button>
    </Row>
  </>
);
