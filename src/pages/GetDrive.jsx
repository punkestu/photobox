import { QRCodeCanvas } from "qrcode.react";
import { useContext, useEffect, useRef } from "react";
import { useSearchParams } from "react-router";
import { memoryProvider } from "../hooks/useMemoryProvider";

async function loadImage(src) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.src = src;
  });
}

export default function GetDrive() {
  const [searchParams] = useSearchParams();
  const print = () => {
    window.print();
  };
  const [memory] = useContext(memoryProvider);
  const canvasRef = useRef(null);
  useEffect(() => {
    if (!canvasRef.current) return;
    (async () => {
      const ctx = canvasRef.current.getContext("2d");
      const images = await Promise.all(memory.map((mem) => loadImage(mem)));
      images.forEach((image, index) => {
        ctx.drawImage(image, index * 1080, 0, 360, 1080);
      });
    })();
  }, [canvasRef, memory]);
  return (
    <main className="w-screen h-screen flex gap-4">
      <div className="absolute right-0 top-0">
        <button
          className="hover:bg-blue-500 text-white px-2 py-1 rounded-bl-lg"
          onClick={() => window.location.reload()}
        >
          Refresh
        </button>
      </div>
      <aside className="w-1/3 m-8">
        <canvas ref={canvasRef}></canvas>
      </aside>
      <aside className="grow flex flex-col justify-center items-center gap-4">
        <QR value={searchParams.get("url")} />
        <p className="font-semibold">Scan QR untuk mendapatkan foto</p>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-xl"
          onClick={print}
        >
          Cetak
        </button>
      </aside>
    </main>
  );
}

function QR({ value }) {
  return (
    <div>
      <QRCodeCanvas value={value} size={200} />
    </div>
  );
}
