export const CommentCard = ({
  text,
  onEdit,
}: {
  text: string;
  onEdit: () => void;
}) => (
  <div
    style={{
      marginTop: 4,
      padding: 8,
      background: "#e7f1ff",
      borderLeft: "4px solid #4285f4",
      fontSize: 13,
      display: "flex",
      justifyContent: "space-between",
      gap: 8,
    }}
  >
    <span>💬 {text}</span>
    <button
      type="button"
      aria-label="Edit comment"
      onClick={onEdit}
      style={{
        border: "none",
        background: "transparent",
        cursor: "pointer",
        fontSize: 14,
        lineHeight: 1,
      }}
    >
      ✎
    </button>
  </div>
);
