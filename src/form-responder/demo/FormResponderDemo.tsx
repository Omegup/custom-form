/**
 * `form-responder` showcase — school `CustomFormResponderHOC`:
 * multi-section fill + form-level Validate via `impRef`.
 */
import { useCallback, useRef, useState } from "react";
import { DemoPage, PhaseJsonPanels, PhaseTabs, ValidateBlock } from "../../demo-utils";
import { FormDialogsEditor, designSidebar } from "../../form-dialogs/demo/FormDialogsDemo";
import { defaultFillVariant } from "../../response/demo/FillFieldViewer";
import { fillViewers } from "../../response/demo/nestedItems";
import { patchResponse } from "../../response/demo/patchResponse";
import * as demo from "./formResponderDemoHelper";
import type * as types from "./formResponderDemoTypes.t";
import * as lib from "./library";

const defaultFieldVariant: types.FieldVariant = defaultFillVariant;

export const FormResponder = lib.CustomFormResponderHOC<
  types.TypeNames,
  types.Params,
  types.Variants,
  types.Ctx,
  types.Section
>(fillViewers, demo.formChrome);

const ctx = lib.branded<types.Ctx, "context">({
  t: () => "Required",
});
export const formResponderCtx = ctx;
const variants = lib.branded<types.Variants, "variants">(defaultFieldVariant);
export const responderVariants: Record<lib.ResponderState, types.Variants> = {
  default: variants,
  old: variants,
  change: variants,
};

export const FormResponderDemo = ({
  heading,
  phase,
  header,
  flatItems,
  responses,
  showDeleted,
  updateArgs,
}: types.DemoProps) => {
  const formRef = useRef<lib.SectionValidator | null>(null);
  const [errors, setErrors] = useState<Record<string, string | null>>({});
  const liveSections = lib.consolidateSections(flatItems);

  const setResponse = useCallback(
    (id: string, next?: lib.Response) => {
      updateArgs({ responses: patchResponse(responses, id, next) });
    },
    [responses, updateArgs],
  );

  const validateForm = () => {
    const next = formRef.current?.validate(responses) ?? {};
    setErrors(next);
  };

  return (
    <DemoPage title={heading}>
      <PhaseTabs
        phase={phase}
        onChange={(next) => updateArgs({ phase: next })}
        phases={demo.PHASES}
      />
      {phase === "design" ? (
        <FormDialogsEditor
          sidebar={designSidebar}
          flatItems={flatItems}
          setFlatItems={(next) =>
            updateArgs({
              flatItems: next,
              sections: lib.consolidateSections(next),
            })
          }
        />
      ) : (
      <ValidateBlock onValidate={validateForm}>
        <FormResponder
          ctx={ctx}
          header={header}
          sections={liveSections}
          responses={responses}
          old={null}
          setResponse={setResponse}
          getError={(id) => errors[id] ?? null}
          impRef={formRef}
          showDeleted={showDeleted}
          variants={responderVariants}
          followUpItems={{}}
          children={null}
        />
      </ValidateBlock>
      )}
      <PhaseJsonPanels
        heading="JSON by phase"
        activeId={phase}
        panels={[
          { id: "design", title: "design · sections", value: liveSections },
          { id: "fill", title: "fill · answers", value: responses },
        ]}
      />
    </DemoPage>
  );
};
