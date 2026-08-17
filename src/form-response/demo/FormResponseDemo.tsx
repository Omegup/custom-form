/**
 * FormResponse lifecycle — Design editor, Fill Send, Update Save/feedback.
 */
import { FormDialogsEditor } from "../../form-dialogs/demo/FormDialogsDemo";
import { sectionsFromFlat } from "../../form-dialogs/demo/formDialogsDemoFlat";
import {
  FormContainer,
  PHASES,
  PhaseJsonPanels,
  PhaseTabs,
} from "./formResponseDemoHelper";
import { FillPhase } from "./formResponseFill";
import type * as types from "./formResponseDemoTypes.t";
import { UpdatePhase } from "./formResponseUpdate";

export const FormResponseDemo = ({
  heading,
  phase,
  flatItems,
  responses,
  formResponse,
  showDeleted,
  updateArgs,
}: types.DemoProps) => {
  const sections = sectionsFromFlat(flatItems);
  return (
    <FormContainer title={heading}>
      <PhaseTabs
        phase={phase}
        onChange={(next) => updateArgs({ phase: next })}
        phases={PHASES}
      />
      {phase === "design" ? (
        <FormDialogsEditor
          embedded={false}
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
        phase={phase}
        responses={responses}
        formResponse={formResponse}
      />
    </FormContainer>
  );
};
