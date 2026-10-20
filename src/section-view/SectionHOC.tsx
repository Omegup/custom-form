/**
 * Section render composition — school `react-packages/form-edit-react/Section.tsx`
 * `SectionHOC`. Pure wiring: builds the section's edit manager
 * (`getSectionEdit`), resolves the add-item renderer for this section, and
 * hands everything to `renderEdit` (e.g. `ColumnsEdit`).
 *
 * `useRenderAddItem` is injected, not imported — matches school (and this
 * repo's dependency rule: `section-view` does not import `side-menu`). Pass
 * `makeUseRenderAddItem(...)` from `side-menu` at the call site.
 */
import type { ReactNode } from "react";
import type {
  ContextDom,
  ExtraDom,
  FlatFormItemEditSession,
  ParamsDom,
  SectionDom,
  VariantsDom,
} from "./_deps";
import { getSectionEdit } from "./_deps";
import type { NodeIndex, RecursiveEditProps, RenderFormItem, SectionProps } from "./types";

export const SectionHOC = <
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
  Variants extends VariantsDom,
  SectionConfig extends SectionDom,
  Context extends ContextDom,
  Extra extends ExtraDom,
>(args: {
  renderEdit: (
    props: RecursiveEditProps<TypeNames, Params, SectionConfig>,
  ) => ReactNode;
  useRenderAddItem: (
    setAddItem: (session: FlatFormItemEditSession<TypeNames, Params>) => void,
  ) => (node: NodeIndex) => ReactNode;
  renderTitle: (
    props: SectionProps<TypeNames, Params, Variants, SectionConfig, Context, Extra>,
  ) => ReactNode;
  renderFormItem: RenderFormItem<TypeNames, Params, Variants, SectionConfig, Context, Extra>;
}) => {
  const { renderEdit, useRenderAddItem, renderTitle, renderFormItem } = args;
  const Section = (
    props: SectionProps<TypeNames, Params, Variants, SectionConfig, Context, Extra>,
  ) => {
    const addItem = useRenderAddItem(props.setAddItem);
    return renderEdit({
      edit: getSectionEdit(props.args, props.clone, props.section, props.sIndex, props.jump),
      title: renderTitle(props),
      render: { addItem, node: renderFormItem(props) },
    });
  };
  return Section;
};
