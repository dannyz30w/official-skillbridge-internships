import { useEffect, useState } from "react";

const CuteCursorBuddy = () => {
  const [pos, setPos] = useState({ x: 24, y: 24 });
  const [target, setTarget] = useState({ x: 24, y: 24 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => setTarget({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", onMove, { passive: true });
    const t = setInterval(() => {
      setPos((p) => ({ x: p.x + (target.x - p.x) * 0.12, y: p.y + (target.y - p.y) * 0.12 }));
    }, 16);
    return () => {
      window.removeEventListener("mousemove", onMove);
      clearInterval(t);
    };
  }, [target.x, target.y]);

  const eyeDx = Math.max(-2, Math.min(2, (target.x - pos.x) / 40));
  const eyeDy = Math.max(-2, Math.min(2, (target.y - pos.y) / 40));

  return (
    <div style={{ position: "fixed", right: 18, bottom: 18, zIndex: 20, pointerEvents: "none" }} aria-hidden="true">
      <div style={{ width: 44, height: 44, borderRadius: "50%", background: "rgba(255,255,255,0.88)", border: "1px solid rgba(79,70,229,0.2)", position: "relative" }}>
        <div style={{ position: "absolute", top: 14, left: 12, width: 8, height: 8, borderRadius: "50%", background: "#111", transform: `translate(${eyeDx}px, ${eyeDy}px)` }} />
        <div style={{ position: "absolute", top: 14, right: 12, width: 8, height: 8, borderRadius: "50%", background: "#111", transform: `translate(${eyeDx}px, ${eyeDy}px)` }} />
      </div>
      <div style={{ width: 30, height: 26, margin: "-2px auto 0", borderRadius: "14px 14px 10px 10px", background: "rgba(79,70,229,0.9)" }} />
    </div>
  );
};

export default CuteCursorBuddy;
