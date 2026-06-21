import { useCallback, useEffect, useMemo, useState } from "react";
import { branded } from "../form/branded";
import { createFormItemByGetChild } from "../form/createFormItemByGetChild";
import type {
  FormItemProps,
  GetChild,
  ViewerProps,
  Viewers,
  WithChildren,
  WithGetChild,
} from "../form/form-react.t";
import type {
  ContextDom,
  ExtraDom,
} from "../form";
import type { RecursiveFormItem } from "./RecursiveFormItem.t";
import type {
  RecursiveFormDemoData,
  RecursiveFormDemoParams,
  RecursiveFormDemoTypeNames,
  RecursiveFormDemoVariants,
} from "./recursiveFormDemoFixtures";

type Context = ContextDom & { accent: string };

type ItemExtra = ExtraDom & {
  value: string;
  onChange: (value: string) => void;
};

export type RecursiveFormPlaygroundProps = RecursiveFormDemoData & {
  accent: string;
};

const makeViewers = <ItemExtra extends ExtraDom>(
  inner: Viewers<
    RecursiveFormDemoTypeNames,
    RecursiveFormDemoParams,
    RecursiveFormDemoVariants,
    WithChildren<ItemExtra>,
    Context,
    string
  >,
): Viewers<
  RecursiveFormDemoTypeNames,
  RecursiveFormDemoParams,
  RecursiveFormDemoVariants,
  WithChildren<ItemExtra>,
  Context,
  string
> => ({
  text: {
    viewer: ({
      props,
    }: {
      props: ViewerProps<
        RecursiveFormDemoParams,
        RecursiveFormDemoVariants,
        "text",
        WithChildren<ItemExtra>["view"],
        Context
      >;
    }) => (
      <label
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 4,
          padding: props.variant === "compact" ? 4 : 8,
          borderLeft: `3px solid ${props.ctx.accent}`,
        }}
      >
        <span style={{ fontSize: 12, opacity: 0.7 }}>
          {props.formItem.params.label}
        </span>
        {inner.text.viewer({ props })}
      </label>
    ),
  },
  group: {
    viewer: ({
      props,
    }: {
      props: ViewerProps<
        RecursiveFormDemoParams,
        RecursiveFormDemoVariants,
        "group",
        WithChildren<ItemExtra>["view"],
        Context
      >;
    }) => (
      <fieldset
        style={{
          border:
            props.variant === "bordered"
              ? `1px solid ${props.ctx.accent}`
              : "none",
          borderRadius: 4,
          padding: 8,
        }}
      >
        <legend>{props.formItem.params.title}</legend>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {Object.entries(props.extra.children).map(([suffix, child]) => (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 8,
                border: "1px solid #ccc",
                padding: 8,
              }}
              key={suffix}
            >
              {child}
            </div>
          ))}
        </div>
      </fieldset>
    ),
    repeatChildren: inner.group.repeatChildren,
  },
});

const viewersValues = makeViewers<ItemExtra>({
  text: {
    viewer: ({ props }) => (
      <input
        value={props.extra.value}
        onChange={(e) => props.extra.onChange(e.target.value)}
      />
    ),
  },
  group: {
    viewer: () => null,
    repeatChildren: ({ id }, { value: ids }) =>
      ids
        ?.split(",")
        .map((i) => `:${[...id.split(":").slice(1), i].join(":")}`) ?? [],
  },
});

const viewersSkeleton = makeViewers<ExtraDom>({
  text: {
    viewer: ({ props }) => (
      <input value={props.formItem.params.label} disabled />
    ),
  },
  group: {
    viewer: () => null,
    repeatChildren: () => [""],
  },
});

const FormItemValues = createFormItemByGetChild(viewersValues, (x) => x);
const FormItemSkeleton = createFormItemByGetChild(viewersSkeleton, (x) => x);

const renderItem = <Extra extends ExtraDom>(
  formItem: RecursiveFormItem<RecursiveFormDemoTypeNames, RecursiveFormDemoParams, never, 1>,
  variants: RecursiveFormDemoVariants,
  ctx: Context,
  FormItem: (
    props: FormItemProps<
      RecursiveFormDemoParams,
      RecursiveFormDemoVariants,
      RecursiveFormDemoTypeNames,
      WithGetChild<Extra>,
      Context
    >,
  ) => React.ReactNode,
  extra: (
    formItem: RecursiveFormItem<RecursiveFormDemoTypeNames, RecursiveFormDemoParams, never, 1>,
    render: (
      formItem: RecursiveFormItem<RecursiveFormDemoTypeNames, RecursiveFormDemoParams, never, 1>,
    ) => React.ReactNode,
  ) => Extra & GetChild,
): React.ReactNode => {
  if (formItem.header.deleted) return null;

  const render = (formItem: RecursiveFormItem<RecursiveFormDemoTypeNames, RecursiveFormDemoParams, never, 1>) => (
    <FormItem
      key={formItem.header.id}
      viewProps={{
        formItem: formItem.header,
        ctx,
        variant: variants[formItem.header.type],
        extra: extra(formItem, render),
      }}
      renderCard={(view) => (
        <div style={{ background: "#f5f5f5", borderRadius: 4 }}>{view}</div>
      )}
    />
  );
  return render(formItem);
};

export const RecursiveFormPlayground = ({
  accent,
  variants: variantProps,
  values: valuesProp,
  items,
}: RecursiveFormPlaygroundProps) => {
  const [values, setValues] = useState(valuesProp);

  useEffect(() => {
    setValues(valuesProp);
  }, [valuesProp]);

  const variants = useMemo(
    (): RecursiveFormDemoVariants => branded(variantProps),
    [variantProps],
  );
  const ctx = useMemo((): Context => branded({ accent }), [accent]);

  const onValueChange = useCallback((id: string, value: string) => {
    setValues((prev) => ({ ...prev, [id]: value }));
  }, []);

  const renderValues = useCallback(
    (item: RecursiveFormItem<RecursiveFormDemoTypeNames, RecursiveFormDemoParams, never, 1>) =>
      renderItem<ItemExtra>(
        item,
        variants,
        ctx,
        FormItemValues,
        (formItem, render) =>
          branded({
            value: values[formItem.header.id] ?? "",
            onChange: (value) => onValueChange(formItem.header.id, value),
            getChild: (suffix) => {
              return (
                <div style={{ display: "flex", gap: 20 }}>
                  {formItem.children.map((slot, index) => (
                    <div key={index} style={{ flex: 1 }}>
                      {slot.map((child) =>
                        render({
                          ...child,
                          header: {
                            ...child.header,
                            id: `${child.header.id}${suffix}`,
                          },
                        }),
                      )}
                    </div>
                  ))}
                </div>
              );
            },
          }),
      ),
    [variants, values, ctx, onValueChange],
  );
  const renderSkeleton = useCallback(
    (item: RecursiveFormItem<RecursiveFormDemoTypeNames, RecursiveFormDemoParams, never, 1>) =>
      renderItem<ExtraDom>(
        item,
        variants,
        ctx,
        FormItemSkeleton,
        (formItem, render) =>
          branded({
            getChild: () => {
              return (
                <div style={{ display: "flex", gap: 20 }}>
                  {formItem.children.map((slot, index) => (
                    <div key={index} style={{ flex: 1 }}>
                      {slot.map(render)}
                    </div>
                  ))}
                </div>
              );
            },
          }),
      ),
    [variants, ctx],
  );
  return (
    <div
      style={{ display: "flex", flexDirection: "column", gap: 16, padding: 16 }}
    >
      <h2 style={{ margin: 0 }}>Recursive form</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {items.map((item) => (
          <div key={item.header.id}>{renderSkeleton(item)}</div>
        ))}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {items.map((item) => (
          <div key={item.header.id}>{renderValues(item)}</div>
        ))}
      </div>
    </div>
  );
};
