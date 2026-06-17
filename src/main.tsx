import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { FormTest } from "./form/form.test";


createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <FormTest />
  </StrictMode>,
);
