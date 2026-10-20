import { IconButton } from "./IconButton";

const ACTION = {
  lock: { glyph: "🔒", label: "Locked — add remark to unlock" },
  unlock: { glyph: "🔓", label: "Unlocked by remark — remove remark" },
} as const;

export const ReviewLock = ({
  kind,
  onClick,
}: {
  kind: "lock" | "unlock";
  onClick: () => void;
}) => {
  const { glyph, label } = ACTION[kind];
  return (
    <IconButton onClick={onClick} label={label}>
      {glyph}
    </IconButton>
  );
};
