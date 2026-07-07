import { useEffect, useState } from "react";
import Logo from "../assets/Logo_border_120px.webp";
import LogoTypo from "../assets/Logo_border_typo_180px.webp";
import { Navigate, useParams } from "react-router";
import { useShareImage } from "../hooks/useSharePic";

export default function Gallery() {
  const [images, setImages] = useState([]);
  const { folderId } = useParams();
  useEffect(() => {
    if (!folderId) return;
    const API_KEY = import.meta.env.VITE_API_KEY;
    const query = `'${folderId}' in parents and mimeType contains 'image/' and trashed=false`;

    const url = new URL("https://www.googleapis.com/drive/v3/files");
    url.searchParams.set("key", API_KEY);
    url.searchParams.set("q", query);
    url.searchParams.set("fields", "nextPageToken,files(id,name,mimeType)");
    url.searchParams.set("pageSize", "1000");

    fetch(url)
      .then((res) => res.json())
      .then((res) => {
        const files = res.files;
        const framed = files.find((file) => file.name.includes("framed"));
        const gif = files.find((file) => file.name.includes("gif"));
        const images = files.filter(
          (file) => !file.name.includes("gif") && !file.name.includes("framed"),
        );
        setImages([...images, gif, framed]);
      })
      .catch((err) => console.error(err));
  }, [folderId]);

  const share = useShareImage(import.meta.env.VITE_API_KEY);

  if (!folderId) {
    return <Navigate to="/" replace />;
  }

  return (
    <main className="h-screen w-screen bg-red-900 bg-halftone p-8">
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 items-start max-h-full overflow-auto pb-24">
        {images.map(
          (image) =>
            image && (
              <div
                key={image.id}
                className="bg-white p-2 rounded-md h-full flex flex-col"
              >
                <img
                  src={`https://drive.google.com/thumbnail?id=${image.id}&sz=w800`}
                  alt={image.name}
                  className="w-full h-96 md:h-80 lg:h-64 object-cover object-center"
                />
                <div className="flex mt-2 grow gap-2">
                  <a
                    href={`https://drive.google.com/uc?export=view&id=${image.id}`}
                    target="_blank"
                    className="border-2 border-red-900 rounded-md text-red-900 text-center grow"
                  >
                    View
                  </a>
                  <button
                    onClick={() => {
                      share(image.id, "Pic from Soreaja");
                    }}
                    className="border-2 border-red-900 rounded-md text-red-900 text-center grow"
                  >
                    Share
                  </button>
                  <a
                    href={`https://drive.google.com/uc?export=download&id=${image.id}`}
                    target="_blank"
                    className="border-2 border-red-900 bg-red-900 rounded-md text-white text-center grow"
                  >
                    Download
                  </a>
                </div>
              </div>
            ),
        )}
      </section>
      <img
        src={LogoTypo}
        width={180}
        alt="Logo Typography"
        fetchPriority="high"
        className="absolute bottom-0 right-0 m-6"
      />
    </main>
  );
}
