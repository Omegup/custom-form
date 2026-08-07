/** Storybook docs source for the edit-section demo. */
import { FormContainer } from "../../form-edit/demo/editFormDemoHelper";
import editSectionDemoSource from "./EditSectionDemo.tsx?raw";
import editSectionDemoTypesSource from "./editSectionDemoTypes.t.ts?raw";

export { FormContainer };

// ── Storybook docs (`?raw` of types + integration) ────────────────────────────

const withFileHeader = (path: string, source: string) =>
  `// ── ${path} ──\n${source.trimEnd()}`;

export const EDIT_SECTION_DEMO_SOURCE = [
  withFileHeader("editSectionDemoTypes.t.ts", editSectionDemoTypesSource),
  "",
  withFileHeader("EditSectionDemo.tsx", editSectionDemoSource),
].join("\n");
