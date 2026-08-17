import type { ReactNode } from "react";
import { FieldRow, NestedSlot } from "../../demo-utils";
import * as lib from "./library";
import * as types from "./editFormDemoTypes.t";
import editFormDemoSource from "./EditFormDemo.tsx?raw";
import editFormDemoTypesSource from "./editFormDemoTypes.t.ts?raw";

export {
  FieldRow,
  NestedSlot,
  SectionColumn,
  SectionPanel,
  SectionsList,
  MoveBar,
} from "../../demo-utils";
export { DemoPage as FormContainer } from "../../demo-utils";

// ── Storybook docs (`?raw` of types + integration) ────────────────────────────

const withFileHeader = (path: string, source: string) =>
  `// ── ${path} ──\n${source.trimEnd()}`;

export const EDIT_FORM_DEMO_SOURCE = [
  withFileHeader("editFormDemoTypes.t.ts", editFormDemoTypesSource),
  "",
  withFileHeader("EditFormDemo.tsx", editFormDemoSource),
].join("\n");

export const pendingRemoveCopy = <Item, Section extends { title: string }>(
  target: { item: Item } | { section: Section } | { end: null },
  itemName: (item: Item) => ReactNode,
): ReactNode => {
  if ("item" in target)
    return (
      <>
        Item <strong>{itemName(target.item)}</strong> will be removed.
      </>
    );
  if ("section" in target)
    return (
      <>
        Section <strong>{target.section.title}</strong> will be removed.
      </>
    );
  return null;
};

/** `FieldRow` + nested-panel slot — shared `renderCard` body for list demos. */
export const renderListCard = (
  view: ReactNode,
  args: {
    focused: boolean | null;
    actions: lib.MoveActions;
    parentDeleted: boolean;
    nested: ReactNode | null;
    extra: types.ExtraAction[];
  },
) => (
  <div>
    <FieldRow
      name={view}
      focused={args.focused}
      actions={args.actions}
      extra={args.extra}
      parentDeleted={args.parentDeleted}
    />
    {args.nested != null ? <NestedSlot>{args.nested}</NestedSlot> : null}
  </div>
);
