"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BIRTHDAY_DATE } from "@/app/config";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const TARGET_DATE = new Date(BIRTHDAY_DATE).getTime();

function calculateTimeLeft(): TimeLeft {
  const now = Date.now();
  const difference = TARGET_DATE - now;

  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / (1000 * 60)) % 60),
    seconds: Math.floor((difference / 1000) % 60),
  };
}

function TimerUnit({ value, label }: { value: number; label: string }) {
  const displayValue = String(value).padStart(2, "0");

  return (
    <div className="flex flex-col items-center">
      <div className="relative overflow-hidden rounded-xl border border-white/10 bg-white/5 backdrop-blur-md px-3 py-2 md:px-5 md:py-4">
        <AnimatePresence mode="popLayout">
          <motion.span
            key={displayValue}
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 30, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="block text-3xl font-bold tabular-nums text-white md:text-5xl lg:text-6xl"
          >
            {displayValue}
          </motion.span>
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
      </div>
      <span className="mt-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-purple-300/70 md:text-xs">
        {label}
      </span>
    </div>
  );
}

export default function CountdownTimer({
  onComplete,
}: {
  onComplete: () => void;
}) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setTimeLeft(calculateTimeLeft());

    const interval = setInterval(() => {
      const tl = calculateTimeLeft();
      setTimeLeft(tl);

      if (
        tl.days === 0 &&
        tl.hours === 0 &&
        tl.minutes === 0 &&
        tl.seconds === 0
      ) {
        clearInterval(interval);
        onComplete();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [onComplete]);

  if (!mounted) {
    return (
      <div className="flex items-center gap-3 md:gap-5">
        {["Days", "Hours", "Minutes", "Seconds"].map((label) => (
          <TimerUnit key={label} value={0} label={label} />
        ))}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
      className="flex items-center gap-2 md:gap-4"
    >
      <TimerUnit value={timeLeft.days} label="Days" />
      <span className="text-2xl font-light text-purple-400/50 mt-[-20px] md:text-4xl">
        :
      </span>
      <TimerUnit value={timeLeft.hours} label="Hours" />
      <span className="text-2xl font-light text-purple-400/50 mt-[-20px] md:text-4xl">
        :
      </span>
      <TimerUnit value={timeLeft.minutes} label="Minutes" />
      <span className="text-2xl font-light text-purple-400/50 mt-[-20px] md:text-4xl">
        :
      </span>
      <TimerUnit value={timeLeft.seconds} label="Seconds" />
    </motion.div>
  );
}
