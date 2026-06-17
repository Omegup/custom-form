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

type Params = TheParams<{
  text: { label: string };
  group: { title: string; count: number };
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

const TextViewer = ({
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
    <span style={{ fontSize: 12, opacity: 0.7 }}>{formItem.params.label}</span>
    <input value={value} onChange={(e) => onChange(e.target.value)} />
  </label>
);

const GroupViewer = ({
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
);

const viewers: Viewers<
  TypeNames,
  Params,
  Variants,
  WithChildren<ItemExtra>,
  Context,
  string
> = {
  text: { viewer: TextViewer },
  group: {
    viewer: GroupViewer,
    repeatChildren: (formItem) =>
      Array.from({ length: formItem.params.count }, (_, i) => String(i)),
  },
};

const FormItem = FormItemHOC(viewers, x=>x);

const TextField = ({
  formItem,
  ctx,
  variant,
  value,
  onChange,
}: {
  formItem: TypedFormItem<Params, "text">;
  ctx: Context;
  variant: Variants["text"];
  value: string;
  onChange: (value: string) => void;
}) => (
  <FormItem
    viewProps={{
      formItem,
      ctx,
      variant,
      extra: asExtra({ value, onChange, getChild: () => null }),
    }}
    renderCard={(view) => (
      <div style={{ background: "#f5f5f5", borderRadius: 4 }}>{view}</div>
    )}
  />
);

const GroupField = ({
  formItem,
  ctx,
  variant,
  childValues,
  onChildChange,
}: {
  formItem: TypedFormItem<Params, "group">;
  ctx: Context;
  variant: Variants["group"];
  childValues: string[];
  onChildChange: (index: number, value: string) => void;
}) => {
  const getChild = useCallback(
    (suffix: string) => {
      const index = Number(suffix);
      return (
        <TextField
          formItem={{
            id: `${formItem.id}-${suffix}`,
            type: "text",
            params: { label: `Item ${index + 1}` },
            deleted: false,
          }}
          ctx={ctx}
          variant="default"
          value={childValues[index] ?? ""}
          onChange={(value) => onChildChange(index, value)}
        />
      );
    },
    [childValues, ctx, formItem.id, onChildChange],
  );

  return (
    <FormItem
      viewProps={{
        formItem,
        ctx,
        variant,
        extra: asExtra({
          value: "",
          onChange: () => undefined,
          getChild,
        }),
      }}
      renderCard={(view) => (
        <div style={{ background: "#fafafa", borderRadius: 4 }}>{view}</div>
      )}
    />
  );
};

export const FormTest = () => {
  const [name, setName] = useState("Alice");
  const [items, setItems] = useState(["alpha", "beta", "gamma"]);

  const ctx = useMemo((): Context => ({ accent: "#4a90d9" }) as Context, []);

  const onChildChange = useCallback((index: number, value: string) => {
    setItems((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  }, []);

  const groupItem = useMemo(
    (): TypedFormItem<Params, "group"> => ({
      id: "group-1",
      type: "group",
      params: { title: "Tagged items", count: items.length },
      deleted: false,
    }),
    [items.length],
  );

  return (
    <div
      style={{ display: "flex", flexDirection: "column", gap: 16, padding: 16 }}
    >
      <h2 style={{ margin: 0 }}>Form test</h2>
      <TextField
        formItem={{
          id: "text-1",
          type: "text",
          params: { label: "Name" },
          deleted: false,
        }}
        ctx={ctx}
        variant="default"
        value={name}
        onChange={setName}
      />
      <GroupField
        formItem={groupItem}
        ctx={ctx}
        variant="bordered"
        childValues={items}
        onChildChange={onChildChange}
      />
      <pre
        style={{
          margin: 0,
          padding: 8,
          background: "#eee",
          borderRadius: 4,
          fontSize: 12,
        }}
      >
        {JSON.stringify({ name, items }, null, 2)}
      </pre>
    </div>
  );
};
