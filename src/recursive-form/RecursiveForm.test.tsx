import { useCallback, useMemo, useState } from "react";
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
  TheParams,
  TheVariants,
} from "../form";
import type { RecursiveFormItem } from "./RecursiveFormItem.t";

type TypeNames = "text" | "group";

type Params = TheParams<{
  text: { label: string };
  group: { title: string };
}>;

type Variants = TheVariants<{
  text: "default" | "compact";
  group: "default" | "bordered";
}>;

type Context = ContextDom & { accent: string };

type ItemExtra = ExtraDom & {
  value: string;
  onChange: (value: string) => void;
};

type FormData = {
  variants: {
    text: Variants["text"];
    group: Variants["group"];
  };
  values: Record<string, string>;
  items: RecursiveFormItem<TypeNames, Params, never, 1>[];
};

const DEFAULT_FORM: FormData = {
  variants: {
    text: "default",
    group: "bordered",
  },
  values: {
    t: "Alice",
    g: "1,2,3",
    "ga:1": "Apple",
    "ga:2": "Banana",
    "ga:3": "Carrot",
    "gb:1": "Red",
    "gb:2": "Green",
    "gb:3": "Blue",
    "gga:1:": "Small",
    "gga:2:": "Medium",
    "gga:3:": "Large",
  },
  items: [
    {
      header: {
        id: "t",
        type: "text",
        deleted: false,
        params: {
          label: "Name",
        },
      },
      children: [],
    },
    {
      header: {
        id: "g",
        type: "group",
        deleted: false,
        params: {
          title: "Inventory",
        },
      },
      children: [
        [
          {
            header: {
              id: "ga",
              type: "text",
              deleted: false,
              params: {
                label: "Item",
              },
            },
            children: [],
          },
          {
            header: {
              id: "gb",
              type: "text",
              deleted: false,
              params: {
                label: "Color",
              },
            },
            children: [],
          },
        ],
        [
          {
            header: {
              id: "gg",
              type: "group",
              deleted: false,
              params: {
                title: "Attributes",
              },
            },
            children: [
              [
                {
                  header: {
                    id: "gga",
                    type: "text",
                    deleted: false,
                    params: {
                      label: "Size",
                    },
                  },
                  children: [],
                },
              ],
            ],
          },
        ],
      ],
    },
  ],
};

const makeViewers = <ItemExtra extends ExtraDom>(
  inner: Viewers<
    TypeNames,
    Params,
    Variants,
    WithChildren<ItemExtra>,
    Context,
    string
  >,
): Viewers<
  TypeNames,
  Params,
  Variants,
  WithChildren<ItemExtra>,
  Context,
  string
> => ({
  text: {
    viewer: ({
      props,
    }: {
      props: ViewerProps<
        Params,
        Variants,
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
        Params,
        Variants,
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
  formItem: RecursiveFormItem<TypeNames, Params, never, 1>,
  variants: Variants,
  ctx: Context,
  FormItem: (
    props: FormItemProps<
      Params,
      Variants,
      TypeNames,
      WithGetChild<Extra>,
      Context
    >,
  ) => React.ReactNode,
  extra: (
    formItem: RecursiveFormItem<TypeNames, Params, never, 1>,
    render: (
      formItem: RecursiveFormItem<TypeNames, Params, never, 1>,
    ) => React.ReactNode,
  ) => Extra & GetChild,
): React.ReactNode => {
  if (formItem.header.deleted) return null;

  const render = (formItem: RecursiveFormItem<TypeNames, Params, never, 1>) => (
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

const parseForm = (json: string): { form: FormData; error: string | null } => {
  try {
    return { form: JSON.parse(json) as FormData, error: null };
  } catch (e) {
    return {
      form: DEFAULT_FORM,
      error: e instanceof Error ? e.message : "Invalid JSON",
    };
  }
};

export const RecursiveFormTest = () => {
  const [formJson, setFormJson] = useState(() =>
    JSON.stringify(DEFAULT_FORM, null, 2),
  );

  const { form, error: parseError } = useMemo(
    () => parseForm(formJson),
    [formJson],
  );

  const variants = form.variants as Variants;
  const ctx = useMemo((): Context => ({ accent: "#4a90d9" }) as Context, []);

  const onValueChange = useCallback((id: string, value: string) => {
    setFormJson((prev) => {
      try {
        const parsed = JSON.parse(prev) as FormData;
        return JSON.stringify(
          { ...parsed, values: { ...parsed.values, [id]: value } },
          null,
          2,
        );
      } catch {
        return prev;
      }
    });
  }, []);

  const renderValues = useCallback(
    (item: RecursiveFormItem<TypeNames, Params, never, 1>) =>
      renderItem<ItemExtra>(
        item,
        variants,
        ctx,
        FormItemValues,
        (formItem, render) =>
          branded({
            value: form.values[formItem.header.id] ?? "",
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
    [variants, form.values, ctx, onValueChange],
  );
  const renderSkeleton = useCallback(
    (item: RecursiveFormItem<TypeNames, Params, never, 1>) =>
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
      <h2 style={{ margin: 0 }}>Form test</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {form.items.map((item) => (
          <div key={item.header.id}>{renderSkeleton(item)}</div>
        ))}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {form.items.map((item) => (
          <div key={item.header.id}>{renderValues(item)}</div>
        ))}
      </div>
      <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <span style={{ fontSize: 12, opacity: 0.7 }}>Form (JSON)</span>
        <textarea
          value={formJson}
          onChange={(e) => setFormJson(e.target.value)}
          spellCheck={false}
          style={{
            minHeight: 280,
            fontFamily: "monospace",
            fontSize: 12,
            padding: 8,
            borderRadius: 4,
            border: parseError ? "1px solid #c00" : "1px solid #ccc",
          }}
        />
        {parseError && (
          <span style={{ color: "#c00", fontSize: 12 }}>{parseError}</span>
        )}
      </label>
    </div>
  );
};
