import type { ReactNode } from "react";
import type {
  ExtraDom,
  ViewerProps,
  Viewers,
  WithChildren,
} from "../../form";
import recursiveFormDemoSource from "./RecursiveFormDemo.tsx?raw";
import type {
  Context,
  Params,
  TypeNames,
  Variants,
} from "./recursiveFormDemoTypes.t";
import recursiveFormDemoTypesSource from "./recursiveFormDemoTypes.t.ts?raw";
import type { Data } from "./recursiveFormDemoTypes.t";

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

// ── Demo helpers ──────────────────────────────────────────────────────────────

export const makeViewers = <Extra extends ExtraDom>(
  inner: Viewers<
    TypeNames,
    Params,
    Variants,
    WithChildren<Extra>,
    Context,
    string
  >,
): Viewers<
  TypeNames,
  Params,
  Variants,
  WithChildren<Extra>,
  Context,
  string
> => ({
  text: {
    viewer: ({
      props,
    }: {
      props: ViewerProps<
        Params,
        Variants,
        "text",
        WithChildren<Extra>["view"],
        Context
      >;
    }) => (
      <label
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 4,
          padding: props.variant === "compact" ? 4 : 8,
          borderLeft: `3px solid ${props.ctx.accent}`,
        }}
      >
        <span style={{ fontSize: 12, opacity: 0.7 }}>
          {props.formItem.params.label}
        </span>
        {inner.text.viewer({ props })}
      </label>
    ),
  },
  group: {
    viewer: ({
      props,
    }: {
      props: ViewerProps<
        Params,
        Variants,
        "group",
        WithChildren<Extra>["view"],
        Context
      >;
    }) => (
      <fieldset
        style={{
          border:
            props.variant === "bordered"
              ? `1px solid ${props.ctx.accent}`
              : "none",
          borderRadius: 4,
          padding: 8,
        }}
      >
        <legend>{props.formItem.params.title}</legend>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {props.extra.children.map((child) => (
            <GroupChildFrame key={child.key}>{child}</GroupChildFrame>
          ))}
        </div>
      </fieldset>
    ),
    repeatChildren: inner.group.repeatChildren,
  },
});

export const GroupChildFrame = ({ children }: { children: ReactNode }) => (
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

export const ChildSlots = ({ slots }: { slots: ReactNode[][] }) => (
  <div style={{ display: "flex", gap: 20 }}>
    {slots.map((slot, index) => (
      <div key={index} style={{ flex: 1 }}>
        {slot}
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
