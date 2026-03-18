import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type BoxesProps = React.HTMLAttributes<HTMLDivElement> & {
  className?: string;
  rows?: number;
  cols?: number;
};

export const BoxesCore = ({ className, rows = 72, cols = 42, ...rest }: BoxesProps) => {
  const rowItems = React.useMemo(() => new Array(rows).fill(1), [rows]);
  const colItems = React.useMemo(() => new Array(cols).fill(1), [cols]);

  const colors = [
    "rgb(125 211 252)",
    "rgb(249 168 212)",
    "rgb(134 239 172)",
    "rgb(253 224 71)",
    "rgb(252 165 165)",
    "rgb(216 180 254)",
    "rgb(147 197 253)",
    "rgb(165 180 252)",
    "rgb(196 181 253)",
  ];

  const getRandomColor = () => colors[Math.floor(Math.random() * colors.length)];

  return (
    <div
      style={{
        transform:
          "translate(-40%,-60%) skewX(-48deg) skewY(14deg) scale(0.675) rotate(0deg) translateZ(0)",
      }}
      className={cn(
        "absolute left-1/4 p-4 -top-1/4 flex -translate-x-1/2 -translate-y-1/2 h-full w-full z-0 opacity-70",
        className,
      )}
      {...rest}
    >
      {rowItems.map((_, i) => (
        <motion.div key={`row${i}`} className="relative h-8 w-16 border-l border-slate-700/70">
          {colItems.map((__, j) => (
            <motion.div
              key={`col${i}-${j}`}
              whileHover={{
                backgroundColor: getRandomColor(),
                transition: { duration: 0 },
              }}
              animate={{ transition: { duration: 2 } }}
              className="relative h-8 w-16 border-r border-t border-slate-700/70"
            >
              {j % 2 === 0 && i % 2 === 0 ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="pointer-events-none absolute -left-[22px] -top-[14px] h-6 w-10 stroke-[1px] text-slate-700/70"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
                </svg>
              ) : null}
            </motion.div>
          ))}
        </motion.div>
      ))}
    </div>
  );
};

export const Boxes = React.memo(BoxesCore);
