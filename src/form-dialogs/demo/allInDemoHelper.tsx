import type { ReactNode } from "react";
import { FieldRow } from "../../form-edit/demo/editFormDemoHelper";
import allInEditorSource from "./AllInEditor.tsx?raw";
import allInDemoTypesSource from "./allInDemoTypes.t.ts?raw";
import type * as types from "./allInDemoTypes.t";
import * as lib from "./library";

const withFileHeader = (path: string, source: string) =>
  `// ── ${path} ──\n${source.trimEnd()}`;

export const ALL_IN_DEMO_SOURCE = [
  withFileHeader("allInDemoTypes.t.ts", allInDemoTypesSource),
  "",
  withFileHeader("AllInEditor.tsx", allInEditorSource),
].join("\n");

type CardExtra = types.ListExtra & lib.EditExtra & lib.Children;

/** List viewers — labels only; nested columns are placed by `renderCard`. */
export const viewers: lib.Viewers<
  types.TypeNames,
  types.Params,
  types.Variants,
  CardExtra,
  types.ListExtra & lib.EditExtra,
  types.ListCtx,
  string
> = {
  field: {
    viewer: ({ props: { formItem } }) => (
      <span>
        {formItem.params.name}
        {formItem.params.required ? " *" : ""}
      </span>
    ),
  },
  heading: {
    viewer: ({ props: { formItem } }) => (
      <strong style={{ fontSize: 15 }}>{formItem.params.name}</strong>
    ),
  },
  panel: {
    viewer: ({ props: { formItem } }) => (
      <span style={{ fontWeight: 600 }}>{formItem.params.name}</span>
    ),
    /** One slot — column flex already built into `getChild` by the `renderEdit`. */
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

export const renderCard = (
  view: ReactNode,
  viewProps: lib.ViewerProps<
    types.Params,
    types.Variants,
    types.TypeNames,
    CardExtra,
    types.ListCtx
  >,
) => {
  const { extra, ctx, formItem, variant } = viewProps;
  return (
    <div style={variant.shell}>
      <FieldRow
        name={
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
            {view}
            {variant.badge}
          </span>
        }
        focused={ctx.autoFocused(formItem.id)}
        actions={extra.actions}
        extra={extra.parentDeleted ? [] : [{ label: "Edit", onClick: extra.onEdit }]}
        parentDeleted={extra.parentDeleted}
      />
      {extra.children.length > 0 && <NestedSlot>{extra.children}</NestedSlot>}
    </div>
  );
};

export const buildListExtraMap = (
  sections: types.ListSection[],
  itemActions: (item: types.ListItem) => lib.MoveActions,
  onEdit: (item: types.ListItem) => void,
): Map<string, types.ListExtra> => {
  const map = new Map<string, types.ListExtra>();
  const walk = (columns: types.ListItem[][]) => {
    for (const column of columns) {
      for (const item of column) {
        map.set(
          item.header.id,
          lib.branded<types.ListExtra, "viewer-extra">({
            actions: itemActions(item),
            onEdit: () => onEdit(item),
          }),
        );
        walk(item.children);
      }
    }
  };
  for (const section of sections) walk(section.items);
  return map;
};

export const emptyListExtra = (): types.ListExtra =>
  lib.branded<types.ListExtra, "viewer-extra">({
    actions: {
      up: null,
      down: null,
      clone: null,
      remove: null,
      restore: null,
      isDeleted: false,
    },
    onEdit: () => {},
  });
