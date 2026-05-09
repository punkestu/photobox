import { useContext, useMemo } from "react";
import { Camera } from "../components/Camera";
import { Gallery } from "../components/Gallery";
import { useNavigate } from "react-router";
import { memoryProvider } from "./useMemoryProvider";
import { frameProvider } from "./useFrame";

export function useCamera() {
  const [images, setImages] = useContext(memoryProvider);
  const [selectedFrame, _] = useContext(frameProvider);
  const galleryIsFull = useMemo(() => images.length >= selectedFrame.image_count, [images, selectedFrame]);
  const navigate = useNavigate();

  const process = async () => {
    navigate("/upload");
  };
  const addImage = (img) => setImages((prev) => [...prev, img]);
  const deleteImage = (index) =>
    setImages(images.filter((_, i) => i !== index));
  return [images, galleryIsFull, process, addImage, deleteImage];
}
