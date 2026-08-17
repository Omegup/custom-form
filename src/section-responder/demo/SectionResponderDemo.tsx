/**
 * `section-responder` showcase — school `SectionResponderHOC`:
 * one section of fillable fields, section-level Validate via `impRef`.
 */
import { useCallback, useRef, useState, type Ref } from "react";
import { FormDialogsEditor } from "../../form-dialogs/demo/FormDialogsDemo";
import { sectionsFromFlat } from "../../form-dialogs/demo/formDialogsDemoFlat";
import { RequiredMark } from "../../form-edit/demo/editFormDemoHelper";
import {
  headingView,
  panelRepeatChildren,
  panelView,
} from "../../response/demo/nestedItems";
import * as demo from "./sectionResponderDemoHelper";
import type * as types from "./sectionResponderDemoTypes.t";
import * as lib from "./library";

const defaultFieldVariant: types.FieldVariant = {
  border: "#ccc",
  background: "#fff",
  badge: null,
  shell: {},
  errorBorder: "#c00",
};

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
    viewer: ({ props: { formItem, extra, variant } }) => {
      const { setDataValue, value } = demo.useFieldMethods(
        extra.impRef,
        extra.response,
        formItem.params.required,
        formItem.params.name,
      );
      const err =
        typeof extra.error === "string"
          ? extra.error
          : extra.error
            ? "Invalid"
            : null;
      const border =
        extra.error && variant.errorBorder
          ? variant.errorBorder
          : variant.border;
      return (
        <label
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 4,
            fontSize: 14,
            ...variant.shell,
          }}
        >
          <span>
            {formItem.params.name}
            <RequiredMark required={formItem.params.required} />
            {variant.badge}
            {extra.icon}
          </span>
          <input
            value={value}
            onChange={(e) => setDataValue(e.target.value)}
            style={{
              padding: "6px 8px",
              border: `1px solid ${border}`,
              borderRadius: 4,
              background: variant.background,
            }}
          />
          {err && <span style={{ color: "#c00", fontSize: 12 }}>{err}</span>}
          {extra.appendix}
        </label>
      );
    },
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

export const SectionResponder = lib.SectionResponderHOC<
  types.TypeNames,
  types.Params,
  types.Variants,
  types.Ctx,
  types.Section
>(viewers, demo.sectionChrome);

const ctx = lib.branded<types.Ctx, "context">({
  t: () => "Required",
});
const variants = lib.branded<types.Variants, "variants">(defaultFieldVariant);
export const sectionResponderCtx = ctx;
export const sectionResponderVariants: Record<lib.ResponderState, types.Variants> =
  {
    default: variants,
    old: variants,
    change: variants,
  };

export const SectionResponderDemo = ({
  heading,
  phase,
  flatItems,
  section,
  responses,
  updateArgs,
}: types.DemoProps) => {
  const sectionRef = useRef<lib.SectionValidator | null>(null);
  const liveSection = sectionsFromFlat(flatItems)[0] ?? section;
  const [errors, setErrors] = useState<Record<string, string | null>>({});

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

  const validateSection = () => {
    const next = sectionRef.current?.validate(responses) ?? {};
    setErrors(next);
  };

  return (
    <demo.FormContainer title={heading}>
      <demo.PhaseTabs
        phase={phase}
        onChange={(next) => updateArgs({ phase: next })}
        phases={demo.PHASES}
      />
      {phase === "design" ? (
        <FormDialogsEditor
          embedded={false}
          flatItems={flatItems}
          setFlatItems={(next) => {
            const [first] = sectionsFromFlat(next);
            updateArgs({
              flatItems: next,
              ...(first ? { section: first } : {}),
            });
          }}
        />
      ) : (
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <SectionResponder
          ctx={ctx}
          multiSection={false}
          section={liveSection}
          responses={responses}
          old={null}
          setResponse={setResponse}
          getError={(id) => errors[id] ?? null}
          impRef={sectionRef}
          variants={sectionResponderVariants}
          followUpItems={{}}
          i={0}
        />
        <button type="button" onClick={validateSection} style={{ alignSelf: "flex-start" }}>
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
    </demo.FormContainer>
  );
};
