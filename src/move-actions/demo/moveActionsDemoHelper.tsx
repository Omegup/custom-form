export type { StoryArgs } from "./moveActionsDemoTypes.t";
import type { MoveActions } from "../MoveActions.t";
import {
  withFileHeader,
  DeletedModeBar,
  MoveActionsPage,
  MoveItemRow,
} from "../../demo-utils";
import moveActionsDemoSource from "./MoveActionsDemo.tsx?raw";
import type { Ctx, Data, Item } from "./moveActionsDemoTypes.t";
import moveActionsDemoTypesSource from "./moveActionsDemoTypes.t.ts?raw";

import { autofocusCtx, type AutoFocusState } from "./library";

export const DEFAULT_MOVE_ACTIONS_DEMO: Data = {
  items: [{ del: false, name: "Item 1" }],
};

export const MULTIPLE_ITEMS_DEMO: Data = {
  items: ["Alpha", "Beta", "Gamma"].map((name) => ({ del: false, name })),
};


export const MOVE_ACTIONS_DEMO_SOURCE = [
  withFileHeader("moveActionsDemoTypes.t.ts", moveActionsDemoTypesSource),
  "",
  withFileHeader("MoveActionsDemo.tsx", moveActionsDemoSource),
].join("\n");

export const makeCtx = (
  autofocus: AutoFocusState,
  deleted: Ctx["deleted"],
): Ctx => autofocusCtx<Pick<Ctx, "deleted">>({ deleted }, autofocus);

export const ItemRow = ({
  item,
  actions,
  ctx,
}: {
  item: Item;
  actions: MoveActions;
  ctx: Ctx;
}) => (
  <MoveItemRow
    name={item.name}
    struck={item.del}
    focused={ctx.autoFocused(item.name)}
    actions={actions}
  />
);

export const ListContainer = ({ children }: { children: React.ReactNode }) => (
  <MoveActionsPage>{children}</MoveActionsPage>
);

export const DeletedButtons = ({
  deleted,
  setDeleted,
}: {
  deleted: Ctx["deleted"];
  setDeleted: (deleted: Ctx["deleted"]) => void;
}) => <DeletedModeBar mode={deleted} onChange={setDeleted} />;
