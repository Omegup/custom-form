import { LengthHint } from "./LengthHint";

export const TooLongHint = ({
  current,
  limit,
}: {
  current: number;
  limit: number;
}) => (
  <LengthHint current={current} limit={limit} emphasize={current > limit}>
    characters{current > limit ? " — too long" : ""}
  </LengthHint>
);
