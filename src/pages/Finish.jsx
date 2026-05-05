import { useContext, useEffect, useRef, useState } from "react";
import { memoryProvider } from "../hooks/useMemoryProvider";
import { GetFrames } from "../utils/frameData";

export default function Finish() {
  const [images] = useContext(memoryProvider);
  const canvasRef = useRef(null);
  const [frames, setFrames] = useState([]);
  const [selectedFrame, setSelectedFrame] = useState(null);
  const [frame, setFrame] = useState(null);

  useEffect(() => {
    GetFrames().then((frames) => {
      setFrames(frames.data);
      console.log(frames.data);
    });
  }, []);

  useEffect(() => {
    if (!selectedFrame) return;
    const timeoutID = setTimeout(async function () {
      setFrame(
        await new Promise((resolve) => {
          const img = new Image();
          img.src = selectedFrame.frame_url;
          img.onload = () => resolve(img);
        }),
      );
    }, 1000);
    return () => clearTimeout(timeoutID);
  }, [selectedFrame]);

  useEffect(() => {
    if (!images?.length || !frame) return;

    const loadImages = async () => {
      const loaded = await Promise.all(
        images.map((image) => {
          return new Promise((resolve) => {
            const img = new Image();
            img.src = image; // data URL langsung dipakai
            img.onload = () => resolve(img);
          });
        }),
      );
      if (canvasRef.current) {
        renderImagesWithFrame(
          canvasRef.current,
          loaded,
          frame,
          selectedFrame.positions,
        );
      }
    };
    loadImages();
  }, [canvasRef, images, selectedFrame, frame]);

  return (
    <main className="h-screen w-screen bg-red-900 bg-halftone flex">
      <aside className="grow p-2 flex gap-4 m-2 border-2 border-red-700 rounded-xl overflow-auto">
        {frames.map((frame) => (
          <button
            className="cursor-pointer w-1/2 h-64 border-2 border-red-700 bg-gray-200 rounded-lg overflow-hidden relative"
            onClick={() => setSelectedFrame(frame)}
          >
            <img src={frame.frame_url} />
            <img src={frame.frame_url} className="absolute right-0 bottom-0 h-[calc(100%-2rem)] bg-white p-1 m-2" />
          </button>
        ))}
      </aside>
      <aside className="w-140 m-2 p-4 border-2 border-red-700 rounded-xl overflow-auto">
        <div className={`${selectedFrame ? "" : "hidden"}`}>
          <canvas ref={canvasRef}></canvas>
        </div>
        {!selectedFrame && (
          <p className="bg-white p-4 rounded-lg text-center">
            Pilih frame terlebih dahulu!
          </p>
        )}
      </aside>
    </main>
  );
}

function renderImagesWithFrame(canvas, images, frame, positions) {
  const ctx = canvas.getContext("2d");
  // contoh: set size canvas
  canvas.width = frame.width;
  canvas.height = frame.height;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  images.forEach((img, i) => {
    if (!positions[i]) return;
    const x = positions[i].x ?? 0;
    const y = positions[i].y ?? i * 150;
    const w = positions[i].w ?? 150;
    const h = positions[i].h ?? 150;
    drawImageCover(ctx, img, x, y, w, h);
  });
  ctx.drawImage(frame, 0, 0);
}

function drawImageCover(ctx, img, x, y, width, height) {
  const imgRatio = img.width / img.height;
  const canvasRatio = width / height;

  let sx, sy, sWidth, sHeight;

  if (imgRatio > canvasRatio) {
    // gambar lebih lebar → crop kiri kanan
    sHeight = img.height;
    sWidth = img.height * canvasRatio;
    sx = (img.width - sWidth) / 2;
    sy = 0;
  } else {
    // gambar lebih tinggi → crop atas bawah
    sWidth = img.width;
    sHeight = img.width / canvasRatio;
    sx = 0;
    sy = (img.height - sHeight) / 2;
  }

  ctx.drawImage(img, sx, sy, sWidth, sHeight, x, y, width, height);
}
