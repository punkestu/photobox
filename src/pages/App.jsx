import { useCamera } from "../hooks/UsePhotobox";
import { Gallery } from "../components/Gallery";
import { Camera } from "../components/Camera";
import { useContext, useEffect } from "react";
import { requestWakeLock } from "../utils/screen";
import Timer from "../components/Timer";
import { timerProvider } from "../hooks/useTimerProvider";
import { useLocation } from "react-router";

function App() {
  const [images, galleryIsFull, process, addImage, deleteImage] = useCamera();
  const [_1, setTimer] = useContext(timerProvider);
  const location = useLocation();

  useEffect(() => {
    requestWakeLock();
    if (location.pathname == "/app") {
      setTimer(7 * 60);
    }
  }, [location, setTimer]);
  return (
    <main className="flex h-screen w-screen overflow-hidden bg-red-900 bg-halftone text-white relative">
      <Camera
        className={"w-full"}
        saveImage={addImage}
        process={process}
        galleryIsFull={galleryIsFull}
      />
      <Gallery
        className="w-full absolute"
        deleteImage={deleteImage}
        images={images}
      />
      <Timer />
    </main>
  );
}

export default App;
