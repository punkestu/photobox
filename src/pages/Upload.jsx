import { QRCodeCanvas } from "qrcode.react";
import { useContext, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { memoryProvider } from "../hooks/useMemoryProvider";
import LogoTypo from "../assets/Logo_border_typo.webp";
import { postImage } from "../utils/googleDrive";
import Loading from "./Loading";
import { credentialProvider } from "../hooks/useGoogleProvider";
import { frameProvider } from "../hooks/useFrame";
import { renderImagesWithFrame } from "../utils/frameRender";

export default function Upload() {
  const [url, setUrl] = useState("");
  const [images] = useContext(memoryProvider);
  const location = useLocation();
  const [credential, setCredential] = useContext(credentialProvider);
  const [selectedFrame] = useContext(frameProvider);
  const [framedImage, setFramedImage] = useState("");
  const navigate = useNavigate();
  const print = () => {
    window.print();
  };

  useEffect(() => {
    if (location.pathname == "/upload" && images.length > 0) {
      console.log("upload");
      const expiresAt = localStorage.getItem("credential_expires_at");

      // Expired → clear + login
      if (expiresAt && Date.now() / 1000 >= parseInt(expiresAt) - 60) {
        localStorage.removeItem("credential");
        localStorage.removeItem("credential_expires_at");
        setCredential(null);
        navigate("/login");
        return;
      }

      (async () => {
        console.log("start render");
        const loaded = await Promise.all(
          images.map((url) => {
            return new Promise((resolve) => {
              const img = new Image();
              img.crossOrigin = "anonymous";
              img.src = url;
              img.onload = () => resolve(img);
            });
          }),
        );
        const frame = await new Promise((resolve) => {
          const img = new Image();
          img.crossOrigin = "anonymous";
          img.src = selectedFrame.frame_url;
          img.onload = () => resolve(img);
        });
        if (canvasRef.current) {
          renderImagesWithFrame(
            canvasRef.current,
            loaded,
            frame,
            selectedFrame.positions,
            false,
          );
        }

        console.log("end render");
        const framedImage = canvasRef.current.toDataURL();
        console.log("get framed image");
        setFramedImage(framedImage);

        postImage([
          ...images,
          framedImage
        ], credential)
          .then((url) => {
            setUrl(url);
          })
          .catch((e) => alert(e.message));
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);
  const canvasRef = useRef(null);

  if (url == "") {
    return (
      <>
        <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
        <Loading />
      </>
    );
  }
  return (
    <main className="w-screen h-screen flex gap-4 bg-red-900 bg-halftone relative">
      <div className="absolute right-0 top-0 z-20">
        <button
          className="hover:bg-blue-500 hover:text-white text-white/0 px-2 py-1 rounded-bl-lg"
          onClick={() => window.location.reload()}
        >
          Refresh
        </button>
      </div>
      <aside className="lg:w-1/3 w-full absolute lg:relative p-8 h-full flex lg:justify-center">
        <img
          src={framedImage}
          className="-rotate-3 w-full h-full object-scale-down"
        />
      </aside>
      <aside className="grow flex flex-col justify-center items-center gap-4 z-10">
        <QR value={url} />
        <p className="font-semibold font-sef text-2xl text-white">
          Scan QR untuk mendapatkan foto
        </p>
        <button
          className="bg-white font-sef text-3xl text-red-900 hover:-rotate-6 px-4 py-2 rounded-xl"
          onClick={print}
        >
          Cetak
        </button>
      </aside>
      <img
        src={LogoTypo}
        width={180}
        className="absolute bottom-0 right-0 m-6"
      />
    </main>
  );
}

function QR({ value }) {
  return (
    <div className="p-4 bg-white rounded-lg">
      <QRCodeCanvas value={value} size={200} />
    </div>
  );
}
