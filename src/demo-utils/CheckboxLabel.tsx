import type { ReactNode } from "react";

export const CheckboxLabel = ({
  checked,
  onChange,
  fontSize,
  gap,
  marginTop,
  color,
  children,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  fontSize: number;
  gap: number;
  marginTop: number;
  color: string | null;
  children: ReactNode;
}) => (
  <label
    style={{
      display: "flex",
      alignItems: "center",
      gap,
      fontSize,
      marginTop,
      color: color ?? undefined,
    }}
  >
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
    />
    {children}
  </label>
);
