import type { ReactNode } from "react";
import type { ResponseSetter } from "../response";
import type { ExtraDom } from "./form.t";

/**
 * Viewer extra shared by fill and review — error, deleted, icon, appendix,
 * response. Review adds `status` on top.
 */
export type PhaseItemExtra = ExtraDom & {
  error: boolean | string | null;
  parentDeleted: boolean;
  index: number;
  icon: ReactNode;
  appendix: ReactNode;
  response: ResponseSetter;
};
