import { useEffect, useRef, useState } from "react";

type CursorDetail = { x: number; y: number; visible: boolean };

const CURSOR_EVENT = "skillbridge:cursor";

const CuteCursorBuddy = () => {
  const dotRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const target = useRef({ x: -100, y: -100 });
  const current = useRef({ x: -100, y: -100 });
  const [visible, setVisible] = useState(false);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const coarsePointer = window.matchMedia("(pointer: coarse)");

    const syncEnabled = () => {
      const loadingActive = document.body.dataset.loadingScreen === "true";
      const nextEnabled = !coarsePointer.matches && !loadingActive;
      setEnabled(nextEnabled);
      document.body.style.cursor = nextEnabled ? "none" : "";
      if (!nextEnabled) {
        setVisible(false);
        window.dispatchEvent(new CustomEvent<CursorDetail>(CURSOR_EVENT, { detail: { x: current.current.x, y: current.current.y, visible: false } }));
      }
    };

    syncEnabled();

    const observer = new MutationObserver(syncEnabled);
    observer.observe(document.body, { attributes: true, attributeFilter: ["data-loading-screen"] });
    coarsePointer.addEventListener("change", syncEnabled);

    const onMove = (event: MouseEvent) => {
      if (!enabled) return;
      target.current = { x: event.clientX, y: event.clientY };
      current.current = { x: event.clientX, y: event.clientY };
      setVisible(true);
      window.dispatchEvent(new CustomEvent<CursorDetail>(CURSOR_EVENT, { detail: { x: event.clientX, y: event.clientY, visible: true } }));
    };

    const onLeave = () => {
      setVisible(false);
      window.dispatchEvent(new CustomEvent<CursorDetail>(CURSOR_EVENT, { detail: { x: current.current.x, y: current.current.y, visible: false } }));
    };

    const animate = () => {
      current.current.x += (target.current.x - current.current.x) * 0.35;
      current.current.y += (target.current.y - current.current.y) * 0.35;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${current.current.x - 7}px, ${current.current.y - 7}px)`;
      }

      rafRef.current = window.requestAnimationFrame(animate);
    };

    rafRef.current = window.requestAnimationFrame(animate);
    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseout", onLeave);

    return () => {
      observer.disconnect();
      coarsePointer.removeEventListener("change", syncEnabled);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseout", onLeave);
      window.cancelAnimationFrame(rafRef.current);
      document.body.style.cursor = "";
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      ref={dotRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        left: 0,
        top: 0,
        width: 14,
        height: 14,
        borderRadius: "9999px",
        background: "radial-gradient(circle at 30% 30%, #ffffff 0%, #9ff6ff 38%, #0f172a 100%)",
        boxShadow: "0 0 0 2px rgba(255,255,255,0.45), 0 0 24px rgba(34,211,238,0.4)",
        pointerEvents: "none",
        zIndex: 9999,
        opacity: visible ? 1 : 0,
        transition: "opacity 0.18s ease",
        willChange: "transform",
      }}
    />
  );
};

export default CuteCursorBuddy;
