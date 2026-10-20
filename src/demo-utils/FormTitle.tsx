import type { ReactNode } from "react";

export const FormTitle = ({
  title,
  description,
  note,
}: {
  title: string;
  description: string | null;
  note: ReactNode | null;
}) => (
  <div style={{ marginBottom: 4 }}>
    <h2 style={{ margin: "0 0 4px", fontSize: 22, fontWeight: 600 }}>
      {title}
    </h2>
    {description ? (
      <p style={{ margin: 0, color: "#555", fontSize: 14 }}>{description}</p>
    ) : null}
    {note}
  </div>
);
