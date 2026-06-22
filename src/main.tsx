/**
 * Legacy Vite entry — demos live in Storybook (`pnpm storybook`).
 */
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

const App = () => (
  <div style={{ padding: 24, fontFamily: "system-ui, sans-serif" }}>
    <h1 style={{ marginTop: 0 }}>slot-tree</h1>
    <p>
      Module demos are in Storybook. Run <code>pnpm storybook</code> and open{" "}
      <a href="http://localhost:6006">http://localhost:6006</a>.
    </p>
  </div>
);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
