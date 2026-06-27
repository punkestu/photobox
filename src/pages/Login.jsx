import { useContext, useEffect } from "react";
import { GoogleLoginButton } from "../components/GoogleLogin";
import { credentialProvider } from "../hooks/useGoogleProvider";
import { useNavigate } from "react-router";
import Logo from "../assets/Logo_border_typo_180px.webp";

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
    <main className="w-screen h-screen flex flex-col justify-center items-center bg-red-900 bg-halftone gap-6">
      <img src={Logo} width={240} fetchPriority="high" alt="Logo" />
      <GoogleLoginButton className={"w-60 text-base"} />
    </main>
  );
}
