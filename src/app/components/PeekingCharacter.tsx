"use client";

interface PeekingCharacterProps {
  visible: boolean;
}

export default function PeekingCharacter({ visible }: PeekingCharacterProps) {
  return (
    <div
      className="fixed bottom-0 right-2 z-40 md:right-6 transition-transform duration-1000"
      style={{
        transform: visible ? "translateY(0)" : "translateY(260px)",
        transitionTimingFunction: "cubic-bezier(0.34, 1.56, 0.64, 1)",
      }}
    >
      {/* Speech bubble */}
      <div
        className="absolute -top-1 -left-32 md:-left-40 z-50 transition-all duration-500"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "scale(1)" : "scale(0.5)",
          transitionDelay: visible ? "1s" : "0s",
        }}
      >
        <div
          className="relative rounded-2xl px-3 py-2 backdrop-blur-md shadow-lg"
          style={{ background: "rgba(120, 53, 15, 0.85)", boxShadow: "0 4px 15px rgba(251,191,36,0.1)" }}
        >
          <p
            className="text-xs font-semibold text-amber-200"
            style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
          >
            &#10024; Open it! Open it!
          </p>
          <div
            className="absolute -right-2 bottom-3 h-0 w-0"
            style={{
              borderTop: "6px solid transparent",
              borderBottom: "6px solid transparent",
              borderLeft: "8px solid rgba(120, 53, 15, 0.85)",
            }}
          />
        </div>
      </div>

      {/* Character SVG */}
      <svg
        viewBox="0 0 140 210"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: 120, height: 180 }}
      >
        <g className="character-bounce">
          {/* Body */}
          <ellipse cx="70" cy="155" rx="34" ry="44" fill="#C084FC" />
          <ellipse cx="70" cy="155" rx="34" ry="44" fill="url(#bodyG)" />
          <ellipse cx="70" cy="162" rx="20" ry="26" fill="#DDD6FE" opacity="0.15" />

          {/* Head */}
          <circle cx="70" cy="96" r="30" fill="#C084FC" />
          <circle cx="70" cy="96" r="30" fill="url(#headG)" />

          {/* Eyes */}
          <g className="blink-eyes">
            <ellipse cx="59" cy="92" rx="4.5" ry="5.5" fill="white" />
            <circle cx="60" cy="92" r="2.8" fill="#1E1B4B" />
            <circle cx="61" cy="90.5" r="1.1" fill="white" />
            <ellipse cx="81" cy="92" rx="4.5" ry="5.5" fill="white" />
            <circle cx="82" cy="92" r="2.8" fill="#1E1B4B" />
            <circle cx="83" cy="90.5" r="1.1" fill="white" />
          </g>

          {/* Smile + blush */}
          <path d="M63 103 Q70 110 77 103" stroke="#581C87" strokeWidth="2" strokeLinecap="round" fill="none" />
          <circle cx="53" cy="100" r="4.5" fill="#F472B6" opacity="0.3" />
          <circle cx="87" cy="100" r="4.5" fill="#F472B6" opacity="0.3" />

          {/* Left arm pointing */}
          <g className="arm-point" style={{ transformOrigin: "45px 130px" }}>
            <path d="M45 130 Q22 118 12 106" stroke="#C084FC" strokeWidth="9" strokeLinecap="round" fill="none" />
            <circle cx="10" cy="104" r="5.5" fill="#DDD6FE" />
            <path d="M10 104 L-2 100" stroke="#DDD6FE" strokeWidth="3.5" strokeLinecap="round" />
          </g>

          {/* Right arm */}
          <g className="arm-wave" style={{ transformOrigin: "95px 130px" }}>
            <path d="M95 130 Q108 124 113 140" stroke="#C084FC" strokeWidth="9" strokeLinecap="round" fill="none" />
            <circle cx="114" cy="142" r="5.5" fill="#DDD6FE" />
          </g>

          {/* Party hat */}
          <g className="hat-wobble" style={{ transformOrigin: "70px 70px" }}>
            <polygon points="56,77 70,42 84,77" fill="#FBBF24" />
            <polygon points="56,77 70,42 84,77" fill="url(#hatG)" />
            <circle cx="70" cy="40" r="3.5" fill="#F472B6" />
            <line x1="61" y1="67" x2="67" y2="50" stroke="#F59E0B" strokeWidth="1.5" opacity="0.4" />
            <line x1="73" y1="50" x2="79" y2="67" stroke="#F59E0B" strokeWidth="1.5" opacity="0.4" />
          </g>

          {/* Feet */}
          <ellipse cx="56" cy="197" rx="13" ry="5.5" fill="#9333EA" />
          <ellipse cx="84" cy="197" rx="13" ry="5.5" fill="#9333EA" />
        </g>

        <defs>
          <linearGradient id="bodyG" x1="36" y1="111" x2="104" y2="199">
            <stop offset="0%" stopColor="#DDD6FE" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#7C3AED" stopOpacity="0.3" />
          </linearGradient>
          <linearGradient id="headG" x1="40" y1="66" x2="100" y2="126">
            <stop offset="0%" stopColor="#DDD6FE" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#7C3AED" stopOpacity="0.25" />
          </linearGradient>
          <linearGradient id="hatG" x1="56" y1="42" x2="84" y2="77">
            <stop offset="0%" stopColor="#FDE68A" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.15" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
