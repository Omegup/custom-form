/**
 * Demo: library sidebar (`Side`) + in-slot add dropdown (`AddFormItem`).
 * Same stack as form-dialogs — `FormDialogsEditor` + `designSidebar`.
 */
import { DemoPage } from "../../demo-utils";
import {
  FormDialogsEditor,
  designSidebar,
} from "../../form-dialogs/demo/FormDialogsDemo";
import type * as types from "./sideMenuDemoTypes.t";

export const SideMenuDemo = ({
  heading,
  flatItems,
  updateArgs,
}: types.DemoProps) => (
  <DemoPage title={heading}>
    <FormDialogsEditor
      sidebar={designSidebar}
      flatItems={flatItems}
      setFlatItems={(items) => updateArgs({ flatItems: items })}
    />
  </DemoPage>
);
