import { useContext, useMemo } from "react";
import { Camera } from "../components/Camera";
import { Gallery } from "../components/Gallery";
import { useNavigate } from "react-router";
import { memoryProvider } from "./useMemoryProvider";

const max_gallery = 4;

export function useCamera() {
  const [images, setImages] = useContext(memoryProvider);
  const galleryIsFull = useMemo(() => images.length >= max_gallery, [images]);
  const navigate = useNavigate();

  const process = async () => {
    navigate("/finish");
  };
  const addImage = (img) => setImages((prev) => [...prev, img]);
  const deleteImage = (index) =>
    setImages(images.filter((_, i) => i !== index));
  return [images, galleryIsFull, process, addImage, deleteImage];
}
