export const RemarkCard = ({ children }: { children: string }) => (
  <div
    style={{
      marginTop: 4,
      padding: 8,
      background: "#fff3cd",
      borderLeft: "4px solid #ffc107",
      color: "#856404",
      fontSize: 12,
    }}
  >
    {children}
  </div>
);
