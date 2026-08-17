/**
 * `response` showcase — school fill path foundation:
 * `Response` / `ResponseSetter` + `FormItemHOC(…, getUseImpRefViewProps)`.
 * Each field writes `data.value`; Validate runs every `impRef.validate`.
 */
import { useCallback, useRef, useState } from "react";
import { DemoPage, PhaseJsonPanels, ValidateBlock } from "../../demo-utils";
import { FillFieldViewer, defaultFillVariant } from "./FillFieldViewer";
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
    viewer: ({ props: { formItem, extra } }) => (
      <FillFieldViewer
        name={formItem.params.name}
        required={formItem.params.required}
        extra={{ ...extra, icon: null, appendix: null }}
        variant={defaultFillVariant}
      />
    ),
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
    <DemoPage title={heading}>
      <ValidateBlock onValidate={validateAll}>
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
        <PhaseJsonPanels
          heading="State"
          activeId="responses"
          panels={[{ id: "responses", title: "Responses", value: responses }]}
        />
      </ValidateBlock>
    </DemoPage>
  );
};
