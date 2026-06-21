/**
 * Demo: EditFormTest + add-item library sidebar.
 * Wires useSide → insertFlatFormItem / appendFlatSection.
 */
import type { TheParams } from "../form/form.t";
import type { MetaDom } from "../recursive-form";
import type { SectionMetaDom } from "../form-edit";
import { appendFlatSection, insertFlatFormItem } from "./_deps";
import {
  container,
  EditFormTest,
  type EditFormSection,
  type EditFormSideArgs,
} from "../form-edit/EditFormHost";
import { useSide } from "./useSide";
import type { MenuItemDefinition } from "./MenuItemDefinition.t";

// ── Domain types (aligned with EditFormHost) ─────────────────────────────────

type TypeNames = "field";
type Params = TheParams<{ field: { name: string } }>;
type Section = EditFormSection;
type SectionMeta = SectionMetaDom<{ index: number; total: number }>;
type ItemMeta = MetaDom<{ index: number; sIndex: number }>;

const MENU_ITEMS: MenuItemDefinition<TypeNames, Params>[] = [
  {
    icon: "📝",
    title: "Text field",
    header: { type: "field", params: { name: "New field" } },
  },
  {
    icon: "📎",
    title: "Attachment field",
    header: { type: "field", params: { name: "Attachment" } },
  },
  {
    icon: "✉️",
    title: "Email field",
    header: { type: "field", params: { name: "Email" } },
  },
];

const randomId = () => `id_${Math.random().toString(36).slice(2, 7)}`;

export type SideMenuPlaygroundProps = {
  heading: string;
  sidebarWidth: number;
  libraryTitle: string;
};

// ── Side panel ────────────────────────────────────────────────────────────────

const EditFormSidePanel = ({
  setFlatItems,
  focus,
  libraryTitle,
  sidebarWidth,
}: EditFormSideArgs & Pick<SideMenuPlaygroundProps, "libraryTitle" | "sidebarWidth">) => {
  const {
    search,
    setSearch,
    renderMenuItems,
    addSection: onAddSection,
  } = useSide<TypeNames, Params, Section, SectionMeta, ItemMeta>({
    menuItems: MENU_ITEMS,
    setAddFormItem: (item) => {
      setFlatItems((prev) => insertFlatFormItem(prev, item));
      focus(item.header.id);
    },
    setAddSection: (section) => {
      setFlatItems((prev) => appendFlatSection(prev, section.header));
      focus(section.header.id);
    },
    random: randomId,
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
        width: sidebarWidth,
        flexShrink: 0,
        padding: 16,
        border: "1px solid #ddd",
        borderRadius: 8,
        background: "#fafafa",
      }}
    >
      <strong style={{ fontSize: 13 }}>{libraryTitle}</strong>
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
            onClick={() =>
              onClick({
                header: { ...item.header, id: random(), deleted: false },
                meta: { index: -1, sIndex: -1 },
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
        onClick={onAddSection}
        style={{ padding: "8px 10px", borderRadius: 4, fontSize: 13 }}
      >
        + Add section
      </button>
    </div>
  );
};

// ── Test UI ───────────────────────────────────────────────────────────────────

export const SideMenuPlayground = ({
  heading,
  sidebarWidth,
  libraryTitle,
}: SideMenuPlaygroundProps) =>
  container(
    heading,
    <EditFormTest
      renderLayout={({
        sections,
        alert,
        details,
        setFlatItems,
        setFocused,
      }) => (
        <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
          <EditFormSidePanel
            setFlatItems={setFlatItems}
            focus={(id) => setFocused({ id, focused: true })}
            libraryTitle={libraryTitle}
            sidebarWidth={sidebarWidth}
          />

          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              gap: 16,
            }}
          >
            {alert}
            {sections}
            {details}
          </div>
        </div>
      )}
    />,
  );
