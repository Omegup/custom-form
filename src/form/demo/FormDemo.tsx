import { useCallback } from "react";
import * as demo from "./formDemoHelper";
import * as types from "./formDemoTypes.t";
import { branded, createFormItemByGetChild } from "./library";

const viewers: types.Viewers = {
  text: {
    viewer: ({ props: { formItem, ctx, variant, extra } }) => {
      const { params, id } = formItem;
      const { showLabel, label, template } = params;
      const { value, onChange } = extra;
      return (
        <demo.Label variant={variant} border={ctx.accent}>
          {showLabel ? demo.applyTemplate(label, template, id) : null}
          <input value={value} onChange={(e) => onChange(e.target.value)} />
        </demo.Label>
      );
    },
  },
  group: {
    viewer: ({ props: { formItem, ctx, variant, extra } }) => {
      const { params } = formItem;
      const { title } = params;
      return (
        <demo.Group variant={variant} border={ctx.accent} title={title}>
          {extra.children}
        </demo.Group>
      );
    },
    repeatChildren: (g, { value: ids }) =>
      (g.params.name ? [""] : []).concat(ids?.split(",") ?? []),
  },
};

const FormItem = createFormItemByGetChild(viewers, (x) => x);

export const FormDemo = () => {
  const { ctx, variants, values, items, updateArgs } = demo.useStoryArgs();

  const onValueChange = useCallback(
    (id: string, value: string) => {
      updateArgs({ values: { ...values, [id]: value } });
    },
    [updateArgs, values],
  );

  const renderItem = (
    item: types.Item,
    suffix: string,
  ): React.ReactNode => {
    if (item.deleted) return null;

    return (
      <FormItem
        viewProps={{
          formItem: { ...item, id: item.id + suffix },
          ctx,
          variant: variants[item.type],
          extra: branded({
            value: values[item.id + suffix] ?? "",
            onChange: (value: string) =>
              onValueChange(item.id + suffix, value),
            getChild: (childSuffix: string, index: number) => {
              if (item.type !== "group") return null;
              if (index === 0 && item.params.name)
                return renderItem(item.params.name, suffix);
              return renderItem(item.params.item, `${suffix}:${childSuffix}`);
            },
          }),
        }}
        renderCard={(view) => <demo.Card>{view}</demo.Card>}
      />
    );

  };

  return (
    <demo.FormContainer>
      {items.map((item) => (
        <div key={item.id}>{renderItem(item, "")}</div>
      ))}
    </demo.FormContainer>
  );
};
