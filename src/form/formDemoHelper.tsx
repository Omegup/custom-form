import { useMemo, type ReactNode } from "react";
import { useArgs } from "storybook/preview-api";
import { branded } from "./branded";
import formDemoSource from "./FormDemo.tsx?raw";
import type {
  Context,
  FormDemoData,
  Props,
  StoryArgs,
  Variants,
} from "./formDemoTypes.t";
import formDemoTypesSource from "./formDemoTypes.t.ts?raw";

export type {
  Context,
  Extra,
  FormDemoData,
  Params,
  Props,
  StoryArgs,
  TypeNames,
  Variants,
  Viewers,
} from "./formDemoTypes.t";

// ── Fixture ───────────────────────────────────────────────────────────────────

export const DEFAULT_FORM_DEMO: FormDemoData = {
  variants: {
    text: "default",
    group: "bordered",
  },
  values: {
    t: "Alice",
    g: "1,2",
    "g:1": "1,2,3",
    "g_name:1": "Eating",
    "g:1:1": "Apple",
    "g:1:2": "Banana",
    "g:1:3": "Carrot",
    "g:2": "1,2,3",
    "g_name:2": "Drinking",
    "g:2:1": "Soda",
    "g:2:2": "Water",
    "g:2:3": "Juice",
  },
  items: [
    {
      id: "t",
      type: "text",
      deleted: false,
      params: {
        label: "Name",
        showLabel: true,
      },
    },
    {
      id: "g",
      type: "group",
      deleted: false,
      params: {
        title: "Inventory",
        item: {
          id: "g",
          type: "group",
          deleted: false,
          params: {
            title: "Slot",
            name: {
              id: "g_name",
              type: "text",
              deleted: false,
              params: {
                label: "Name",
                showLabel: false,
              },
            },
            item: {
              id: "g",
              type: "text",
              deleted: false,
              params: {
                label: "Item {{id}}",
                showLabel: true,
                template: true,
              },
            },
          },
        },
      },
    },
  ],
};

// ── Storybook docs (`?raw` of types + integration) ────────────────────────────

const withFileHeader = (path: string, source: string) =>
  `// ── ${path} ──\n${source.trimEnd()}`;

export const FORM_DEMO_SOURCE = [
  withFileHeader("formDemoTypes.t.ts", formDemoTypesSource),
  "",
  withFileHeader("FormDemo.tsx", formDemoSource),
].join("\n");

// ── Story arg mapping ─────────────────────────────────────────────────────────

export const storyArgsToDemoProps = ({
  textVariant,
  groupVariant,
  ...rest
}: StoryArgs): Omit<Props, "onValueChange"> => ({
  ...rest,
  variants: { text: textVariant, group: groupVariant },
});

// ── Demo helpers (typing lives here, not in FormDemo.tsx) ─────────────────────

export const applyTemplate = (
  label: string,
  template: boolean | undefined,
  id: string,
) => {
  return template ? label.replace("{{id}}", id.split(":").pop() ?? "") : label;
};

export const Label = ({
  variant,
  border,
  children: [label, ...children],
}: {
  variant: Variants["text"];
  border: Context["accent"];
  children: ReactNode[];
}) =>
  label === null ? (
    children
  ) : (
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

export const useStoryArgs = () => {
  const [{ accent, textVariant, groupVariant, values, items }, updateArgs] =
    useArgs<StoryArgs>();
  const ctx = useMemo((): Context => branded({ accent }), [accent]);
  const variants = useMemo(
    (): Variants => branded({ text: textVariant, group: groupVariant }),
    [textVariant, groupVariant],
  );
  return { ctx, variants, values, items, updateArgs };
};

export const Card = ({ children }: { children: ReactNode }) => (
  <div style={{ background: "#f5f5f5", borderRadius: 4 }}>{children}</div>
);

export const FormContainer = ({ children }: { children: ReactNode }) => (
  <div
    style={{ display: "flex", flexDirection: "column", gap: 16, padding: 16 }}
  >
    <h2 style={{ margin: 0 }}>Form</h2>
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {children}
    </div>
  </div>
);
