"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";

const photos = [
  "https://picsum.photos/seed/bday1/400/400",
  "https://picsum.photos/seed/bday2/400/400",
  "https://picsum.photos/seed/bday3/400/400",
  "https://picsum.photos/seed/bday4/400/400",
  "https://picsum.photos/seed/bday5/400/400",
];

interface PhotoCarouselProps {
  active: boolean;
}

export default function PhotoCarousel({ active }: PhotoCarouselProps) {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % photos.length);
  }, []);

  useEffect(() => {
    if (!active) return;
    const interval = setInterval(next, 3000);
    return () => clearInterval(interval);
  }, [active, next]);

  return (
    <div className="flex flex-col items-center gap-3 w-full h-full justify-center">
      {/* Photo frame — bigger */}
      <div
        className="relative overflow-hidden"
        style={{
          width: "min(88%, 380px)",
          aspectRatio: "1 / 1",
          borderRadius: 18,
          boxShadow: "0 6px 28px rgba(0,0,0,0.12), inset 0 0 0 1.5px rgba(180,130,60,0.15)",
        }}
      >
        {photos.map((src, i) => (
          <div
            key={src}
            className="absolute inset-0"
            style={{
              opacity: current === i ? 1 : 0,
              transform: current === i ? "scale(1)" : "scale(1.08)",
              transition: "opacity 0.8s ease, transform 0.8s ease",
            }}
          >
            <Image src={src} alt={`Memory ${i + 1}`} fill className="object-cover" unoptimized />
          </div>
        ))}
        <div
          className="absolute inset-0 pointer-events-none z-10"
          style={{ background: "radial-gradient(ellipse at center, transparent 50%, rgba(180,130,60,0.06) 100%)" }}
        />
      </div>

      {/* Dots */}
      <div className="flex gap-2">
        {photos.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className="transition-all duration-300"
            style={{
              width: current === i ? 20 : 7,
              height: 7,
              borderRadius: 4,
              background: current === i ? "rgba(180,130,60,0.6)" : "rgba(180,130,60,0.2)",
            }}
          />
        ))}
      </div>
    </div>
  );
}
