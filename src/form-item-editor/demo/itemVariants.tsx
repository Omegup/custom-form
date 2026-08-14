/**
 * Concrete ItemVariant values for field / heading / panel demos.
 * Hosts pass these objects (or bags of them) — viewers read `variant.border`,
 * never `VARIANT_CHROME[name]`.
 */
import type { ItemVariant, Variants } from "./formItemEditorDemoTypes.t";
import { branded } from "./library";

const FOLLOW_UP_BADGE = (
  <span
    title="Added follow-up"
    aria-label="Added follow-up"
    style={{ color: "#b45309", fontSize: 12, fontWeight: 700, lineHeight: 1 }}
  >
    ✚
  </span>
);

const followUpShell = {
  padding: 8,
  borderRadius: 6,
  background: "#fffbeb",
  border: "1px solid #e6b800",
} as const;

/** Black / neutral chrome — design items and settled answers. */
export const defaultFieldVariant: ItemVariant = {
  border: "#ccc",
  background: "#fafafa",
  badge: null,
  shell: {},
  errorBorder: "#c00",
  reviewTone: true,
};

export const defaultHeadingVariant: ItemVariant = {
  border: "#ccc",
  background: "#fafafa",
  badge: null,
  shell: {},
  reviewTone: true,
};

export const defaultPanelVariant: ItemVariant = {
  border: "#b8d4f0",
  background: "#fafafa",
  badge: null,
  shell: {},
  reviewTone: true,
};

/** Yellow pending follow-up chrome. */
export const followUpFieldVariant: ItemVariant = {
  border: "#e6b800",
  background: "#fffbeb",
  badge: FOLLOW_UP_BADGE,
  shell: followUpShell,
  reviewTone: false,
};

export const followUpHeadingVariant: ItemVariant = {
  border: "#e6b800",
  background: "#fffbeb",
  badge: FOLLOW_UP_BADGE,
  shell: followUpShell,
  reviewTone: false,
};

export const followUpPanelVariant: ItemVariant = {
  border: "#e6b800",
  background: "#fffbeb",
  badge: FOLLOW_UP_BADGE,
  shell: followUpShell,
  reviewTone: false,
};

export const defaultVariants = branded<Variants, "variants">({
  field: defaultFieldVariant,
  heading: defaultHeadingVariant,
  panel: defaultPanelVariant,
});

export const followUpVariants = branded<Variants, "variants">({
  field: followUpFieldVariant,
  heading: followUpHeadingVariant,
  panel: followUpPanelVariant,
});
