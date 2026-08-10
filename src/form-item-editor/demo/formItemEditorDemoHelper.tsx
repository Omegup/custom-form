import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import {
  FieldRow,
  FormContainer,
  SectionPanel,
  SectionsList,
} from "../../form-edit/demo/editFormDemoHelper";
import type * as types from "./formItemEditorDemoTypes.t";
import formItemEditorDemoSource from "./FormItemEditorDemo.tsx?raw";
import formItemEditorDemoTypesSource from "./formItemEditorDemoTypes.t.ts?raw";
import * as lib from "./library";

export type { StoryArgs } from "./formItemEditorDemoTypes.t";
export { FormContainer };

// ── Storybook docs (`?raw` of types + integration) ────────────────────────────

const withFileHeader = (path: string, source: string) =>
  `// ── ${path} ──\n${source.trimEnd()}`;

export const FORM_ITEM_EDITOR_DEMO_SOURCE = [
  withFileHeader("formItemEditorDemoTypes.t.ts", formItemEditorDemoTypesSource),
  "",
  withFileHeader("FormItemEditorDemo.tsx", formItemEditorDemoSource),
].join("\n");

// ── Edit dialog + field chrome (orthogonal to the HOC showcase) ─────────────

export const EditorDialog = ({
  title,
  onCancel,
  onSave,
  saveError,
  children,
}: {
  title: ReactNode;
  onCancel: () => void;
  onSave: () => void;
  saveError: string | null;
  children: ReactNode;
}) => (
  <div
    style={{
      border: "1px solid #b8d4f0",
      borderRadius: 8,
      overflow: "hidden",
      maxWidth: 360,
      background: "#e8f4fd",
      marginBottom: 12,
    }}
  >
    <div
      style={{
        padding: "8px 12px",
        background: "#d4e9f7",
        fontSize: 13,
      }}
    >
      <strong>{title}</strong>
    </div>
    <div style={{ padding: 12, display: "flex", flexDirection: "column", gap: 8 }}>
      {children}
      {saveError && (
        <p style={{ margin: 0, color: "#c00", fontSize: 12 }}>{saveError}</p>
      )}
    </div>
    <div
      style={{
        display: "flex",
        gap: 8,
        justifyContent: "flex-end",
        padding: "8px 12px",
        borderTop: "1px solid #b8d4f0",
      }}
    >
      <button type="button" onClick={onCancel} style={{ padding: "4px 12px" }}>
        Cancel
      </button>
      <button type="button" onClick={onSave} style={{ padding: "4px 12px" }}>
        Save
      </button>
    </div>
  </div>
);

export const RemoveAlert = ({
  pending,
  onConfirm,
  onCancel,
}: {
  pending: {
    rm: () => void;
    item:
      | { item: types.ItemHeader; n: number }
      | { section: types.Section }
      | { end: null };
    label?: ReactNode;
  };
  onConfirm: () => void;
  onCancel: () => void;
}) => (
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
      {"item" in pending.item ? (
        <>
          Item <strong>{pending.label}</strong>
        </>
      ) : "section" in pending.item ? (
        <>
          Section <strong>{pending.item.section.title}</strong>
        </>
      ) : null}{" "}
      will be removed.
    </span>
    <button type="button" onClick={onConfirm}>
      Confirm
    </button>
    <button type="button" onClick={onCancel}>
      Cancel
    </button>
  </div>
);

export const NameField = ({
  value,
  error,
  onChange,
}: {
  value: string;
  error: string | null;
  onChange: (value: string) => void;
}) => (
  <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
    <span style={{ fontSize: 12, opacity: 0.7 }}>Name</span>
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{
        padding: "6px 8px",
        borderRadius: 4,
        border: `1px solid ${error ? "#c00" : "#ccc"}`,
      }}
    />
    {error && <span style={{ color: "#c00", fontSize: 12 }}>{error}</span>}
  </label>
);

const MAX_NAME_LEN = 10;

export const NameLengthHint = ({ name }: { name: string }) => (
  <p
    style={{
      margin: 0,
      fontSize: 11,
      opacity: name.length > MAX_NAME_LEN ? 1 : 0.55,
    }}
  >
    {name.length}/{MAX_NAME_LEN} characters
    {name.length > MAX_NAME_LEN ? " — too long" : ""}
  </p>
);

export { MAX_NAME_LEN };

const MIN_HEADING_LEN = 3;

export const TextField = ({
  label,
  value,
  error,
  onChange,
}: {
  label: string;
  value: string;
  error: string | null;
  onChange: (value: string) => void;
}) => (
  <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
    <span style={{ fontSize: 12, opacity: 0.7 }}>{label}</span>
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{
        padding: "6px 8px",
        borderRadius: 4,
        border: `1px solid ${error ? "#c00" : "#ccc"}`,
      }}
    />
    {error && <span style={{ color: "#c00", fontSize: 12 }}>{error}</span>}
  </label>
);

export const HeadingLengthHint = ({ text }: { text: string }) => (
  <p
    style={{
      margin: 0,
      fontSize: 11,
      opacity: text.trim().length < MIN_HEADING_LEN ? 1 : 0.55,
    }}
  >
    {text.trim().length}/{MIN_HEADING_LEN} characters minimum
    {text.trim().length < MIN_HEADING_LEN ? " — too short" : ""}
  </p>
);

export { MIN_HEADING_LEN };

export const PANEL_COL_OPTIONS = [1, 2] as const;

export const SelectColumns = ({
  cols,
  onChange,
}: {
  cols: number;
  onChange: (cols: number) => void;
}) => (
  <fieldset
    style={{
      margin: 0,
      padding: "8px 10px",
      border: "1px solid #ccc",
      borderRadius: 4,
      display: "flex",
      flexDirection: "column",
      gap: 6,
    }}
  >
    <legend style={{ fontSize: 12, opacity: 0.7, padding: "0 4px" }}>
      Columns (n)
    </legend>
    <div style={{ display: "flex", gap: 8 }}>
      {PANEL_COL_OPTIONS.map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          style={{
            flex: 1,
            padding: "8px 6px",
            borderRadius: 4,
            border: `2px solid ${cols === n ? "#3b82f6" : "#ccc"}`,
            background: cols === n ? "#eff6ff" : "white",
            cursor: "pointer",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${n}, 1fr)`,
              gap: 3,
              height: 28,
              marginBottom: 4,
            }}
          >
            {Array.from({ length: n }, (_, i) => (
              <div
                key={i}
                style={{
                  background: cols === n ? "#93c5fd" : "#e5e7eb",
                  borderRadius: 2,
                }}
              />
            ))}
          </div>
          <span style={{ fontSize: 11 }}>
            {n} column{n > 1 ? "s" : ""}
          </span>
        </button>
      ))}
    </div>
    <p style={{ margin: 0, fontSize: 11, opacity: 0.6 }}>
      Decreasing columns merges trailing slots into the last column.
    </p>
  </fieldset>
);

/** School `editors/selectSection.tsx` `<Select>` — visible only when there's more than one section to choose from. */
export const SelectSection = ({
  sections,
  value,
  error,
  onChange,
}: {
  sections: types.SectionOption[];
  value: number;
  error: string | null;
  onChange: (index: number) => void;
}) => (
  <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
    <span style={{ fontSize: 12, opacity: 0.7 }}>Section</span>
    <select
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      style={{
        padding: "6px 8px",
        borderRadius: 4,
        border: `1px solid ${error ? "#c00" : "#ccc"}`,
      }}
    >
      <option value={-1} disabled>
        Choose a section…
      </option>
      {sections.map(({ index, title }) => (
        <option key={index} value={index}>
          {title}
        </option>
      ))}
    </select>
    {error && <span style={{ color: "#c00", fontSize: 12 }}>{error}</span>}
  </label>
);

const MIN_PANEL_TITLE_LEN = 2;

export const PanelTitleHint = ({ title }: { title: string }) => (
  <p
    style={{
      margin: 0,
      fontSize: 11,
      opacity: title.trim().length < MIN_PANEL_TITLE_LEN ? 1 : 0.55,
    }}
  >
    {title.trim().length}/{MIN_PANEL_TITLE_LEN} characters minimum
    {title.trim().length < MIN_PANEL_TITLE_LEN ? " — too short" : ""}
  </p>
);

export { MIN_PANEL_TITLE_LEN };

export const NestedColumns = ({ columns }: { columns: ReactNode[] }) => (
  <div
    style={{
      display: "flex",
      flexDirection: "row",
      gap: 6,
      marginLeft: 12,
      marginTop: 4,
      paddingLeft: 8,
      borderLeft: "2px solid #b8d4f0",
    }}
  >
    {columns.map((column, i) => (
      <div
        key={i}
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: 4,
          minWidth: 0,
        }}
      >
        {column}
      </div>
    ))}
  </div>
);

// ── Form-edit list shell (orthogonal — move/clone/sections) ───────────────────

export type ExtraAction = { label: string; onClick: () => void };

type PendingRemove = {
  rm: () => void;
  item: lib.FlatNestedItem<types.TypeNames, types.Params, types.Section>;
};

const randomId = () => `id_${Math.random().toString(36).slice(2, 7)}`;

const cloneFn: lib.Clone<
  types.TypeNames,
  types.Params,
  lib.ContextDom,
  types.Section
> = (subItems, _, allItems) =>
  lib.cloneFlatItems(
    subItems,
    allItems,
    (name, n) => `${name} (copy${n})`,
    randomId,
    { rename: "first" },
  );

export const FormItemEditorFormTest = ({
  flatItems,
  updateArgs,
  itemName,
  extra,
  renderAddItem,
  renderLayout,
}: {
  flatItems: types.FlatItems;
  updateArgs: (patch: Partial<types.StoryArgs>) => void;
  itemName: (header: types.ItemHeader) => ReactNode;
  extra?: (item: types.ListItem) => ExtraAction[];
  renderAddItem?: (slot: types.AddItemSlot) => ReactNode;
  renderLayout?: (args: types.ListLayoutArgs) => ReactNode;
}) => {
  const [focused, setFocused] = useState<lib.AutoFocusState>(null);
  const [toRemove, setToRemove] = useState<PendingRemove | null>(null);

  const ctx = useMemo(
    () => lib.autofocusCtx<lib.ContextDom>(lib.branded({}), focused),
    [focused],
  );

  const applyItems = (newItems: types.FlatItems, newCtx: typeof ctx) => {
    if (newItems !== flatItems) updateArgs({ flatItems: newItems });
    setFocused(newCtx.focused);
  };

  const sections = useMemo(
    () => lib.consolidateSections(flatItems),
    [flatItems],
  );
  // Visibility only — school always jumps deleted neighbors when moving
  // (action.utils `isDeleted`), so active items never land in a deleted section.
  const [showDeleted, setShowDeleted] = useState(true);
  const jump = true;
  const sectionOfItem = useMemo(
    () => lib.buildItemSectionDict(flatItems),
    [flatItems],
  );

  const actionsArgs = {
    items: flatItems,
    setItems: applyItems,
    ctx,
    sectionOfItem,
    setToRemove,
  };
  const itemActions = lib.getFormItemMoveActions(actionsArgs, cloneFn, jump);

  const renderItem = (
    item: types.ListItem,
    parentDeleted = false,
  ): ReactNode => {
    if (item.header.deleted && !showDeleted) return null;
    const actions = itemActions(item);
    const fieldFocused = ctx.autoFocused(item.header.id);
    const deleted = parentDeleted || item.header.deleted;
    return (
      <div key={item.header.id}>
        <FieldRow
          name={itemName(item.header)}
          focused={fieldFocused}
          actions={actions}
          extra={parentDeleted ? [] : extra?.(item) ?? []}
          parentDeleted={parentDeleted}
        />
        {/*
          School RecursiveEdit/FlatDnd: every list slot (section column *and*
          nested panel column) ends with `render.addItem(node)`, where the
          list-node index is `lastChild.index + lastChild.total` — same as
          `getFlatInsertionIndex(parent.meta.index, parent.children, col)`.
        */}
        {item.children.length > 0 && (
          <NestedColumns
            columns={item.children.map((column, colIndex) => (
              <>
                {column.map((child) => renderItem(child, deleted))}
                {!deleted &&
                  renderAddItem?.({
                    index: lib.getFlatInsertionIndex(
                      item.meta.index,
                      item.children,
                      colIndex,
                    ),
                    sIndex: item.meta.sIndex,
                  })}
              </>
            ))}
          />
        )}
      </div>
    );
  };

  const alert = toRemove && (
    <RemoveAlert
      pending={{
        ...toRemove,
        label:
          "item" in toRemove.item ? itemName(toRemove.item.item) : undefined,
      }}
      onConfirm={() => {
        toRemove.rm();
        setToRemove(null);
      }}
      onCancel={() => setToRemove(null)}
    />
  );
  const details = (
    <button type="button" onClick={() => setShowDeleted(!showDeleted)}>
      {showDeleted ? "Hide deleted" : "Show deleted"}
    </button>
  );
  const sectionsNode = (
    <SectionsList>
      {sections.map((section, sIndex) => {
        if (section.header.deleted && !showDeleted) return null;
        const sectionFocused = ctx.autoFocused(section.header.id);
        const sActions = lib.getSectionMoveActions(
          actionsArgs,
          cloneFn,
          section,
          jump,
        );
        const sectionDeleted = section.header.deleted;
        return (
          <SectionPanel
            key={section.header.id}
            title={section.header.title}
            focused={sectionFocused}
            sectionActions={sActions}
            sectionExtra={[]}
            columns={section.items.map((column, colIndex) => (
              <>
                {column.map((item) => renderItem(item, sectionDeleted))}
                {!sectionDeleted &&
                  renderAddItem?.({
                    index: lib.getFlatInsertionIndex(
                      section.meta.index,
                      section.items,
                      colIndex,
                    ),
                    sIndex,
                  })}
              </>
            ))}
          />
        );
      })}
    </SectionsList>
  );

  if (!renderLayout)
    return (
      <>
        {alert}
        {details}
        {sectionsNode}
      </>
    );
  return renderLayout({
    alert,
    details,
    sections: sectionsNode,
    setFlatItems: (update) =>
      updateArgs({
        flatItems: typeof update === "function" ? update(flatItems) : update,
      }),
    focus: (id) => setFocused({ id, value: true }),
  });
};
