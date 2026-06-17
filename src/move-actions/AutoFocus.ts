export type AutoFocusCtx<Ctx, T> = Ctx & {
  setAutoFocus: (id?: string) => AutoFocusCtx<Ctx, T>;
  autoFocused: (id: string) => T | null;
};
