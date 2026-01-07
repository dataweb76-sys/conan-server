"use client";

import { useEffect, useState } from "react";

const images = [
  "/carousel/1.png",
  "/carousel/2.png",
  "/carousel/3.png",
  "/carousel/4.png",
  "/carousel/5.png",
];

export default function Carousel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % images.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full h-full overflow-hidden rounded-xl">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={images[index]}
        alt="carousel"
        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
      />
    </div>
  );
}
