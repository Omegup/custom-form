import type { EditFormSideArgs } from "../form-edit/EditFormHost";
import { appendFlatSection, insertFlatFormItem } from "../side-menu";
import type { SectionMetaDom } from "../form-edit";
import { useSide } from "../side-menu";
import { EDIT_FORM_MENU_ITEMS, editFormRandomId } from "../form-edit/fixtures";
import type { EditFormItemMeta, EditFormFieldParams, EditFormSection, EditFormFieldTypeNames } from "../form-edit/fixtures";

type SectionMeta = SectionMetaDom<{ index: number; total: number }>;

export const AllInSidePanel = ({
  setFlatItems,
  focus,
  onAddItem,
}: EditFormSideArgs & {
  onAddItem?: (item: import("../recursive-form").RecursiveFormItem<
    EditFormFieldTypeNames,
    EditFormFieldParams,
    EditFormItemMeta
  >) => void;
}) => {
  const { search, setSearch, renderMenuItems, addSection: onAddSection } = useSide<
    EditFormFieldTypeNames,
    EditFormFieldParams,
    EditFormSection,
    SectionMeta,
    EditFormItemMeta
  >({
    menuItems: EDIT_FORM_MENU_ITEMS,
    setAddFormItem: (item) => {
      if (onAddItem) {
        onAddItem(item);
      } else {
        setFlatItems((prev) => insertFlatFormItem(prev, item));
        focus(item.header.id);
      }
    },
    setAddSection: (section) => {
      setFlatItems((prev) => appendFlatSection(prev, section.header));
      focus(section.header.id);
    },
    random: editFormRandomId,
    makeSection: (id) => ({
      meta: { index: -1, total: 1 },
      header: { id, title: "New section", description: "", deleted: false },
      items: [[]],
    }),
  });

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 12,
        width: 240,
        flexShrink: 0,
        padding: 16,
        border: "1px solid #ddd",
        borderRadius: 8,
        background: "#fafafa",
      }}
    >
      <strong style={{ fontSize: 13 }}>Library</strong>
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search items…"
        style={{
          padding: "6px 8px",
          borderRadius: 4,
          border: "1px solid #ccc",
          fontSize: 13,
        }}
      />
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {renderMenuItems(({ key, item, onClick, random }) => (
          <button
            key={`${key}-${item.title}`}
            type="button"
            onClick={() =>
              onClick({
                header: { ...item.header, id: random(), deleted: false },
                meta: { index: -1, total: 0, sIndex: -1 },
                children: Array.from({ length: item.n ?? 0 }, () => []),
              })
            }
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "8px 10px",
              borderRadius: 4,
              border: "1px solid #eee",
              background: "white",
              cursor: "pointer",
              textAlign: "left",
            }}
          >
            <span>{item.icon}</span>
            <span style={{ fontSize: 13 }}>{item.title}</span>
          </button>
        ))}
      </div>
      <button
        type="button"
        onClick={onAddSection}
        style={{ padding: "8px 10px", borderRadius: 4, fontSize: 13 }}
      >
        + Add section
      </button>
    </div>
  );
};
