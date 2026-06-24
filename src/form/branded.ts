import type { Branded } from "./branded.t";

export const branded = <T, B>(x: Omit<T, keyof Branded<{}, B>>) => x as Branded<T, B>
