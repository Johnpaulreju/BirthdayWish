"use client";

import { useState, useEffect, useCallback } from "react";

interface MobileOrientationOverlayProps {
  onReady: () => void;
}

type Step = "rotate" | "fullscreen" | "done";

export default function MobileOrientationOverlay({ onReady }: MobileOrientationOverlayProps) {
  const [step, setStep] = useState<Step>("rotate");
  const [isLandscape, setIsLandscape] = useState(false);

  // Check orientation
  useEffect(() => {
    const checkOrientation = () => {
      const landscape = window.innerWidth > window.innerHeight;
      setIsLandscape(landscape);
      if (landscape && step === "rotate") {
        setStep("fullscreen");
      }
    };

    checkOrientation();
    window.addEventListener("resize", checkOrientation);
    window.addEventListener("orientationchange", () => {
      // Small delay for orientation to settle
      setTimeout(checkOrientation, 200);
    });

    return () => {
      window.removeEventListener("resize", checkOrientation);
      window.removeEventListener("orientationchange", checkOrientation);
    };
  }, [step]);

  const requestFullscreen = useCallback(async () => {
    try {
      const el = document.documentElement;
      if (el.requestFullscreen) {
        await el.requestFullscreen();
      } else if ((el as unknown as { webkitRequestFullscreen?: () => Promise<void> }).webkitRequestFullscreen) {
        await (el as unknown as { webkitRequestFullscreen: () => Promise<void> }).webkitRequestFullscreen();
      }
    } catch {
      // Fullscreen denied or not supported — proceed anyway
    }
    setStep("done");
    onReady();
  }, [onReady]);

  const skipFullscreen = useCallback(() => {
    setStep("done");
    onReady();
  }, [onReady]);

  if (step === "done") return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center"
      style={{ background: "rgba(7,5,16,0.92)", backdropFilter: "blur(12px)" }}
    >
      {step === "rotate" && (
        <div className="flex flex-col items-center gap-8 px-8 text-center card-text-reveal">
          {/* Rotate phone icon */}
          <div className="relative" style={{ width: 100, height: 100 }}>
            <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
              {/* Phone body */}
              <rect
                x="30" y="15" width="40" height="70" rx="6"
                stroke="rgba(251,191,36,0.8)" strokeWidth="2.5" fill="none"
                className="rotate-phone-icon"
              />
              {/* Screen */}
              <rect
                x="34" y="22" width="32" height="54" rx="2"
                fill="rgba(251,191,36,0.1)"
                className="rotate-phone-icon"
              />
              {/* Rotation arrow */}
              <path
                d="M78 50 C78 30, 62 18, 50 18"
                stroke="rgba(196,132,252,0.7)" strokeWidth="2" fill="none"
                strokeLinecap="round" markerEnd="url(#arrowhead)"
              />
              <path
                d="M22 50 C22 70, 38 82, 50 82"
                stroke="rgba(196,132,252,0.7)" strokeWidth="2" fill="none"
                strokeLinecap="round" markerEnd="url(#arrowhead)"
              />
              <defs>
                <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="6" refY="3" orient="auto">
                  <path d="M0,0 L8,3 L0,6" fill="rgba(196,132,252,0.7)" />
                </marker>
              </defs>
            </svg>
          </div>

          <div className="flex flex-col gap-3">
            <h2
              className="text-xl font-semibold text-white/90"
              style={{ fontFamily: "var(--font-montserrat)" }}
            >
              Rotate Your Screen
            </h2>
            <p
              className="text-sm text-white/50 max-w-[260px]"
              style={{ fontFamily: "var(--font-montserrat)" }}
            >
              For the best experience, please rotate your phone to landscape mode
            </p>
          </div>

          {/* Pulsing dots */}
          <div className="flex gap-2">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-full"
                style={{
                  background: "rgba(251,191,36,0.6)",
                  animation: `tapFade 1.5s ease-in-out ${i * 0.3}s infinite`,
                }}
              />
            ))}
          </div>
        </div>
      )}

      {step === "fullscreen" && (
        <div className="flex flex-col items-center gap-8 px-8 text-center card-text-reveal">
          {/* Fullscreen icon */}
          <div style={{ width: 80, height: 80 }}>
            <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
              {/* Corner arrows */}
              <path d="M8 25 L8 8 L25 8" stroke="rgba(251,191,36,0.8)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M55 8 L72 8 L72 25" stroke="rgba(251,191,36,0.8)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M72 55 L72 72 L55 72" stroke="rgba(251,191,36,0.8)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M25 72 L8 72 L8 55" stroke="rgba(251,191,36,0.8)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              {/* Inner screen */}
              <rect x="18" y="18" width="44" height="44" rx="4" stroke="rgba(196,132,252,0.4)" strokeWidth="1.5" strokeDasharray="4 4" fill="none" />
            </svg>
          </div>

          <div className="flex flex-col gap-3">
            <h2
              className="text-xl font-semibold text-white/90"
              style={{ fontFamily: "var(--font-montserrat)" }}
            >
              Go Fullscreen
            </h2>
            <p
              className="text-sm text-white/50 max-w-[260px]"
              style={{ fontFamily: "var(--font-montserrat)" }}
            >
              Tap below to enter fullscreen for an immersive experience
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <button
              onClick={requestFullscreen}
              className="px-8 py-3 rounded-full text-sm font-semibold transition-all duration-300 hover:scale-105 active:scale-95"
              style={{
                fontFamily: "var(--font-montserrat)",
                background: "linear-gradient(135deg, rgba(251,191,36,0.9), rgba(217,119,6,0.8))",
                color: "white",
                boxShadow: "0 4px 20px rgba(251,191,36,0.3)",
              }}
            >
              Enter Fullscreen
            </button>
            <button
              onClick={skipFullscreen}
              className="text-xs text-white/30 hover:text-white/50 transition-colors"
              style={{ fontFamily: "var(--font-montserrat)" }}
            >
              Skip
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
