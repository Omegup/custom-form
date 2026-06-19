import type {
  ContextDom,
  ParamsDom,
  SomeFormItem,
} from "../form/form.t";
import type { SetAutoFocus } from "../move-actions/autofocus.t";
import { cloneName } from "../move-actions/cloneName";
import type { MakeActions } from "../move-actions/makeActions";
import type { Clone, GetActionsArgs } from "./edit-form";
import type { FlattenFormItem, FlattenFormItems, SectionDom } from "./form-tree";

const cloneItemName = <T extends object>(
  items: T[],
  t: (name: string, n: string) => string,
) => {
  type V<K extends string> = T extends Record<K, unknown> ? T : never;
  const is = <K extends string>(k: K, x: T): x is V<K> => k in x;
  const getItems = <K extends string>(k: K): V<K>[K][] =>
    items.flatMap((x) => (is(k, x) ? [x[k]] : []));
  return <K extends string>(k: K, q: V<K>, name: (item: V<K>[K]) => string) =>
    cloneName<V<K>[K]>(q[k], getItems(k), name, t);
};

export const clone = <
  TypeNames extends string,
  Params extends ParamsDom<TypeNames, { name: string }>,
  SectionConfig extends SectionDom & { title: string },
>(
  formItems: FlattenFormItems<TypeNames, Params, SectionConfig>,
  t: (name: string, n: string) => string,
  random: () => string,
): FlattenFormItems<TypeNames, Params, SectionConfig> => {
  const clone = cloneItemName<
    FlattenFormItem<TypeNames, Params, SectionConfig>
  >(formItems, t);
  return formItems.map((q) =>
    "item" in q
      ? {
          item: {
            ...q.item,
            params: {
              ...q.item.params,
              name: clone("item", q, (x) => x.params.name),
            },
            id: random(),
          },
          n: q.n,
        }
      : "section" in q
        ? {
            section: {
              ...q.section,
              title: clone("section", q, (x) => x.title),
              id: random(),
            },
          }
        : q,
  );
};
export const getCommonActions = <
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
  Ctx extends ContextDom,
  SectionConfig extends SectionDom,
>(
  args: GetActionsArgs<TypeNames, Params, SetAutoFocus<Ctx>, SectionConfig>,
  clone: Clone<TypeNames, Params, SetAutoFocus<Ctx>, SectionConfig>,
) => {
  const { sectionOfItem, setItems, setToRemove, ctx, items } = args;
  const isDeleted = (item: SomeFormItem<TypeNames, Params>) =>
    item.deleted || sectionOfItem[item.id]?.deleted;

  const commonActions = (
    subItems: FlattenFormItems<TypeNames, Params, SectionConfig>,
    index: number,
    min?: number,
  ): MakeActions<
    FlattenFormItem<TypeNames, Params, SectionConfig>,
    SetAutoFocus<Ctx>
  > => {
    return {
      highlight: (x) => {
        const id =
          "item" in x ? x.item.id : "section" in x ? x.section.id : undefined;
        return { ctx: ctx.setAutoFocus(id), item: x };
      },
      clone: () => clone(subItems, ctx),
      index,
      ctx,
      min,
      total: subItems.length,
      items,
      setItems,
      isDeleted: (q) =>
        "section" in q
          ? q.section.deleted
          : "end" in q
            ? false
            : isDeleted(q.item),
      markAsDeleted: ({ ...item }, deleted) => {
        if ("section" in item) item.section = { ...item.section, deleted };
        else if ("item" in item) item.item = { ...item.item, deleted };
        return { ctx, item };
      },
      setToRemove: (rm) => () => setToRemove({ rm }),
    };
  };
  return { commonActions, isDeleted };
};
