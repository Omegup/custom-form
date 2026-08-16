import type { ReactNode } from "react";
import {
  FieldRow,
  FormContainer,
  NestedSlot,
  SectionColumn,
  SectionPanel,
  SectionsList,
} from "../../form-edit/demo/editFormDemoHelper";
import sectionViewDemoSource from "./SectionViewDemo.tsx?raw";
import sectionViewDemoTypesSource from "./sectionViewDemoTypes.t.ts?raw";
import * as types from "./sectionViewDemoTypes.t";
import * as lib from "./library";

export { FormContainer, SectionsList };

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

// ── Viewers — labels only; nested columns are placed by `renderCard` ──

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
    viewer: ({ props: { formItem } }) => <span>{formItem.params.name}</span>,
  },
  panel: {
    viewer: ({ props: { formItem } }) => (
      <span style={{ fontWeight: 600 }}>{formItem.params.name}</span>
    ),
    /** One slot — `ColumnsEdit` already built the full column flex into `getChild`. */
    repeatChildren: () => [""],
  },
};

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
) => {
  const { extra, ctx, formItem } = viewProps;
  return (
    <div>
      <FieldRow
        name={view}
        focused={ctx.autoFocused(formItem.id)}
        actions={extra.actions}
        extra={[]}
        parentDeleted={extra.parentDeleted}
      />
      {extra.children.length > 0 && <NestedSlot>{extra.children}</NestedSlot>}
    </div>
  );
};

// ── ColumnsEdit chrome — same `SectionPanel` / `SectionColumn` as form-edit.
// Does not read autofocus; that stays with the caller that owns `ctx`.

export const columnsChrome: lib.ColumnsEditChrome = {
  renderColumn: ({ children }) => <SectionColumn>{children}</SectionColumn>,
  renderSection: ({ title, actions, columns }) => (
    <SectionPanel
      title={title}
      focused={null}
      sectionActions={actions}
      sectionExtra={[]}
      columns={columns}
    />
  ),
};

// ── Per-item extra: move actions, keyed by id ─────────────────────────────────

export const buildItemExtraMap = (
  sections: lib.SectionWithItems<
    types.TypeNames,
    types.Params,
    types.Section,
    lib.SectionMetaDom<lib.Indexed>,
    types.ItemMeta
  >[],
  itemActions: (item: types.ListItem) => lib.MoveActions,
): Map<string, types.ItemExtra> => {
  const map = new Map<string, types.ItemExtra>();
  const walk = (columns: types.ListItem[][]) => {
    for (const column of columns) {
      for (const item of column) {
        map.set(
          item.header.id,
          lib.branded<types.ItemExtra, "viewer-extra">({
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
