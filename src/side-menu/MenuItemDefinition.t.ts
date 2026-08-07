/** Library catalog entry — school `types/edit-form-react` `MenuItemDefinition`. */
import type { ReactNode } from "react";
import type { ParamsDom } from "./_deps";

export type MenuItemDefinition<
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
> = {
  icon?: ReactNode;
  title: string;
  /** Column slots for container items (e.g. panel). Default 0. */
  n?: number;
  header: {
    [K in TypeNames]: {
      type: K;
      params: Params[K];
    };
  }[TypeNames];
};
