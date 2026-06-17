import { useCallback, useMemo, useState } from "react";
import { FormItemHOC } from "./FormItem";
import type {
  ContextDom,
  ExtraDom,
  TheParams,
  TypedFormItem,
  TheVariants,
} from "./form.model";
import type {
  GetChild,
  ViewerProps,
  Viewers,
  WithChildren,
} from "./form-react";

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

type FieldData = {
  id: string;
  type: TypeNames;
  variant: Variants[TypeNames];
  deleted: boolean;
  params: Params[TypeNames];
  value: string;
  childFields: FieldData[];
};

type ItemExtra = ExtraDom & {
  value: string;
  onChange: (value: string) => void;
  childFields: FieldData[];
};

type FormExtra = WithChildren<ItemExtra>;
type ViewExtra = FormExtra["view"];

const asExtra = <T extends object>(extra: T) => extra as T & ExtraDom;

const DEFAULT_FIELDS: FieldData[] = [
  {
    id: "text-1",
    type: "text",
    variant: "default",
    deleted: false,
    params: { label: "Name" },
    value: "Alice",
    childFields: [],
  },
  {
    id: "group-1",
    type: "group",
    variant: "bordered",
    deleted: false,
    params: { title: "Tagged items" },
    value: "",
    childFields: [
      {
        id: "text-2",
        type: "text",
        variant: "default",
        deleted: false,
        params: { label: "Item 1" },
        value: "alpha",
        childFields: [],
      },
      {
        id: "text-3",
        type: "text",
        variant: "default",
        deleted: false,
        params: { label: "Item 2" },
        value: "beta",
        childFields: [],
      },
      {
        id: "text-4",
        type: "text",
        variant: "default",
        deleted: false,
        params: { label: "Item 3" },
        value: "gamma",
        childFields: [],
      },
    ],
  },
];

const updateFieldValue = (
  fields: FieldData[],
  id: string,
  value: string,
): FieldData[] =>
  fields.map((field) => ({
    ...field,
    value: field.id === id ? value : field.value,
    childFields: updateFieldValue(field.childFields, id, value),
  }));

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
    repeatChildren: (_formItem, extra) =>
      extra.childFields.map((_, i) => String(i)),
  },
};

const FormItem = FormItemHOC(viewers, (x) => x);

const toFormItem = (field: FieldData): TypedFormItem<Params, TypeNames> => ({
  id: field.id,
  type: field.type,
  params: field.params,
  deleted: field.deleted,
});

const toViewExtra = (
  field: FieldData,
  onValueChange: (id: string, value: string) => void,
  renderFieldTree: (field: FieldData) => React.ReactNode,
): ItemExtra & GetChild =>
  asExtra({
    value: field.value,
    onChange: (value) => onValueChange(field.id, value),
    childFields: field.childFields,
    getChild: (suffix) => {
      const child = field.childFields[Number(suffix)];
      return child ? renderFieldTree(child) : null;
    },
  });

const renderField = (
  field: FieldData,
  ctx: Context,
  onValueChange: (id: string, value: string) => void,
  renderFieldTree: (field: FieldData) => React.ReactNode,
): React.ReactNode => {
  if (field.deleted) return null;

  return (
    <FormItem
      viewProps={{
        formItem: toFormItem(field),
        ctx,
        variant: field.variant,
        extra: toViewExtra(field, onValueChange, renderFieldTree),
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
        return JSON.stringify(updateFieldValue(parsed, id, value), null, 2);
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
