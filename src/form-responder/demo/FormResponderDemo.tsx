/**
 * `form-responder` showcase — school `CustomFormResponderHOC`:
 * multi-section fill + form-level Validate via `impRef`.
 */
import { useCallback, useRef, useState, type Ref } from "react";
import { DemoPage, PhaseTabs } from "../../demo-utils";
import { FormDialogsEditor, designSidebar } from "../../form-dialogs/demo/FormDialogsDemo";
import { FillFieldViewer, defaultFillVariant } from "../../response/demo/FillFieldViewer";
import {
  headingView,
  panelRepeatChildren,
  panelView,
} from "../../response/demo/nestedItems";
import * as demo from "./formResponderDemoHelper";
import type * as types from "./formResponderDemoTypes.t";
import * as lib from "./library";

const defaultFieldVariant: types.FieldVariant = defaultFillVariant;

const viewers: lib.Viewers<
  types.TypeNames,
  types.Params,
  types.Variants,
  types.FieldExtra & lib.Children,
  lib.ResponderExtra & { impRef: Ref<lib.StrictViewerMethods> },
  types.Ctx,
  string
> = {
  field: {
    viewer: ({ props: { formItem, extra, variant } }) => (
      <FillFieldViewer
        name={formItem.params.name}
        required={formItem.params.required}
        extra={extra}
        variant={{
          ...variant,
          errorBorder: variant.errorBorder ?? null,
        }}
      />
    ),
  },
  heading: {
    viewer: headingView,
    repeatChildren: () => [""],
  },
  panel: {
    viewer: panelView,
    repeatChildren: panelRepeatChildren,
  },
};

export const FormResponder = lib.CustomFormResponderHOC<
  types.TypeNames,
  types.Params,
  types.Variants,
  types.Ctx,
  types.Section
>(viewers, demo.formChrome);

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
      if (next === undefined) {
        const { [id]: _, ...rest } = responses;
        updateArgs({ responses: rest });
        return;
      }
      updateArgs({ responses: { ...responses, [id]: next } });
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
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
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
        <button type="button" onClick={validateForm} style={{ alignSelf: "flex-start" }}>
          Validate
        </button>
        <pre
          style={{
            margin: 0,
            padding: 12,
            background: "#f6f7f9",
            borderRadius: 6,
            fontSize: 12,
            overflow: "auto",
          }}
        >
          {JSON.stringify(responses, null, 2)}
        </pre>
      </div>
      )}
    </DemoPage>
  );
};
