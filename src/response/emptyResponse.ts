import type { Response } from "./types";

/** School default when a slot has no answer yet / `update` returns nothing. */
export const emptyResponse = (): Response => ({ meta: {}, data: {} });
