/**
 * UI chrome for the section-edit demo + Storybook docs source.
 * Dialog/field styling mirrors the form-item-editor demo helpers; the
 * column selector allows up to 3 columns (sections, unlike panels).
 */
import { withFileHeader, EditorDialog, SelectColumns, TextField } from "../../demo-utils";
import { FormContainer } from "../../form-edit/demo/editFormDemoHelper";
import sectionEditDemoSource from "./SectionEditDemo.tsx?raw";
import sectionEditDemoTypesSource from "./sectionEditDemoTypes.t.ts?raw";

export { FormContainer, EditorDialog, TextField, SelectColumns };

// ── Storybook docs (`?raw` of types + integration) ────────────────────────────


export const SECTION_EDIT_DEMO_SOURCE = [
  withFileHeader("sectionEditDemoTypes.t.ts", sectionEditDemoTypesSource),
  "",
  withFileHeader("SectionEditDemo.tsx", sectionEditDemoSource),
].join("\n");

// ── Dialog chrome ─────────────────────────────────────────────────────────────

export const SECTION_COL_OPTIONS = [1, 2, 3] as const;
