/**
 * Shared ItemVariant values for field / heading / panel demos.
 * One chrome object for every type — viewers read `variant.border`, never
 * a per-type bag.
 */
import type { ItemVariant, Variants } from "./formItemEditorDemoTypes.t";
import { branded } from "./library";
import { FollowUpBadge } from "../../demo-utils";

export const FOLLOW_UP_BADGE = <FollowUpBadge />;

const followUpShell = {
  padding: 8,
  borderRadius: 6,
  background: "#fffbeb",
  border: "1px solid #e6b800",
} as const;

/** Black / neutral chrome — design items and settled answers. */
export const defaultVariant: ItemVariant = {
  border: "#ccc",
  background: "#fafafa",
  badge: null,
  shell: {},
  errorBorder: "#c00",
  reviewTone: true,
};

/** Yellow pending follow-up chrome. */
export const followUpVariant: ItemVariant = {
  border: "#e6b800",
  background: "#fffbeb",
  badge: FOLLOW_UP_BADGE,
  shell: followUpShell,
  reviewTone: false,
};

export const defaultVariants = branded<Variants, "variants">(defaultVariant);
export const followUpVariants = branded<Variants, "variants">(followUpVariant);
