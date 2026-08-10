/**
 * Library sidebar — school form-edit-ui `Side` logic (`useSide` + catalog).
 * Host owns nav/search/list chrome via `render` / `renderMenuItem`.
 */
import { Fragment, type ReactNode } from "react";
import type { ParamsDom, SectionDom } from "./_deps";
import type { NewFormItem } from "./createBlankFormItem";
import type { FormMenuItemRenderArgs } from "./FormMenuItem";
import { FormMenuItem } from "./FormMenuItem";
import type { MenuItemDefinition } from "./MenuItemDefinition.t";
import { useSide, type NewSection } from "./useSide";

export type SideRenderArgs = {
  title: string;
  search: string;
  setSearch: (value: string) => void;
  addSectionLabel: string;
  addSection: () => void;
  menu: ReactNode;
};

export const Side = <
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
  SectionConfig extends SectionDom,
>({
  title,
  addSectionLabel,
  menuItems,
  setAddFormItem,
  setAddSection,
  blankSection,
  random,
  render,
  renderMenuItem,
}: {
  title: string;
  addSectionLabel: string;
  menuItems: MenuItemDefinition<TypeNames, Params>[];
  setAddFormItem: (item: NewFormItem<TypeNames, Params>) => void;
  setAddSection: (section: NewSection<TypeNames, Params, SectionConfig>) => void;
  blankSection: (id: string) => SectionConfig;
  random: () => string;
  render: (args: SideRenderArgs) => ReactNode;
  renderMenuItem: (args: FormMenuItemRenderArgs) => ReactNode;
}) => {
  const { search, setSearch, addSection, renderMenuItems } = useSide({
    menuItems,
    setAddFormItem,
    setAddSection,
    blankSection,
    random,
  });

  return render({
    title,
    search,
    setSearch,
    addSectionLabel,
    addSection,
    menu: (
      <>
        {renderMenuItems(({ key, item, onClick, random: rand }) => (
          <Fragment key={key}>
            <FormMenuItem
              item={item}
              onClick={onClick}
              random={rand}
              render={renderMenuItem}
            />
          </Fragment>
        ))}
      </>
    ),
  });
};
