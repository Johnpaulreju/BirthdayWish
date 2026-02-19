"use client";

import { useMemo } from "react";

interface BirthdayBannerProps {
  name: string;
}

export default function BirthdayBanner({ name }: BirthdayBannerProps) {
  const text = `HAPPY BIRTHDAY ${name.toUpperCase()}`;

  const letters = useMemo(() => {
    return text.split("").map((char, i) => {
      const total = text.length;
      // Arc: letters spread along a curve
      const progress = i / (total - 1); // 0 to 1
      const angle = -30 + progress * 60; // -30deg to +30deg
      const yOffset = Math.cos((progress - 0.5) * Math.PI) * 20; // arc curve

      return { char, angle, yOffset, delay: i * 0.04 };
    });
  }, [text]);

  return (
    <div className="fixed top-0 left-0 right-0 z-[80] flex justify-center pt-6 pointer-events-none">
      <div className="relative flex items-end justify-center" style={{ height: 100 }}>
        {letters.map((l, i) => (
          <span
            key={i}
            className="inline-block banner-letter-pop"
            style={{
              fontFamily: "var(--font-amatic)",
              fontSize: "clamp(1.8rem, 4vw, 3rem)",
              fontWeight: 700,
              color: i % 3 === 0 ? "#FBBF24" : i % 3 === 1 ? "#F472B6" : "#C084FC",
              textShadow: "0 2px 10px rgba(0,0,0,0.3)",
              transform: `rotate(${l.angle}deg) translateY(${-l.yOffset}px)`,
              animationDelay: `${l.delay}s`,
              marginLeft: l.char === " " ? "0.4em" : "0.05em",
              minWidth: l.char === " " ? "0.3em" : undefined,
            }}
          >
            {l.char === " " ? "\u00A0" : l.char}
          </span>
        ))}
      </div>
    </div>
  );
}
