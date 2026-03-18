import { useEffect, useLocation, useState } from "react";
import { Component as EtheralShadow } from "@/components/ui/etheral-shadow";

const AppBackground = () => {
  const { pathname } = useLocation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (pathname === "/") return null;

  return (
    <div className="app-bg-root" aria-hidden="true">
      <div
        className="app-bg-layer"
        style={{
          background: "linear-gradient(180deg, #020617 0%, #030712 48%, #000000 100%)",
        }}
      />
      <div
        className="app-bg-layer"
        style={{
          background:
            "radial-gradient(circle at 18% 18%, rgba(56,189,248,0.18), transparent 24%), radial-gradient(circle at 82% 16%, rgba(99,102,241,0.16), transparent 22%), radial-gradient(circle at 50% 78%, rgba(14,165,233,0.14), transparent 28%)",
          opacity: 0.9,
        }}
      />
      {mounted ? (
        <EtheralShadow
          className="app-bg-layer"
          color="rgba(15, 23, 42, 0.88)"
          animation={{ scale: 14, speed: 18 }}
          noise={{ opacity: 0.04, scale: 0.65 }}
          sizing="fill"
          showTitle={false}
          style={{ opacity: 0.22, transform: 'scale(1.01)' }}
        />
      ) : null}
      <div
        className="app-bg-layer"
        style={{
          background:
            "linear-gradient(180deg, rgba(2,6,23,0.08) 0%, rgba(2,6,23,0.24) 42%, rgba(0,0,0,0.54) 100%)",
        }}
      />
    </div>
  );
};

export default AppBackground;
