import { useCallback, useEffect, useMemo, useState } from "react";
import { createFormItemByGetChild } from "./createFormItemByGetChild";
import type { ContextDom, ExtraDom, SomeFormItem } from "./form.t";
import type { ViewerProps, Viewers, WithChildren } from "./form-react.t";
import { branded } from "./branded";
import type {
  FormDemoData,
  FormDemoParams,
  FormDemoTypeNames,
  FormDemoVariants,
} from "./formDemoFixtures";

type Context = ContextDom & { accent: string };

type ItemExtra = ExtraDom & {
  value: string;
  onChange: (value: string) => void;
};

type FormExtra = WithChildren<ItemExtra>;
type ViewExtra = FormExtra["view"];

export type FormPlaygroundProps = FormDemoData & { accent: string };

const viewers: Viewers<
  FormDemoTypeNames,
  FormDemoParams,
  FormDemoVariants,
  FormExtra,
  Context,
  string
> = {
  text: {
    viewer: ({
      props: {
        formItem,
        ctx,
        variant,
        extra: { value, onChange },
      },
    }: {
      props: ViewerProps<
        FormDemoParams,
        FormDemoVariants,
        "text",
        ViewExtra,
        Context
      >;
    }) =>
      formItem.params.showLabel ? (
        <label
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 4,
            padding: variant === "compact" ? 4 : 8,
            borderLeft: `3px solid ${ctx.accent}`,
          }}
        >
          <span style={{ fontSize: 12, opacity: 0.7 }}>
            {formItem.params.template
              ? formItem.params.label.replace(
                  "{{id}}",
                  formItem.id.split(":").pop() ?? "",
                )
              : formItem.params.label}
          </span>
          <input value={value} onChange={(e) => onChange(e.target.value)} />
        </label>
      ) : (
        <input value={value} onChange={(e) => onChange(e.target.value)} />
      ),
  },
  group: {
    viewer: ({
      props: {
        formItem,
        ctx,
        variant,
        extra: { children },
      },
    }: {
      props: ViewerProps<
        FormDemoParams,
        FormDemoVariants,
        "group",
        ViewExtra,
        Context
      >;
    }) => (
      <fieldset
        style={{
          border: variant === "bordered" ? `1px solid ${ctx.accent}` : "none",
          borderRadius: 4,
          padding: 8,
        }}
      >
        <legend>{formItem.params.title}</legend>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {children}
        </div>
      </fieldset>
    ),
    repeatChildren: (g, { value: ids }) => [
      ...(g.params.name ? [""] : []),
      ...(ids?.split(",") ?? []),
    ],
  },
};

const FormItem = createFormItemByGetChild(viewers, (x) => x);

const renderItem = (
  formItem: SomeFormItem<FormDemoTypeNames, FormDemoParams>,
  variants: FormDemoVariants,
  values: Record<string, string>,
  ctx: Context,
  onValueChange: (id: string, value: string) => void,
): React.ReactNode => {
  if (formItem.deleted) return null;

  const render = (
    formItem: SomeFormItem<FormDemoTypeNames, FormDemoParams>,
    suffix: string,
  ) => (
    <FormItem
      viewProps={{
        formItem: { ...formItem, id: formItem.id + suffix },
        ctx,
        variant: variants[formItem.type],
        extra: branded({
          value: values[formItem.id + suffix] ?? "",
          onChange: (value) => onValueChange(formItem.id + suffix, value),
          getChild: (childSuffix, index) => {
            if (formItem.type !== "group") return null;
            if (index === 0 && formItem.params.name)
              return render(formItem.params.name, `${suffix}`);
            return render(formItem.params.item, `${suffix}:${childSuffix}`);
          },
        }),
      }}
      renderCard={(view) => (
        <div style={{ background: "#f5f5f5", borderRadius: 4 }}>{view}</div>
      )}
    />
  );

  return render(formItem, "");
};

export const FormPlayground = ({
  accent,
  variants: variantProps,
  values: valuesProp,
  items,
}: FormPlaygroundProps) => {
  const [values, setValues] = useState(valuesProp);

  useEffect(() => {
    setValues(valuesProp);
  }, [valuesProp]);

  const variants = useMemo(
    (): FormDemoVariants => branded(variantProps),
    [variantProps],
  );
  const ctx = useMemo((): Context => branded({ accent }), [accent]);

  const onValueChange = useCallback((id: string, value: string) => {
    setValues((prev) => ({ ...prev, [id]: value }));
  }, []);

  const renderItemTree = useCallback(
    (item: SomeFormItem<FormDemoTypeNames, FormDemoParams>) =>
      renderItem(item, variants, values, ctx, onValueChange),
    [variants, values, ctx, onValueChange],
  );

  return (
    <div
      style={{ display: "flex", flexDirection: "column", gap: 16, padding: 16 }}
    >
      <h2 style={{ margin: 0 }}>Form</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {items.map((item) => (
          <div key={item.id}>{renderItemTree(item)}</div>
        ))}
      </div>
    </div>
  );
};
