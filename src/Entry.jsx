import {
  BrowserRouter,
  Route,
  Routes,
  useNavigate,
} from "react-router";
import {
  credentialProvider,
  CredentialProvider,
} from "./hooks/useGoogleProvider";
import App from "./pages/App";
import Login from "./pages/Login";
import { useContext, useEffect } from "react";
import GetDrive from "./pages/GetDrive";

export function Entry() {
  const [credential, setCredential] = useContext(credentialProvider);
  const navigate = useNavigate();

  useEffect(() => {
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
  }, [credential, setCredential, navigate]);
  return (
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/finish" element={<GetDrive />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}
