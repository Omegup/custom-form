import type { ReactNode } from "react";
import { FieldLabel, PanelLabel } from "../../demo-utils";
import {
  FormContainer,
  SectionColumn,
  SectionPanel,
  SectionsList,
  renderListCard,
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
    viewer: ({ props: { formItem } }) => (
      <FieldLabel name={formItem.params.name} />
    ),
  },
  panel: {
    viewer: ({ props: { formItem } }) => (
      <PanelLabel name={formItem.params.name} />
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
  return renderListCard(view, {
    focused: ctx.autoFocused(formItem.id),
    actions: extra.actions,
    parentDeleted: extra.parentDeleted,
    nested: extra.children.length > 0 ? extra.children : null,
    extra: [],
  });
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
      headerExtra={null}
      columns={columns}
    />
  ),
};

export const emptyItemExtra = (): types.ItemExtra =>
  lib.branded<types.ItemExtra, "viewer-extra">({
    actions: {
      up: null,
      down: null,
      clone: null,
      remove: null,
      restore: null,
      isDeleted: false,
    },
  });
