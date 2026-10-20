export const ReviewValue = ({
  value,
  border,
  background,
  mute,
  emphasis,
}: {
  value: string;
  border: string;
  background: string;
  mute: boolean;
  emphasis: boolean;
}) => (
  <div
    style={{
      padding: "6px 8px",
      border: `1px solid ${border}`,
      borderRadius: 4,
      background: mute ? "#f0f0f0" : background,
      fontWeight: emphasis ? 700 : 400,
      color: mute ? "#666" : undefined,
    }}
  >
    {value || (
      <em style={{ color: "#999", fontWeight: 400 }}>No answer</em>
    )}
  </div>
);
