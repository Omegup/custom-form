/**
 * FormResponse lifecycle — Design editor, Fill Send, Update Save/feedback.
 */
import { DemoPage, PhaseJsonPanels, PhaseTabs } from "../../demo-utils";
import { FormDialogsEditor, designSidebar } from "../../form-dialogs/demo/FormDialogsDemo";
import { PHASES } from "./formResponseDemoHelper";
import { FillPhase } from "./formResponseFill";
import type * as types from "./formResponseDemoTypes.t";
import { UpdatePhase } from "./formResponseUpdate";
import * as lib from "./library";

export const FormResponseDemo = ({
  heading,
  phase,
  flatItems,
  responses,
  formResponse,
  showDeleted,
  updateArgs,
}: types.DemoProps) => {
  const sections = lib.consolidateSections(flatItems);
  return (
    <DemoPage title={heading}>
      <PhaseTabs
        phase={phase}
        onChange={(next) => updateArgs({ phase: next })}
        phases={PHASES}
      />
      {phase === "design" ? (
        <FormDialogsEditor
          sidebar={designSidebar}
          flatItems={flatItems}
          setFlatItems={(next) => updateArgs({ flatItems: next })}
        />
      ) : null}
      {phase === "fill" ? (
        <FillPhase
          sections={sections}
          responses={responses}
          formResponse={formResponse}
          updateArgs={updateArgs}
        />
      ) : null}
      {phase === "update" ? (
        <UpdatePhase
          sections={sections}
          formResponse={formResponse}
          showDeleted={showDeleted}
          updateArgs={updateArgs}
        />
      ) : null}
      <PhaseJsonPanels
        heading="Document"
        activeId={phase === "fill" ? "fill" : "formResponse"}
        panels={[
          { id: "formResponse", title: "FormResponse", value: formResponse },
          ...(phase === "fill"
            ? [{ id: "fill", title: "Fill draft", value: responses }]
            : []),
        ]}
      />
    </DemoPage>
  );
};
