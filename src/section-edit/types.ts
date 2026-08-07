/** Section edit types — see section-edit/README.md. */

/** Generic error bag — safe for any `T`, no assumption about its fields. */
export type Errors<T> = { [P in keyof T]?: string };
