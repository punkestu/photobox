import { useContext, useState } from "react";
import { Camera } from "../components/Camera";
import { Gallery } from "../components/Gallery";
import { postImage } from "../utils/googleDrive";
import { credentialProvider } from "./useGoogleProvider";
import { useNavigate } from "react-router";

export function useCamera() {
  const [images, setImages] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [credential] = useContext(credentialProvider);
  const navigate = useNavigate();

  const process = async () => {
    if (isProcessing) return;
    setIsProcessing(true);
    postImage(images, credential).then((url) => {
      setIsProcessing(false);
      navigate(`/finish?url=${encodeURIComponent(url)}`);
    });
  };
  return [
    images,
    isProcessing,
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
