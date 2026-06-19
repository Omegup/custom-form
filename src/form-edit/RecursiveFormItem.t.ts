import type { ParamsDom, SomeFormItem, TypedFormItem } from "../form/form.t";
import type { Recursive } from "../Recursive.t";

export type RecursiveFormItem<
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
> = Recursive<SomeFormItem<TypeNames, Params>>


export type RecursiveTypedFormItem<
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
  K extends TypeNames,
> = Recursive<SomeFormItem<TypeNames, Params>, TypedFormItem<Params, K>>
