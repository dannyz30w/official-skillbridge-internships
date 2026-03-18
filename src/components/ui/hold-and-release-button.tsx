"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ButtonHoldAndReleaseProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  holdDuration?: number;
  onComplete?: () => void;
}

export function ButtonHoldAndRelease({ holdDuration = 3000, onComplete, className, children = "Delete My Account", ...props }: ButtonHoldAndReleaseProps) {
  const [isHolding, setIsHolding] = useState(false);
  const [progress, setProgress] = useState(0);

  const start = () => {
    if (props.disabled) return;
    setIsHolding(true);
    const startTime = Date.now();
    const tick = () => {
      const elapsed = Date.now() - startTime;
      const next = Math.min(100, (elapsed / holdDuration) * 100);
      setProgress(next);
      if (next >= 100) {
        setIsHolding(false);
        onComplete?.();
        setProgress(0);
        return;
      }
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  const cancel = () => {
    setIsHolding(false);
    setProgress(0);
  };

  return (
    <button
      {...props}
      onMouseDown={start}
      onMouseUp={cancel}
      onMouseLeave={cancel}
      onTouchStart={start}
      onTouchEnd={cancel}
      className={cn("relative overflow-hidden btn-glass-destructive h-12 px-6 text-body font-semibold", className)}
    >
      <motion.span className="absolute inset-0 bg-red-500/40" style={{ scaleX: progress / 100, transformOrigin: "left" }} />
      <span className="relative z-10">{isHolding ? `Hold... ${Math.ceil((100 - progress) / 33)}s` : children}</span>
    </button>
  );
}
