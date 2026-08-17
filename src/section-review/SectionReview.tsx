/**
 * Section review shell — school `section-review-ui/SectionReview`
 * `SectionReviewHOC`. Wires `FormItemHOC` and the slot walk (`reviewRender`).
 * Overlay editors are **host-owned**: this HOC only opens them via
 * `setAddition` / `setDeleteCommentId`. The call site mounts chrome with
 * {@link reviewOverlayActions}.
 *
 * All presentation is injected via {@link SectionReviewChrome} — this module
 * emits no HTML (see `.cursor/rules/no-html-outside-demo.mdc`).
 */
import { type Ref } from "react";
import type {
  Children,
  MetaDom,
  ParamsDom,
  SectionMetaDom,
  StrictViewerMethods,
  VariantsDom,
  ViewerMethods,
  Viewers,
} from "./_deps";
import { FormItemHOC, getUseImpRefViewProps } from "./_deps";
import { makeReviewRender } from "./reviewRender";
import type {
  ReviewExtra,
  SectionReviewChrome,
  SectionReviewContext,
  SectionReviewHeader,
  SectionReviewProps,
} from "./types";

type ViewerExtra = ReviewExtra & { impRef: Ref<ViewerMethods> };
type HostExtra = ReviewExtra & { impRef: Ref<StrictViewerMethods> };

export const SectionReviewHOC = <
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
  Variants extends VariantsDom,
  Context extends SectionReviewContext,
  SectionConfig extends SectionReviewHeader,
>(
  viewers: Viewers<
    TypeNames,
    Params,
    Variants,
    ViewerExtra & Children,
    HostExtra,
    Context,
    string
  >,
  chrome: SectionReviewChrome<TypeNames, Params>,
) => {
  const FormItem = FormItemHOC<
    TypeNames,
    Params,
    Variants,
    ViewerExtra,
    Context,
    HostExtra
  >(
    viewers,
    getUseImpRefViewProps<
      TypeNames,
      Params,
      Variants,
      ReviewExtra & Children,
      Context
    >(),
  );

  const reviewRender = makeReviewRender<TypeNames, Params, Variants>()(chrome);

  return <SectionMeta extends SectionMetaDom, Meta extends MetaDom>(
    props: SectionReviewProps<
      TypeNames,
      Params,
      Variants,
      Context,
      SectionConfig,
      SectionMeta,
      Meta
    >,
  ) => {
    const {
      multiSection,
      section,
      i,
      responses,
      ctx,
      changes,
      setChanges,
      lastPending,
      variants,
      setAddition,
      setDeleteCommentId,
      renderFormItemsEditor,
    } = props;

    const { renderSlots } = reviewRender<Meta>({
      responses,
      changes,
      setChanges,
      setAddition,
      setDeleteCommentId,
      lastPending,
      variants,
      renderFormItemsEditor,
      renderFormItem: ({ formItem, variant, extra }) => (
        <FormItem
          viewProps={{ ctx, formItem, variant, extra }}
          renderCard={(view) => view}
        />
      ),
    });

    return chrome.renderSection({
      deleted: section.header.deleted,
      title: section.header.title,
      description: section.header.description,
      i,
      multiSection,
      columns: renderSlots(section.items, "", section.header.deleted),
    });
  };
};
