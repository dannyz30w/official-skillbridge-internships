import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const WORDS = ["Discover", "Connect", "Bridge"];

const LoadingScreen = ({ onComplete }: { onComplete: () => void }) => {
  const [wordIndex, setWordIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const startRef = useRef(0);
  const rafRef = useRef<number>(0);
  const doneRef = useRef(false);

  const animate = useCallback((ts: number) => {
    if (!startRef.current) startRef.current = ts;
    const elapsed = ts - startRef.current;
    const p = Math.min(elapsed / 2700, 1);
    setProgress(p * 100);
    if (p < 1) {
      rafRef.current = requestAnimationFrame(animate);
    } else if (!doneRef.current) {
      doneRef.current = true;
      setTimeout(onComplete, 400);
    }
  }, [onComplete]);

  useEffect(() => {
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [animate]);

  useEffect(() => {
    const t1 = setTimeout(() => setWordIndex(1), 900);
    const t2 = setTimeout(() => setWordIndex(2), 1800);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  const counter = String(Math.floor(progress)).padStart(3, "0");

  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex flex-col justify-between"
      style={{ background: "#0a0a0f" }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Top-left label */}
      <motion.p
        className="px-8 pt-8 text-xs uppercase tracking-[0.3em]"
        style={{ color: "rgba(255,255,255,0.5)", fontFamily: "var(--font-body)" }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        SkillBridge
      </motion.p>

      {/* Center rotating words */}
      <div className="flex-1 flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.span
            key={wordIndex}
            className="text-6xl md:text-8xl italic"
            style={{ color: "rgba(255,255,255,0.8)", fontFamily: "var(--font-display)" }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
          >
            {WORDS[wordIndex]}
          </motion.span>
        </AnimatePresence>
      </div>

      {/* Bottom section */}
      <div className="px-8 pb-8">
        {/* Counter */}
        <div className="flex justify-end mb-4">
          <span
            className="text-7xl md:text-9xl italic tabular-nums"
            style={{ color: "white", fontFamily: "var(--font-display)" }}
          >
            {counter}
          </span>
        </div>
        {/* Progress bar */}
        <div className="h-[3px] w-full rounded-full" style={{ background: "rgba(255,255,255,0.08)" }}>
          <motion.div
            className="h-full rounded-full"
            style={{
              background: "linear-gradient(90deg, #4F46E5 0%, #818CF8 100%)",
              boxShadow: "0 0 8px rgba(79,70,229,0.35)",
              transformOrigin: "left",
            }}
            animate={{ scaleX: progress / 100 }}
            transition={{ duration: 0.05 }}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default LoadingScreen;
