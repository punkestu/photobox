import { useCamera } from "../hooks/UsePhotobox";
import { Gallery } from "../components/Gallery";

function App() {
  const [_, Camera, Gallery] = useCamera();

  return (
    <main className="flex h-screen overflow-hidden bg-black text-white relative">
      <Camera className="w-3/4" />
      <Gallery className="w-1/4" />
    </main>
  );
}

export default App;
