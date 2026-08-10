/**
 * Catalog row — school section-edit-ui `FormMenuItem` logic only.
 * Click emits a blank item; the host owns the row chrome via `render`.
 */
import type { ReactNode } from "react";
import type { ParamsDom } from "./_deps";
import { createBlankFormItem, type NewFormItem } from "./createBlankFormItem";
import type { MenuItemDefinition } from "./MenuItemDefinition.t";

export type FormMenuItemRenderArgs = {
  title: string;
  icon?: ReactNode;
  onSelect: () => void;
};

export type FormMenuItemProps<
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
> = {
  item: MenuItemDefinition<TypeNames, Params>;
  onClick: (item: NewFormItem<TypeNames, Params>) => void;
  random: () => string;
  render: (args: FormMenuItemRenderArgs) => ReactNode;
};

export const FormMenuItem = <
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
>({
  item,
  onClick,
  random,
  render,
}: FormMenuItemProps<TypeNames, Params>) =>
  render({
    title: item.title,
    icon: item.icon,
    onSelect: () => onClick(createBlankFormItem(item, random)),
  });
