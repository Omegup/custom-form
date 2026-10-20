import { Row } from "./Row";

export const DeletedModeBar = ({
  mode,
  onChange,
}: {
  mode: "show" | "jump" | "hide";
  onChange: (mode: "show" | "jump" | "hide") => void;
}) => (
  <Row gap={8} align="center" wrap={false} fontSize={null}>
    <button disabled={mode === "show"} onClick={() => onChange("show")}>
      Show
    </button>
    <button disabled={mode === "jump"} onClick={() => onChange("jump")}>
      Show but Jump
    </button>
    <button disabled={mode === "hide"} onClick={() => onChange("hide")}>
      Hide
    </button>
  </Row>
);
