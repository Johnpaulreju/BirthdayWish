"use client";

import { useMemo } from "react";

interface PlanetConfig {
  name: string;
  orbitRadius: number;
  size: number;
  duration: number;
  color: string;
  glow: string;
  startAngle: number;
  hasRing?: boolean;
}

const planets: PlanetConfig[] = [
  {
    name: "mercury",
    orbitRadius: 220,
    size: 8,
    duration: 40,
    color: "radial-gradient(circle at 40% 35%, #E5E7EB, #9CA3AF, #6B7280)",
    glow: "rgba(156,163,175,0.3)",
    startAngle: 30,
  },
  {
    name: "venus",
    orbitRadius: 360,
    size: 14,
    duration: 60,
    color: "radial-gradient(circle at 40% 35%, #FDE68A, #F59E0B, #D97706)",
    glow: "rgba(245,158,11,0.3)",
    startAngle: 100,
  },
  {
    name: "earth",
    orbitRadius: 520,
    size: 16,
    duration: 80,
    color: "radial-gradient(circle at 40% 35%, #60A5FA, #3B82F6, #1D4ED8)",
    glow: "rgba(59,130,246,0.4)",
    startAngle: 200,
  },
  {
    name: "mars",
    orbitRadius: 700,
    size: 12,
    duration: 100,
    color: "radial-gradient(circle at 40% 35%, #FCA5A5, #EF4444, #B91C1C)",
    glow: "rgba(239,68,68,0.3)",
    startAngle: 300,
  },
  {
    name: "saturn",
    orbitRadius: 920,
    size: 22,
    duration: 140,
    color: "radial-gradient(circle at 40% 35%, #FDE68A, #D4A44C, #92400E)",
    glow: "rgba(251,191,36,0.3)",
    startAngle: 60,
    hasRing: true,
  },
];

export default function SolarSystemBg() {
  const stars = useMemo(
    () =>
      Array.from({ length: 100 }, (_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        size: Math.random() * 1.8 + 0.4,
        delay: Math.random() * 5,
        duration: Math.random() * 3 + 2,
      })),
    []
  );

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
      {/* Star field */}
      {stars.map((s) => (
        <div
          key={s.id}
          className="absolute rounded-full bg-white"
          style={{
            left: s.left,
            top: s.top,
            width: s.size,
            height: s.size,
            animation: `starTwinkle ${s.duration}s ease-in-out ${s.delay}s infinite`,
          }}
        />
      ))}

      {/* Solar system — sun anchored at bottom-left corner */}
      <div className="absolute" style={{ bottom: 0, left: 0, width: "100vw", height: "100vh" }}>
        {/* Sun — bottom-left corner, only 1/4 visible */}
        <div
          className="absolute"
          style={{
            bottom: -90,
            left: -90,
            width: 180,
            height: 180,
            borderRadius: "50%",
            background: "radial-gradient(circle at 55% 45%, #FDE68A 0%, #FBBF24 25%, #F59E0B 50%, #D97706 75%, #92400E 100%)",
            boxShadow:
              "0 0 60px rgba(251,191,36,0.4), 0 0 120px rgba(245,158,11,0.2), 0 0 200px rgba(217,119,6,0.1)",
            animation: "sunPulse 4s ease-in-out infinite",
            zIndex: 2,
          }}
        />

        {/* Sun corona glow */}
        <div
          className="absolute"
          style={{
            bottom: -175,
            left: -175,
            width: 350,
            height: 350,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(251,191,36,0.1) 0%, rgba(245,158,11,0.04) 40%, transparent 70%)",
          }}
        />

        {/* Orbital paths + planets — all centered on bottom-left corner */}
        {planets.map((p) => {
          const orbitSize = p.orbitRadius * 2;
          return (
            <div key={p.name}>
              {/* Orbit ring (visual) */}
              <div
                className="absolute rounded-full"
                style={{
                  bottom: -p.orbitRadius,
                  left: -p.orbitRadius,
                  width: orbitSize,
                  height: orbitSize,
                  border: "1px solid rgba(255,255,255,0.03)",
                }}
              />

              {/* Rotating orbit container */}
              <div
                className="absolute"
                style={{
                  bottom: -p.orbitRadius,
                  left: -p.orbitRadius,
                  width: orbitSize,
                  height: orbitSize,
                  animation: `orbitRotate ${p.duration}s linear infinite`,
                  // Start at a different angle
                  transform: `rotate(${p.startAngle}deg)`,
                }}
              >
                {/* Planet at the top of its orbit (12 o'clock position) */}
                <div
                  className="absolute"
                  style={{
                    top: 0,
                    left: "50%",
                    width: p.size,
                    height: p.size,
                    borderRadius: "50%",
                    transform: "translate(-50%, -50%)",
                    background: p.color,
                    boxShadow: `0 0 ${p.size}px ${p.glow}, inset -2px -2px ${p.size / 3}px rgba(0,0,0,0.3)`,
                    animation: `planetCounterRotate ${p.duration}s linear infinite`,
                  }}
                >
                  {p.hasRing && (
                    <div
                      className="absolute left-1/2 top-1/2"
                      style={{
                        transform: "translate(-50%, -50%) rotateX(75deg)",
                        width: p.size * 2.2,
                        height: p.size * 2.2,
                        borderRadius: "50%",
                        border: "2px solid rgba(251,191,36,0.25)",
                        boxShadow: "0 0 0 3px rgba(251,191,36,0.08)",
                      }}
                    />
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
