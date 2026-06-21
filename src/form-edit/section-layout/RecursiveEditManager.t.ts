import type { ParamsDom } from "../../form";
import type { MetaDom } from "../../recursive-form";
import type { MoveActions } from "../../move-actions/MoveActions.t";
import type { SectionDom } from "../flat-raw-actions";
import type { SectionEditNodes } from "./SectionEditNodes.t";

export type RecursiveEditManager<
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
  Meta extends MetaDom<{ index: number; total: number; sIndex: number }>,
  SectionConfig extends SectionDom = SectionDom,
> = {
  resetAutofocus: () => void;
  autofocus: unknown;
  item: SectionConfig;
  nodes: SectionEditNodes<TypeNames, Params, Meta>;
  actions: MoveActions;
  setNodes: (nodes: SectionEditNodes<TypeNames, Params, Meta>) => void;
};
