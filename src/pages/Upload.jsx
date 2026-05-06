import { QRCodeCanvas } from "qrcode.react";
import { useContext, useEffect, useState } from "react";
import { useLocation } from "react-router";
import { memoryProvider } from "../hooks/useMemoryProvider";
import LogoTypo from "../assets/Logo_border_typo.png";
import { postImage } from "../utils/googleDrive";
import Loading from "./Loading";
import { credentialProvider } from "../hooks/useGoogleProvider";

export default function Upload() {
  const [url, setUrl] = useState("");
  const [images] = useContext(memoryProvider);
  const location = useLocation();
  const [credential] = useContext(credentialProvider);
  const print = () => {
    window.print();
  };

  useEffect(() => {
    if (location.pathname == "/upload") {
      postImage(images, credential).then((url) => {
        setUrl(url);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);
  const [memory] = useContext(memoryProvider);

  if (url == "") {
    return <Loading />
  }
  return (
    <main className="w-screen h-screen flex gap-4 bg-red-900 bg-halftone relative">
      <div className="absolute right-0 top-0">
        <button
          className="hover:bg-blue-500 hover:text-white text-white/0 px-2 py-1 rounded-bl-lg"
          onClick={() => window.location.reload()}
        >
          Refresh
        </button>
      </div>
      <aside className="lg:w-1/3 w-full absolute lg:relative p-8 h-full flex lg:justify-center">
        <img src={memory.at(-1)} className="-rotate-3" />
      </aside>
      <aside className="grow flex flex-col justify-center items-center gap-4 z-10">
        <QR value={url} />
        <p className="font-semibold font-sef text-2xl text-white">
          Scan QR untuk mendapatkan foto
        </p>
        <button
          className="bg-white font-sef text-3xl text-red-900 hover:-rotate-6 px-4 py-2 rounded-xl"
          onClick={print}
        >
          Cetak
        </button>
      </aside>
      <img
        src={LogoTypo}
        width={180}
        className="absolute bottom-0 right-0 m-6"
      />
    </main>
  );
}

function QR({ value }) {
  return (
    <div className="p-4 bg-white rounded-lg">
      <QRCodeCanvas value={value} size={200} />
    </div>
  );
}
