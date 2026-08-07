/**
 * Library sidebar state — port of school form-edit-react `useSide`.
 * Search filters the catalog (accent-insensitive); `addSection` emits a blank
 * one-column section with `index: -1` (append — `updateSectionInFlat`).
 */
import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import type {
  MetaDom,
  ParamsDom,
  RecursiveFormItem,
  SectionDom,
  SIndexed,
} from "./_deps";
import type { NewFormItem } from "./createBlankFormItem";
import type { MenuItemDefinition } from "./MenuItemDefinition.t";

/** New section without a flat span yet (`index: -1` → append). */
export type NewSection<
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
  SectionConfig extends SectionDom,
> = {
  header: SectionConfig;
  index: number;
  total: number;
  items: RecursiveFormItem<TypeNames, Params, MetaDom<SIndexed>>[][];
};

export type RenderMenuItem<
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
> = (args: {
  key: TypeNames;
  item: MenuItemDefinition<TypeNames, Params>;
  onClick: (item: NewFormItem<TypeNames, Params>) => void;
  random: () => string;
}) => ReactNode;

const normalize = (str: string) =>
  str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

export const useSide = <
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
  SectionConfig extends SectionDom,
>({
  menuItems,
  setAddFormItem,
  setAddSection,
  blankSection,
  random,
}: {
  menuItems: MenuItemDefinition<TypeNames, Params>[];
  setAddFormItem: (item: NewFormItem<TypeNames, Params>) => void;
  setAddSection: (section: NewSection<TypeNames, Params, SectionConfig>) => void;
  /** School hardcoded the `AppSection` blank; generic config needs a factory. */
  blankSection: (id: string) => SectionConfig;
  random: () => string;
}) => {
  const [search, setSearch] = useState("");
  const tokens = useMemo(() => normalize(search).split(/\s+/), [search]);

  const filtered = search
    ? menuItems.filter(({ title }) =>
        tokens.every((token) => normalize(title).includes(token)),
      )
    : menuItems;
  return {
    search,
    setSearch,
    renderMenuItems: (renderMenuItem: RenderMenuItem<TypeNames, Params>) =>
      filtered.map((item) =>
        renderMenuItem({
          key: item.header.type,
          onClick: setAddFormItem,
          item,
          random,
        }),
      ),
    addSection: () =>
      setAddSection({
        header: blankSection(random()),
        index: -1,
        total: 0,
        items: [[]],
      }),
  };
};
