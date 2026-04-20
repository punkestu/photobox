import { useCamera } from "./hooks/UseCamera";
import { Gallery } from "./components/Gallery";

function App() {
  const [images, deleteImage, Camera] = useCamera();

  return (
    <main className="flex h-screen overflow-hidden bg-black relative">
      <Camera className="w-3/4" />
      <Gallery images={images} deleteImage={deleteImage} />
    </main>
  );
}

export default App;
