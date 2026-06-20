/**
 * Shared edit-form demo host.
 *
 * Owns flatItems state and move-action UI. Feature modules (side-menu, form-item-editor,
 * section-edit) inject behavior via `extra`, `sectionExtra`, and `renderLayout` — they
 * must NOT be imported here. See form-edit/README.md.
 */
import {
  useMemo,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";
import type { ContextDom, TheParams } from "./_deps";
import type { MetaDom, RecursiveTypedFormItem } from "./_deps";
import type {
  GetActionsArgs,
  FlatFormItems,
  Clone,
  FlatFormItem,
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
type Section = {
  id: string;
  deleted: boolean;
  title: string;
  description: string;
};

export type EditFormSection = Section;
export type EditFormFlatItems = FlatFormItems<TypeNames, Params, Section>;
export type EditFormSideArgs = {
  setFlatItems: Dispatch<SetStateAction<EditFormFlatItems>>;
  focus: (id: string) => void;
};

type BaseCtx = { focused: { id: string; focused: boolean } | null };
export type EditFormCtx = AutoFocus<ContextDom & BaseCtx, boolean>;

type ItemMeta = MetaDom<{ index: number; total: number; sIndex: number }>;
export type EditFormEditingItem = RecursiveTypedFormItem<
  TypeNames,
  Params,
  "field",
  ItemMeta
>;

export type EditFormEditorArgs = {
  draft: EditFormEditingItem;
  setDraft: Dispatch<SetStateAction<EditFormEditingItem>>;
  ctx: EditFormCtx;
  onSave: () => void;
  onCancel: () => void;
};

export type EditFormTestProps = {
  extra?: (
    item: EditFormEditingItem,
  ) => { label: string; onClick: () => void }[];
  sectionExtra?: (
    section: EditFormSection,
    meta: { cols: number },
  ) => { label: string; onClick: () => void }[];
  renderLayout: (args: {
    sections: ReactNode;
    alert: ReactNode;
    details: ReactNode;
    ctx: EditFormCtx;
    setFocused: (focused: { id: string; focused: boolean }) => void;
    setFlatItems: Dispatch<
      SetStateAction<FlatFormItems<TypeNames, Params, Section>>
    >;
  }) => React.ReactNode;
};

// ── Context factory ───────────────────────────────────────────────────────────

const makeCtx = (
  focused: { id: string; focused: boolean } | null,
): EditFormCtx =>
  branded({
    focused,
    setAutoFocus: (id) =>
      makeCtx(id ? { id, focused: !focused?.focused } : null),
    autoFocused: (id) => (id === focused?.id ? focused.focused : null),
  });

// ── Initial flat data ─────────────────────────────────────────────────────────

const INITIAL: FlatFormItems<TypeNames, Params, Section> = [
  { section: { id: "s1", deleted: false, title: "Personal", description: "" } },
  {
    item: {
      id: "f1",
      type: "field",
      params: { name: "Name" },
      deleted: false,
    },
    n: 0,
  },
  { end: null },
  {
    item: {
      id: "f2",
      type: "field",
      params: { name: "Email" },
      deleted: false,
    },
    n: 0,
  },
  { section: { id: "s2", deleted: false, title: "Details", description: "" } },
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

const SectionBar = ({
  a,
  extra,
}: {
  a: MoveActions;
  extra: { label: string; onClick: () => void }[];
}) => (
  <span style={{ display: "inline-flex", gap: 3 }}>
    <Btn label="↑" onClick={a.up} />
    <Btn label="↓" onClick={a.down} />
    <Btn label="Clone" onClick={a.clone} />
    {a.isDeleted ? (
      <Btn label="Restore" onClick={a.restore} />
    ) : (
      <Btn label="Remove" onClick={a.remove} />
    )}
    {extra.map(({ label, onClick }) => (
      <Btn key={label} label={label} onClick={onClick} />
    ))}
  </span>
);

const FieldBar = ({
  a,
  extra,
}: {
  a: MoveActions;
  extra: { label: string; onClick: () => void }[];
}) => (
  <span style={{ display: "inline-flex", gap: 3 }}>
    <Btn label="↑" onClick={a.up} />
    <Btn label="↓" onClick={a.down} />
    <Btn label="Clone" onClick={a.clone} />
    {a.isDeleted ? (
      <Btn label="Restore" onClick={a.restore} />
    ) : (
      <Btn label="Remove" onClick={a.remove} />
    )}
    {extra.map(({ label, onClick }) => (
      <Btn key={label} label={label} onClick={onClick} />
    ))}
  </span>
);

// ── Main demo ─────────────────────────────────────────────────────────────────

export const EditFormTest = ({
  extra,
  sectionExtra,
  renderLayout,
}: EditFormTestProps) => {
  const [flatItems, setFlatItems] = useState(INITIAL);
  const [focused, setFocused] = useState<{
    id: string;
    focused: boolean;
  } | null>(null);
  const [toRemove, setToRemove] = useState<{
    rm: () => void;
    item: FlatFormItem<TypeNames, Params, Section>;
  } | null>(null);

  const ctx = useMemo(() => makeCtx(focused), [focused]);

  const applyItems = (newItems: typeof flatItems, newCtx: EditFormCtx) => {
    setFlatItems(newItems);
    setFocused(newCtx.focused);
  };

  const sections = useMemo(() => consolidateSections(flatItems), [flatItems]);

  console.log("sections", sections);

  const sectionOfItem = useMemo(
    () => buildSectionOfItem(flatItems),
    [flatItems],
  );

  const actionsArgs: GetActionsArgs<TypeNames, Params, EditFormCtx, Section> = {
    items: flatItems,
    setItems: applyItems,
    ctx,
    sectionOfItem,
    setToRemove: setToRemove,
  };

  const itemActions = getFormItemMoveActions(actionsArgs, cloneFn);

  return renderLayout({
    alert: toRemove && (
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
        <span>
          {"item" in toRemove.item ? (
            <>
              Item <strong>{toRemove.item.item.params.name} </strong>
            </>
          ) : "section" in toRemove.item ? (
            <>
              Section <strong>{toRemove.item.section.title} </strong>
            </>
          ) : null}
          will be removed.
        </span>
        <button
          onClick={() => {
            toRemove.rm();
            setToRemove(null);
          }}
        >
          Confirm
        </button>
        <button onClick={() => setToRemove(null)}>Cancel</button>
      </div>
    ),

    sections: (
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {sections.map((section) => {
          const focused = ctx.autoFocused(section.header.id);
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
                  animation:
                    focused !== null
                      ? `pulse${focused ? 1 : 2} .2s 2`
                      : undefined,
                }}
              >
                <strong style={{ fontSize: 13 }}>{section.header.title}</strong>
                <SectionBar
                  a={sActions}
                  extra={sectionExtra?.(section.header, {
                    cols: section.items.length,
                  }) ?? []}
                />
              </div>

              <div style={{ display: "flex", flexDirection: "row", gap: 4 }}>
                {section.items.map((item, i) => (
                  <div
                    key={i}
                    style={{
                      padding: "6px 10px",
                      display: "flex",
                      flexDirection: "column",
                      gap: 4,
                      flex: 1,
                    }}
                  >
                    {item.map((item) => {
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
                            animation:
                              focused !== null
                                ? `pulse${focused ? 1 : 2} .2s 2`
                                : undefined,
                            background: item.header.deleted
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
                          <FieldBar a={actions} extra={extra?.(item) ?? []} />
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    ),

    details: (
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
    ),
    ctx,
    setFlatItems,
    setFocused,
  });
};

export const container = (title: string, children: React.ReactNode) => (
  <div
    style={{ display: "flex", flexDirection: "column", gap: 16, padding: 16 }}
  >
    <h2 style={{ margin: 0 }}>{title}</h2>
    {children}
  </div>
);

export const BareEditFormTest = () => {
  return container(
    "Edit form",
    <EditFormTest
      renderLayout={({ sections, alert, details }) => (
        <>
          {alert}
          {sections}
          {details}
        </>
      )}
    />,
  );
};

/*





      <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
        {renderSide?.({ setFlatItems, focus })}

        <div
          style={{ flex: 1, display: "flex", flexDirection: "column", gap: 16 }}
        >
        </div>
      </div>
*/
