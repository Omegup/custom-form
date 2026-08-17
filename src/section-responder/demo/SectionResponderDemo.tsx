/**
 * `section-responder` showcase — school `SectionResponderHOC`:
 * one section of fillable fields, section-level Validate via `impRef`.
 */
import { useCallback, useRef, useState, type Ref } from "react";
import * as demo from "./sectionResponderDemoHelper";
import type * as types from "./sectionResponderDemoTypes.t";
import * as lib from "./library";

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
    viewer: ({ props: { formItem, extra } }) => {
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
      return (
        <label style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 14 }}>
          <span>
            {formItem.params.name}
            {formItem.params.required ? " *" : ""}
            {extra.icon}
          </span>
          <input
            value={value}
            onChange={(e) => setDataValue(e.target.value)}
            style={{
              padding: "6px 8px",
              border: extra.error ? "1px solid #c00" : "1px solid #ccc",
              borderRadius: 4,
            }}
          />
          {err && <span style={{ color: "#c00", fontSize: 12 }}>{err}</span>}
          {extra.appendix}
        </label>
      );
    },
  },
};

const SectionResponder = lib.SectionResponderHOC<
  types.TypeNames,
  types.Params,
  types.Variants,
  types.Ctx,
  types.Section
>(viewers, demo.sectionChrome);

const ctx = lib.branded<types.Ctx, "context">({
  t: () => "Required",
});
const variants = lib.branded<types.Variants, "variants">({ field: "default" });

export const SectionResponderDemo = ({
  heading,
  section,
  responses,
  updateArgs,
}: types.DemoProps) => {
  const sectionRef = useRef<lib.SectionValidator | null>(null);
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
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <SectionResponder
          ctx={ctx}
          multiSection={false}
          section={section}
          responses={responses}
          old={null}
          setResponse={setResponse}
          getError={(id) => errors[id] ?? null}
          impRef={sectionRef}
          resolveVariant={(item) => variants[item.type]}
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
    </demo.FormContainer>
  );
};
