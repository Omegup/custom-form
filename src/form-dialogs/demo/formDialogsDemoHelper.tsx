import type { ReactNode } from "react";
import { RequiredMark } from "../../demo-utils";
import {
  FieldLabel,
  HeadingLabel,
  PanelLabel,
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
