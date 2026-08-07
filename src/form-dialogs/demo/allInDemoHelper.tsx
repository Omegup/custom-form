/**
 * All-in list chrome — viewers + `renderCard` for `SectionFormItemHOC`.
 * Display-only rows (no inline edit); Edit opens a dialog via `ListExtra.onEdit`.
 */
import type { ReactNode } from "react";
import { FieldRow } from "../../form-edit/demo/editFormDemoHelper";
import { NestedColumns } from "../../form-item-editor/demo/formItemEditorDemoHelper";
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

/** List viewers — labels only; nested panel columns come from `ColumnsEdit`. */
export const viewers: lib.Viewers<
  types.TypeNames,
  types.Params,
  types.Variants,
  types.ListExtra & lib.EditExtra & lib.Children,
  types.ListExtra & lib.EditExtra,
  types.ListCtx,
  string
> = {
  field: {
    viewer: ({ props: { formItem } }) => <span>{formItem.params.name}</span>,
  },
  heading: {
    viewer: ({ props: { formItem } }) => (
      <strong style={{ fontSize: 15 }}>{formItem.params.name}</strong>
    ),
  },
  panel: {
    viewer: ({ props: { formItem, extra } }) => (
      <div>
        <span style={{ fontWeight: 600 }}>{formItem.params.name}</span>
        <NestedColumns columns={extra.children} />
        <span style={{ fontSize: 11, opacity: 0.5 }}>{formItem.type}</span>
      </div>
    ),
    repeatChildren: () => [""],
  },
};

export const renderCard = (
  view: ReactNode,
  viewProps: lib.ViewerProps<
    types.Params,
    types.Variants,
    types.TypeNames,
    types.ListExtra & lib.EditExtra,
    types.ListCtx
  >,
) => (
  <FieldRow
    name={view}
    focused={viewProps.ctx.autoFocused(viewProps.formItem.id)}
    actions={viewProps.extra.actions}
    extra={
      viewProps.extra.parentDeleted
        ? []
        : [{ label: "Edit", onClick: viewProps.extra.onEdit }]
    }
    parentDeleted={viewProps.extra.parentDeleted}
  />
);

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
