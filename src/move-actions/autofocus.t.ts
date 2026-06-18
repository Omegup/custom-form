export type AutoFocus<Ctx, T> = Ctx & {
  setAutoFocus: (id?: string) => AutoFocus<Ctx, T>;
  autoFocused: (id: string) => T | null;
};
