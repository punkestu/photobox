import { useCamera } from "../hooks/UsePhotobox";
import { Gallery } from "../components/Gallery";
import { useEffect } from "react";
import { requestWakeLock } from "../utils/screen";

function App() {
  const [_, isProcessing, Camera, Gallery] = useCamera();

  useEffect(() => {
    requestWakeLock();
  }, []);

  return (
    <main className="flex h-screen overflow-hidden bg-black text-white relative">
      {isProcessing ? (
        <h1 className="w-full h-full flex justify-center items-center">
          Loading...
        </h1>
      ) : (
        <>
          <Camera className="w-3/4" />
          <Gallery className="w-1/4" />
        </>
      )}
    </main>
  );
}

export default App;
