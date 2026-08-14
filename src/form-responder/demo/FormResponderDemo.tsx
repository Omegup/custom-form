/**
 * `form-responder` showcase — school `CustomFormResponderHOC`:
 * multi-section fill + form-level Validate via `impRef`.
 */
import { useCallback, useRef, useState, type Ref } from "react";
import * as demo from "./formResponderDemoHelper";
import type * as types from "./formResponderDemoTypes.t";
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
            {formItem.params.required ? " *" : ""}
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
};

const FormResponder = lib.CustomFormResponderHOC<
  types.TypeNames,
  types.Params,
  types.Variants,
  types.Ctx,
  types.Section
>(viewers, demo.formChrome);

const ctx = lib.branded<types.Ctx, "context">({
  t: () => "Required",
});
const variants = lib.branded<types.Variants, "variants">({
  field: defaultFieldVariant,
});
const responderVariants: Record<lib.ResponderState, types.Variants> = {
  default: variants,
  old: variants,
  change: variants,
  error: variants,
};

export const FormResponderDemo = ({
  heading,
  header,
  sections,
  responses,
  showDeleted,
  updateArgs,
}: types.DemoProps) => {
  const formRef = useRef<lib.SectionValidator | null>(null);
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

  const validateForm = () => {
    const next = formRef.current?.validate(responses) ?? {};
    setErrors(next);
  };

  return (
    <demo.FormContainer title={heading}>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <FormResponder
          ctx={ctx}
          header={header}
          sections={sections}
          responses={responses}
          old={null}
          setResponse={setResponse}
          getError={(id) => errors[id] ?? null}
          impRef={formRef}
          showDeleted={showDeleted}
          variants={responderVariants}
          followUpItems={{}}
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
    </demo.FormContainer>
  );
};
