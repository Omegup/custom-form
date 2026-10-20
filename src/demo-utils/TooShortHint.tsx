import { LengthHint } from "./LengthHint";

export const TooShortHint = ({
  current,
  limit,
}: {
  current: number;
  limit: number;
}) => (
  <LengthHint current={current} limit={limit} emphasize={current < limit}>
    characters minimum{current < limit ? " — too short" : ""}
  </LengthHint>
);
