import type { ReactNode } from "react";
import { FieldRow, FormContainer } from "../../form-edit/demo/editFormDemoHelper";
import { NestedColumns } from "../../form-item-editor/demo/formItemEditorDemoHelper";
import sectionViewDemoSource from "./SectionViewDemo.tsx?raw";
import sectionViewDemoTypesSource from "./sectionViewDemoTypes.t.ts?raw";
import * as types from "./sectionViewDemoTypes.t";
import * as lib from "./library";

export { FormContainer };

// ── Storybook docs (`?raw` of types + integration) ────────────────────────────

const withFileHeader = (path: string, source: string) =>
  `// ── ${path} ──\n${source.trimEnd()}`;

export const SECTION_VIEW_DEMO_SOURCE = [
  withFileHeader("sectionViewDemoTypes.t.ts", sectionViewDemoTypesSource),
  "",
  withFileHeader("SectionViewDemo.tsx", sectionViewDemoSource),
].join("\n");

// ── Catalog (in-slot "+ Add") ──────────────────────────────────────────────────

export const randomId = () => `id_${Math.random().toString(36).slice(2, 7)}`;

export const MENU_ITEMS: lib.MenuItemDefinition<types.TypeNames, types.Params>[] = [
  { title: "Field", header: { type: "field", params: { name: "New field" } } },
  { title: "Panel", header: { type: "panel", params: { name: "New panel" } }, n: 2 },
];

// ── Viewers (name `viewers` + `createFormItemByGetChild`, same pattern as `form` demo) ──

export const viewers: lib.Viewers<
  types.TypeNames,
  types.Params,
  types.Variants,
  types.ItemExtra & lib.EditExtra & lib.Children,
  types.ItemExtra & lib.EditExtra,
  types.Ctx,
  string
> = {
  field: {
    viewer: ({ props: { extra } }) => (
      <input
        value={extra.value}
        onChange={(e) => extra.onChange(e.target.value)}
        style={{ padding: "4px 6px", border: "1px solid #ccc", borderRadius: 4 }}
      />
    ),
  },
  panel: {
    viewer: ({ props: { formItem, extra } }) => (
      <div>
        <input
          value={extra.value}
          onChange={(e) => extra.onChange(e.target.value)}
          style={{
            padding: "4px 6px",
            border: "1px solid #ccc",
            borderRadius: 4,
            fontWeight: 600,
          }}
        />
        <NestedColumns columns={extra.children} />
        <span style={{ fontSize: 11, opacity: 0.5 }}>{formItem.type}</span>
      </div>
    ),
    repeatChildren: () => [""],
  },
};

// ── Item chrome (`renderCard` — school `HandledCard`) ─────────────────────────

export const renderCard = (view: ReactNode, viewProps: {
  extra: types.ItemExtra & lib.EditExtra;
}) => (
  <FieldRow
    name={view}
    focused={null}
    actions={viewProps.extra.actions}
    extra={[]}
    parentDeleted={viewProps.extra.parentDeleted}
  />
);

// ── Per-item extra: live name binding + move actions, keyed by id ─────────────

export const buildItemExtraMap = (
  sections: lib.SectionWithItems<
    types.TypeNames,
    types.Params,
    types.Section,
    lib.SectionMetaDom<lib.Indexed>,
    types.ItemMeta
  >[],
  itemActions: (item: types.ListItem) => lib.MoveActions,
  onChange: (id: string, value: string) => void,
): Map<string, types.ItemExtra> => {
  const map = new Map<string, types.ItemExtra>();
  const walk = (columns: types.ListItem[][]) => {
    for (const column of columns) {
      for (const item of column) {
        map.set(
          item.header.id,
          lib.branded<types.ItemExtra, "viewer-extra">({
            value: item.header.params.name,
            onChange: (value) => onChange(item.header.id, value),
            actions: itemActions(item),
          }),
        );
        walk(item.children);
      }
    }
  };
  for (const section of sections) walk(section.items);
  return map;
};
