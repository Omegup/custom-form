/** Layout chrome for the side-menu demo + Storybook docs source. */
import type { ReactNode } from "react";
import { FormContainer } from "../../form-edit/demo/editFormDemoHelper";
import sideMenuDemoSource from "./SideMenuDemo.tsx?raw";
import sideMenuDemoTypesSource from "./sideMenuDemoTypes.t.ts?raw";

export { FormContainer };

// ── Storybook docs (`?raw` of types + integration) ────────────────────────────

const withFileHeader = (path: string, source: string) =>
  `// ── ${path} ──\n${source.trimEnd()}`;

export const SIDE_MENU_DEMO_SOURCE = [
  withFileHeader("sideMenuDemoTypes.t.ts", sideMenuDemoTypesSource),
  "",
  withFileHeader("SideMenuDemo.tsx", sideMenuDemoSource),
].join("\n");

// ── Layout chrome (not part of the side-menu API) ─────────────────────────────

export const LayoutWithSidebar = ({
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
