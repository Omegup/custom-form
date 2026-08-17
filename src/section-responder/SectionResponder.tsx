/**
 * Section fill shell — school `section-responder-ui/SectionResponder`
 * `SectionResponderHOC`. Wires `FormItemHOC` and the slot walk
 * (`renderFillColumns`). Aggregates item validators into a section-level
 * `validate` / `update` / `getKeys`.
 *
 * Reviewer follow-ups (`followUpItems`) render **under their origin item**
 * (same placement as section-review appendix), not as design-tree siblings.
 *
 * All presentation is injected via {@link SectionResponderChrome} — this
 * module emits no HTML (see `.cursor/rules/no-html-outside-demo.mdc`).
 */
import { useImperativeHandle, useRef, type Ref } from "react";
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
import { renderFillColumns } from "./responderRender";
import { sectionValidator } from "./sectionValidator";
import type {
  ResponderExtra,
  SectionResponderChrome,
  SectionResponderContext,
  SectionResponderHeader,
  SectionResponderProps,
} from "./types";

type ViewerExtra = ResponderExtra & { impRef: Ref<ViewerMethods> };
type HostExtra = ResponderExtra & { impRef: Ref<StrictViewerMethods> };

export const SectionResponderHOC = <
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
  Variants extends VariantsDom,
  Context extends SectionResponderContext,
  SectionConfig extends SectionResponderHeader,
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
  chrome: SectionResponderChrome,
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
      ResponderExtra & Children,
      Context
    >(),
  );

  return <SectionMeta extends SectionMetaDom, Meta extends MetaDom>(
    props: SectionResponderProps<
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
      setResponse,
      impRef,
      getError,
      ctx,
      old,
      variants,
      followUpItems,
    } = props;

    const validators = useRef<Record<string, StrictViewerMethods | null>>(
      {},
    );

    useImperativeHandle(impRef, () => sectionValidator(validators.current));

    return chrome.renderSection({
      deleted: section.header.deleted,
      title: section.header.title,
      description: section.header.description,
      i,
      multiSection,
      columns: renderFillColumns(
        chrome,
        {
          responses,
          setResponse,
          getError,
          old,
          variants,
          followUpItems,
          validators: validators.current,
          renderFormItem: ({ formItem, variant, extra }) => (
            <FormItem
              viewProps={{ ctx, formItem, variant, extra }}
              renderCard={(view) => view}
            />
          ),
        },
        section.items,
        section.header.deleted,
      ),
    });
  };
};
