import { useEffect, useMemo, useState } from "react";

type CursorDetail = { x: number; y: number; visible: boolean };

const CURSOR_EVENT = "skillbridge:cursor";

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const CursorBuddyBot = () => {
  const [enabled, setEnabled] = useState(false);
  const [cursor, setCursor] = useState<CursorDetail>({ x: 0, y: 0, visible: false });

  useEffect(() => {
    const coarsePointer = window.matchMedia("(pointer: coarse)");

    const syncEnabled = () => {
      const loadingActive = document.body.dataset.loadingScreen === "true";
      setEnabled(!coarsePointer.matches && !loadingActive);
    };

    syncEnabled();

    const observer = new MutationObserver(syncEnabled);
    observer.observe(document.body, { attributes: true, attributeFilter: ["data-loading-screen"] });
    coarsePointer.addEventListener("change", syncEnabled);

    const onCursorMove = (event: Event) => {
      const detail = (event as CustomEvent<CursorDetail>).detail;
      if (detail) setCursor(detail);
    };

    window.addEventListener(CURSOR_EVENT, onCursorMove as EventListener);

    return () => {
      observer.disconnect();
      coarsePointer.removeEventListener("change", syncEnabled);
      window.removeEventListener(CURSOR_EVENT, onCursorMove as EventListener);
    };
  }, []);

  const eyeOffset = useMemo(() => {
    if (!enabled || !cursor.visible) return { x: 0, y: 0 };

    const anchorX = window.innerWidth - 82;
    const anchorY = window.innerHeight - 94;
    const dx = cursor.x - anchorX;
    const dy = cursor.y - anchorY;
    const distance = Math.max(Math.hypot(dx, dy), 1);
    return {
      x: clamp((dx / distance) * 4.5, -4.5, 4.5),
      y: clamp((dy / distance) * 4.5, -4.5, 4.5),
    };
  }, [cursor, enabled]);

  if (!enabled) return null;

  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        right: 18,
        bottom: 18,
        width: 128,
        height: 128,
        pointerEvents: "none",
        zIndex: 9997,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "34px 34px 28px 28px",
          background: "linear-gradient(180deg, rgba(226,255,255,0.96) 0%, rgba(110,231,255,0.95) 42%, rgba(8,145,178,0.98) 100%)",
          boxShadow: "0 20px 45px rgba(8,145,178,0.24), inset 0 2px 0 rgba(255,255,255,0.75)",
          border: "1px solid rgba(255,255,255,0.78)",
        }}
      />
      <div style={{ position: "absolute", inset: 10, borderRadius: 28, border: "1px solid rgba(15,23,42,0.08)" }} />
      <div style={{ position: "absolute", left: 22, right: 22, top: 24, height: 54, borderRadius: 22, background: "rgba(15,23,42,0.12)", backdropFilter: "blur(8px)" }} />
      {[28, 72].map((left) => (
        <div key={left} style={{ position: "absolute", top: 36, left, width: 28, height: 28, borderRadius: "9999px", background: "white", boxShadow: "inset 0 -2px 6px rgba(14,116,144,0.15)" }}>
          <div style={{ position: "absolute", left: 9 + eyeOffset.x, top: 9 + eyeOffset.y, width: 10, height: 10, borderRadius: "9999px", background: "#0f172a", transition: "left 0.08s linear, top 0.08s linear" }}>
            <div style={{ position: "absolute", left: 2, top: 2, width: 3, height: 3, borderRadius: "9999px", background: "rgba(255,255,255,0.9)" }} />
          </div>
        </div>
      ))}
      <div style={{ position: "absolute", left: 41, top: 74, width: 46, height: 18, borderBottom: "4px solid rgba(15,23,42,0.75)", borderRadius: "0 0 999px 999px", opacity: cursor.visible ? 1 : 0.75 }} />
      <div style={{ position: "absolute", left: 20, top: 8, width: 26, height: 16, borderRadius: "999px 999px 0 999px", background: "linear-gradient(180deg, #cffafe 0%, #67e8f9 100%)", border: "1px solid rgba(255,255,255,0.8)", transform: "rotate(-18deg)" }} />
      <div style={{ position: "absolute", right: 20, top: 8, width: 26, height: 16, borderRadius: "999px 999px 999px 0", background: "linear-gradient(180deg, #cffafe 0%, #67e8f9 100%)", border: "1px solid rgba(255,255,255,0.8)", transform: "rotate(18deg)" }} />
      <div style={{ position: "absolute", left: 24, right: 24, bottom: 14, height: 12, borderRadius: 999, background: "rgba(255,255,255,0.32)" }} />
    </div>
  );
};

export default CursorBuddyBot;
