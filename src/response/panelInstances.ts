import type { Response } from "./types";

/** Panel `data.instances` — comma-separated instance ids (`0,1,…`). */
export const PANEL_INSTANCES_KEY = "instances";

export const parsePanelInstanceIds = (response: Response): string[] => {
  const raw = response.data[PANEL_INSTANCES_KEY];
  if (!raw) return ["0"];
  const ids = raw.split(",").filter((s) => s.length > 0);
  return ids.length ? ids : ["0"];
};

/** Suffixes passed to `getChild` / `renderSlots` (`:0`, `:1`, …). */
export const panelInstanceSuffixes = (
  multiple: boolean,
  response: Response,
): string[] => {
  if (!multiple) return [""];
  return parsePanelInstanceIds(response).map((id) => `:${id}`);
};

export const nextPanelInstanceId = (response: Response): string => {
  const ids = parsePanelInstanceIds(response);
  const max = ids.reduce((m, id) => Math.max(m, Number(id) || 0), 0);
  return String(max + 1);
};

export const withPanelInstances = (
  response: Response,
  ids: string[],
): Response => ({
  ...response,
  data: {
    ...response.data,
    [PANEL_INSTANCES_KEY]: ids.join(","),
  },
});
