/**
 * Shared demo/test fixtures for the edit-form domain.
 * Used by module tests, Storybook all-in editor, and integration tests.
 */
import { branded } from "../form/branded";
import type { TheParams, TheVariants } from "../form";
import type { MetaDom } from "../recursive-form";
import type { MenuItemDefinition } from "../side-menu";
import { cloneFlatItems } from "./cloneFlatItems";
import type { Clone } from "./flat-raw-actions";
import type {
  EditFormCtx,
  EditFormFlatItems,
  EditFormSection,
} from "./EditFormHost";

export type EditFormFieldTypeNames = "field";
export type EditFormFieldParams = TheParams<{ field: { name: string } }>;
export type EditFormFieldVariants = TheVariants<{ field: "default" }>;
export type EditFormItemMeta = MetaDom<{
  index: number;
  total: number;
  sIndex: number;
}>;
export type EditFormBaseCtx = { focused: { id: string; focused: boolean } | null };

export type {
  EditFormSection,
  EditFormFlatItems,
  EditFormCtx,
} from "./EditFormHost";

export const EDIT_FORM_INITIAL: EditFormFlatItems = [
  { section: { id: "s1", deleted: false, title: "Personal", description: "Your info" } },
  {
    item: { id: "f1", type: "field", params: { name: "Name" }, deleted: false },
    n: 0,
  },
  { end: null },
  {
    item: { id: "f2", type: "field", params: { name: "Email" }, deleted: false },
    n: 0,
  },
  { section: { id: "s2", deleted: false, title: "Details", description: "More fields" } },
  {
    item: { id: "f3", type: "field", params: { name: "Notes" }, deleted: false },
    n: 0,
  },
];

export const EDIT_FORM_MENU_ITEMS: MenuItemDefinition<
  EditFormFieldTypeNames,
  EditFormFieldParams
>[] = [
  {
    icon: "📝",
    title: "Text field",
    header: { type: "field", params: { name: "New field" } },
  },
  {
    icon: "✉️",
    title: "Email field",
    header: { type: "field", params: { name: "Email" } },
  },
];

export const editFormRandomId = () => `id_${Math.random().toString(36).slice(2, 7)}`;

export const makeEditFormCtx = (
  focused: EditFormBaseCtx["focused"],
): EditFormCtx =>
  branded({
    focused,
    setAutoFocus: (id) =>
      makeEditFormCtx(id ? { id, focused: !focused?.focused } : null),
    autoFocused: (id) => (id === focused?.id ? focused.focused : null),
  });

export const editFormClone: Clone<
  EditFormFieldTypeNames,
  EditFormFieldParams,
  EditFormCtx,
  EditFormSection
> = (subItems, _, allItems) =>
  cloneFlatItems(
    subItems,
    allItems,
    (name, n) => `${name} (copy${n})`,
    editFormRandomId,
    { rename: "first" },
  );
