import { useEffect, useRef, useState, useCallback } from "react";

const CLICKABLE = "a, button, [role=button], label, input[type=submit], input[type=button]";
const TEXT_ELS = "p, h1, h2, h3, h4, h5, h6, span, blockquote, li";

const CuteCursorBuddy = () => {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const target = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });
  const [visible, setVisible] = useState(false);
  const [hoverState, setHoverState] = useState<"default" | "clickable" | "text">("default");
  const [pressed, setPressed] = useState(false);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    // Hide on touch devices
    const isTouchDevice = window.matchMedia("(hover: none)").matches;
    if (isTouchDevice) return;

    setVisible(true);
    document.body.style.cursor = "none";

    const onMove = (e: MouseEvent) => {
      target.current = { x: e.clientX, y: e.clientY };
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${e.clientX - 3}px, ${e.clientY - 3}px)`;
      }

      // Check hover state
      const el = document.elementFromPoint(e.clientX, e.clientY);
      if (el) {
        if (el.closest(CLICKABLE)) {
          setHoverState("clickable");
        } else if (el.closest(TEXT_ELS)) {
          setHoverState("text");
        } else {
          setHoverState("default");
        }
      }
    };

    const onDown = () => setPressed(true);
    const onUp = () => setPressed(false);

    const animate = () => {
      const spring = 0.12;
      ringPos.current.x += (target.current.x - ringPos.current.x) * spring;
      ringPos.current.y += (target.current.y - ringPos.current.y) * spring;

      if (ringRef.current) {
        const size = hoverState === "clickable" ? 56 : hoverState === "text" ? 40 : 32;
        const h = hoverState === "text" ? 2 : size;
        ringRef.current.style.transform = `translate(${ringPos.current.x - size / 2}px, ${ringPos.current.y - h / 2}px)`;
        ringRef.current.style.width = `${size}px`;
        ringRef.current.style.height = `${h}px`;
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);

    // Restore cursor on inputs/textareas
    const style = document.createElement("style");
    style.textContent = `
      input, textarea, select, [contenteditable="true"] { cursor: text !important; }
      a, button, [role="button"], label { cursor: none !important; }
    `;
    document.head.appendChild(style);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      document.body.style.cursor = "";
      style.remove();
    };
  }, [hoverState]);

  if (!visible) return null;

  const ringBorder = hoverState === "clickable"
    ? "1px solid rgba(79,70,229,0.8)"
    : "1px solid rgba(255,255,255,0.35)";
  const ringBg = hoverState === "clickable"
    ? "rgba(79,70,229,0.08)"
    : hoverState === "text"
    ? "rgba(255,255,255,0.06)"
    : "transparent";
  const ringRadius = hoverState === "text" ? "1px" : "50%";
  const dotSize = hoverState === "clickable" ? 3 : pressed ? 10 : 6;
  const ringScale = pressed ? "scale(0.8)" : "";

  return (
    <>
      {/* Dot */}
      <div
        ref={dotRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: dotSize,
          height: dotSize,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.9)",
          pointerEvents: "none",
          zIndex: 9999,
          transition: "width 0.2s, height 0.2s",
          willChange: "transform",
        }}
      />
      {/* Ring */}
      <div
        ref={ringRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 32,
          height: 32,
          borderRadius: ringRadius,
          border: ringBorder,
          background: ringBg,
          backdropFilter: "blur(2px)",
          WebkitBackdropFilter: "blur(2px)",
          pointerEvents: "none",
          zIndex: 9998,
          transition: `width 0.2s cubic-bezier(0.34,1.56,0.64,1), height 0.2s cubic-bezier(0.34,1.56,0.64,1), border 0.2s, background 0.2s, border-radius 0.2s${ringScale ? ", transform 0.1s" : ""}`,
          willChange: "transform",
          ...(ringScale ? { transform: ringScale } : {}),
        }}
      />
    </>
  );
};

export default CuteCursorBuddy;
