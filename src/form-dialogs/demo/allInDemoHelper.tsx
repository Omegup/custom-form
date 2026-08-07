/** Storybook docs source for the All-in story (`?raw` of types + integration). */
import allInEditorSource from "./AllInEditor.tsx?raw";
import allInDemoTypesSource from "./allInDemoTypes.t.ts?raw";

const withFileHeader = (path: string, source: string) =>
  `// ── ${path} ──\n${source.trimEnd()}`;

export const ALL_IN_DEMO_SOURCE = [
  withFileHeader("allInDemoTypes.t.ts", allInDemoTypesSource),
  "",
  withFileHeader("AllInEditor.tsx", allInEditorSource),
].join("\n");
