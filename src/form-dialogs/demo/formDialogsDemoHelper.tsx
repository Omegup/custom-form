import type { ReactNode } from "react";
import { ItemCaption, VariantShell } from "../../demo-utils";
import { renderListCard } from "../../form-edit/demo/editFormDemoHelper";
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
    <VariantShell shell={variant.shell}>
      {renderListCard(
        <ItemCaption badge={variant.badge}>{view}</ItemCaption>,
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
    </VariantShell>
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
