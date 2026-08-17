/**
 * Section review shell — school `section-review-ui/SectionReview`
 * `SectionReviewHOC`. Wires `FormItemHOC`, the slot walk (`reviewRender`),
 * and overlay submit callbacks (`reviewChanges`). Status, partition, and
 * overlay ownership live in sibling modules.
 *
 * All presentation is injected via {@link SectionReviewChrome} — this module
 * emits no HTML (see `.cursor/rules/no-html-outside-demo.mdc`). Overlays
 * render inline (sibling to content), never via `createPortal`.
 */
import { type Ref } from "react";
import type {
  Children,
  MetaDom,
  ParamsDom,
  RecursiveFormItem,
  SectionMetaDom,
  SIndexed,
  SomeFormItem,
  StrictViewerMethods,
  VariantsDom,
  ViewerMethods,
  Viewers,
} from "./_deps";
import { FormItemHOC, getUseImpRefViewProps } from "./_deps";
import { makeReviewRender } from "./reviewRender";
import { withComment, withFormItemEntry, withoutComment } from "./reviewChanges";
import { sectionOwnsOverlay } from "./sectionOwnsOverlay";
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

  const { renderSection, renderOverlays, ...itemChrome } = chrome;
  const reviewRender = makeReviewRender<TypeNames, Params, Variants>()(
    itemChrome,
  );

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
      tCommon,
      addition,
      setAddition,
      deleteCommentId,
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

    const submitComment = (text: string) => {
      if (!addition || addition.mode !== "comment") return;
      setChanges(withComment(changes, addition.originId, text));
      setAddition(null);
    };

    const confirmDeleteComment = () => {
      if (!deleteCommentId) return;
      setChanges(withoutComment(changes, deleteCommentId));
      setDeleteCommentId(null);
    };

    const submitFormItem = (payload: {
      comment?: string;
      formItem?: SomeFormItem<TypeNames, Params>;
      children?: RecursiveFormItem<TypeNames, Params, MetaDom<SIndexed>>[][];
    }) => {
      if (!addition || addition.mode !== "formItem") return;
      setChanges(
        withFormItemEntry(
          changes,
          addition.originId,
          { ...payload, date: lastPending },
          addition.replace != null ? addition.replace.index : null,
        ),
      );
      setAddition(null);
    };

    const overlayId = addition?.originId ?? deleteCommentId;

    return (
      <>
        {renderSection({
          deleted: section.header.deleted,
          title: section.header.title,
          description: section.header.description,
          i,
          multiSection,
          columns: renderSlots(section.items, "", section.header.deleted),
        })}
        {overlayId &&
        sectionOwnsOverlay(overlayId, section.items, changes)
          ? renderOverlays({
              addition,
              deleteCommentId,
              setAddition,
              clearDelete: () => setDeleteCommentId(null),
              onSubmitComment: submitComment,
              onConfirmDeleteComment: confirmDeleteComment,
              onSubmitFormItem: submitFormItem,
              tCommon,
            })
          : null}
      </>
    );
  };
};
