"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import HTMLFlipBook from "react-pageflip";
import PhotoCarousel from "./PhotoCarousel";
import InkLetter from "./InkLetter";

interface BirthdayCardProps {
  onOpen?: () => void;
  onClose?: () => void;
  autoOpen?: boolean;
}

/* ── Cover page ── */
const CoverPage = React.forwardRef<HTMLDivElement, { pageW: number; pageH: number }>(
  ({ pageW, pageH }, ref) => {
    const fs = {
      flourish: Math.max(14, pageW * 0.035),
      happy: Math.max(26, pageW * 0.09),
      birthday: Math.max(44, pageW * 0.17),
      message: Math.max(12, pageW * 0.028),
      name: Math.max(22, pageW * 0.07),
      dividerW: Math.max(60, pageW * 0.22),
    };

    return (
      <div ref={ref} className="relative w-full h-full overflow-hidden" style={{ background: "#FAF5EF" }}>
        <Image src="/front_cover_page.png" alt="Card Cover" fill className="object-cover" priority />
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 px-6">
          <div style={{ fontSize: fs.flourish, letterSpacing: "0.5em", color: "rgba(180,130,60,0.45)", marginBottom: pageH * 0.02 }}>
            &#10022; &#10022; &#10022;
          </div>
          <h2 style={{ fontFamily: "var(--font-amatic)", fontWeight: 700, fontSize: fs.happy, letterSpacing: "0.3em", color: "rgba(80,50,20,0.8)", marginBottom: pageH * 0.005 }}>
            HAPPY
          </h2>
          <h1
            style={{
              fontFamily: "var(--font-great-vibes)", fontSize: fs.birthday,
              backgroundImage: "linear-gradient(135deg, #B8860B, #DAA520, #CD853F, #DAA520)",
              backgroundSize: "200% 200%", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              backgroundClip: "text", animation: "goldShimmer 3s ease-in-out infinite",
              filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))",
            }}
          >
            Birthday
          </h1>
          <div style={{ width: fs.dividerW, height: 1, margin: `${pageH * 0.03}px 0`, background: "linear-gradient(90deg, transparent, rgba(180,130,60,0.4), transparent)" }} />
          <p style={{ fontFamily: "var(--font-montserrat)", fontWeight: 300, fontSize: fs.message, letterSpacing: "0.04em", color: "rgba(80,50,20,0.6)", textAlign: "center", lineHeight: 1.8, maxWidth: "80%" }}>
            The world is a better place<br />with you in it
          </p>
          <p style={{ fontFamily: "var(--font-great-vibes)", fontSize: fs.name, color: "rgba(120,80,30,0.7)", marginTop: pageH * 0.02 }}>
            , Aleena
          </p>
          <div style={{ fontSize: fs.flourish * 0.85, letterSpacing: "0.3em", color: "rgba(180,130,60,0.3)", marginTop: pageH * 0.025 }}>
            &#9472; &#10022; &#9472;
          </div>
        </div>
      </div>
    );
  }
);
CoverPage.displayName = "CoverPage";

/* ── Inside left page (carousel) ── */
const InsideLeftPage = React.forwardRef<HTMLDivElement, { isVisible: boolean }>(
  ({ isVisible }, ref) => (
    <div ref={ref} className="relative w-full h-full overflow-hidden" style={{ background: "#FAF5EF" }}>
      <Image src="/inside_page_left.png" alt="Inside Left" fill className="object-cover" priority />
      <div className="absolute top-0 right-0 h-full pointer-events-none" style={{ width: 30, background: "linear-gradient(to left, rgba(0,0,0,0.05), transparent)" }} />
      <div className="absolute inset-0 flex items-center justify-center z-10 p-4">
        <PhotoCarousel active={isVisible} />
      </div>
    </div>
  )
);
InsideLeftPage.displayName = "InsideLeftPage";

/* ── Inside right page (letter + close button) ── */
const InsideRightPage = React.forwardRef<HTMLDivElement, { isVisible: boolean; onCloseClick: () => void }>(
  ({ isVisible, onCloseClick }, ref) => (
    <div ref={ref} className="relative w-full h-full overflow-hidden" style={{ background: "#FAF5EF" }}>
      <Image src="/inside_page_right.png" alt="Inside Right" fill className="object-cover" priority />
      <div className="absolute top-0 left-0 h-full pointer-events-none" style={{ width: 30, background: "linear-gradient(to right, rgba(0,0,0,0.05), transparent)" }} />
      <div className="absolute inset-0 z-10">
        <InkLetter active={isVisible} />
      </div>
      {/* Close / Click Here button — bottom right corner */}
      {isVisible && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onCloseClick();
          }}
          className="absolute z-30 flex items-center justify-center"
          style={{
            bottom: 16,
            right: 16,
            width: 48,
            height: 48,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(180,160,120,0.25), rgba(180,160,120,0.12))",
            boxShadow: "0 0 12px rgba(180,160,120,0.2), 0 0 24px rgba(180,160,120,0.08)",
            border: "1.5px solid rgba(180,160,120,0.2)",
            animation: "clickHerePulse 2.5s ease-in-out infinite",
            cursor: "pointer",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-montserrat)",
              fontSize: 7,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              color: "rgba(80,50,20,0.55)",
              textAlign: "center",
              lineHeight: 1.2,
            }}
          >
            Click<br />Here
          </span>
        </button>
      )}
    </div>
  )
);
InsideRightPage.displayName = "InsideRightPage";

/* ── Back cover ── */
const BackCover = React.forwardRef<HTMLDivElement>((_, ref) => (
  <div ref={ref} className="relative w-full h-full" style={{ background: "linear-gradient(135deg, #FAF5EF, #F0E8D8)" }}>
    <div className="absolute inset-0 flex items-center justify-center">
      <p style={{ fontFamily: "var(--font-great-vibes)", fontSize: 24, color: "rgba(180,130,60,0.3)" }}>&#10022;</p>
    </div>
  </div>
));
BackCover.displayName = "BackCover";

/* ── Main component ── */
export default function BirthdayCard({ onOpen, onClose, autoOpen = false }: BirthdayCardProps) {
  const [dimensions, setDimensions] = useState({ pageW: 0, pageH: 0 });
  const [insideVisible, setInsideVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const bookRef = useRef<any>(null);

  useEffect(() => {
    const calculate = () => {
      const vh = window.innerHeight;
      const vw = window.innerWidth;
      let pageH = vh * 0.82;
      let pageW = pageH * 0.75;
      if (pageW * 2 > vw * 0.94) {
        pageW = (vw * 0.94) / 2;
        pageH = pageW / 0.75;
      }
      if (pageW > vw * 0.48) {
        pageW = vw * 0.48;
        pageH = pageW / 0.75;
      }
      setDimensions({ pageW: Math.round(pageW), pageH: Math.round(pageH) });
    };
    calculate();
    window.addEventListener("resize", calculate);
    return () => window.removeEventListener("resize", calculate);
  }, []);

  // Auto-open: flip the cover after a short delay
  useEffect(() => {
    if (!autoOpen || !dimensions.pageW) return;
    const t = setTimeout(() => {
      const pageFlip = bookRef.current?.pageFlip();
      if (pageFlip) {
        pageFlip.flipNext();
      }
    }, 1000);
    return () => clearTimeout(t);
  }, [autoOpen, dimensions.pageW]);

  const handleFlip = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (e: any) => {
      // Cover just opened — show inside pages
      if (e.data >= 1 && !insideVisible) {
        setInsideVisible(true);
        onOpen?.();

        // Disable further flipping by blocking mouse events on the inner pages
        // react-pageflip doesn't have a lock API, so we disable interaction
        setTimeout(() => {
          const pageFlip = bookRef.current?.pageFlip();
          if (pageFlip) {
            // Remove mouse/touch listeners to prevent further flips
            pageFlip.setting.useMouseEvents = false;
          }
        }, 100);
      }
    },
    [insideVisible, onOpen]
  );

  const handleCloseClick = useCallback(() => {
    setIsClosing(true);
    // Flip back to cover
    const pageFlip = bookRef.current?.pageFlip();
    if (pageFlip) {
      pageFlip.setting.useMouseEvents = true;
      pageFlip.flipPrev();
    }
    // After flip animation completes, trigger close
    setTimeout(() => {
      onClose?.();
    }, 1600);
  }, [onClose]);

  const { pageW, pageH } = dimensions;
  if (!pageW) return null;

  return (
    <div
      className="flex items-center justify-center w-full h-full"
      style={{
        transition: "transform 1s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.8s ease",
        transform: isClosing ? "scale(0.15) translate(-180%, -180%)" : "scale(1)",
        opacity: isClosing ? 0 : 1,
        borderRadius: isClosing ? "50%" : "0",
        overflow: "hidden",
      }}
    >
      <HTMLFlipBook
        ref={bookRef}
        width={pageW}
        height={pageH}
        showCover={true}
        flippingTime={1200}
        drawShadow={true}
        useMouseEvents={true}
        usePortrait={false}
        startZIndex={0}
        autoSize={false}
        maxShadowOpacity={0.4}
        mobileScrollSupport={false}
        onFlip={handleFlip}
        className="book-shadow"
        style={{}}
        startPage={0}
        size="fixed"
        minWidth={pageW}
        maxWidth={pageW}
        minHeight={pageH}
        maxHeight={pageH}
        clickEventForward={true}
        swipeDistance={30}
        showPageCorners={!insideVisible}
        disableFlipByClick={false}
      >
        <CoverPage pageW={pageW} pageH={pageH} />
        <InsideLeftPage isVisible={insideVisible} />
        <InsideRightPage isVisible={insideVisible} onCloseClick={handleCloseClick} />
        <BackCover />
      </HTMLFlipBook>
    </div>
  );
}
