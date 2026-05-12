import {
  BrowserRouter,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router";
import {
  credentialProvider,
  CredentialProvider,
} from "./hooks/useGoogleProvider";
import App from "./pages/App";
import Login from "./pages/Login";
import { useContext, useEffect } from "react";
import Welcome from "./pages/Welcome";
import TestFrame from "./pages/TestFrame";
import Upload from "./pages/Upload";
import FrameSelect from "./pages/FrameSelect";
import Preview from "./pages/Preview";

export function Entry() {
  const [credential, setCredential] = useContext(credentialProvider);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname == "/test-frame") return;
    const expiresAt = localStorage.getItem("credential_expires_at");

    // No credential → login
    if (!credential) {
      navigate("/login");
      return;
    }

    // Expired → clear + login
    if (expiresAt && Date.now() / 1000 >= parseInt(expiresAt)) {
      localStorage.removeItem("credential");
      localStorage.removeItem("credential_expires_at");
      setCredential(null);
      navigate("/login");
      return;
    }

    // Valid → DO NOTHING (let user navigate freely)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [credential, setCredential, navigate]);
  return (
    <Routes>
      <Route path="/" element={<Welcome />} />
      <Route path="/app" element={<App />} />
      <Route path="/frame-select" element={<FrameSelect />} />
      <Route path="/preview" element={<Preview />} />
      <Route path="/upload" element={<Upload />} />
      <Route path="/login" element={<Login />} />
      <Route path="/test-frame" element={<TestFrame />} />
    </Routes>
  );
}
