import type { AutoFocus } from "./autofocus.t";

export type AutoFocusState = { id: string; value: boolean } | null;

export const autofocusCtx = <Ctx>(
  ctx: Ctx,
  focused: AutoFocusState,
): AutoFocus<
  Ctx & { focused: AutoFocusState },
  boolean
> => ({
  ...ctx,
  focused,
  setAutoFocus: (id) =>
    autofocusCtx(ctx, id ? { id, value: !focused?.value } : null),
  autoFocused: (id) => (id === focused?.id ? focused.value : null),
});
