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
import { lazy, Suspense, useContext, useEffect } from "react";

const Welcome = lazy(() => import("./pages/Welcome"));
const TestFrame = lazy(() => import("./pages/TestFrame"));
const Upload = lazy(() => import("./pages/Upload"));
const FrameSelect = lazy(() => import("./pages/FrameSelect"));
const Preview = lazy(() => import("./pages/Preview"));
const Loading = lazy(() => import("./pages/Loading"));

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
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/app" element={<App />} />
        <Route path="/frame-select" element={<FrameSelect />} />
        <Route path="/preview" element={<Preview />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/login" element={<Login />} />
        <Route path="/test-frame" element={<TestFrame />} />
      </Routes>
    </Suspense>
  );
}
