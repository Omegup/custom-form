import type { ReactNode } from "react";
import type {
  MetaDom,
  ParamsDom,
  Response,
  VariantsDom,
} from "./_deps";
import type { FillWalk } from "./responderWalk.t";

export const renderFillClearIcon = <
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
  Variants extends VariantsDom,
  Meta extends MetaDom,
>(
  walk: FillWalk<TypeNames, Params, Variants, Meta>,
  id: string,
  oldValue: Response | null,
  current: Response | null,
): ReactNode =>
  oldValue && current
    ? walk.chrome.renderClearIcon(() => walk.live.setResponse(id, undefined))
    : null;
