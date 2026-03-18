import { useEffect, useState } from "react";

const InvertedCursor = () => {
  const [visible, setVisible] = useState(false);
  const [isTouch, setIsTouch] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const coarsePointer = window.matchMedia("(pointer: coarse)");
    const updatePointerType = () => setIsTouch(coarsePointer.matches);
    updatePointerType();

    const onMove = (event: MouseEvent) => {
      setVisible(true);
      setPosition({ x: event.clientX, y: event.clientY });
    };

    const onLeave = () => setVisible(false);

    coarsePointer.addEventListener("change", updatePointerType);
    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseout", onLeave);

    return () => {
      coarsePointer.removeEventListener("change", updatePointerType);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseout", onLeave);
    };
  }, []);

  if (isTouch) return null;

  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        left: 0,
        top: 0,
        width: 18,
        height: 18,
        borderRadius: "9999px",
        background: "#ffffff",
        mixBlendMode: "difference",
        pointerEvents: "none",
        zIndex: 9999,
        opacity: visible ? 1 : 0,
        transform: `translate(${position.x - 9}px, ${position.y - 9}px)`,
        transition: "opacity 0.2s ease, transform 0.08s linear",
      }}
    />
  );
};

export default InvertedCursor;
