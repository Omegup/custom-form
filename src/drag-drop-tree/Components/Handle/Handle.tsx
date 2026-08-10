import type { CSSProperties } from "react";
import type { Theme } from "../../theme";

type VariantTheme = {
  background: string;
  dotColor: string;
};

export const unselectedVertical = (theme: Theme): VariantTheme => ({
  background: theme.colors.backgroundOverlay,
  dotColor: theme.colors.gray,
});
export const unselectedHorizontal = (theme: Theme): VariantTheme => ({
  background: "transparent",
  dotColor: theme.colors.gray,
});
export const selectedVertical = (theme: Theme): VariantTheme => ({
  background: theme.colors.blue,
  dotColor: theme.colors.blue_light,
});
export const selectedHorizontal = (theme: Theme): VariantTheme => ({
  background: "transparent",
  dotColor: theme.colors.blue_light,
});
export const overVertical = (theme: Theme): VariantTheme => ({
  background: theme.colors.blue_light_400,
  dotColor: theme.colors.blue,
});
export const overHorizontal = (theme: Theme): VariantTheme => ({
  background: "transparent",
  dotColor: theme.colors.blue,
});

const handleBase: CSSProperties = {
  padding: "15px 10px",
  display: "grid",
  gap: 5,
};

export const HandleVertical = ({
  theme,
  variant,
}: {
  theme: Theme;
  variant: (theme: Theme) => VariantTheme;
}) => {
  const { background, dotColor } = variant(theme);
  return (
    <div style={{ ...handleBase, gridTemplateColumns: "repeat(2, 1fr)", background }}>
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          style={{ width: 4, height: 4, borderRadius: "50%", backgroundColor: dotColor }}
        />
      ))}
    </div>
  );
};

export const HandleHorizontal = ({
  theme,
  variant,
}: {
  theme: Theme;
  variant: (theme: Theme) => VariantTheme;
}) => {
  const { background, dotColor } = variant(theme);
  return (
    <div style={{ ...handleBase, gridTemplateColumns: "repeat(3, 1fr)", background }}>
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          style={{ width: 5, height: 5, borderRadius: "50%", backgroundColor: dotColor }}
        />
      ))}
    </div>
  );
};
