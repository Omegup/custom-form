import type { MoveActions } from "../MoveActions.t";
import moveActionsDemoSource from "./MoveActionsDemo.tsx?raw";
import type { Ctx, Data, Item } from "./moveActionsDemoTypes.t";
import moveActionsDemoTypesSource from "./moveActionsDemoTypes.t.ts?raw";

import "./animation.css";
import { autofocusCtx, type AutoFocusState } from "./library";


// ── Fixtures ──────────────────────────────────────────────────────────────────

export const DEFAULT_MOVE_ACTIONS_DEMO: Data = {
  items: [{ del: false, name: "Item 1" }],
};

export const MULTIPLE_ITEMS_DEMO: Data = {
  items: ["Alpha", "Beta", "Gamma"].map((name) => ({ del: false, name })),
};

// ── Storybook docs (`?raw` of types + integration) ────────────────────────────

const withFileHeader = (path: string, source: string) =>
  `// ── ${path} ──\n${source.trimEnd()}`;

export const MOVE_ACTIONS_DEMO_SOURCE = [
  withFileHeader("moveActionsDemoTypes.t.ts", moveActionsDemoTypesSource),
  "",
  withFileHeader("MoveActionsDemo.tsx", moveActionsDemoSource),
].join("\n");

// ── Demo helpers ──────────────────────────────────────────────────────────────

export const makeCtx = (
  autofocus: AutoFocusState,
  deleted: Ctx["deleted"],
): Ctx => autofocusCtx<Pick<Ctx, "deleted">>({deleted}, autofocus);

const Button = ({
  onClick,
  children,
}: {
  onClick: (() => void) | null;
  children: React.ReactNode;
}) => (
  <button disabled={onClick === null} onClick={onClick ?? undefined}>
    {children}
  </button>
);

export const ActionButtons = ({
  actions: { clone, down, remove, up, restore, isDeleted },
}: {
  actions: MoveActions;
}) =>
  isDeleted && restore ? (
    <Button onClick={restore}>Undo</Button>
  ) : (
    <>
      <Button onClick={clone}>Clone</Button>
      <Button onClick={remove}>Remove</Button>
      <Button onClick={up}>Up</Button>
      <Button onClick={down}>Down</Button>
    </>
  );

export const ItemRow = ({
  item,
  actions,
  ctx,
}: {
  item: Item;
  actions: MoveActions;
  ctx: Ctx;
}) => {
  const focused = ctx.autoFocused(item.name);
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        gap: 10,
        animation:
          focused === null ? undefined : `pulse${focused ? 1 : 2} .2s 2`,
      }}
    >
      <span style={{ textDecoration: item.del ? "line-through" : "", flex: 1 }}>
        {item.name}
      </span>
      <ActionButtons actions={actions} />
    </div>
  );
};

export const ListContainer = ({ children }: { children: React.ReactNode }) => (
  <div
    style={{ display: "flex", flexDirection: "column", gap: 16, padding: 16 }}
  >
    <h2 style={{ margin: 0 }}>Move actions</h2>
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {children}
    </div>
  </div>
);

export const DeletedButtons = ({
  deleted,
  setDeleted,
}: {
  deleted: Ctx["deleted"];
  setDeleted: (deleted: Ctx["deleted"]) => void;
}) => (
  <div style={{ display: "flex", flexDirection: "row", gap: 8 }}>
    <button disabled={deleted === "show"} onClick={() => setDeleted("show")}>
      Show
    </button>
    <button disabled={deleted === "jump"} onClick={() => setDeleted("jump")}>
      Show but Jump
    </button>
    <button disabled={deleted === "hide"} onClick={() => setDeleted("hide")}>
      Hide
    </button>
  </div>
);
