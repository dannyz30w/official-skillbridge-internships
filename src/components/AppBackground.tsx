import { useLocation } from "react-router-dom";
import { Component as EtheralShadow } from "@/components/ui/etheral-shadow";

const AppBackground = () => {
  const { pathname } = useLocation();

  if (pathname === "/") return null;

  return (
    <div className="app-bg-root" aria-hidden="true">
      <EtheralShadow
        className="app-bg-layer"
        color="rgba(8, 15, 31, 0.96)"
        animation={{ scale: 56, speed: 54 }}
        noise={{ opacity: 0.18, scale: 0.9 }}
        sizing="fill"
        showTitle={false}
        style={{ transform: 'scale(1.04)' }}
      />
      <div
        className="app-bg-layer"
        style={{
          background:
            "linear-gradient(180deg, rgba(2,6,23,0.08) 0%, rgba(2,6,23,0.34) 46%, rgba(0,0,0,0.58) 100%)",
        }}
      />
    </div>
  );
};

export default AppBackground;
