"use client";

import Image from "next/image";

interface EnvelopeProps {
  onClick: () => void;
  shaking: boolean;
}

export default function Envelope({ onClick, shaking }: EnvelopeProps) {
  return (
    <div
      onClick={onClick}
      className={`relative cursor-pointer select-none group ${shaking ? "envelope-shake" : ""}`}
      style={{ width: 380, height: 270 }}
    >
      {/* Glow behind envelope */}
      <div
        className="absolute -inset-4 rounded-2xl blur-3xl opacity-25 transition-opacity duration-300 group-hover:opacity-40"
        style={{ background: "linear-gradient(135deg, #FBBF24, #F472B6, #C084FC)" }}
      />

      {/* Envelope image */}
      <div className="relative w-full h-full transition-transform duration-300 ease-out group-hover:scale-[1.04] group-active:scale-[0.97]">
        <Image
          src="/envelope.png"
          alt="Envelope"
          fill
          className="object-contain"
          style={{ filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.4))" }}
          priority
        />
      </div>

      {/* Tap to open */}
      <p
        className="absolute -bottom-10 left-1/2 -translate-x-1/2 whitespace-nowrap text-sm font-medium tap-hint"
        style={{
          fontFamily: "var(--font-montserrat), sans-serif",
          color: "rgba(251,191,36,0.5)",
        }}
      >
        Tap to open
      </p>
    </div>
  );
}
