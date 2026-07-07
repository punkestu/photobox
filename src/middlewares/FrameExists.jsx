import { useContext, useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router";
import { frameProvider } from "../hooks/useFrame";
import { memoryProvider } from "../hooks/useMemoryProvider";
import { getImage } from "../utils/cacheBrowser";

function FrameExistsMiddleware() {
  const [_selectedFrame, setSelectedFrame] = useContext(frameProvider);
  const [_images, setImages] = useContext(memoryProvider);
  const [frameExists, setFrameExists] = useState(null);

  useEffect(() => {
    (async () => {
      const memimages = [];
      let counter = 0;
      while (true) {
        const image = await getImage("image_" + counter);
        if (!image) {
          break;
        }
        memimages.push(image);
        counter++;
        setFrameExists((prev) => (prev == null ? true : prev && true));
      }
      const memselectedFrame = await getImage("selectedFrame");
      if (!memselectedFrame) {
        setFrameExists((prev) => (prev == null ? false : prev && false));
      }
      setSelectedFrame(memselectedFrame);
      setImages(memimages);
    })();
  }, [setImages, setSelectedFrame]);

  return frameExists ? <Navigate to="/preview" replace /> : <Outlet />;
}

export default FrameExistsMiddleware;
