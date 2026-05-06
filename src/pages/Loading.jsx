import { useEffect, useState } from "react";
import Logo from "../assets/Logo_border.png";
import LogoTypo from "../assets/Logo_border_typo.png";

export default function Loading() {
  const [tick, setTick] = useState(3);
  useEffect(() => {
    const intervalID = setInterval(() => {
      setTick((prev) => (prev + 1) % 4);
    }, 1000);
    return () => clearInterval(intervalID);
  }, [setTick]);
  return (
    <main className="w-screen h-screen flex justify-center items-center gap-4 bg-red-900 bg-halftone">
      <div className="flex flex-col items-center gap-6">
        <img
          src={Logo}
          width={120}
          className="animate-[wiggle_1s_steps(2,end)_infinite]"
        />
        <div className="text-white font-sef text-4xl">
          Mohon tunggu sebentar yaaa.{new Array(tick).fill(null).map(() => ".")}
        </div>
      </div>
      <img
        src={LogoTypo}
        width={180}
        className="absolute bottom-0 right-0 m-6"
      />
    </main>
  );
}
