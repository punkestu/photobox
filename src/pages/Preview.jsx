import { useContext, useEffect, useRef, useState } from "react";
import { frameProvider } from "../hooks/useFrame";
import { memoryProvider } from "../hooks/useMemoryProvider";
import { renderImagesWithFrame } from "../utils/frameRender";
import { renderGIF } from "../utils/gifRender";
import LogoTypo from "../assets/Logo_border_typo_180px.webp";
import { useNavigate } from "react-router";

export default function Preview() {
  const canvasRef = useRef(null);
  const [selectedFrame] = useContext(frameProvider);
  const [images] = useContext(memoryProvider);
  const [gif, setGif] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!selectedFrame) return;

    const loadImages = async () => {
      const loaded = await Promise.all(
        images.map((url) => {
          return new Promise((resolve) => {
            const img = new Image();
            img.crossOrigin = "anonymous";
            img.src = url;
            img.onload = () => resolve(img);
          });
        }),
      );
      const frame = await new Promise((resolve) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = selectedFrame.frame_url;
        img.onload = () => resolve(img);
      });
      if (canvasRef.current) {
        renderImagesWithFrame(
          canvasRef.current,
          loaded,
          frame,
          selectedFrame.positions,
        );
      }
      const gifUrl = await renderGIF(loaded);
      setGif(URL.createObjectURL(gifUrl));
    };
    loadImages();
  }, [selectedFrame, images]);
  return (
    <main className="h-screen w-screen bg-red-900 bg-halftone p-4 flex gap-2">
      <aside className="w-140 h-full overflow-y-auto bg-white p-4 rounded-lg">
        <canvas ref={canvasRef} className="w-full"></canvas>
      </aside>
      <aside className="grow h-full flex justify-center items-center">
        {gif && (
          <img src={gif} alt="GIF" className="w-1/2 bg-white p-4 rounded-lg" />
        )}
      </aside>
      <img
        src={LogoTypo}
        alt="Logo Typography"
        width={180}
        fetchPriority="high"
        className="absolute bottom-0 right-0 m-6"
      />
      <div className="absolute top-0 right-0 w-full flex justify-between p-2">
        <button
          className="px-4 py-2 bg-white font-sef text-2xl text-red-900 border-2 border-red-900 rounded-xl"
          onClick={() => navigate("/app")}
        >
          Foto ulang
        </button>
        <button
          className="px-4 py-2 bg-white font-sef text-2xl text-red-900 border-2 border-red-900 rounded-xl"
          onClick={() => navigate("/upload")}
        >
          Selesaikan
        </button>
      </div>
    </main>
  );
}
