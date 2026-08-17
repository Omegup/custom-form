/**
 * Generic Storybook chrome — not form-specific. Import from package `demo/`
 * and `*.stories.tsx` only (never library `_deps`).
 */
import type { ReactNode } from "react";

export const DemoPage = ({
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

export const SidebarLayout = ({
  main,
  sidebar,
}: {
  main: ReactNode;
  sidebar: ReactNode;
}) => (
  <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
    <div
      style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}
    >
      {main}
    </div>
    {sidebar}
  </div>
);

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

export const DropdownMenu = ({
  open,
  trigger,
  children,
}: {
  open: boolean;
  trigger: ReactNode;
  children: ReactNode;
}) => (
  <div
    style={{
      position: "relative",
      display: "flex",
      flexDirection: "column",
      gap: 4,
    }}
  >
    {trigger}
    {open ? children : null}
  </div>
);
