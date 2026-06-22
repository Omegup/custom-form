import { useCallback, useMemo } from "react";
import * as demo from "./recursiveFormDemoHelper";
import type {
  Context,
  Item,
  ItemRender,
  RecursiveFormDemoProps,
  RenderItem,
  ValueExtra,
  Variants,
  Viewers,
} from "./recursiveFormDemoTypes.t";
import { branded, createFormItemByGetChild } from "./library";

const viewersValues: Viewers<ValueExtra> = demo.makeViewers({
  text: {
    viewer: ({ props: { extra } }) => (
      <input
        value={extra.value}
        onChange={(e) => extra.onChange(e.target.value)}
      />
    ),
  },
  group: {
    viewer: () => null,
    repeatChildren: (_, { value: ids }) => ids?.split(",") ?? [],
  },
});

const viewersSkeleton: Viewers = demo.makeViewers({
  text: {
    viewer: ({ props: { formItem } }) => (
      <input value={formItem.params.label} disabled />
    ),
  },
  group: {
    viewer: () => null,
    repeatChildren: () => [""],
  },
});

const FormItemValues = createFormItemByGetChild(viewersValues, (x) => x);
const FormItemSkeleton = createFormItemByGetChild(viewersSkeleton, (x) => x);

const renderItem: RenderItem = (formItem, variants, ctx, FormItem, extra) => {
  if (formItem.header.deleted) return null;

  const render: ItemRender = (item, suffix) => (
    <FormItem
      key={item.header.id}
      viewProps={{
        formItem: item.header,
        ctx,
        variant: variants[item.header.type],
        extra: extra(item, render, suffix),
      }}
      renderCard={(view) => <demo.Card>{view}</demo.Card>}
    />
  );

  return render(formItem, "");
};

export const RecursiveFormDemo = ({
  accent,
  textVariant,
  groupVariant,
  values,
  items,
  updateArgs,
}: RecursiveFormDemoProps) => {
  const variants = useMemo(
    (): Variants => branded({ text: textVariant, group: groupVariant }),
    [textVariant, groupVariant],
  );
  const ctx = useMemo((): Context => branded({ accent }), [accent]);

  const onValueChange = useCallback(
    (id: string, value: string) => {
      updateArgs({ values: { ...values, [id]: value } });
    },
    [updateArgs, values],
  );

  const renderValues = (item: Item) =>
    renderItem<ValueExtra>(item, variants, ctx, FormItemValues, (formItem, render, suffix) =>
      branded({
        value: values[formItem.header.id + suffix] ?? "",
        onChange: (value) => onValueChange(formItem.header.id, value),
        getChild: (childSuffix) => (
          <demo.ChildSlots
            slots={formItem.children.map((slot) =>
              slot.map((child) => render(child, `${suffix}:${childSuffix}`)),
            )}
          />
        ),
      }),
    );

  const renderSkeleton = useCallback(
    (item: Item) =>
      renderItem(item, variants, ctx, FormItemSkeleton, (formItem, render) =>
        branded({
          getChild: () => (
            <demo.ChildSlots
              slots={formItem.children.map((slot) =>
                slot.map((child) => render(child, "")),
              )}
            />
          ),
        }),
      ),
    [variants, ctx],
  );

  return (
    <demo.FormContainer title="Recursive form">
      <demo.Section title="Skeleton">
        {items.map((item) => (
          <div key={item.header.id}>{renderSkeleton(item)}</div>
        ))}
      </demo.Section>
      <demo.Section title="Values">
        {items.map((item) => (
          <div key={item.header.id}>{renderValues(item)}</div>
        ))}
      </demo.Section>
    </demo.FormContainer>
  );
};
