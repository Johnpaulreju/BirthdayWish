"use client";

import SolarSystemBg from "@/app/components/SolarSystemBg";

export default function MemoriesPage() {
  return (
    <div
      className="relative min-h-[100dvh] flex flex-col items-center justify-center overflow-hidden"
      style={{ background: "#070510" }}
    >
      <SolarSystemBg />
      <div className="relative z-10 flex flex-col items-center gap-6 px-6 text-center">
        <h1
          className="text-3xl md:text-5xl font-bold text-white/90"
          style={{ fontFamily: "var(--font-amatic)", letterSpacing: "0.15em" }}
        >
          One Year of Memories
        </h1>
        <p
          className="text-sm md:text-base text-white/40"
          style={{ fontFamily: "var(--font-montserrat)" }}
        >
          Coming soon...
        </p>
      </div>
    </div>
  );
}
