import { useContext, useEffect } from "react";
import { GoogleLoginButton } from "../components/GoogleLogin";
import { credentialProvider } from "../hooks/useGoogleProvider";
import { useNavigate } from "react-router";

export default function Login() {
  const [credential, setCredential] = useContext(credentialProvider);
  const navigate = useNavigate();
  useEffect(() => {
    const expiresAt = localStorage.getItem("credential_expires_at");

    // No credential → login
    if (
      !credential ||
      (expiresAt && Date.now() / 1000 >= parseInt(expiresAt))
    ) {
      return;
    }

    navigate("/");
  }, [credential, setCredential, navigate]);
  return (
    <main className="w-screen h-screen flex flex-col text-white justify-center items-center bg-black gap-3">
      <h1 className="font-black text-3xl">PhotoBox</h1>
      <GoogleLoginButton />
    </main>
  );
}
