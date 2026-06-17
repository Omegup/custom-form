import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { MoveActionsTest } from "./move-actions/Actions.test";


createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <MoveActionsTest />
  </StrictMode>,
);
