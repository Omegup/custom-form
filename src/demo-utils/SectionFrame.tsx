import type { ReactNode } from "react";
import { Stack } from "./Stack";

export const SectionFrame = ({
  deleted,
  title,
  description,
  i,
  multiSection,
  columns,
  note,
}: {
  deleted: boolean;
  title: string;
  description: string;
  i: number;
  multiSection: boolean;
  columns: ReactNode[];
  note: ReactNode | null;
}) => (
  <div style={{ marginBottom: 20, opacity: deleted ? 0.5 : 1 }}>
    <div style={{ marginBottom: 12 }}>
      <h3 style={{ margin: "0 0 4px", fontSize: 18, fontWeight: 600 }}>
        {multiSection ? `${i + 1}. ${title}` : title}
      </h3>
      {description ? (
        <p style={{ margin: 0, color: "#555", fontSize: 14 }}>{description}</p>
      ) : null}
      {note}
    </div>
    <Stack gap={16}>
      {columns.map((col, idx) => (
        <Stack key={idx} gap={12}>
          {col}
        </Stack>
      ))}
    </Stack>
  </div>
);
