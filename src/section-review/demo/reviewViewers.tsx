import type { CSSProperties, ReactNode } from "react";
import {
  defaultVariant,
  followUpVariant,
} from "../../form-item-editor/demo/itemVariants";
import {
  headingView,
  panelRepeatChildren,
  panelView,
} from "../../response/demo/nestedItems";
import type { ResponseSetter, ReviewStatus } from "./library";
import { branded } from "./library";
import type * as types from "./sectionReviewDemoTypes.t";
import { ReviewFieldViewer } from "./ReviewFieldViewer";

type ReviewFieldProps = {
  formItem: { params: { name: string; required: boolean } };
  extra: {
    response: ResponseSetter;
    status: ReviewStatus;
    parentDeleted: boolean;
    icon: ReactNode | null;
    appendix: ReactNode | null;
  };
  variant: {
    border: string;
    background: string;
    badge: ReactNode;
    shell: CSSProperties;
    reviewTone: boolean;
  };
};

export const reviewFieldView = ({ props }: { props: ReviewFieldProps }) => (
  <ReviewFieldViewer
    name={props.formItem.params.name}
    required={props.formItem.params.required}
    extra={props.extra}
    variant={props.variant}
  />
);

export const reviewViewers = {
  field: { viewer: reviewFieldView },
  heading: {
    viewer: headingView,
    repeatChildren: () => [""],
  },
  panel: {
    viewer: panelView,
    repeatChildren: panelRepeatChildren,
  },
};

const variants = branded<types.Variants, "variants">(defaultVariant);
const followUpVariants = branded<types.Variants, "variants">(followUpVariant);

export const reviewVariants: Record<"default" | "change", types.Variants> = {
  default: variants,
  change: followUpVariants,
};
