import type { ReactNode } from "react";
import { FieldRow, FormContainer } from "../../form-edit/demo/editFormDemoHelper";
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

type CardExtra = types.ItemExtra & lib.EditExtra & lib.Children;

// ── Viewers — labels/inputs only; nested columns are placed by `renderCard` ──

export const viewers: lib.Viewers<
  types.TypeNames,
  types.Params,
  types.Variants,
  CardExtra,
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
    viewer: ({ props: { extra } }) => (
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
    ),
    /** One slot — `ColumnsEdit` already built the full column flex into `getChild`. */
    repeatChildren: () => [""],
  },
};

const NestedSlot = ({ children }: { children: ReactNode }) => (
  <div
    style={{
      display: "flex",
      flexDirection: "row",
      gap: 6,
      marginLeft: 12,
      marginTop: 4,
      paddingLeft: 8,
      borderLeft: "2px solid #b8d4f0",
      minWidth: 0,
    }}
  >
    {children}
  </div>
);

// ── Item chrome (`renderCard` — school `HandledCard`) ─────────────────────────

export const renderCard = (
  view: ReactNode,
  viewProps: lib.ViewerProps<
    types.Params,
    types.Variants,
    types.TypeNames,
    CardExtra,
    types.Ctx
  >,
) => (
  <div>
    <FieldRow
      name={view}
      focused={null}
      actions={viewProps.extra.actions}
      extra={[]}
      parentDeleted={viewProps.extra.parentDeleted}
    />
    {viewProps.extra.children.length > 0 && (
      <NestedSlot>{viewProps.extra.children}</NestedSlot>
    )}
  </div>
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
