import { useCamera } from "../hooks/UsePhotobox";
import { Gallery } from "../components/Gallery";
import { Camera } from "../components/Camera";
import { useContext, useEffect } from "react";
import { requestWakeLock } from "../utils/screen";
import Timer from "../components/Timer";
import { timerProvider } from "../hooks/useTimerProvider";
import { useLocation, useNavigate } from "react-router";
import { frameProvider } from "../hooks/useFrame";

function App() {
  const [images, galleryIsFull, addImage, deleteImage] = useCamera();
  const [_1, setTimer] = useContext(timerProvider);
  const [selectedFrame] = useContext(frameProvider);
  const navigate = useNavigate();
  const location = useLocation();
  const process = async () => {
    navigate("/preview");
  };

  useEffect(() => {
    requestWakeLock();
    if (location.pathname == "/app") {
      if (!selectedFrame) {
        navigate("/frame-select");
      }
      setTimer(7 * 60);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location, setTimer]);
  return (
    <main className="flex h-screen w-screen overflow-hidden bg-red-900 bg-halftone text-white relative">
      <Camera
        className={"w-full"}
        saveImage={addImage}
        process={process}
        galleryIsFull={galleryIsFull}
        currentFrame={
          selectedFrame ? selectedFrame.positions.at(images.length) : {}
        }
      />
      <Gallery
        className="w-full absolute z-10"
        deleteImage={deleteImage}
        images={images}
      />
      <Timer />
    </main>
  );
}

export default App;
