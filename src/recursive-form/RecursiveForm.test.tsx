import { useCallback, useMemo, useState } from "react";
import { branded } from "../form/branded";
import { createFormItemByGetChild } from "../form/createFormItemByGetChild";
import type { ViewerProps, Viewers, WithChildren } from "../form/form-react.t";
import type {
  ContextDom,
  ExtraDom,
  ParamsDom,
  SomeFormItem,
  TheParams,
  TheVariants,
} from "../form/form.t";

type Recursive<T> = {
  header: T;
  children: Recursive<T>[][];
};

type RecursiveFormItem<
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
> = Recursive<SomeFormItem<TypeNames, Params>>;

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

type FormExtra = WithChildren<ItemExtra>;
type ViewExtra = FormExtra["view"];

type FormData = {
  variants: {
    text: Variants["text"];
    group: Variants["group"];
  };
  values: Record<string, string>;
  items: RecursiveFormItem<TypeNames, Params>[];
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

const viewers: Viewers<
  TypeNames,
  Params,
  Variants,
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
      props: ViewerProps<Params, Variants, "text", ViewExtra, Context>;
    }) => (
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
          {formItem.params.label}
        </span>
        <input value={value} onChange={(e) => onChange(e.target.value)} />
      </label>
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
      props: ViewerProps<Params, Variants, "group", ViewExtra, Context>;
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
          {Object.entries(children).map(([suffix, child]) => (
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
    repeatChildren: ({ id }, { value: ids }) =>
      ids
        ?.split(",")
        .map((i) => `:${[...id.split(":").slice(1), i].join(":")}`) ?? [],
  },
};

const FormItem = createFormItemByGetChild(viewers, (x) => x);

const renderItem = (
  formItem: RecursiveFormItem<TypeNames, Params>,
  variants: Variants,
  values: Record<string, string>,
  ctx: Context,
  onValueChange: (id: string, value: string) => void,
): React.ReactNode => {
  if (formItem.header.deleted) return null;

  const render = (formItem: RecursiveFormItem<TypeNames, Params>) => (
    <FormItem
      viewProps={{
        formItem: formItem.header,
        ctx,
        variant: variants[formItem.header.type],
        extra: branded({
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

  const renderItemTree = useCallback(
    (item: RecursiveFormItem<TypeNames, Params>) =>
      renderItem(item, variants, form.values, ctx, onValueChange),
    [variants, form.values, ctx, onValueChange],
  );

  return (
    <div
      style={{ display: "flex", flexDirection: "column", gap: 16, padding: 16 }}
    >
      <h2 style={{ margin: 0 }}>Form test</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {form.items.map((item) => (
          <div key={item.header.id}>{renderItemTree(item)}</div>
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
