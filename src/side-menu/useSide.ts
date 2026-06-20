import type {
  MetaDom,
  ParamsDom,
  RecursiveFormItem,
  SectionDom,
  SectionMetaDom,
  SectionWithItems,
} from "./_deps";
import { useMemo, useState } from "./_deps";
import type { ReactNode } from "./_deps";
import type { MenuItemDefinition } from "./MenuItemDefinition.t";

const normalize = (str: string) =>
  str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

export const useSide = <
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
  SectionConfig extends SectionDom,
  SectionMeta extends SectionMetaDom,
  ItemMeta extends MetaDom,
>({
  menuItems,
  setAddFormItem,
  setAddSection,
  random,
  makeSection,
}: {
  menuItems: MenuItemDefinition<TypeNames, Params>[];
  setAddFormItem: (item: RecursiveFormItem<TypeNames, Params, ItemMeta>) => void;
  setAddSection: (
    section: SectionWithItems<
      TypeNames,
      Params,
      SectionConfig,
      SectionMeta,
      ItemMeta
    >,
  ) => void;
  random: () => string;
  makeSection: (
    id: string,
  ) => SectionWithItems<
    TypeNames,
    Params,
    SectionConfig,
    SectionMeta,
    ItemMeta
  >;
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
    renderMenuItems: (
      renderMenuItem: (args: {
        key: TypeNames;
        item: MenuItemDefinition<TypeNames, Params>;
        onClick: (item: RecursiveFormItem<TypeNames, Params, ItemMeta>) => void;
        random: () => string;
      }) => ReactNode,
    ) =>
      filtered.map((item) =>
        renderMenuItem({
          key: item.header.type,
          onClick: setAddFormItem,
          item,
          random,
        }),
      ),
    addSection: () => setAddSection(makeSection(random())),
  };
};
