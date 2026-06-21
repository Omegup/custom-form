/**
 * Demo: SectionFormItemHOC — editable section with viewers + per-column add-item slots.
 */
import { useMemo, useState, type ComponentProps, type ReactNode } from "react";
import { branded } from "../form/branded";
import type { ContextDom, ExtraDom, TheParams, TheVariants } from "../form";
import type { MetaDom, RecursiveFormItem } from "../recursive-form";
import type { MoveActions } from "../move-actions/MoveActions.t";
import type { AutoFocus } from "../move-actions/autofocus.t";
import {
  cloneFlatItems,
  columnFlatInsertIndex,
  consolidateSections,
  type FlatFormItems,
  type GetActionsArgs,
} from "../form-edit";
import { container } from "../form-edit/EditForm.test";
import { insertFlatFormItem } from "../side-menu/insertFlatFormItem";
import type { MenuItemDefinition } from "../side-menu";
import {
  SectionFormItemHOC,
  type RecursiveEditProps,
  type RenderFormItemArgs,
} from "../edit-section";
import type { Clone } from "../form-edit/flat-raw-actions";

// ── Domain types (aligned with EditForm.test) ─────────────────────────────────

type TypeNames = "field";
type Params = TheParams<{ field: { name: string } }>;
type Section = {
  id: string;
  deleted: boolean;
  title: string;
  description: string;
};
type Variants = TheVariants<{ field: "default" }>;
type ItemMeta = MetaDom<{ index: number; total: number; sIndex: number }>;
type BaseCtx = { focused: { id: string; focused: boolean } | null };
type Ctx = AutoFocus<ContextDom & BaseCtx, boolean>;

const MENU_ITEMS: MenuItemDefinition<TypeNames, Params>[] = [
  {
    icon: "📝",
    title: "Text field",
    header: { type: "field", params: { name: "New field" } },
  },
  {
    icon: "✉️",
    title: "Email field",
    header: { type: "field", params: { name: "Email" } },
  },
];

const VARIANTS = branded<Variants, "variants">({ field: "default" });
const randomId = () => `id_${Math.random().toString(36).slice(2, 7)}`;

const INITIAL: FlatFormItems<TypeNames, Params, Section> = [
  { section: { id: "s1", deleted: false, title: "Personal", description: "" } },
  {
    item: { id: "f1", type: "field", params: { name: "Name" }, deleted: false },
    n: 0,
  },
  { end: null },
  {
    item: { id: "f2", type: "field", params: { name: "Email" }, deleted: false },
    n: 0,
  },
  { section: { id: "s2", deleted: false, title: "Details", description: "" } },
  {
    item: { id: "f3", type: "field", params: { name: "Notes" }, deleted: false },
    n: 0,
  },
];

const makeCtx = (
  focused: { id: string; focused: boolean } | null,
): Ctx =>
  branded({
    focused,
    setAutoFocus: (id) =>
      makeCtx(id ? { id, focused: !focused?.focused } : null),
    autoFocused: (id) => (id === focused?.id ? focused.focused : null),
  });

type FieldExtra = ExtraDom;

// ── Simple section shell (stand-in for school RecursiveEdit UI) ───────────────

const ActionBtn = ({
  label,
  onClick,
  disabled,
}: {
  label: string;
  onClick?: () => void;
  disabled?: boolean;
}) => (
  <button
    type="button"
    disabled={disabled || !onClick}
    onClick={onClick ?? undefined}
    style={{ fontSize: 11, padding: "2px 6px" }}
  >
    {label}
  </button>
);

const ActionBar = ({ a }: { a: MoveActions }) => (
  <span style={{ display: "inline-flex", gap: 4 }}>
    <ActionBtn label="↑" onClick={a.up ?? undefined} />
    <ActionBtn label="↓" onClick={a.down ?? undefined} />
    <ActionBtn label="Clone" onClick={a.clone ?? undefined} />
    {a.isDeleted ? (
      <ActionBtn label="Restore" onClick={a.restore ?? undefined} />
    ) : (
      <ActionBtn label="Remove" onClick={a.remove ?? undefined} />
    )}
  </span>
);

const renderItemNode = (
  renderNode: (args: RenderFormItemArgs<TypeNames, Params, ItemMeta>) => ReactNode,
  item: RecursiveFormItem<TypeNames, Params, ItemMeta>,
  parentDeleted: boolean,
  index: number,
): ReactNode => {
  const children = item.children.flatMap((slot) =>
    slot.map((child, ci) =>
      renderItemNode(
        renderNode,
        child,
        parentDeleted || item.header.deleted,
        ci,
      ),
    ),
  );
  return renderNode({ item, children, parentDeleted, index });
};

const SimpleSectionEdit = ({
  title,
  edit,
  render,
}: RecursiveEditProps<TypeNames, Params, Ctx, ItemMeta>) => (
  <section
    style={{
      border: "1px solid #ccc",
      borderRadius: 8,
      marginBottom: 16,
      overflow: "hidden",
    }}
  >
    <div
      style={{
        padding: "8px 12px",
        background: edit.item.deleted ? "#fdd" : "#eee",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      {title}
      <ActionBar a={edit.actions} />
    </div>
    <div style={{ display: "flex", gap: 8, padding: 12 }}>
      {edit.nodes.children.map((column, colIndex) => (
        <div
          key={colIndex}
          style={{
            flex: 1,
            minHeight: 80,
            border: "1px dashed #ccc",
            borderRadius: 4,
            padding: 8,
          }}
        >
          {column.map((node, ord) =>
            renderItemNode(render.node, node, edit.item.deleted, ord),
          )}
          {render.addItem({
            index: columnFlatInsertIndex(
              edit.nodes.meta.index,
              edit.nodes.children,
              colIndex,
            ),
            sIndex: edit.nodes.meta.sIndex,
          })}
        </div>
      ))}
    </div>
  </section>
);

const clone: Clone<TypeNames, Params, Ctx, Section> = (
  subItems,
  _,
  allItems,
) =>
  cloneFlatItems(
    subItems,
    allItems,
    (name, n) => `${name} (copy${n})`,
    randomId,
    { rename: "first" },
  );

// ── SectionFormItemHOC factory ────────────────────────────────────────────────

const sectionExtra = branded<
  { items: (id: string) => FieldExtra },
  "section-extra"
>({
  items: () => branded({}) as FieldExtra,
});

const Section = SectionFormItemHOC<
  TypeNames,
  Params,
  Variants,
  Section,
  FieldExtra,
  ContextDom & BaseCtx,
  typeof sectionExtra,
  ItemMeta
>({
  viewers: {
    field: {
      viewer: ({ props }) => (
        <span style={{ opacity: props.extra.parentDeleted ? 0.45 : 1 }}>
          {props.formItem.params.name}
        </span>
      ),
    },
  },
  useMenuItems: () => MENU_ITEMS,
  random: randomId,
  renderEdit: (props) => (
    <SimpleSectionEdit
      {...(props as RecursiveEditProps<TypeNames, Params, Ctx, ItemMeta>)}
    />
  ),
  renderAddItem: ({ item, menuItems, random, setAddItem }) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 4, marginTop: 8 }}>
      <span style={{ fontSize: 11, opacity: 0.6 }}>Add item</span>
      {menuItems.map((menuItem) => (
        <button
          key={menuItem.title}
          type="button"
          style={{ fontSize: 12, textAlign: "left" }}
          onClick={() =>
            setAddItem(
              {
                meta: {
                  index: item.index,
                  total: 0,
                  sIndex: item.sIndex,
                },
                header: {
                  ...menuItem.header,
                  id: random(),
                  deleted: false,
                },
                children: Array.from({ length: menuItem.n ?? 0 }, () => []),
              },
              (x) => x,
            )
          }
        >
          {menuItem.icon} {menuItem.title}
        </button>
      ))}
    </div>
  ),
  renderTitle: ({ edit }) => (
    <strong>{edit.section.header.title}</strong>
  ),
  renderCard: (_props, { parentDeleted }) => (view) => (
    <div
      style={{
        padding: "6px 8px",
        background: parentDeleted ? "#fee" : "#f5f5f5",
        borderRadius: 4,
        marginBottom: 4,
      }}
    >
      {view}
    </div>
  ),
});

// ── Test UI ───────────────────────────────────────────────────────────────────

export const EditSectionTest = () => {
  const [flatItems, setFlatItems] = useState(INITIAL);
  const [focused, setFocused] = useState<{
    id: string;
    focused: boolean;
  } | null>(null);

  const ctx = useMemo(() => makeCtx(focused), [focused]);
  const sections = useMemo(() => consolidateSections(flatItems), [flatItems]);

  const sectionOfItem = useMemo(() => {
    const map: Record<string, Section> = {};
    let current: Section | undefined;
    for (const fi of flatItems) {
      if ("section" in fi) current = fi.section;
      else if ("item" in fi && current) map[fi.item.id] = current;
    }
    return map;
  }, [flatItems]);

  const actionsArgs: GetActionsArgs<TypeNames, Params, Ctx, Section> = {
    items: flatItems,
    setItems: (items, newCtx) => {
      setFlatItems(items);
      setFocused(newCtx.focused);
    },
    ctx,
    sectionOfItem,
    setToRemove: () => {},
  };

  const cloneFn = clone;

  return (
    <div>
      <p style={{ fontSize: 13, opacity: 0.7, marginBottom: 12 }}>
        Sections rendered via <code>SectionFormItemHOC</code> — viewers, column
        add-item slots, and section move actions.
      </p>
      {sections.map((section, i) => (
        <Section
          key={section.header.id}
          {...({
            ctx,
            variants: VARIANTS,
            extra: sectionExtra,
            edit: {
              clone: cloneFn,
              actions: actionsArgs,
              sections,
              section,
              i,
            },
            setAddItem: (item: RecursiveFormItem<TypeNames, Params, ItemMeta> | null) => {
              if (!item) return;
              setFlatItems((prev: FlatFormItems<TypeNames, Params, Section>) =>
                insertFlatFormItem(prev, item),
              );
              setFocused({ id: item.header.id, focused: true });
            },
          } as ComponentProps<typeof Section>)}
        />
      ))}
      <details style={{ marginTop: 16 }}>
        <summary style={{ cursor: "pointer", fontSize: 13 }}>Flat items (JSON)</summary>
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

export const EditSectionDemo = () =>
  container("Edit section", <EditSectionTest />);
