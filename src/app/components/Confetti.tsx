"use client";

import { useEffect } from "react";
import confetti from "canvas-confetti";

export default function Confetti() {
  useEffect(() => {
    const colors = ["#C084FC", "#F472B6", "#FBBF24", "#60A5FA", "#34D399", "#FF6B6B"];

    // Big initial burst
    confetti({
      particleCount: 150,
      spread: 100,
      origin: { y: 0.6 },
      colors,
      zIndex: 9999,
    });

    // Side cannons for 4 seconds
    const duration = 4000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors,
        zIndex: 9999,
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors,
        zIndex: 9999,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    frame();

    // Another burst after a beat
    const timeout = setTimeout(() => {
      confetti({
        particleCount: 100,
        spread: 120,
        origin: { y: 0.5, x: 0.5 },
        colors,
        zIndex: 9999,
        startVelocity: 45,
      });
    }, 800);

    return () => clearTimeout(timeout);
  }, []);

  return null;
}
