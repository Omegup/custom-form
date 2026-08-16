/** Demo chrome for the FlatDnd showcase — viewers + `renderCard` for
 * `SectionFormItemHOC` (same shape as the `section-view` demo); the DnD
 * engine lives in `drag-drop-tree`; this demo only wires it via `WebRecursiveEdit.tsx`. */
import type { ReactNode } from "react";
import { FieldRow, FormContainer, NestedSlot, SectionsList } from "../../form-edit/demo/editFormDemoHelper";
import flatDndDemoSource from "./FlatDndDemo.tsx?raw";
import flatDndDemoTypesSource from "./flatDndDemoTypes.t.ts?raw";
import webRecursiveEditSource from "./WebRecursiveEdit.tsx?raw";
import * as types from "./flatDndDemoTypes.t";
import * as lib from "./library";

export { FormContainer, SectionsList };

const withFileHeader = (path: string, source: string) =>
  `// ── ${path} ──\n${source.trimEnd()}`;

export const FLAT_DND_DEMO_SOURCE = [
  withFileHeader("flatDndDemoTypes.t.ts", flatDndDemoTypesSource),
  "",
  withFileHeader("WebRecursiveEdit.tsx", webRecursiveEditSource),
  "",
  withFileHeader("FlatDndDemo.tsx", flatDndDemoSource),
].join("\n");

export const randomId = () => `id_${Math.random().toString(36).slice(2, 7)}`;

export const MENU_ITEMS: lib.MenuItemDefinition<types.TypeNames, types.Params>[] = [
  { title: "Field", header: { type: "field", params: { name: "New field" } } },
  { title: "Panel", header: { type: "panel", params: { name: "New panel" } }, n: 2 },
];

type CardExtra = types.ItemExtra & lib.EditExtra & lib.Children;

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
    /** One slot — the DnD tree already builds the full column flex into `getChild`. */
    repeatChildren: () => [""],
  },
};

export const renderCard = (
  view: ReactNode,
  viewProps: lib.ViewerProps<types.Params, types.Variants, types.TypeNames, CardExtra, types.Ctx>,
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
