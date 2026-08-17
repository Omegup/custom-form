import type { ReactNode } from "react";

export const ConfirmBanner = ({
  children,
  onConfirm,
  onCancel,
}: {
  children: ReactNode;
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
    <span>{children}</span>
    <button type="button" onClick={onConfirm}>
      Confirm
    </button>
    <button type="button" onClick={onCancel}>
      Cancel
    </button>
  </div>
);
