import type { ReactNode } from "react";
import {
  FieldLabel,
  HeadingLabel,
  PanelLabel,
  RequiredMark,
  renderListCard,
} from "../../form-edit/demo/editFormDemoHelper";
import formDialogsDemoSource from "./FormDialogsDemo.tsx?raw";
import formDialogsDemoTypesSource from "./formDialogsDemoTypes.t.ts?raw";
import type * as types from "./formDialogsDemoTypes.t";
import * as lib from "./library";

const withFileHeader = (path: string, source: string) =>
  `// ── ${path} ──\n${source.trimEnd()}`;

export const FORM_DIALOGS_DEMO_SOURCE = [
  withFileHeader("formDialogsDemoTypes.t.ts", formDialogsDemoTypesSource),
  "",
  withFileHeader("FormDialogsDemo.tsx", formDialogsDemoSource),
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
      <>
        <FieldLabel name={formItem.params.name} />
        <RequiredMark required={formItem.params.required} />
      </>
    ),
  },
  heading: {
    viewer: ({ props: { formItem } }) => (
      <HeadingLabel name={formItem.params.name} />
    ),
  },
  panel: {
    viewer: ({ props: { formItem } }) => (
      <PanelLabel name={formItem.params.name} />
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
    CardExtra,
    types.ListCtx
  >,
) => {
  const { extra, ctx, formItem, variant } = viewProps;
  return (
    <div style={variant.shell}>
      {renderListCard(
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
          {view}
          {variant.badge}
        </span>,
        {
          focused: ctx.autoFocused(formItem.id),
          actions: extra.actions,
          parentDeleted: extra.parentDeleted,
          nested: extra.children.length > 0 ? extra.children : null,
          extra: extra.parentDeleted
            ? []
            : [{ label: "Edit", onClick: extra.onEdit }],
        },
      )}
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
