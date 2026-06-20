import { useMemo, useState } from "react";
import type { ContextDom, SomeFormItem, TheParams } from "./_deps";
import type {
  GetActionsArgs,
  FlatFormItems,
  Clone,
} from "./flat-item-raw-actions";
import type { MoveActions } from "../move-actions/MoveActions.t";
import { cloneFlatItems } from "./cloneFlatItems";
import { consolidateSections } from "./consolidateSections";
import { getFormItemMoveActions } from "./section-actions";
import { getSectionMoveActions } from "./section-actions";
import type { AutoFocus } from "../move-actions/autofocus.t";
import { branded } from "../form/branded";

// ── Domain types ──────────────────────────────────────────────────────────────

type TypeNames = "field";
type Params = TheParams<{ field: { name: string } }>;
type Section = { id: string; deleted: boolean; title: string };

type BaseCtx = { focusedId: string | null };
type Ctx = AutoFocus<ContextDom & BaseCtx, unknown>;

// ── Context factory ───────────────────────────────────────────────────────────

const makeCtx = (focusedId: string | null): Ctx =>
  branded({
    focusedId,
    setAutoFocus: (id) => makeCtx(id ?? null),
    autoFocused: (id) => (id === focusedId ? true : null),
  });

// ── Initial flat data ─────────────────────────────────────────────────────────
//
// The flat format is the canonical edit representation used throughout this module.
// Each section is a { section } marker; each leaf item is { item, n: 0 }; items with
// children would have n > 0 followed by n × (children + { end: null }) entries.

const INITIAL: FlatFormItems<TypeNames, Params, Section> = [
  { section: { id: "s1", deleted: false, title: "Personal" } },
  {
    item: {
      id: "f1",
      type: "field",
      params: { name: "Name" },
      deleted: false,
    },
    n: 0,
  },
  {
    item: {
      id: "f2",
      type: "field",
      params: { name: "Email" },
      deleted: false,
    },
    n: 0,
  },
  { section: { id: "s2", deleted: false, title: "Details" } },
  {
    item: {
      id: "f3",
      type: "field",
      params: { name: "Notes" },
      deleted: false,
    },
    n: 0,
  },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

const buildSectionOfItem = (
  items: FlatFormItems<TypeNames, Params, Section>,
): Record<string, Section> => {
  const map: Record<string, Section> = {};
  let current: Section | undefined;
  for (const fi of items) {
    if ("section" in fi) current = fi.section;
    else if ("item" in fi && current) map[fi.item.id] = current;
  }
  return map;
};

const cloneFn: Clone<TypeNames, Params, unknown, Section> = (
  subItems,
  _,
  allItems,
) =>
  cloneFlatItems(
    subItems,
    allItems,
    (name, n) => `${name} (copy${n})`,
    () => `id_${Math.random().toString(36).slice(2, 7)}`,
    { rename: "first" },
  );

// ── UI pieces ─────────────────────────────────────────────────────────────────

const Btn = ({
  label,
  onClick,
}: {
  label: string;
  onClick: null | undefined | (() => void);
}) => (
  <button
    disabled={!onClick}
    onClick={onClick ?? undefined}
    style={{ padding: "2px 7px", fontSize: 11, opacity: onClick ? 1 : 0.3 }}
  >
    {label}
  </button>
);

const SectionBar = ({ a }: { a: MoveActions }) => (
  <span style={{ display: "inline-flex", gap: 3 }}>
    <Btn label="↑" onClick={a.up} />
    <Btn label="↓" onClick={a.down} />
    <Btn label="Clone" onClick={a.clone} />
    {a.isDeleted ? (
      <Btn label="Restore" onClick={a.restore} />
    ) : (
      <Btn label="Remove" onClick={a.remove} />
    )}
  </span>
);

const FieldBar = ({ a, edit }: { a: MoveActions; edit: () => void }) => (
  <span style={{ display: "inline-flex", gap: 3 }}>
    <Btn label="↑" onClick={a.up} />
    <Btn label="↓" onClick={a.down} />
    <Btn label="Clone" onClick={a.clone} />
    {a.isDeleted ? (
      <Btn label="Restore" onClick={a.restore} />
    ) : (
      <Btn label="Remove" onClick={a.remove} />
    )}
    <Btn label="Edit" onClick={edit} />
  </span>
);

// ── Main demo ─────────────────────────────────────────────────────────────────

export const EditFormTest = () => {
  const [flatItems, setFlatItems] = useState(INITIAL);
  const [focusedId, setFocusedId] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<SomeFormItem<
    TypeNames,
    Params
  > | null>(null);
  const [pendingRemove, setPendingRemove] = useState<(() => void) | null>(null);

  const ctx = useMemo(() => makeCtx(focusedId), [focusedId]);

  const applyItems = (newItems: typeof flatItems, newCtx: Ctx) => {
    setFlatItems(newItems);
    setFocusedId(newCtx.focusedId);
  };

  const sections = useMemo(() => consolidateSections(flatItems), [flatItems]);
  const sectionOfItem = useMemo(
    () => buildSectionOfItem(flatItems),
    [flatItems],
  );

  const actionsArgs: GetActionsArgs<TypeNames, Params, Ctx, Section> = {
    items: flatItems,
    setItems: applyItems,
    ctx,
    sectionOfItem,
    setToRemove: (x) => setPendingRemove(x ? x.rm : null),
  };

  const itemActions = getFormItemMoveActions(actionsArgs, cloneFn);

  return (
    <div
      style={{ display: "flex", flexDirection: "column", gap: 16, padding: 16 }}
    >
      <h2 style={{ margin: 0 }}>Recursive form</h2>

      {pendingRemove && (
        <div
          style={{
            display: "flex",
            gap: 8,
            alignItems: "center",
            background: "#fff3cd",
            padding: "8px 12px",
            borderRadius: 4,
            fontSize: 13,
          }}
        >
          <span>Item will be removed.</span>
          <button
            onClick={() => {
              pendingRemove();
              setPendingRemove(null);
            }}
          >
            Confirm
          </button>
          <button onClick={() => setPendingRemove(null)}>Cancel</button>
        </div>
      )}

      {editingItem && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: "#e8f4fd",
            padding: "8px 12px",
            borderRadius: 4,
            fontSize: 13,
          }}
        >
          <span>
            Editing <strong>{editingItem.params.name}</strong>{" "}
            <span style={{ color: "#666" }}>(id: {editingItem.id})</span>
          </span>
          <button onClick={() => setEditingItem(null)}>✕</button>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {sections.map((section) => {
          const sActions = getSectionMoveActions(actionsArgs, cloneFn, section);
          return (
            <div
              key={section.header.id}
              style={{
                border: "1px solid #ddd",
                borderRadius: 6,
                overflow: "hidden",
                opacity: section.header.deleted ? 0.45 : 1,
              }}
            >
              <div
                style={{
                  background: "#f2f2f2",
                  padding: "6px 10px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <strong style={{ fontSize: 13 }}>{section.header.title}</strong>
                <SectionBar a={sActions} />
              </div>

              <div
                style={{
                  padding: "6px 10px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 4,
                }}
              >
                {section.items[0]?.map((item) => {
                  const actions = itemActions(item);
                  const focused = ctx.autoFocused(item.header.id);
                  return (
                    <div
                      key={item.header.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "5px 8px",
                        borderRadius: 4,
                        border: "1px solid #eee",
                        background: focused
                          ? "#dbeafe"
                          : item.header.deleted
                            ? "#fafafa"
                            : "white",
                        opacity: item.header.deleted ? 0.55 : 1,
                      }}
                    >
                      <span
                        style={{
                          fontSize: 13,
                          textDecoration: item.header.deleted
                            ? "line-through"
                            : undefined,
                        }}
                      >
                        {item.header.params.name}
                      </span>
                      <FieldBar
                        a={actions}
                        edit={() => setEditingItem(item.header)}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <details>
        <summary
          style={{
            fontSize: 12,
            cursor: "pointer",
            color: "#888",
            userSelect: "none",
          }}
        >
          Flat items (JSON)
        </summary>
        <pre
          style={{
            marginTop: 6,
            fontSize: 11,
            background: "#f8f8f8",
            padding: 10,
            borderRadius: 4,
            overflow: "auto",
            maxHeight: 260,
          }}
        >
          {JSON.stringify(flatItems, null, 2)}
        </pre>
      </details>
    </div>
  );
};
