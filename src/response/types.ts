/**
 * School `types/response` + `types/form-response-react` viewer method contract.
 * Per-item answers are `{ meta, data }` string maps; hosts own how keys are used.
 */

export type Response = Record<"meta" | "data", Record<string, string>>;

export type ResponseSetter = {
  value: Response;
  setValue: null | (<K extends keyof Response>(key: K, value: Response[K]) => void);
};

/** What a fillable viewer registers on its internal `impRef`. */
export type ViewerMethods = {
  validate: (value: Response) => string | null;
  update?: (value?: Response) => Response;
};

/**
 * What the host attaches on `extra.impRef` — `getUseImpRefViewProps` exposes a
 * strict `update` that always returns a `Response` (defaults to empty).
 */
export type StrictViewerMethods = {
  validate: (value?: Response) => string | null;
  update: (value?: Response) => Response;
};
