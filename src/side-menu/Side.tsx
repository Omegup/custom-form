/**
 * Library sidebar — school form-edit-ui `Side` on plain elements
 * (no theme / i18n / icon set here).
 */
import type { ParamsDom, SectionDom } from "./_deps";
import { FormMenuItem } from "./FormMenuItem";
import type { NewFormItem } from "./createBlankFormItem";
import type { MenuItemDefinition } from "./MenuItemDefinition.t";
import { useSide, type NewSection } from "./useSide";

export const Side = <
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
  SectionConfig extends SectionDom,
>({
  title = "Library",
  addSectionLabel = "+ Add section",
  menuItems,
  setAddFormItem,
  setAddSection,
  blankSection,
  random,
}: {
  title?: string;
  addSectionLabel?: string;
  menuItems: MenuItemDefinition<TypeNames, Params>[];
  setAddFormItem: (item: NewFormItem<TypeNames, Params>) => void;
  setAddSection: (section: NewSection<TypeNames, Params, SectionConfig>) => void;
  blankSection: (id: string) => SectionConfig;
  random: () => string;
}) => {
  const { search, setSearch, addSection, renderMenuItems } = useSide({
    menuItems,
    setAddFormItem,
    setAddSection,
    blankSection,
    random,
  });

  return (
    <nav
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 10,
        padding: 14,
        border: "1px solid #ddd",
        borderRadius: 6,
        width: 220,
        alignSelf: "flex-start",
        boxSizing: "border-box",
      }}
    >
      <strong style={{ fontSize: 13 }}>{title}</strong>
      <input
        type="search"
        placeholder="Search…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ padding: "4px 8px", fontSize: 13 }}
      />
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {renderMenuItems(({ key, item, onClick, random }) => (
          <FormMenuItem key={key} item={item} onClick={onClick} random={random} />
        ))}
      </div>
      <button type="button" onClick={addSection} style={{ fontSize: 13 }}>
        {addSectionLabel}
      </button>
    </nav>
  );
};
