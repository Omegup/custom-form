import type { Response } from "./_deps";
import type { ResponderState } from "./types";

export const responderState = (args: {
  error: string | null;
  oldValue: Response | null;
  remark: string | null;
  isFollowUpTree: boolean;
}): ResponderState => {
  if (args.error) return "error";
  if (args.isFollowUpTree && !args.oldValue) return "change";
  if (args.oldValue && args.remark != null) return "change";
  if (args.oldValue) return "old";
  return "default";
};
