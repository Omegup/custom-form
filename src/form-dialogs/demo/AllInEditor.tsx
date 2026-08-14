/**
 * All-in composition — Design → Fill → Update as views over two documents.
 * Open this file + allInDemoTypes.t.ts to see how the library is wired.
 */
import { useMemo } from "react";
import { FormContainer } from "../../side-menu/demo/sideMenuDemoHelper";
import { DesignPhase } from "./allInDesign";
import { FillPhase } from "./allInFill";
import { PhaseJsonPanels, PhaseTabs } from "./allInLifecycle";
import { UpdatePhase } from "./allInUpdate";
import type * as types from "./allInDemoTypes.t";
import * as lib from "./library";

export const AllInEditor = ({
  heading,
  phase,
  flatItems,
  responses,
  formResponse,
  showDeleted,
  updateArgs,
}: types.DemoProps) => {
  const sections = useMemo(
    () => lib.consolidateSections(flatItems) as types.ListSection[],
    [flatItems],
  );

  return (
    <FormContainer title={heading}>
      <PhaseTabs
        phase={phase}
        onChange={(next) => updateArgs({ phase: next })}
      />
      {phase === "design" ? (
        <DesignPhase flatItems={flatItems} updateArgs={updateArgs} />
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
          flatItems={flatItems}
          formResponse={formResponse}
          showDeleted={showDeleted}
          updateArgs={updateArgs}
        />
      ) : null}
      <PhaseJsonPanels
        phase={phase}
        flatItems={flatItems}
        responses={responses}
        formResponse={formResponse}
      />
    </FormContainer>
  );
};
