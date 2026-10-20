export const DropLine = () => {
  const color = "#4a90d9";
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        height: 0,
        overflow: "visible",
      }}
    >
      <div
        style={{
          width: 0,
          height: 0,
          borderTop: "5px solid transparent",
          borderBottom: "5px solid transparent",
          borderLeft: `8px solid ${color}`,
        }}
      />
      <div style={{ width: "100%", height: 2, background: color }} />
    </div>
  );
};
