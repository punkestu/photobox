import { useContext, useEffect } from "react";
import { Navigate, Outlet } from "react-router";
import { credentialProvider } from "../hooks/useGoogleProvider";

function AuthMiddleware() {
  const [credential, setCredential] = useContext(credentialProvider);

  useEffect(() => {
    // Expired → clear
    const expiresAt = localStorage.getItem("credential_expires_at");
    const isExpired = expiresAt && Date.now() / 1000 >= parseInt(expiresAt);
    if (isExpired) {
      localStorage.removeItem("credential");
      localStorage.removeItem("credential_expires_at");
      setCredential(null);
    }
  }, [credential, setCredential]);

  // No credential → login
  if (!credential) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export default AuthMiddleware;
