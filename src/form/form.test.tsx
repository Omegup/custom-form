import { useCallback, useMemo, useState } from "react";
import { FormItemHOC } from "./FormItem";
import type {
  ContextDom,
  ExtraDom,
  SomeFormItem,
  TheParams,
  TypedFormItem,
  TheVariants,
} from "./form.model";
import type {
  ViewerProps,
  Viewers,
  WithChildren,
} from "./form-react";
import { branded } from "./branded-cast";

type TypeNames = "text" | "group";

type Params = TheParams<{
  text: { label: string };
  group: { title: string; k: TypedFormItem<Params, "text">[] };
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
  items: SomeFormItem<TypeNames, Params>[];
};

const DEFAULT_FORM: FormData = {
  variants: { text: "default", group: "bordered" },
  values: {
    "text-1": "Alice",
    "text-2": "alpha",
    "text-3": "beta",
    "text-4": "gamma",
  },
  items: [
    {
      id: "text-1",
      type: "text",
      deleted: false,
      params: { label: "Name" },
    },
    {
      id: "group-1",
      type: "group",
      deleted: false,
      params: {
        title: "Tagged items",
        k: [
          {
            id: "text-2",
            type: "text",
            deleted: false,
            params: { label: "Item 1" },
          },
          {
            id: "text-3",
            type: "text",
            deleted: false,
            params: { label: "Item 2" },
          },
          {
            id: "text-4",
            type: "text",
            deleted: false,
            params: { label: "Item 3" },
          },
        ],
      },
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
            <div key={suffix}>{child}</div>
          ))}
        </div>
      </fieldset>
    ),
    repeatChildren: (formItem) => formItem.params.k.map((_, i) => String(i)),
  },
};

const FormItem = FormItemHOC(viewers, (x) => x);

const renderItem = (
  formItem: SomeFormItem<TypeNames, Params>,
  variants: Variants,
  values: Record<string, string>,
  ctx: Context,
  onValueChange: (id: string, value: string) => void,
  renderItemTree: (item: SomeFormItem<TypeNames, Params>) => React.ReactNode,
): React.ReactNode => {
  if (formItem.deleted) return null;

  return (
    <FormItem
      viewProps={{
        formItem,
        ctx,
        variant: variants[formItem.type],
        extra: branded({
          value: values[formItem.id] ?? "",
          onChange: (value) => onValueChange(formItem.id, value),
          getChild: (suffix) => {
            if (formItem.type !== "group") return null;
            const child = formItem.params.k[Number(suffix)];
            return child ? renderItemTree(child) : null;
          },
        }),
      }}
      renderCard={(view) => (
        <div style={{ background: "#f5f5f5", borderRadius: 4 }}>{view}</div>
      )}
    />
  );
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

export const FormTest = () => {
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
    (item: SomeFormItem<TypeNames, Params>) =>
      renderItem(
        item,
        variants,
        form.values,
        ctx,
        onValueChange,
        renderItemTree,
      ),
    [variants, form.values, ctx, onValueChange],
  );

  return (
    <div
      style={{ display: "flex", flexDirection: "column", gap: 16, padding: 16 }}
    >
      <h2 style={{ margin: 0 }}>Form test</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {form.items.map((item) => (
          <div key={item.id}>{renderItemTree(item)}</div>
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
