import { Suspense, useContext, useEffect, useRef, useState } from "react";
import { memoryProvider } from "../hooks/useMemoryProvider";
import { GetFrames } from "../utils/frameData";
import { useNavigate } from "react-router";

export default function Finish() {
  const [images, setImages] = useContext(memoryProvider);
  const canvasRef = useRef(null);
  // const [frames, setFrames] = useState([]);
  const [selectedFrame, setSelectedFrame] = useState(null);
  const [frame, setFrame] = useState(null);
  const navigate = useNavigate();

  // useEffect(() => {
  //   GetFrames().then((frames) => {
  //     setFrames(frames.data);
  //     console.log(frames.data);
  //   });
  // }, []);

  useEffect(() => {
    if (!selectedFrame) return;
    const timeoutID = setTimeout(async function () {
      setFrame(
        await new Promise((resolve) => {
          const img = new Image();
          img.crossOrigin = "anonymous";
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
            img.crossOrigin = "anonymous";
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canvasRef, selectedFrame, frame]);

  const finish = () => {
    if (!canvasRef.current) return;
    const img = canvasRef.current.toDataURL("image/png");
    console.log(img);
    setImages((prev) => [...prev, img]);
    navigate("/upload");
  };

  return (
    <main className="h-screen w-screen bg-red-900 bg-halftone flex">
      <aside className="grow p-2 flex gap-4 m-2 border-2 border-red-700 rounded-xl overflow-auto">
        <Frames
          selectedFrame={selectedFrame}
          setSelectedFrame={setSelectedFrame}
        />
      </aside>
      <aside className="w-140 m-2 p-4 border-2 border-red-700 rounded-xl overflow-auto relative">
        <div className={`${selectedFrame ? "" : "hidden"} w-full`}>
          <canvas ref={canvasRef} className="w-full"></canvas>
        </div>
        {!selectedFrame && (
          <p className="bg-white p-4 rounded-lg text-center">
            Pilih frame terlebih dahulu!
          </p>
        )}
      </aside>
      <div className="absolute bottom-0 left-0 w-full flex justify-end p-4">
        <button
          className="px-4 py-2 bg-white font-sef text-2xl text-red-900 border-2 border-red-900 rounded-xl"
          onClick={finish}
        >
          Selesaikan
        </button>
      </div>
    </main>
  );
}

function Frames({ selectedFrame, setSelectedFrame }) {
  const [isLoading, setIsLoading] = useState(true);
  const [frames, setFrames] = useState([]);

  useEffect(() => {
    GetFrames().then((frames) => {
      setFrames(frames.data);
      setIsLoading(false);
    });
  }, []);

  if (isLoading) {
    return <>Loading...</>;
  }
  return frames.map((frame) => (
    <button
      key={frame.id}
      className={`${selectedFrame && selectedFrame.id == frame.id ? "border-4" : "border-2"} cursor-pointer w-1/2 h-64 border-red-700 bg-gray-200 rounded-lg overflow-hidden relative`}
      onClick={() => setSelectedFrame(frame)}
    >
      <img src={frame.frame_url} />
      <img
        src={frame.frame_url}
        className="absolute right-0 bottom-0 h-[calc(100%-2rem)] bg-white p-1 m-2"
      />
    </button>
  ));
}

function renderImagesWithFrame(canvas, images, frame, positions) {
  const ctx = canvas.getContext("2d");

  const scale = canvas.width / frame.width;
  canvas.height = frame.height * scale;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  images.forEach((img, i) => {
    if (!positions[i]) return;
    const x = positions[i].x ?? 0;
    const y = positions[i].y ?? i * 150;
    const w = positions[i].w ?? 150;
    const h = positions[i].h ?? 150;
    drawImageCover(ctx, img, x * scale, y * scale, w * scale, h * scale);
  });
  drawImageCover(
    ctx,
    frame,
    0 * scale,
    0 * scale,
    frame.width * scale,
    frame.height * scale,
  );
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
