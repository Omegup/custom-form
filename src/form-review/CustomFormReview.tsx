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
  SectionHeader,
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
  Variants extends VariantsDom,
  Context extends SectionReviewContext,
  SectionConfig extends SectionHeader,
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
      Variants,
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
      setAddition,
      setDeleteCommentId,
      renderFormItemsEditor,
      variants,
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
                  setAddition={setAddition}
                  setDeleteCommentId={setDeleteCommentId}
                  renderFormItemsEditor={renderFormItemsEditor}
                  variants={variants}
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
