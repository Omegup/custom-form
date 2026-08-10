/**
 * Minimal `Theme` stand-in for school's `school-style` `Theme` — only the
 * tokens `Components/` actually read. Hosts pass `defaultTheme` (or their own)
 * via `DnDTree` / `TreeNodeComponent`'s `ctx.theme`.
 */
export type Theme = {
  colors: {
    backgroundSecondary: string;
    backgroundOverlay: string;
    blue_light: string;
    blue: string;
    gray: string;
    blue_light_400: string;
  };
};

export const defaultTheme: Theme = {
  colors: {
    backgroundSecondary: "#f7f8fa",
    backgroundOverlay: "#e2e5ea",
    blue_light: "#4a90d9",
    blue: "#4a90d9",
    gray: "#9ca3af",
    blue_light_400: "#93c5fd",
  },
};
