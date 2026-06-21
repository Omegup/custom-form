import type { ContextDom, ParamsDom } from "../../form";
import type { AutoFocus } from "../../move-actions/autofocus.t";
import type { MetaDom } from "../../recursive-form";
import type { Clone, GetActionsArgs, SectionDom } from "../flat-raw-actions";
import type { SectionMetaDom, SectionWithItems } from "./SectionWithItems.t";

export type SectionEditArgs<
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
  Context extends AutoFocus<ContextDom, unknown>,
  SectionConfig extends SectionDom,
  SectionMeta extends SectionMetaDom = SectionMetaDom<{ index: number; total: number }>,
  Meta extends MetaDom = MetaDom,
> = {
  clone: Clone<TypeNames, Params, Context, SectionConfig>;
  actions: GetActionsArgs<TypeNames, Params, Context, SectionConfig>;
  sections: SectionWithItems<
    TypeNames,
    Params,
    SectionConfig,
    SectionMeta,
    Meta
  >[];
  section: SectionWithItems<
    TypeNames,
    Params,
    SectionConfig,
    SectionMeta,
    Meta
  >;
  i: number;
};
