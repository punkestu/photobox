import { useEffect, useRef, useState } from "react";
import { renderImagesWithFrame } from "../utils/frameRender";

export default function TestFrame() {
  const canvasRef = useRef(null);
  const [imgCount, setImageCount] = useState(4);
  const [frameUrl, setFrameUrl] = useState("/example_frame.png");
  const [positions, setPositions] = useState(
    Array.from({ length: imgCount }, (_, i) => ({
      x: 0,
      y: i * 720,
      w: 720,
      h: 720,
    })),
  );

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPositions((prev) => {
      if (prev.length > imgCount) {
        return prev.slice(0, imgCount);
      }
      return [
        ...prev,
        ...new Array(imgCount - prev.length).fill(null).map(() => ({
          x: 0,
          y: 0,
          w: 720,
          h: 720,
        })),
      ];
    });
  }, [imgCount]);

  useEffect(() => {
    if (imgCount < 1 || imgCount > 4 || !frameUrl) return;

    const loadImages = async () => {
      const loaded = await Promise.all(
        Array.from({ length: imgCount }, (_, i) => i + 1).map((index) => {
          return new Promise((resolve) => {
            const img = new Image();
            img.src = `/placeholder${index}.png`; // data URL langsung dipakai
            img.onload = () => resolve(img);
          });
        }),
      );
      const frame = await new Promise((resolve) => {
          const img = new Image();
          img.src = frameUrl;
          img.onload = () => resolve(img);
        });
      if (canvasRef.current) {
        renderImagesWithFrame(canvasRef.current, loaded, frame, positions);
      }
    };
    loadImages();
  }, [canvasRef, imgCount, positions, frameUrl]);
  return (
    <main className="h-screen w-screen bg-red-900 bg-halftone flex">
      <aside className="grow p-2 flex flex-col gap-4 m-2 border-2 border-red-700 rounded-xl">
        <div className="bg-white rounded-lg p-2 flex justify-between items-center gap-2">
          <h1>Edit Frame</h1>
          <button
            className="border border-red-700 text-red-700 px-2 py-1 rounded-lg cursor-pointer"
            onClick={() => {
              downloadJSON(positions);
            }}
          >
            Export
          </button>
        </div>
        <div className="bg-white rounded-lg p-2 flex items-center gap-2">
          Frame URL:
          <input
            className="border rounded-lg p-1 px-2"
            type="text"
            value={frameUrl}
            onChange={(e) => setFrameUrl(e.target.value)}
          />
        </div>
        <div className="bg-white rounded-lg p-2 flex items-center gap-2">
          Jumlah Foto:
          <input
            className="border rounded-lg p-1 px-2"
            type="number"
            value={imgCount}
            onChange={(e) => {
              if (e.target.value > 0 && e.target.value <= 4) {
                setImageCount(e.target.value);
              }
            }}
          />
        </div>
        {positions.map((position, i) => (
          <div key={i} className="bg-white rounded-lg p-2">
            <p key={i}>Image {i + 1}</p>
            <div className="flex gap-2 items-center mb-2">
              <p className="w-10">X,Y:</p>
              <input
                type="number"
                className="border rounded-lg p-1 px-2 w-28"
                value={position.x}
                onChange={(e) =>
                  setPositions((prev) =>
                    prev.map((p, j) => {
                      if (j == i) {
                        return {
                          ...p,
                          x: e.target.value,
                        };
                      }
                      return p;
                    }),
                  )
                }
              />
              ,
              <input
                type="number"
                className="border rounded-lg p-1 px-2 w-28"
                value={position.y}
                onChange={(e) =>
                  setPositions((prev) =>
                    prev.map((p, j) => {
                      if (j == i) {
                        return {
                          ...p,
                          y: e.target.value,
                        };
                      }
                      return p;
                    }),
                  )
                }
              />
            </div>
            <div className="flex gap-2 items-center">
              <p className="w-10">W,H:</p>
              <input
                type="number"
                className="border rounded-lg p-1 px-2 w-28"
                value={position.w}
                onChange={(e) =>
                  setPositions((prev) =>
                    prev.map((p, j) => {
                      if (j == i) {
                        return {
                          ...p,
                          w: e.target.value,
                        };
                      }
                      return p;
                    }),
                  )
                }
              />
              ,
              <input
                type="number"
                className="border rounded-lg p-1 px-2 w-28"
                value={position.h}
                onChange={(e) =>
                  setPositions((prev) =>
                    prev.map((p, j) => {
                      if (j == i) {
                        return {
                          ...p,
                          h: e.target.value,
                        };
                      }
                      return p;
                    }),
                  )
                }
              />
            </div>
          </div>
        ))}
      </aside>
      <aside className="w-140 m-2 p-2 border-2 border-red-700 rounded-xl overflow-auto">
        <div className="w-full">
          <canvas ref={canvasRef} className="w-full"></canvas>
        </div>
      </aside>
    </main>
  );
}

function downloadJSON(data, filename = "data.json") {
  const jsonString = JSON.stringify(data, null, 2); // pretty print

  const blob = new Blob([jsonString], {
    type: "application/json",
  });

  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();

  URL.revokeObjectURL(url);
}
