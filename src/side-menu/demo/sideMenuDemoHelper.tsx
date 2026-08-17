/** Layout + catalog chrome for the side-menu demo + Storybook docs source. */
import { Fragment } from "react";
import {
  CatalogButton,
  DemoPage as FormContainer,
  DropdownMenu,
  LibraryNav,
  QuietButton,
} from "../../demo-utils";
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

export const renderMenuItem = ({
  title,
  icon,
  onSelect,
}: FormMenuItemRenderArgs) => (
  <CatalogButton onClick={onSelect}>
    {icon}
    {title}
  </CatalogButton>
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
      <QuietButton onClick={toggle} label={null}>
        {label}
      </QuietButton>
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
  <LibraryNav
    title={title}
    search={search}
    setSearch={setSearch}
    menu={menu}
    addSectionLabel={addSectionLabel}
    addSection={addSection}
  />
);
