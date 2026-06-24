export type SetAutoFocus<Ctx> = Ctx & {
  setAutoFocus: (id?: string) => SetAutoFocus<Ctx>;
};
export type AutoFocus<Ctx, T> = SetAutoFocus<Ctx & {
  autoFocused: (id: string) => T | null;
}>
