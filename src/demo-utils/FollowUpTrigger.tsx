import { IconButton } from "./IconButton";

export const FollowUpTrigger = ({
  onClick,
  label,
}: {
  onClick: () => void;
  label: string;
}) => (
  <IconButton onClick={onClick} label={label}>
    💬
  </IconButton>
);
