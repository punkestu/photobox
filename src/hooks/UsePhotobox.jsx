import { useContext } from "react";
import { Camera } from "../components/Camera";
import { Gallery } from "../components/Gallery";
import { useNavigate } from "react-router";
import { memoryProvider } from "./useMemoryProvider";

const max_gallery = 4;

export function useCamera() {
  const [images, setImages] = useContext(memoryProvider);
  const navigate = useNavigate();

  const process = async () => {
    navigate("/finish");
  };
  return [
    function ({ className }) {
      return (
        <Camera
          className={className}
          saveImage={(img) => setImages((prev) => [...prev, img])}
          process={process}
          galleryIsFull={images.length >= max_gallery}
        />
      );
    },
    function ({ className }) {
      return (
        <Gallery
          className={className}
          images={images}
          deleteImage={function (index) {
            setImages(images.filter((_, i) => i !== index));
          }}
        />
      );
    },
  ];
}
