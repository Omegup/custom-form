import { useMemo, type ReactNode } from "react";
import { useArgs } from "storybook/preview-api";
import { AccentField, FieldsetGroup, MutedWell } from "../../demo-utils";
import { branded } from "../branded";
import formDemoSource from "./FormDemo.tsx?raw";
import type {
  Context,
  Data,
  Props,
  StoryArgs,
  Variants,
} from "./formDemoTypes.t";
import formDemoTypesSource from "./formDemoTypes.t.ts?raw";

export type { StoryArgs } from "./formDemoTypes.t";

// ── Fixture ───────────────────────────────────────────────────────────────────

export const DEFAULT_FORM_DEMO: Data = {
  variants: branded({ padding: 8, showBorder: true }),
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
  variants: branded({
    ...TEXT_VARIANT[textVariant],
    ...GROUP_VARIANT[groupVariant],
  }),
});

const TEXT_VARIANT = {
  default: { padding: 8 },
  compact: { padding: 4 },
} as const satisfies Record<"default" | "compact", { padding: number }>;

const GROUP_VARIANT = {
  default: { showBorder: false },
  bordered: { showBorder: true },
} as const satisfies Record<"default" | "bordered", { showBorder: boolean }>;

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
  variant: Variants;
  border: Context["accent"];
  children: ReactNode[];
}) =>
  label === null ? (
    children
  ) : (
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

export const useStoryArgs = () => {
  const [{ accent, textVariant, groupVariant, values, items }, updateArgs] =
    useArgs<StoryArgs>();
  const ctx = useMemo((): Context => branded({ accent }), [accent]);
  const variants = useMemo(
    (): Variants =>
      branded({
        ...TEXT_VARIANT[textVariant],
        ...GROUP_VARIANT[groupVariant],
      }),
    [textVariant, groupVariant],
  );
  return { ctx, variants, values, items, updateArgs };
};

export const Card = ({ children }: { children: ReactNode }) => (
  <MutedWell>{children}</MutedWell>
);
