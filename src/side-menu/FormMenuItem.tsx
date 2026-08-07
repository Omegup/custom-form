/**
 * Catalog row — school section-edit-ui `FormMenuItem` on plain buttons.
 * Click emits a blank item; the consumer wraps it in an insert session.
 */
import type { ParamsDom } from "./_deps";
import { createBlankFormItem, type NewFormItem } from "./createBlankFormItem";
import type { MenuItemDefinition } from "./MenuItemDefinition.t";

export const FormMenuItem = <
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
>({
  item,
  onClick,
  random,
}: {
  item: MenuItemDefinition<TypeNames, Params>;
  onClick: (item: NewFormItem<TypeNames, Params>) => void;
  random: () => string;
}) => (
  <button
    type="button"
    onClick={() => onClick(createBlankFormItem(item, random))}
    style={{
      display: "flex",
      alignItems: "center",
      gap: 8,
      padding: "6px 10px",
      fontSize: 13,
      textAlign: "left",
      background: "white",
      border: "1px solid #eee",
      borderRadius: 4,
      cursor: "pointer",
    }}
  >
    {item.icon}
    {item.title}
  </button>
);
