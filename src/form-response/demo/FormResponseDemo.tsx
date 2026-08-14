/**
 * FormResponse lifecycle — Fill Send + Update Save/feedback.
 * Design editing lives in form-dialogs; fill/review shells in their modules.
 */
import {
  FormContainer,
  PhaseJsonPanels,
  PhaseTabs,
} from "./formResponseDemoHelper";
import { FillPhase } from "./formResponseFill";
import type * as types from "./formResponseDemoTypes.t";
import { UpdatePhase } from "./formResponseUpdate";

export const FormResponseDemo = ({
  heading,
  phase,
  sections,
  responses,
  formResponse,
  showDeleted,
  updateArgs,
}: types.DemoProps) => (
  <FormContainer title={heading}>
    <PhaseTabs
      phase={phase}
      onChange={(next) => updateArgs({ phase: next })}
    />
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
