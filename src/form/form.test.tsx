import { useCallback, useMemo, useState } from "react";
import { FormItemHOC } from "./FormItem";
import type {
  ContextDom,
  ExtraDom,
  TheParams,
  TypedFormItem,
  TheVariants,
} from "./form.model";
import type { ViewerProps, Viewers, WithChildren } from "./form-react";

type TypeNames = "text" | "group";

type TextFieldData = {
  id: string;
  type: "text";
  variant: "default" | "compact";
  deleted: boolean;
  params: { label: string };
  value: string;
};

type GroupFieldData = {
  id: string;
  type: "group";
  variant: "default" | "bordered";
  deleted: boolean;
  params: { title: string; children: TextFieldData[] };
};

type FieldData = TextFieldData | GroupFieldData;

type Params = TheParams<{
  text: { label: string };
  group: { title: string; children: TextFieldData[] };
}>;

type Variants = TheVariants<{
  text: "default" | "compact";
  group: "default" | "bordered";
}>;

type Context = ContextDom & { accent: string };

type ItemExtra = ExtraDom & {
  value: string;
  onChange: (value: string) => void;
  getChild: (suffix: string) => React.ReactNode;
};

type ItemViewExtra = ItemExtra & {
  children: Record<string, React.ReactNode>;
};

const asExtra = <T extends object>(extra: T) => extra as T & ExtraDom;

const DEFAULT_FIELDS: FieldData[] = [
  {
    id: "text-1",
    type: "text",
    variant: "default",
    deleted: false,
    params: { label: "Name" },
    value: "Alice",
  },
  {
    id: "group-1",
    type: "group",
    variant: "bordered",
    deleted: false,
    params: {
      title: "Tagged items",
      children: [
        {
          id: "text-2",
          type: "text",
          variant: "default",
          deleted: false,
          params: { label: "Item 1" },
          value: "alpha",
        },
        {
          id: "text-3",
          type: "text",
          variant: "default",
          deleted: false,
          params: { label: "Item 2" },
          value: "beta",
        },
        {
          id: "text-4",
          type: "text",
          variant: "default",
          deleted: false,
          params: { label: "Item 3" },
          value: "gamma",
        },
      ],
    },
  },
];

const updateFieldValue = (
  fields: TextFieldData[],
  id: string,
  value: string,
): TextFieldData[] =>
  fields.map((field) => (field.id === id ? { ...field, value } : field));

const updateFields = (
  fields: FieldData[],
  id: string,
  value: string,
): FieldData[] =>
  fields.map((field) => {
    if (field.id === id && field.type === "text") {
      return { ...field, value };
    }
    if (field.type === "group") {
      return {
        ...field,
        params: {
          ...field.params,
          children: updateFieldValue(field.params.children, id, value),
        },
      };
    }
    return field;
  });

const viewers: Viewers<
  TypeNames,
  Params,
  Variants,
  WithChildren<ItemExtra>,
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
      props: ViewerProps<Params, Variants, "text", ItemViewExtra, Context>;
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
      props: ViewerProps<Params, Variants, "group", ItemViewExtra, Context>;
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
    repeatChildren: (formItem) =>
      formItem.params.children.map((_, i) => String(i)),
  },
};

const FormItem = FormItemHOC(viewers, (x) => x);

const fieldChildren = (field: FieldData): FieldData[] | undefined =>
  (field.params as { children?: FieldData[] }).children;

const renderField = (
  field: FieldData,
  ctx: Context,
  onValueChange: (id: string, value: string) => void,
  renderFieldTree: (field: FieldData) => React.ReactNode,
): React.ReactNode => {
  if (field.deleted) return null;

  const type = field.type;

  return (
    <FormItem
      viewProps={{
        formItem: {
          id: field.id,
          type,
          params: field.params,
          deleted: field.deleted,
        } as TypedFormItem<Params, typeof type>,
        ctx,
        variant: field.variant,
        extra: asExtra({
          value: "value" in field ? field.value : "",
          onChange: (value) => onValueChange(field.id, value),
          getChild: (suffix) => {
            const child = fieldChildren(field)?.[Number(suffix)];
            return child ? renderFieldTree(child) : null;
          },
        }),
      }}
      renderCard={(view) => (
        <div style={{ background: "#f5f5f5", borderRadius: 4 }}>{view}</div>
      )}
    />
  );
};

const parseFields = (
  json: string,
): { fields: FieldData[]; error: string | null } => {
  try {
    return { fields: JSON.parse(json) as FieldData[], error: null };
  } catch (e) {
    return {
      fields: DEFAULT_FIELDS,
      error: e instanceof Error ? e.message : "Invalid JSON",
    };
  }
};

export const FormTest = () => {
  const [fieldsJson, setFieldsJson] = useState(
    () => JSON.stringify(DEFAULT_FIELDS, null, 2),
  );

  const { fields, error: parseError } = useMemo(
    () => parseFields(fieldsJson),
    [fieldsJson],
  );

  const ctx = useMemo((): Context => ({ accent: "#4a90d9" }) as Context, []);

  const onValueChange = useCallback((id: string, value: string) => {
    setFieldsJson((prev) => {
      try {
        const parsed = JSON.parse(prev) as FieldData[];
        return JSON.stringify(updateFields(parsed, id, value), null, 2);
      } catch {
        return prev;
      }
    });
  }, []);

  const renderFieldTree = useCallback(
    (field: FieldData) =>
      renderField(field, ctx, onValueChange, renderFieldTree),
    [ctx, onValueChange],
  );

  return (
    <div
      style={{ display: "flex", flexDirection: "column", gap: 16, padding: 16 }}
    >
      <h2 style={{ margin: 0 }}>Form test</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {fields.map((field) => (
          <div key={field.id}>{renderFieldTree(field)}</div>
        ))}
      </div>
      <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <span style={{ fontSize: 12, opacity: 0.7 }}>Field list (JSON)</span>
        <textarea
          value={fieldsJson}
          onChange={(e) => setFieldsJson(e.target.value)}
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
