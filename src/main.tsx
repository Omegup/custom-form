import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import { FormTest } from "./form/form.test";
import { MoveActionsTest } from "./move-actions/Actions.test";

const App = () => {
  const [tab, setTab] = useState<("form" | "move-actions")>("form");
  return (
    <div>
      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        <button disabled={tab === "form"} onClick={() => setTab("form")} style={{ backgroundColor: tab === "form" ? "gray" : "white", padding: 10, borderRadius: 5, border: "none", cursor: tab === "form" ? "not-allowed" : "pointer" }}>Form</button>
        <button disabled={tab === "move-actions"} onClick={() => setTab("move-actions")} style={{ backgroundColor: tab === "move-actions" ? "gray" : "white", padding: 10, borderRadius: 5, border: "none", cursor: tab === "move-actions" ? "not-allowed" : "pointer" }}>Move actions</button>
      </div>
      {tab === "form" ? <FormTest /> : <MoveActionsTest />}
    </div>
  )
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
