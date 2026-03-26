import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import CraveWebsite from "../crave-cookie-website";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <CraveWebsite />
  </StrictMode>
);
