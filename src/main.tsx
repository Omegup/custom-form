/**
 * App entry — tabbed demo launcher.
 * Each tab mounts a *.test.tsx demo from one package. See src/README.md for the map.
 */
import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import { FormTest } from "./form/Form.test";
import { MoveActionsTest } from "./move-actions/Actions.test";
import { BareEditFormTest } from "./form-edit/EditForm.test";
import { FormItemEditorTest } from "./form-item-editor/FormItemEditor.test";
import { SideMenuTest } from "./side-menu/SideMenu.test";
import { SectionEditDemo } from "./section-edit/SectionEdit.test";
import { EditSectionDemo } from "./edit-section/EditSection.test";
import { RecursiveFormTest } from "./recursive-form/RecursiveForm.test";

type Tab = "form" | "move-actions" | "edit-form" | "form-item-editor" | "add-item-side" | "section-edit" | "edit-section" | "recursive-form";

const TAB_LABELS: Record<Tab, string> = {
  "form": "Form",
  "move-actions": "Move actions",
  "recursive-form": "Recursive form",
  "edit-form": "Edit form",
  "form-item-editor": "Form item editor",
  "add-item-side": "Add-item side",
  "section-edit": "Section edit",
  "edit-section": "Edit section",
};

const App = () => {
  const [tab, setTab] = useState<Tab>("form");
  return (
    <div>
      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        {(Object.keys(TAB_LABELS) as Tab[]).map((t) => (
          <button
            key={t}
            disabled={tab === t}
            onClick={() => setTab(t)}
            style={{ backgroundColor: tab === t ? "gray" : "white", padding: 10, borderRadius: 5, border: "none", cursor: tab === t ? "not-allowed" : "pointer" }}
          >
            {TAB_LABELS[t]}
          </button>
        ))}
      </div>
      {tab === "form" && <FormTest />}
      {tab === "move-actions" && <MoveActionsTest />}
      {tab === "edit-form" && <BareEditFormTest />}
      {tab === "form-item-editor" && <FormItemEditorTest />}
      {tab === "add-item-side" && <SideMenuTest />}
      {tab === "section-edit" && <SectionEditDemo />}
      {tab === "edit-section" && <EditSectionDemo />}
      {tab === "recursive-form" && <RecursiveFormTest />}
    </div>
  )
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
