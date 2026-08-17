/**
 * Full-form fill shell — school `form-responder-ui/CustomFormResponder`
 * `CustomFormResponderHOC`. Maps sections through `SectionResponderHOC` and
 * aggregates section validators into a form-level `validate` / `update` /
 * `getKeys`.
 *
 * Host passes `ctx`, `variants`, and {@link FormResponderChrome} (no HTML
 * in this module — see `.cursor/rules/no-html-outside-demo.mdc`).
 */
import { useImperativeHandle, useRef, type Ref } from "react";
import type {
  Children,
  MetaDom,
  ParamsDom,
  ResponderExtra,
  SectionMetaDom,
  SectionResponderContext,
  SectionHeader,
  SectionValidator,
  StrictViewerMethods,
  VariantsDom,
  ViewerMethods,
  Viewers,
} from "./_deps";
import { SectionResponderHOC } from "./_deps";
import type {
  CustomFormResponderProps,
  FormResponderChrome,
} from "./types";

type ViewerExtra = ResponderExtra & { impRef: Ref<ViewerMethods> };
type HostExtra = ResponderExtra & { impRef: Ref<StrictViewerMethods> };

export const CustomFormResponderHOC = <
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
  Variants extends VariantsDom,
  Context extends SectionResponderContext,
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
  chrome: FormResponderChrome,
) => {
  const { renderHeader, renderForm, ...sectionChrome } = chrome;
  const SectionResponder = SectionResponderHOC<
    TypeNames,
    Params,
    Variants,
    Context,
    SectionConfig
  >(viewers, sectionChrome);

  return <
    SectionMeta extends SectionMetaDom,
    Meta extends MetaDom,
  >(
    props: CustomFormResponderProps<
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
      old,
      getError,
      sections,
      responses,
      setResponse,
      impRef,
      showDeleted,
      variants,
      followUpItems,
      ctx,
      children,
    } = props;

    const validators = useRef<Record<string, SectionValidator | null>>({});

    useImperativeHandle(
      impRef,
      (): SectionValidator => ({
        update: (values) =>
          Object.values(validators.current)
            .filter((x): x is SectionValidator => x != null)
            .reduce((acc, v) => v.update(acc), values),
        validate: (values) => {
          const errors: Record<string, string | null> = {};
          for (const section of sections) {
            if (section.header.deleted) continue;
            const ref = validators.current[section.header.id];
            if (!ref) continue;
            Object.assign(errors, ref.validate(values));
          }
          return errors;
        },
        getKeys: () =>
          Object.values(validators.current).flatMap((v) => v?.getKeys() ?? []),
      }),
    );

    const multiSection =
      sections.filter((s) => !s.header.deleted).length > 1;

    return renderForm({
      header: header != null ? renderHeader(header) : null,
      sections: (
        <>
          {sections.map(
            (section, i) =>
              (showDeleted || !section.header.deleted) && (
                <SectionResponder
                  key={section.header.id}
                  ctx={ctx}
                  multiSection={multiSection}
                  section={section}
                  responses={responses}
                  old={old}
                  setResponse={setResponse}
                  getError={getError}
                  impRef={(ref) => {
                    validators.current[section.header.id] = ref;
                  }}
                  variants={variants}
                  followUpItems={followUpItems}
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
