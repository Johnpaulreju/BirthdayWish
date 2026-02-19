"use client";

import { useState, useEffect, useRef } from "react";

interface InkLetterProps {
  active: boolean;
}

const LETTER = `Hey Aleena,

I know it's your 12th birthday, and on this special day I just want to wish you the happiest, most wonderful day of your entire life.

You deserve every bit of joy, every laugh, every surprise that comes your way today and always. The world truly became a brighter place the day you were born, and every year you only make it shine more.

May this new year of your life bring you adventures you've only dreamed of, friendships that fill your heart, and moments so beautiful they take your breath away.

Never stop being the amazing person you are. Keep smiling, keep dreaming, and keep being unapologetically you — because you are absolutely incredible.

Happy Birthday, superstar.


With all my love,
{Sender's Name}`;

export default function InkLetter({ active }: InkLetterProps) {
  const [displayedChars, setDisplayedChars] = useState(0);
  const [started, setStarted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!active) return;
    const t = setTimeout(() => setStarted(true), 800);
    return () => clearTimeout(t);
  }, [active]);

  useEffect(() => {
    if (!started) return;
    if (displayedChars >= LETTER.length) return;

    const speed = LETTER[displayedChars] === "\n" ? 50 : 22;
    const timer = setTimeout(() => {
      setDisplayedChars((prev) => prev + 1);
    }, speed);

    return () => clearTimeout(timer);
  }, [started, displayedChars]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [displayedChars]);

  const visibleText = LETTER.slice(0, displayedChars);
  const showCursor = displayedChars < LETTER.length && started;

  return (
    <div
      ref={containerRef}
      className="h-full overflow-y-auto"
      style={{
        padding: "clamp(20px, 6%, 40px)",
        paddingTop: "clamp(24px, 7%, 44px)",
        paddingRight: "clamp(16px, 4.5%, 32px)",
      }}
    >
      <pre
        style={{
          fontFamily: "'Comic Sans MS', 'Comic Sans', 'Chalkboard SE', cursive",
          fontSize: "clamp(13px, 1.6vw, 17px)",
          fontWeight: 600,
          lineHeight: 1.8,
          color: "rgba(20, 12, 5, 0.85)",
          whiteSpace: "pre-wrap",
          wordWrap: "break-word",
          textAlign: "left",
          margin: 0,
          letterSpacing: "0.01em",
        }}
      >
        {visibleText}
        {showCursor && (
          <span
            style={{
              display: "inline-block",
              width: "2px",
              height: "1em",
              background: "rgba(20, 12, 5, 0.7)",
              marginLeft: 1,
              verticalAlign: "text-bottom",
              animation: "inkCursorBlink 0.8s step-end infinite",
            }}
          />
        )}
      </pre>
    </div>
  );
}
