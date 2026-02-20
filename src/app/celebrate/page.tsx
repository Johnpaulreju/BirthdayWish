"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Envelope from "@/app/components/Envelope";
import PeekingCharacter from "@/app/components/PeekingCharacter";
import SolarSystemBg from "@/app/components/SolarSystemBg";
import Confetti from "@/app/components/Confetti";
import BirthdayCard from "@/app/components/BirthdayCard";
import MobileOrientationOverlay from "@/app/components/MobileOrientationOverlay";
import BirthdayBanner from "@/app/components/BirthdayBanner";

// Dynamically import the 3D cake to avoid SSR issues with Three.js
const BirthdayCake = dynamic(() => import("@/app/components/BirthdayCake"), { ssr: false });

/* ── Floating particles ── */
function FloatingParticles() {
  const particles = useMemo(
    () =>
      Array.from({ length: 25 }, (_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        size: Math.random() * 3 + 1,
        delay: Math.random() * 8,
        duration: Math.random() * 6 + 6,
        opacity: Math.random() * 0.3 + 0.1,
      })),
    []
  );

  return (
    <div className="fixed inset-0 pointer-events-none z-[1] overflow-hidden">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
            background: `radial-gradient(circle, rgba(196,132,252,${p.opacity}), rgba(244,114,182,${p.opacity * 0.5}))`,
            animation: `floatParticle ${p.duration}s ease-in-out ${p.delay}s infinite alternate`,
          }}
        />
      ))}
    </div>
  );
}

/* ── CSS confetti for card reveal ── */
function CSSConfetti() {
  const colors = ["#A855F7", "#F472B6", "#FBBF24", "#34D399", "#60A5FA", "#FB923C", "#E879F9"];
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const pieces = useMemo(
    () =>
      Array.from({ length: 60 }, (_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        color: colors[Math.floor(Math.random() * colors.length)],
        delay: Math.random() * 1,
        duration: Math.random() * 2 + 2.5,
        rotation: Math.random() * 720 - 360,
        size: Math.random() * 8 + 4,
        shape: Math.random() > 0.5 ? "50%" : "2px",
      })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return (
    <div className="fixed inset-0 pointer-events-none z-[60] overflow-hidden">
      {pieces.map((p) => (
        <div
          key={p.id}
          className="absolute -top-4"
          style={{
            left: p.left,
            width: p.shape === "50%" ? p.size : p.size * 0.6,
            height: p.size,
            borderRadius: p.shape,
            background: p.color,
            animation: `confettiFall ${p.duration}s ease-in ${p.delay}s forwards`,
            transform: `rotate(${p.rotation}deg)`,
          }}
        />
      ))}
    </div>
  );
}

/* ────────────────────────────────────────────────────────────── */
/*  MAIN PAGE                                                    */
/* ────────────────────────────────────────────────────────────── */
type Stage =
  | "landing"
  | "zooming"
  | "mobileOverlay"
  | "openEnvelope"
  | "cardTransition"
  | "card"
  | "cake"
  | "celebration";

export default function CelebratePage() {
  const router = useRouter();
  const [stage, setStage] = useState<Stage>("landing");
  const [showCharacter, setShowCharacter] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showCelebrationConfetti, setShowCelebrationConfetti] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768 || "ontouchstart" in window);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Show character after delay
  useEffect(() => {
    const t = setTimeout(() => setShowCharacter(true), 2000);
    return () => clearTimeout(t);
  }, []);

  /* ── Stage transitions ── */
  const handleEnvelopeClick = () => {
    setShowCharacter(false);
    setStage("zooming");

    if (isMobile) {
      setTimeout(() => setStage("mobileOverlay"), 800);
    } else {
      setTimeout(() => setStage("openEnvelope"), 800);
      setTimeout(() => setShowConfetti(true), 1800);
    }
  };

  const handleMobileReady = useCallback(() => {
    setStage("openEnvelope");
    setTimeout(() => setShowConfetti(true), 1000);
  }, []);

  const handleOpenCard = useCallback(() => {
    // Fade out the envelope card, then fade in the flipbook
    setStage("cardTransition");
    setTimeout(() => setStage("card"), 700);
  }, []);

  const handleCardClose = useCallback(() => {
    // Card closes, zooms out, fades → cake stage
    setTimeout(() => setStage("cake"), 1800);
  }, []);

  const handleCakeComplete = useCallback(() => {
    setStage("celebration");
    setShowCelebrationConfetti(true);
  }, []);

  return (
    <div
      className="relative min-h-[100dvh] flex flex-col items-center justify-center overflow-hidden"
      style={{ background: "#070510" }}
    >
      {/* Solar system background */}
      <SolarSystemBg />

      {/* Background glows */}
      <div className="bg-glow bg-glow-1" />
      <div className="bg-glow bg-glow-2" />
      <div className="bg-glow bg-glow-3" />

      <FloatingParticles />

      {/* Confetti — only on envelope card reveal */}
      {showConfetti && <CSSConfetti />}
      {showConfetti && <Confetti />}

      {/* Celebration confetti — after blowing candle */}
      {showCelebrationConfetti && <CSSConfetti />}
      {showCelebrationConfetti && <Confetti />}

      {/* ═══════════════════════════════════════════════════════ */}
      {/*  LANDING                                               */}
      {/* ═══════════════════════════════════════════════════════ */}
      {stage === "landing" && (
        <div className="relative z-10 flex flex-col items-center gap-10 md:gap-14 px-6">
          <div className="flex flex-col items-center gap-3 text-center card-text-reveal">
            <p
              className="text-xs md:text-sm font-semibold uppercase tracking-[0.3em]"
              style={{ fontFamily: "var(--font-montserrat)", color: "rgba(251,191,36,0.55)" }}
            >
              A little something for you
            </p>
            <h1
              className="text-2xl md:text-4xl lg:text-5xl font-bold leading-snug text-white/90"
              style={{ fontFamily: "var(--font-montserrat)" }}
            >
              There are a few{" "}
              <span className="text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(135deg, #C084FC, #F472B6, #FBBF24)" }}>
                surprises
              </span>
              <br />
              waiting for you
            </h1>
          </div>
          <div className="card-text-reveal" style={{ animationDelay: "0.5s" }}>
            <Envelope onClick={handleEnvelopeClick} shaking={true} />
          </div>
          <p
            className="text-sm card-text-reveal"
            style={{ fontFamily: "var(--font-montserrat)", color: "rgba(255,255,255,0.25)", animationDelay: "1.2s" }}
          >
            Go ahead, open the envelope...
          </p>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════ */}
      {/*  ZOOMING                                               */}
      {/* ═══════════════════════════════════════════════════════ */}
      {stage === "zooming" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black" style={{ animation: "fadeIn 0.6s ease-out forwards", opacity: 0 }} />
          <div className="relative envelope-zooming" style={{ width: 380, height: 270 }}>
            <Image src="/envelope.png" alt="Envelope" fill className="object-contain" style={{ filter: "drop-shadow(0 20px 60px rgba(0,0,0,0.6))" }} priority />
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════ */}
      {/*  MOBILE OVERLAY                                        */}
      {/* ═══════════════════════════════════════════════════════ */}
      {stage === "mobileOverlay" && (
        <MobileOrientationOverlay onReady={handleMobileReady} />
      )}

      {/* ═══════════════════════════════════════════════════════ */}
      {/*  OPEN ENVELOPE (card slides up from envelope)          */}
      {/* ═══════════════════════════════════════════════════════ */}
      {stage === "openEnvelope" && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-end bg-black/90">
          <div className="relative flex flex-col items-center w-full">
            <div className="relative z-10 card-slide-up w-full flex items-center justify-center" style={{ marginBottom: -50 }}>
              <div
                className="relative rounded-2xl overflow-hidden"
                style={{
                  height: "min(78dvh, 78vh)",
                  aspectRatio: "3 / 4",
                  maxWidth: "55vw",
                  boxShadow: "0 -10px 60px rgba(0,0,0,0.4), 0 0 100px rgba(168,85,247,0.08)",
                }}
              >
                <Image src="/front_cover_page.png" alt="Birthday Card" fill className="object-cover" priority />
                <div className="absolute inset-0 flex flex-col items-center justify-center z-10 px-6">
                  <div className="card-text-reveal" style={{ fontSize: "clamp(1rem, 2vw, 1.3rem)", letterSpacing: "0.5em", color: "rgba(180,130,60,0.45)", marginBottom: "1rem", animationDelay: "0.8s" }}>
                    &#10022; &#10022; &#10022;
                  </div>
                  <h2 className="tracking-[0.3em] mb-1 card-text-reveal" style={{ fontFamily: "var(--font-amatic)", fontWeight: 700, color: "rgba(80,50,20,0.8)", animationDelay: "1s", fontSize: "clamp(2rem, 5vw, 3.5rem)" }}>
                    HAPPY
                  </h2>
                  <h1 className="card-text-reveal" style={{ fontFamily: "var(--font-great-vibes)", fontSize: "clamp(3.5rem, 10vw, 7rem)", backgroundImage: "linear-gradient(135deg, #B8860B, #DAA520, #CD853F, #DAA520)", backgroundSize: "200% 200%", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", animation: "goldShimmer 3s ease-in-out infinite, cardTextReveal 0.8s ease-out 1.2s both", filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))" }}>
                    Birthday
                  </h1>
                  <div className="my-4 h-px card-text-reveal" style={{ width: "clamp(80px, 20vw, 160px)", background: "linear-gradient(90deg, transparent, rgba(180,130,60,0.4), transparent)", animationDelay: "1.5s" }} />
                  <p className="card-text-reveal text-center" style={{ fontFamily: "var(--font-montserrat)", fontWeight: 300, fontSize: "clamp(0.85rem, 1.8vw, 1.15rem)", letterSpacing: "0.04em", color: "rgba(80,50,20,0.6)", lineHeight: 1.8, maxWidth: "75%", animationDelay: "1.8s" }}>
                    The world is a better place<br />with you in it
                  </p>
                  <p className="card-text-reveal" style={{ fontFamily: "var(--font-great-vibes)", fontSize: "clamp(1.8rem, 4vw, 3rem)", color: "rgba(120,80,30,0.7)", marginTop: "1rem", animationDelay: "2.1s" }}>
                    , John
                  </p>
                  <div className="card-text-reveal" style={{ fontSize: "clamp(0.85rem, 1.5vw, 1.1rem)", letterSpacing: "0.3em", color: "rgba(180,130,60,0.3)", marginTop: "1.5rem", animationDelay: "2.4s" }}>
                    &#9472; &#10022; &#9472;
                  </div>
                </div>

                {/* Click Here → open card */}
                <button
                  onClick={handleOpenCard}
                  className="absolute z-20 flex items-center justify-center cursor-pointer card-text-reveal"
                  style={{
                    right: -18, top: "50%", transform: "translateY(-50%)",
                    width: 50, height: 50, borderRadius: "50%",
                    background: "radial-gradient(circle, rgba(251,191,36,0.9), rgba(217,119,6,0.8))",
                    boxShadow: "0 0 15px rgba(251,191,36,0.5), 0 0 30px rgba(251,191,36,0.2)",
                    animation: "clickHerePulse 2s ease-in-out infinite, cardTextReveal 0.8s ease-out 2.8s both",
                    border: "2px solid rgba(255,255,255,0.3)",
                  }}
                >
                  <span className="text-[8px] font-bold uppercase tracking-wider text-white text-center leading-tight" style={{ fontFamily: "var(--font-montserrat)" }}>
                    Click<br />Here
                  </span>
                </button>
              </div>
            </div>

            {/* Envelope bottom */}
            <div className="relative" style={{ width: "min(80vw, 400px)", height: 100, animation: "envelopeFadeDown 1.2s ease-in 1.4s forwards", zIndex: 5 }}>
              <Image src="/envelope.png" alt="Open Envelope" fill className="object-contain object-top" style={{ filter: "drop-shadow(0 10px 30px rgba(0,0,0,0.4))" }} priority />
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════ */}
      {/*  CARD TRANSITION (envelope card fades out)             */}
      {/* ═══════════════════════════════════════════════════════ */}
      {stage === "cardTransition" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(7,5,16,0.95)" }}>
          <div className="card-fade-out" style={{ height: "min(78dvh, 78vh)", aspectRatio: "3 / 4", maxWidth: "55vw" }}>
            <div className="relative rounded-2xl overflow-hidden w-full h-full" style={{ boxShadow: "0 10px 60px rgba(0,0,0,0.4)" }}>
              <Image src="/front_cover_page.png" alt="Card" fill className="object-cover" priority />
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════ */}
      {/*  CARD (flipbook — auto-opens)                          */}
      {/* ═══════════════════════════════════════════════════════ */}
      {stage === "card" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center card-stage-enter" style={{ background: "rgba(7,5,16,0.95)" }}>
          <BirthdayCard onClose={handleCardClose} autoOpen />
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════ */}
      {/*  CAKE (3D cake + blow detection)                       */}
      {/* ═══════════════════════════════════════════════════════ */}
      {stage === "cake" && (
        <BirthdayCake onComplete={handleCakeComplete} />
      )}

      {/* ═══════════════════════════════════════════════════════ */}
      {/*  CELEBRATION (after blowing candle)                     */}
      {/* ═══════════════════════════════════════════════════════ */}
      {stage === "celebration" && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center" style={{ background: "rgba(7,5,16,0.95)" }}>
          {/* Banner arch */}
          <BirthdayBanner name="John" />

          {/* Center content */}
          <div className="flex flex-col items-center gap-6 card-text-reveal" style={{ marginTop: 80 }}>
            <p
              className="text-lg md:text-xl"
              style={{
                fontFamily: "var(--font-great-vibes)",
                color: "rgba(251,191,36,0.7)",
                fontSize: "clamp(1.5rem, 3.5vw, 2.5rem)",
              }}
            >
              &#10024; Your special day! &#10024;
            </p>
          </div>

          {/* Swipe arrow — right center */}
          <button
            onClick={() => router.push("/memories")}
            className="fixed right-4 md:right-8 top-1/2 -translate-y-1/2 z-[90] flex items-center gap-2 cursor-pointer group"
            style={{ animation: "tapFade 2s ease-in-out infinite" }}
          >
            <span
              className="text-xs md:text-sm text-right"
              style={{
                fontFamily: "var(--font-montserrat)",
                fontWeight: 500,
                color: "rgba(255,255,255,0.5)",
                maxWidth: 120,
                lineHeight: 1.4,
              }}
            >
              Swipe for one year memories
            </span>
            <svg
              width="28" height="28" viewBox="0 0 24 24" fill="none"
              className="transition-transform group-hover:translate-x-1"
            >
              <path d="M9 5l7 7-7 7" stroke="rgba(251,191,36,0.6)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      )}

      {/* Peeking character — only on landing */}
      {stage === "landing" && <PeekingCharacter visible={showCharacter} />}
    </div>
  );
}
