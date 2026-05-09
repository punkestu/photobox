import { Suspense, useContext, useEffect, useRef, useState } from "react";
import { GetFrames } from "../utils/frameData";
import { useNavigate } from "react-router";
import { renderImagesWithFrame } from "../utils/frameRender";
import { frameProvider } from "../hooks/useFrame";

export default function FrameSelect() {
  const canvasRef = useRef(null);
  const [frameLoading, setFrameLoading] = useState(false);
  const [selectedFrame, setSelectedFrame] = useContext(frameProvider);
  const navigate = useNavigate();

  useEffect(() => {
    if (!selectedFrame) return;

    const loadImages = async (startLoading, endLoading) => {
      startLoading();
      const loaded = await Promise.all(
        new Array(selectedFrame.image_count).fill(null).map((_, i) => {
          return new Promise((resolve) => {
            const img = new Image();
            img.crossOrigin = "anonymous";
            img.src = "/placeholder" + (i + 1) + ".png";
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

      endLoading();
    };
    loadImages(
      () => {
        setTimeout(() => {
          setFrameLoading(true);
        }, 50);
      },
      () => {
        setTimeout(() => {
          setFrameLoading(false);
        }, 50);
      },
    );

    return () => setFrameLoading(true);
  }, [selectedFrame]);

  const finish = () => {
    navigate("/app");
  };

  return (
    <main className="h-screen w-screen bg-red-900 bg-halftone flex">
      <aside className="w-1/2 md:w-2/3 p-2 m-2 border-2 border-red-700 rounded-xl overflow-auto">
        <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3 relative">
          <Frames
            selectedFrame={selectedFrame}
            setSelectedFrame={setSelectedFrame}
          />
        </div>
      </aside>
      <aside className="grow m-2 p-4 border-2 border-red-700 rounded-xl overflow-auto relative">
        {!selectedFrame && (
          <p className="bg-white p-4 rounded-lg text-center h-full flex justify-center items-center font-sef text-3xl text-red-900">
            Pilih frame terlebih dahulu!
          </p>
        )}
        {frameLoading && (
          <p className="bg-white p-4 rounded-lg text-center h-full flex justify-center items-center font-sef text-3xl text-red-900">
            Memproses...
          </p>
        )}
        <div
          className={`${selectedFrame && !frameLoading ? "absolute top-0 left-0" : "hidden"} p-4 w-full z-10`}
        >
          <canvas ref={canvasRef} className="w-full"></canvas>
        </div>
      </aside>
      <div className="absolute bottom-0 left-0 w-full flex justify-end p-4 z-20">
        <button
          className="px-4 py-2 bg-white font-sef text-2xl text-red-900 border-2 border-red-900 rounded-xl"
          onClick={finish}
        >
          Lanjut...
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
      setTimeout(() => {
        setFrames(frames.data);
        setIsLoading(false);
      }, 50);
    });
  }, []);

  if (isLoading) {
    return (
      <p className="h-full w-full flex justify-center items-center bg-white text-red-900 font-sef text-3xl rounded-lg col-span-1 md:col-span-2 lg:col-span-3 p-4">
        Loading...
      </p>
    );
  }
  return frames.map((frame) => (
    <button
      key={frame.id}
      className={`${selectedFrame && selectedFrame.id == frame.id ? "border-4" : "border-2"} cursor-pointer h-64 border-red-700 bg-gray-200 rounded-lg overflow-hidden relative`}
      onClick={() => setSelectedFrame(frame)}
    >
      <img
        src={frame.frame_url}
        className="h-full w-full object-cover object-top"
      />
      <img
        src={frame.frame_url}
        className="absolute right-0 bottom-0 max-h-[calc(100%-2rem)] max-w-1/2 object-contain object-bottom bg-white p-1 m-2"
      />
    </button>
  ));
}
