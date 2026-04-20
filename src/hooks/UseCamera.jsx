import { useState } from "react";
import { Camera } from "../components/Camera";

export function useCamera() {
  const [images, setImages] = useState([]);

  const process = async () => {};
  return [
    images,
    function (index) {
      setImages(images.filter((_, i) => i !== index));
    },
    function ({ className }) {
      return (
        <Camera
          className={className}
          saveImage={(img) => setImages((prev) => [...prev, img])}
          process={process}
          galleryIsFull={images.length >= 4}
        />
      );
    },
  ];
}
