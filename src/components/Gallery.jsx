export function Gallery({images, deleteImage}) {
  return (
    <div className="h-full overflow-y-auto flex flex-col gap-2 pe-4 py-4 w-1/4">
      {images.map((img, index) => (
        <div className="relative" key={index}>
          <button
            className="absolute top-0 left-0 h-full w-full hover:bg-white/75 opacity-0 hover:opacity-100 duration-100 z-10 rounded-lg flex justify-center items-center"
            onClick={() => deleteImage(index)}
          >
            <svg
              className="w-32 opacity-60"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 640 640"
            >
              {
                "<!--!Font Awesome Free v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.-->"
              }
              <path d="M183.1 137.4C170.6 124.9 150.3 124.9 137.8 137.4C125.3 149.9 125.3 170.2 137.8 182.7L275.2 320L137.9 457.4C125.4 469.9 125.4 490.2 137.9 502.7C150.4 515.2 170.7 515.2 183.2 502.7L320.5 365.3L457.9 502.6C470.4 515.1 490.7 515.1 503.2 502.6C515.7 490.1 515.7 469.8 503.2 457.3L365.8 320L503.1 182.6C515.6 170.1 515.6 149.8 503.1 137.3C490.6 124.8 470.3 124.8 457.8 137.3L320.5 274.7L183.1 137.4z" />
            </svg>
          </button>
          <img src={img} className="w-full rounded-lg" />
        </div>
      ))}
    </div>
  );
}
