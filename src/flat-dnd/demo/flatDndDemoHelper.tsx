/** Demo chrome for the FlatDnd showcase — same list UI as `section-view`;
 * the DnD engine lives in `drag-drop-tree`; this demo only wires it via
 * `WebRecursiveEdit.tsx`. */
import { FormContainer, SectionsList } from "../../form-edit/demo/editFormDemoHelper";
import { withFileHeader } from "../../demo-utils";
import flatDndDemoSource from "./FlatDndDemo.tsx?raw";
import flatDndDemoTypesSource from "./flatDndDemoTypes.t.ts?raw";
import webRecursiveEditSource from "./WebRecursiveEdit.tsx?raw";

export { FormContainer, SectionsList };
export {
  MENU_ITEMS,
  emptyItemExtra,
  randomId,
  renderCard,
  viewers,
} from "../../section-view/demo/sectionViewDemoHelper";


export const FLAT_DND_DEMO_SOURCE = [
  withFileHeader("flatDndDemoTypes.t.ts", flatDndDemoTypesSource),
  "",
  withFileHeader("WebRecursiveEdit.tsx", webRecursiveEditSource),
  "",
  withFileHeader("FlatDndDemo.tsx", flatDndDemoSource),
].join("\n");
