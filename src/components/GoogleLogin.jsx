import { GoogleLogin, useGoogleLogin } from "@react-oauth/google";
import { useContext, useEffect } from "react";
import { credentialProvider } from "../hooks/useGoogleProvider";

export function GoogleLoginButton() {
  const [credential, setCredential] = useContext(credentialProvider);
  useEffect(() => {
    setCredential(localStorage.getItem("credential"));
  }, [setCredential]);

  const login = useGoogleLogin({
    scope: "https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/drive.appdata https://www.googleapis.com/auth/drive.file",
    prompt: "consent",
    onSuccess: (tokenResponse) => {
      setCredential(tokenResponse.access_token);
      localStorage.setItem("credential", tokenResponse.access_token);
      localStorage.setItem(
        "credential_expires_at",
        Math.floor(Date.now() / 1000) + tokenResponse.expires_in,
      );
    },
    onError: () => {
      console.log("Login Failed");
    },
  });
  return (
    !credential && (
      <button
        className="bg-white text-black rounded-xl px-6 py-2 cursor-pointer font-semibold"
        onClick={login}
      >
        Masuk
      </button>
    )
  );
}
