import { useEffect, useRef, useState } from "react";

export function Camera({ className, saveImage, process, galleryIsFull }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [timer, setTimer] = useState(0);
  const [flash, setFlash] = useState(false);
  const [image, setImage] = useState(null);

  const capture = () => {
    setTimer(3);
    setTimeout(() => {
      setFlash(true);
      setTimeout(() => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        // mirror selfie
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);

        ctx.drawImage(video, 0, 0);

        ctx.setTransform(1, 0, 0, 1, 0, 0);

        // postprocess
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        // applyFilter(ctx, canvas);
        ctx.putImageData(imageData, 0, 0);

        const img = canvas.toDataURL("image/png");
        setImage(img);
        setFlash(false);
      }, 500);
    }, 3000);
  };

  useEffect(() => {
    if (image) {
      saveImage(image);
    }
  }, [image, saveImage]);
  useEffect(() => {
    try {
      navigator.mediaDevices
        .getUserMedia({
          video: {
            width: 1280,
            height: 720,
            facingMode: "user",
            // noiseSuppression: true,
          },
        })
        .then((stream) => {
          videoRef.current.srcObject = stream;
        });
    } catch (err) {
      console.error(err);
    }
  }, [videoRef]);

  useEffect(() => {
    if (timer > 0) {
      const intervalID = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => {
        clearInterval(intervalID);
      };
    }
    return () => {};
  }, [timer]);
  return (
    <>
      {flash && (
        <div className="w-screen h-screen absolute left-0 top-0 flex justify-center items-center bg-white z-1000">
          <svg
            className="w-42"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 640 640"
          >
            {
              "<!--!Font Awesome Free v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.-->"
            }
            <path
              fill="rgb(255, 212, 59)"
              d="M128 320L156.5 92C158.5 76 172.1 64 188.3 64L356.9 64C371.9 64 384 76.1 384 91.1C384 94.3 383.4 97.6 382.3 100.6L336 224L475.3 224C495.5 224 512 240.4 512 260.7C512 268.1 509.8 275.3 505.6 281.4L313.4 562.4C307.5 571 297.8 576.1 287.5 576.1L284.6 576.1C268.9 576.1 256.1 563.3 256.1 547.6C256.1 545.3 256.4 543 257 540.7L304 352L160 352C142.3 352 128 337.7 128 320z"
            />
          </svg>
        </div>
      )}
      <aside className={className + " relative overflow-hidden m-4"}>
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="-scale-x-100 w-full h-full object-cover rounded-lg"
        />
        <div
          id="overlay"
          className="absolute top-0 left-0 w-full h-full z-10 rounded-lg"
        >
          <button
            className={
              "w-full h-full text-black font-semibold rounded-lg flex flex-col text-2xl justify-center items-center " +
              (timer > 0 ? "" : "bg-white/25")
            }
            onClick={() =>
              !galleryIsFull
                ? capture({ prerun: () => setTimer(3) })
                : process()
            }
          >
            {timer > 0 ? (
              <span className="text-9xl font-black opacity-60 bg-white/75 w-42 aspect-square flex justify-center items-center rounded-full">
                {timer}
              </span>
            ) : !flash ? (
              galleryIsFull ? (
                <>
                  <svg
                    className="w-42 opacity-75"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 640 640"
                  >
                    {
                      "<!--!Font Awesome Free v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.-->"
                    }
                    <path d="M320 576C178.6 576 64 461.4 64 320C64 178.6 178.6 64 320 64C461.4 64 576 178.6 576 320C576 461.4 461.4 576 320 576zM438 209.7C427.3 201.9 412.3 204.3 404.5 215L285.1 379.2L233 327.1C223.6 317.7 208.4 317.7 199.1 327.1C189.8 336.5 189.7 351.7 199.1 361L271.1 433C276.1 438 282.9 440.5 289.9 440C296.9 439.5 303.3 435.9 307.4 430.2L443.3 243.2C451.1 232.5 448.7 217.5 438 209.7z" />
                  </svg>
                  Tekan untuk selesaikan
                </>
              ) : (
                <svg
                  className="w-42 opacity-55"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 640 640"
                >
                  {
                    "<!--!Font Awesome Free v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.-->"
                  }
                  <path d="M213.1 128.8L202.7 160L128 160C92.7 160 64 188.7 64 224L64 480C64 515.3 92.7 544 128 544L512 544C547.3 544 576 515.3 576 480L576 224C576 188.7 547.3 160 512 160L437.3 160L426.9 128.8C420.4 109.2 402.1 96 381.4 96L258.6 96C237.9 96 219.6 109.2 213.1 128.8zM320 256C373 256 416 299 416 352C416 405 373 448 320 448C267 448 224 405 224 352C224 299 267 256 320 256z" />
                </svg>
              )
            ) : (
              ""
            )}
          </button>
        </div>
      </aside>
      <canvas ref={canvasRef} style={{ display: "none" }} />
    </>
  );
}
