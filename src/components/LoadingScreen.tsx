import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const WORDS = ["Discover", "Connect", "Bridge"];

const LoadingScreen = ({ onComplete, readyPromise }: { onComplete: () => void; readyPromise?: Promise<void> }) => {
  const [wordIndex, setWordIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const startRef = useRef(0);
  const rafRef = useRef<number>(0);
  const doneRef = useRef(false);
  const checksReadyRef = useRef(false);

  useEffect(() => {
    document.body.dataset.loadingScreen = "true";

    let cancelled = false;

    const settleChecks = async () => {
      const fontReady = "fonts" in document ? (document as Document & { fonts: FontFaceSet }).fonts.ready : Promise.resolve();

      await Promise.all([
        fontReady,
        readyPromise ?? Promise.resolve(),
        new Promise<void>((resolve) => {
          if (document.readyState === "complete") {
            resolve();
            return;
          }
          window.addEventListener("load", () => resolve(), { once: true });
        }),
      ]).catch(() => undefined);

      if (!cancelled) checksReadyRef.current = true;
    };

    settleChecks();

    const animate = (ts: number) => {
      if (!startRef.current) startRef.current = ts;
      const elapsed = ts - startRef.current;
      const minDurationDone = elapsed >= 1600;
      const maxProgressBeforeReady = checksReadyRef.current ? 99 : 92;
      const targetProgress = checksReadyRef.current
        ? Math.min(100, 92 + ((elapsed - 1400) / 700) * 8)
        : Math.min(maxProgressBeforeReady, 15 + (elapsed / 2200) * 75);

      setProgress((prev) => {
        const next = prev + (targetProgress - prev) * 0.18;
        return checksReadyRef.current ? Math.min(100, next) : Math.min(maxProgressBeforeReady, next);
      });

      if (!doneRef.current && checksReadyRef.current && minDurationDone && elapsed >= 2100) {
        doneRef.current = true;
        setProgress(100);
        window.setTimeout(() => {
          document.body.dataset.loadingScreen = "false";
          onComplete();
        }, 220);
        return;
      }

      if (!doneRef.current) rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      cancelled = true;
      document.body.dataset.loadingScreen = "false";
      cancelAnimationFrame(rafRef.current);
    };
  }, [onComplete, readyPromise]);

  useEffect(() => {
    const t1 = setTimeout(() => setWordIndex(1), 900);
    const t2 = setTimeout(() => setWordIndex(2), 1800);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  const counter = String(Math.floor(progress)).padStart(3, "0");

  return (
    <motion.div className="fixed inset-0 z-[9999] flex flex-col justify-between" style={{ background: "#000" }} exit={{ opacity: 0 }} transition={{ duration: 0.6 }}>
      <motion.p className="px-8 pt-8 text-xs uppercase tracking-[0.3em]" style={{ color: "rgba(210,245,255,0.72)", fontFamily: "var(--font-body)" }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
        SkillBridge
      </motion.p>

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="app-bg-layer app-bg-boxes-glow" />
        <div className="app-bg-layer app-bg-boxes-vignette" style={{ opacity: 0.45 }} />
      </div>

      <div className="relative flex-1 flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.span key={wordIndex} className="text-6xl md:text-8xl italic" style={{ color: "rgba(236,254,255,0.92)", fontFamily: "var(--font-display)" }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}>
            {WORDS[wordIndex]}
          </motion.span>
        </AnimatePresence>
      </div>

      <div className="relative px-8 pb-8">
        <div className="flex justify-end mb-4">
          <span className="text-7xl md:text-9xl italic tabular-nums" style={{ color: "#ecfeff", fontFamily: "var(--font-display)" }}>
            {counter}
          </span>
        </div>
        <div className="h-[3px] w-full rounded-full" style={{ background: "rgba(236,254,255,0.12)" }}>
          <motion.div className="h-full rounded-full" style={{ background: "linear-gradient(90deg, #22d3ee 0%, #38bdf8 45%, #a5f3fc 100%)", boxShadow: "0 0 12px rgba(34,211,238,0.45)", transformOrigin: "left" }} animate={{ scaleX: progress / 100 }} transition={{ duration: 0.05 }} />
        </div>
      </div>
    </motion.div>
  );
};

export default LoadingScreen;
