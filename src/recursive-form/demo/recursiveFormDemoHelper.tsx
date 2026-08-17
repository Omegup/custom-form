import type { ReactNode } from "react";
import {
  withFileHeader,
  AccentField,
  FieldsetGroup,
  InsetFrame,
  MutedWell,
  SectionHeading,
  SplitColumns,
} from "../../demo-utils";
import { branded } from "./library";
import recursiveFormDemoSource from "./RecursiveFormDemo.tsx?raw";
import recursiveFormDemoTypesSource from "./recursiveFormDemoTypes.t.ts?raw";
import type { Context, Data, Variants } from "./recursiveFormDemoTypes.t";

export type { StoryArgs } from "./recursiveFormDemoTypes.t";

// ── Fixture ───────────────────────────────────────────────────────────────────

export const DEFAULT_RECURSIVE_FORM_DEMO: Data = {
  variants: branded<Variants, "variants">({
    padding: 8,
    showBorder: true,
  }),
  values: {
    t: "Alice",
    g: "1,2,3",
    "ga:1": "Apple",
    "ga:2": "Banana",
    "ga:3": "Carrot",
    "gb:1": "Red",
    "gb:2": "Green",
    "gb:3": "Blue",
    "gga:1:": "Small",
    "gga:2:": "Medium",
    "gga:3:": "Large",
  },
  items: [
    {
      header: {
        id: "t",
        type: "text",
        deleted: false,
        params: {
          label: "Name",
        },
      },
      children: [],
    },
    {
      header: {
        id: "g",
        type: "group",
        deleted: false,
        params: {
          title: "Inventory",
        },
      },
      children: [
        [
          {
            header: {
              id: "ga",
              type: "text",
              deleted: false,
              params: {
                label: "Item",
              },
            },
            children: [],
          },
          {
            header: {
              id: "gb",
              type: "text",
              deleted: false,
              params: {
                label: "Color",
              },
            },
            children: [],
          },
        ],
        [
          {
            header: {
              id: "gg",
              type: "group",
              deleted: false,
              params: {
                title: "Attributes",
              },
            },
            children: [
              [
                {
                  header: {
                    id: "gga",
                    type: "text",
                    deleted: false,
                    params: {
                      label: "Size",
                    },
                  },
                  children: [],
                },
              ],
            ],
          },
        ],
      ],
    },
  ],
};

// ── Storybook docs (`?raw` of types + integration) ────────────────────────────


export const RECURSIVE_FORM_DEMO_SOURCE = [
  withFileHeader("recursiveFormDemoTypes.t.ts", recursiveFormDemoTypesSource),
  "",
  withFileHeader("RecursiveFormDemo.tsx", recursiveFormDemoSource),
].join("\n");

// ── Layout chrome (not part of the form API) ──────────────────────────────────

export const Label = ({
  variant,
  border,
  label,
  children,
}: {
  variant: Variants;
  border: Context["accent"];
  label: string;
  children: ReactNode;
}) => (
  <AccentField padding={variant.padding} border={border} label={label}>
    {children}
  </AccentField>
);

export const Group = ({
  variant,
  border,
  title,
  children,
}: {
  variant: Variants;
  border: Context["accent"];
  title: string;
  children: ReactNode;
}) => (
  <FieldsetGroup
    title={title}
    border={border}
    showBorder={variant.showBorder}
  >
    {children}
  </FieldsetGroup>
);

export const Frame = ({ children }: { children: ReactNode }) => (
  <InsetFrame>{children}</InsetFrame>
);

export const DisplayColumns = ({ columns }: { columns: ReactNode[][] }) => (
  <SplitColumns columns={columns} />
);

export const Card = ({ children }: { children: ReactNode }) => (
  <MutedWell>{children}</MutedWell>
);

export const Section = ({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) => (
  <SectionHeading title={title}>{children}</SectionHeading>
);
