import { useMemo } from "react";
import { createFormItemByGetChild, branded } from "./index";
import type { Viewers } from "./index";
import * as demo from "./formDemoHelper";

type FormDemoViewers = Viewers<
  demo.TypeNames,
  demo.Params,
  demo.Variants,
  demo.Extra,
  demo.Context,
  string
>;
const viewers: FormDemoViewers = {
  text: {
    viewer: ({
      props: {
        formItem,
        ctx,
        variant,
        extra: { value, onChange },
      },
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
            {demo.formDemoLabel(formItem)}
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

export const FormDemo = ({
  accent,
  variants,
  values,
  items,
  onValueChange,
}: demo.Props) => {
  const ctx = useMemo((): demo.Context => branded({ accent }), [accent]);
  const brandedVariants = useMemo(
    (): demo.Variants => branded(variants),
    [variants],
  );

  const rendered = useMemo(() => {
    const renderItem = (
      formItem: (typeof items)[number],
      suffix: string,
    ): React.ReactNode => {
      if (formItem.deleted) return null;

      const render = (item: (typeof items)[number], itemSuffix: string) => (
        <FormItem
          viewProps={{
            formItem: { ...item, id: item.id + itemSuffix },
            ctx,
            variant: brandedVariants[item.type],
            extra: demo.bindFormDemoExtra(
              item,
              itemSuffix,
              values,
              onValueChange,
              render,
            ),
          }}
          renderCard={view => <demo.Card>{view}</demo.Card>}
        />
      );

      return render(formItem, suffix);
    };

    return items.map((item) => <div key={item.id}>{renderItem(item, "")}</div>);
  }, [items, brandedVariants, values, ctx, onValueChange]);

  return (
    <div
      style={{ display: "flex", flexDirection: "column", gap: 16, padding: 16 }}
    >
      <h2 style={{ margin: 0 }}>Form</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {rendered}
      </div>
    </div>
  );
};
