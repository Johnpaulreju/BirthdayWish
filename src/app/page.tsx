"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import CountdownTimer from "@/app/components/CountdownTimer";
import { TypewriterEffect } from "@/app/components/TypewriterEffect";
import Confetti from "@/app/components/Confetti";
import FloatingParticles from "@/app/components/FloatingParticles";
import { BIRTHDAY_DATE } from "@/app/config";

const birthdayWords = [
  { text: "It's" },
  { text: "Your" },
  {
    text: "Birthday!",
    className: "text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-amber-400",
  },
];

export default function Home() {
  const router = useRouter();
  const [isTimerDone, setIsTimerDone] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastExiting, setToastExiting] = useState(false);

  const handleTimerComplete = useCallback(() => {
    setIsTimerDone(true);
  }, []);

  const handleButtonClick = () => {
    if (isTimerDone) {
      router.push("/celebrate");
    } else {
      setShowToast(true);
      setToastExiting(false);
      setTimeout(() => {
        setToastExiting(true);
        setTimeout(() => setShowToast(false), 300);
      }, 2500);
    }
  };

  // Check on mount if the date has already passed
  useEffect(() => {
    const target = new Date(BIRTHDAY_DATE).getTime();
    if (Date.now() >= target) {
      setIsTimerDone(true);
    }
  }, []);

  return (
    <div className="relative flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden px-6">
      {/* Background glows */}
      <div className="bg-glow bg-glow-1" />
      <div className="bg-glow bg-glow-2" />
      <div className="bg-glow bg-glow-3" />

      {/* Floating particles */}
      <FloatingParticles />

      {/* Confetti on timer complete */}
      {isTimerDone && <Confetti />}

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center gap-8 md:gap-12">
        {/* Countdown Timer - always on top */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <CountdownTimer onComplete={handleTimerComplete} />
        </motion.div>

        {/* Main heading or typewriter */}
        <AnimatePresence mode="wait">
          {!isTimerDone ? (
            <motion.div
              key="waiting"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20, transition: { duration: 0.3 } }}
              transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
              className="flex flex-col items-center gap-4"
            >
              <h1 className="text-center text-4xl font-bold leading-tight tracking-tight text-white md:text-6xl lg:text-8xl">
                Your Birthday
                <br />
                <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-amber-400 bg-clip-text text-transparent">
                  Month is Here
                </span>
              </h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 0.6 }}
                className="max-w-md text-center text-sm text-slate-400 md:text-base"
              >
                Something special is coming your way...
              </motion.p>
            </motion.div>
          ) : (
            <motion.div
              key="birthday"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
              className="flex flex-col items-center gap-4"
            >
              <TypewriterEffect
                words={birthdayWords}
                className="text-4xl md:text-6xl lg:text-8xl"
                cursorClassName="bg-pink-400"
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2, ease: "easeOut" }}
          className="relative"
        >
          <button
            onClick={handleButtonClick}
            className={`relative rounded-full px-8 py-3 text-base font-semibold transition-all duration-500 md:px-10 md:py-4 md:text-lg ${
              isTimerDone
                ? "bg-gradient-to-r from-purple-500 via-pink-500 to-amber-500 text-white shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/40 hover:scale-105 active:scale-95 cursor-pointer"
                : "bg-white/10 text-white/40 backdrop-blur-sm border border-white/10 blur-[2px] cursor-pointer hover:blur-[3px]"
            }`}
          >
            Let&apos;s Begin
          </button>
        </motion.div>
      </div>

      {/* Toast notification */}
      <AnimatePresence>
        {showToast && (
          <div
            className={`fixed bottom-8 left-1/2 z-50 -translate-x-1/2 ${
              toastExiting ? "toast-exit" : "toast-enter"
            }`}
          >
            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 backdrop-blur-xl">
              <span className="text-lg">⏳</span>
              <p className="text-sm font-medium text-white/80">
                Wait until the timer runs out!
              </p>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
