import { GhostButton } from "./GhostButton";

export const ClearIcon = ({ onClick }: { onClick: () => void }) => (
  <GhostButton onClick={onClick} label="Clear draft answer" margin="0 4px">
    ×
  </GhostButton>
);
