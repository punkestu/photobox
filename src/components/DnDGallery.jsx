import { useState } from "react";

export default function DnDGallery({ images, setImages }) {
  const [dragged, setDragged] = useState(null);
  const handleDrop = (index) => (e) => {
    e.preventDefault();
    setImages((prev) => {
      const newArr = [...prev];
      [newArr[index], newArr[dragged]] = [newArr[dragged], newArr[index]];
      return newArr;
    });
    setDragged(index);
  };
  return (
    <div className={"overflow-y-auto flex flex-col gap-2 p-2 w-80"}>
      {images.map((img, index) => (
        <div
          draggable
          onDragStart={() => setDragged(index)}
          onDragOver={handleDrop(index)}
          className={`relative ${index == 0 ? "col-start-2" : ""}`}
          key={img}
        >
          <button className="absolute top-0 left-0 h-full w-full hover:bg-white/75 opacity-0 hover:opacity-100 duration-100 z-10 rounded-lg flex justify-center items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
              className="w-14 opacity-60"
            >
              {
                "<!--!Font Awesome Free v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.-->"
              }
              <path
                fill="rgb(0, 0, 0)"
                d="M406.6 502.6l96-96c9.2-9.2 11.9-22.9 6.9-34.9S492.9 352 480 352l-64 0 0-320c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 320-64 0c-12.9 0-24.6 7.8-29.6 19.8s-2.2 25.7 6.9 34.9l96 96c12.5 12.5 32.8 12.5 45.3 0zM150.6 9.4c-12.5-12.5-32.8-12.5-45.3 0l-96 96c-9.2 9.2-11.9 22.9-6.9 34.9S19.1 160 32 160l64 0 0 320c0 17.7 14.3 32 32 32s32-14.3 32-32l0-320 64 0c12.9 0 24.6-7.8 29.6-19.8s2.2-25.7-6.9-34.9l-96-96z"
              />
            </svg>
          </button>
          <p className="absolute right-0 top-0 p-2 text-xl text-white bg-red-900/55 rounded-tr-lg w-10 text-center aspect-square">
            {index}
          </p>
          <img src={img} className="w-full rounded-xl" />
        </div>
      ))}
    </div>
  );
}
