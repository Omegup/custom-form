/** Layout + catalog chrome for the side-menu demo + Storybook docs source. */
import { Fragment } from "react";
import { DemoPage as FormContainer, DropdownMenu } from "../../demo-utils";
import type {
  AddFormItemRenderArgs,
  FormMenuItemRenderArgs,
  SideRenderArgs,
} from "../index";
import sideMenuDemoSource from "./SideMenuDemo.tsx?raw";
import sideMenuDemoTypesSource from "./sideMenuDemoTypes.t.ts?raw";

export { FormContainer };

// ── Storybook docs (`?raw` of types + integration) ────────────────────────────

const withFileHeader = (path: string, source: string) =>
  `// ── ${path} ──\n${source.trimEnd()}`;

export const SIDE_MENU_DEMO_SOURCE = [
  withFileHeader("sideMenuDemoTypes.t.ts", sideMenuDemoTypesSource),
  "",
  withFileHeader("SideMenuDemo.tsx", sideMenuDemoSource),
].join("\n");

// ── HTML chrome (demo-only — see no-html-outside-demo rule) ───────────────────

export const renderMenuItem = ({
  title,
  icon,
  onSelect,
}: FormMenuItemRenderArgs) => (
  <button
    type="button"
    onClick={onSelect}
    style={{
      display: "flex",
      alignItems: "center",
      gap: 8,
      padding: "6px 10px",
      fontSize: 13,
      textAlign: "left",
      background: "white",
      border: "1px solid #eee",
      borderRadius: 4,
      cursor: "pointer",
    }}
  >
    {icon}
    {title}
  </button>
);

export const renderAddFormItem = ({
  open,
  label,
  toggle,
  items,
}: AddFormItemRenderArgs) => (
  <DropdownMenu
    open={open}
    align="start"
    trigger={
      <button
        type="button"
        onClick={toggle}
        style={{ fontSize: 12, opacity: 0.75 }}
      >
        {label}
      </button>
    }
  >
    {items.map((item) => (
      <Fragment key={item.key}>
        {renderMenuItem({
          title: item.title,
          icon: item.icon,
          onSelect: item.onSelect,
        })}
      </Fragment>
    ))}
  </DropdownMenu>
);

export const renderSide = ({
  title,
  search,
  setSearch,
  addSectionLabel,
  addSection,
  menu,
}: SideRenderArgs) => (
  <nav
    style={{
      display: "flex",
      flexDirection: "column",
      gap: 10,
      padding: 14,
      border: "1px solid #ddd",
      borderRadius: 6,
      width: 220,
      alignSelf: "flex-start",
      boxSizing: "border-box",
    }}
  >
    <strong style={{ fontSize: 13 }}>{title}</strong>
    <input
      type="search"
      placeholder="Search…"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      style={{ padding: "4px 8px", fontSize: 13 }}
    />
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>{menu}</div>
    <button type="button" onClick={addSection} style={{ fontSize: 13 }}>
      {addSectionLabel}
    </button>
  </nav>
);
