import type { ReactNode } from "react";
import { Stack } from "./Stack";

export const LibraryNav = ({
  title,
  search,
  setSearch,
  menu,
  addSectionLabel,
  addSection,
}: {
  title: string;
  search: string;
  setSearch: (value: string) => void;
  menu: ReactNode;
  addSectionLabel: string;
  addSection: () => void;
}) => (
  <nav
    style={{
      display: "flex",
      flexDirection: "column",
      gap: 10,
      padding: 14,
      border: "1px solid #ddd",
      borderRadius: 6,
      width: 220,
      alignSelf: "flex-start",
      boxSizing: "border-box",
    }}
  >
    <strong style={{ fontSize: 13 }}>{title}</strong>
    <input
      type="search"
      placeholder="Search…"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      style={{ padding: "4px 8px", fontSize: 13 }}
    />
    <Stack gap={6}>{menu}</Stack>
    <button type="button" onClick={addSection} style={{ fontSize: 13 }}>
      {addSectionLabel}
    </button>
  </nav>
);
