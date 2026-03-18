import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const WORDS = ["Discover", "Connect", "Bridge"];
const VIDEO_URL = "https://ussszdsedbqjgktsxxpx.supabase.co/storage/v1/object/public/vidd/12231468-uhd_3840_2160_30fps.mp4";

const LoadingScreen = ({ onComplete }: { onComplete: () => void }) => {
  const [wordIndex, setWordIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const startRef = useRef(0);
  const rafRef = useRef<number>(0);
  const doneRef = useRef(false);
  const videoReadyRef = useRef(false);
  const fontsReadyRef = useRef(false);

  useEffect(() => {
    // Preload video
    const video = document.createElement("video");
    video.preload = "auto";
    video.muted = true;
    video.playsInline = true;
    video.src = VIDEO_URL;
    video.addEventListener("canplaythrough", () => { videoReadyRef.current = true; }, { once: true });
    video.load();

    // Preload fonts
    document.fonts.ready.then(() => { fontsReadyRef.current = true; });

    // Force complete after 6s
    const forceTimeout = setTimeout(() => {
      if (!doneRef.current) {
        doneRef.current = true;
        setProgress(100);
        setTimeout(onComplete, 150);
      }
    }, 6000);

    const animate = (ts: number) => {
      if (!startRef.current) startRef.current = ts;
      const elapsed = ts - startRef.current;
      const minDone = elapsed >= 800;
      const allReady = videoReadyRef.current && fontsReadyRef.current;

      // Compute progress based on real loading milestones
      let p = 0;
      if (elapsed < 400) {
        p = (elapsed / 400) * 30; // 0-30%: HTML/CSS
      } else if (!fontsReadyRef.current) {
        p = 30 + Math.min((elapsed - 400) / 1000, 1) * 30; // 30-60%: waiting for fonts
      } else if (!videoReadyRef.current) {
        p = 60 + Math.min((elapsed - 400) / 2000, 1) * 35; // 60-95%: waiting for video
      } else {
        p = 95 + Math.min((elapsed - 400) / 200, 1) * 5; // 95-100%: settle
      }

      setProgress(Math.min(100, p));

      const shouldFinish = minDone && allReady && p >= 95;
      if (!doneRef.current && shouldFinish) {
        doneRef.current = true;
        setProgress(100);
        setTimeout(onComplete, 150);
        return;
      }

      if (!doneRef.current) rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => {
      cancelAnimationFrame(rafRef.current);
      clearTimeout(forceTimeout);
    };
  }, [onComplete]);

  useEffect(() => {
    const t1 = setTimeout(() => setWordIndex(1), 900);
    const t2 = setTimeout(() => setWordIndex(2), 1800);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  const counter = String(Math.floor(progress)).padStart(3, "0");

  return (
    <motion.div className="fixed inset-0 z-[9999] flex flex-col justify-between" style={{ background: "#0a0a0f" }} exit={{ opacity: 0 }} transition={{ duration: 0.6 }}>
      <motion.p className="px-8 pt-8 text-xs uppercase tracking-[0.3em]" style={{ color: "rgba(255,255,255,0.5)", fontFamily: "var(--font-body)" }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
        SkillBridge
      </motion.p>

      <div className="flex-1 flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.span key={wordIndex} className="text-6xl md:text-8xl italic" style={{ color: "rgba(255,255,255,0.8)", fontFamily: "var(--font-display)" }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}>
            {WORDS[wordIndex]}
          </motion.span>
        </AnimatePresence>
      </div>

      <div className="px-8 pb-8">
        <div className="flex justify-end mb-4">
          <span className="text-7xl md:text-9xl italic tabular-nums" style={{ color: "white", fontFamily: "var(--font-display)" }}>
            {counter}
          </span>
        </div>
        <div className="h-[3px] w-full rounded-full" style={{ background: "rgba(255,255,255,0.08)" }}>
          <motion.div className="h-full rounded-full" style={{ background: "linear-gradient(90deg, #4F46E5 0%, #818CF8 100%)", boxShadow: "0 0 8px rgba(79,70,229,0.35)", transformOrigin: "left" }} animate={{ scaleX: progress / 100 }} transition={{ duration: 0.05 }} />
        </div>
      </div>
    </motion.div>
  );
};

export default LoadingScreen;
