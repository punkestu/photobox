import { useNavigate } from "react-router";
import Logo from "../assets/Logo_border_120px.webp";
import LogoTypo from "../assets/Logo_border_typo_180px.webp";

export default function Welcome() {
  const navigate = useNavigate();
  return (
    <main className="h-screen w-screen flex justify-center items-center bg-red-900 bg-halftone">
      <button
        className="flex flex-col items-center gap-6 group"
        onClick={() => {
          navigate("/frame-select");
        }}
      >
        <img
          src={Logo}
          width={120}
          className="group-hover:rotate-12"
          fetchPriority="high"
          alt="Logo"
        />
        <div className="text-white font-sef text-4xl group-hover:-rotate-6">
          Tekan untuk mulai
        </div>
      </button>
      <a href="https://soreaja.my.id">
        <img
          src={LogoTypo}
          width={180}
          alt="Logo Typography"
          fetchPriority="high"
          className="absolute bottom-0 right-0 m-6"
        />
      </a>
    </main>
  );
}
