import type { ReactNode } from "react";
import recursiveFormDemoSource from "./RecursiveFormDemo.tsx?raw";
import recursiveFormDemoTypesSource from "./recursiveFormDemoTypes.t.ts?raw";
import type { Context, Data, Variants } from "./recursiveFormDemoTypes.t";

export type { StoryArgs } from "./recursiveFormDemoTypes.t";

// ── Fixture ───────────────────────────────────────────────────────────────────

export const DEFAULT_RECURSIVE_FORM_DEMO: Data = {
  variants: {
    text: "default",
    group: "bordered",
  },
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

const withFileHeader = (path: string, source: string) =>
  `// ── ${path} ──\n${source.trimEnd()}`;

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
  variant: Variants["text"];
  border: Context["accent"];
  label: string;
  children: ReactNode;
}) => (
  <label
    style={{
      display: "flex",
      flexDirection: "column",
      gap: 4,
      padding: variant === "compact" ? 4 : 8,
      borderLeft: `3px solid ${border}`,
    }}
  >
    <span style={{ fontSize: 12, opacity: 0.7 }}>{label}</span>
    {children}
  </label>
);

export const Group = ({
  variant,
  border,
  title,
  children,
}: {
  variant: Variants["group"];
  border: Context["accent"];
  title: string;
  children: ReactNode;
}) => (
  <fieldset
    style={{
      border: variant === "bordered" ? `1px solid ${border}` : "none",
      borderRadius: 4,
      padding: 8,
    }}
  >
    <legend>{title}</legend>
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {children}
    </div>
  </fieldset>
);

export const Frame = ({ children }: { children: ReactNode }) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      gap: 8,
      border: "1px solid #ccc",
      padding: 8,
    }}
  >
    {children}
  </div>
);

export const DisplayColumns = ({ columns }: { columns: ReactNode[][] }) => (
  <div style={{ display: "flex", gap: 20 }}>
    {columns.map((column, index) => (
      <div key={index} style={{ flex: 1 }}>
        {column}
      </div>
    ))}
  </div>
);

export const Card = ({ children }: { children: ReactNode }) => (
  <div style={{ background: "#f5f5f5", borderRadius: 4 }}>{children}</div>
);

export const FormContainer = ({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) => (
  <div
    style={{ display: "flex", flexDirection: "column", gap: 16, padding: 16 }}
  >
    <h2 style={{ margin: 0 }}>{title}</h2>
    {children}
  </div>
);

export const Section = ({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
    <h3 style={{ margin: 0, fontSize: 14, opacity: 0.7 }}>{title}</h3>
    {children}
  </div>
);
