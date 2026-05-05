import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Entry } from "./Entry.jsx";
import { CredentialProvider } from "./hooks/useGoogleProvider.jsx";
import { BrowserRouter } from "react-router";
import { TimerProvider } from "./hooks/useTimerProvider.jsx";
import { MemoryProvider } from "./hooks/useMemoryProvider.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <CredentialProvider>
        <TimerProvider>
          <MemoryProvider>
            <BrowserRouter>
              <Entry />
            </BrowserRouter>
          </MemoryProvider>
        </TimerProvider>
      </CredentialProvider>
    </GoogleOAuthProvider>
  </StrictMode>,
);
