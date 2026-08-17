/**
 * `response` showcase — school fill path foundation:
 * `Response` / `ResponseSetter` + `FormItemHOC(…, getUseImpRefViewProps)`.
 * Each field writes `data.value`; Validate runs every `impRef.validate`.
 */
import { useCallback, useRef, useState } from "react";
import { RequiredMark } from "../../form-edit/demo/editFormDemoHelper";
import * as demo from "./responseDemoHelper";
import type * as types from "./responseDemoTypes.t";
import * as lib from "./library";

const viewers: lib.Viewers<
  types.TypeNames,
  types.Params,
  types.Variants,
  types.FieldExtra & lib.Children,
  types.FieldExtra,
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
      return (
        <label style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 14 }}>
          <span>
            {formItem.params.name}
            <RequiredMark required={formItem.params.required} />
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
          {extra.error && (
            <span style={{ color: "#c00", fontSize: 12 }}>{extra.error}</span>
          )}
        </label>
      );
    },
  },
};

const FormItem = lib.FormItemHOC<
  types.TypeNames,
  types.Params,
  types.Variants,
  types.FieldExtra,
  types.Ctx,
  types.FieldExtraView
>(
  viewers,
  lib.getUseImpRefViewProps<
    types.TypeNames,
    types.Params,
    types.Variants,
    types.FieldBaseExtra & lib.Children,
    types.Ctx
  >(),
);

const ctx = lib.branded<types.Ctx, "context">({});
const variants = lib.branded<types.Variants, "variants">({});

export const ResponseDemo = ({
  heading,
  items,
  responses,
  updateArgs,
}: types.DemoProps) => {
  const validators = useRef<Record<string, lib.StrictViewerMethods | null>>({});
  const [errors, setErrors] = useState<Record<string, string | null>>({});

  const setResponse = useCallback(
    (id: string, next: lib.Response) => {
      updateArgs({ responses: { ...responses, [id]: next } });
    },
    [responses, updateArgs],
  );

  const validateAll = () => {
    const next: Record<string, string | null> = {};
    for (const item of items) {
      const ref = validators.current[item.id];
      next[item.id] = ref?.validate(responses[item.id]) ?? null;
    }
    setErrors(next);
  };

  return (
    <demo.FormContainer title={heading}>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {items.map((item) => {
          const value = responses[item.id] ?? lib.emptyResponse();
          return (
            <FormItem
              key={item.id}
              viewProps={{
                formItem: item,
                ctx,
                variant: variants,
                extra: lib.branded({
                  error: errors[item.id] ?? null,
                  response: {
                    value,
                    setValue: (key, v) =>
                      setResponse(item.id, { ...value, [key]: v }),
                  },
                  getChild: () => null,
                  impRef: (methods) => {
                    validators.current[item.id] = methods;
                  },
                }),
              }}
              renderCard={(view) => view}
            />
          );
        })}
        <button type="button" onClick={validateAll} style={{ alignSelf: "flex-start" }}>
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
