/**
 * Full-form review shell — school `form-response-ui/CustomFormResponses`
 * `CustomFormResponsesHOC`. Maps sections through `SectionReviewHOC`; no
 * validator aggregation (review is read-only).
 *
 * Host passes `ctx` and {@link FormReviewChrome} (no HTML in this module —
 * see `.cursor/rules/no-html-outside-demo.mdc`).
 */
import type { Ref } from "react";
import type {
  Children,
  MetaDom,
  ParamsDom,
  ReviewExtra,
  SectionMetaDom,
  SectionReviewContext,
  SectionReviewHeader,
  StrictViewerMethods,
  VariantsDom,
  ViewerMethods,
  Viewers,
} from "./_deps";
import { SectionReviewHOC } from "./_deps";
import type { CustomFormReviewProps, FormReviewChrome } from "./types";

type ViewerExtra = ReviewExtra & { impRef: Ref<ViewerMethods> };
type HostExtra = ReviewExtra & { impRef: Ref<StrictViewerMethods> };

export const CustomFormReviewHOC = <
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
  Variants extends VariantsDom<TypeNames>,
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
  variants: Variants,
  followUpVariants: Variants,
  chrome: FormReviewChrome<TypeNames, Params>,
) => {
  const { renderHeader, renderForm, ...sectionChrome } = chrome;
  const SectionReview = SectionReviewHOC<
    TypeNames,
    Params,
    Variants,
    Context,
    SectionConfig
  >(viewers, sectionChrome);

  return <SectionMeta extends SectionMetaDom, Meta extends MetaDom>(
    props: CustomFormReviewProps<
      TypeNames,
      Params,
      Context,
      SectionConfig,
      SectionMeta,
      Meta
    >,
  ) => {
    const {
      header,
      sections,
      responses,
      lastPending,
      changes,
      setChanges,
      addition,
      setAddition,
      deleteCommentId,
      setDeleteCommentId,
      renderFormItemsEditor,
      tCommon,
      showDeleted,
      ctx,
      children,
    } = props;

    const multiSection = sections.filter((s) => !s.header.deleted).length > 1;

    return renderForm({
      header: header != null ? renderHeader(header) : null,
      sections: (
        <>
          {sections.map(
            (section, i) =>
              (showDeleted || !section.header.deleted) && (
                <SectionReview
                  key={section.header.id}
                  ctx={ctx}
                  multiSection={multiSection}
                  section={section}
                  responses={responses}
                  lastPending={lastPending}
                  changes={changes}
                  setChanges={setChanges}
                  addition={addition}
                  setAddition={setAddition}
                  deleteCommentId={deleteCommentId}
                  setDeleteCommentId={setDeleteCommentId}
                  renderFormItemsEditor={renderFormItemsEditor}
                  variants={variants}
                  followUpVariants={followUpVariants}
                  tCommon={tCommon}
                  i={i}
                />
              ),
          )}
        </>
      ),
      children,
    });
  };
};
