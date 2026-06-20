/** Catalogue entry for the add-item library sidebar (icon, title, item template). */
import type React from "react";
import type { ParamsDom } from "./_deps";

export type MenuItemDefinition<
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
> = {
  icon: React.ReactNode;
  title: string;
  n?: number;
  header: {
    [K in TypeNames]: {
      type: K;
      params: Params[K];
    };
  }[TypeNames];
};
