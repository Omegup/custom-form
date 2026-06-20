import type { ParamsDom, SomeFormItem, TypedFormItem } from "../form-edit/_deps";
import type { MetaDom, Recursive, RecursiveT } from "./Recursive.t";

export type RecursiveFormItem<
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
  Meta extends MetaDom,
  NoMeta extends 0 | 1 = 0,
> = RecursiveT<SomeFormItem<TypeNames, Params>, Meta, NoMeta>;

export type RecursiveTypedFormItem<
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
  K extends TypeNames,
  Meta extends MetaDom,
> = Recursive<SomeFormItem<TypeNames, Params>, TypedFormItem<Params, K>, Meta>;
