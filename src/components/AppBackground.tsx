import { useLocation } from "react-router-dom";

const AppBackground = () => {
  const { pathname } = useLocation();

  // Keep landing page visuals untouched (video hero owns the background there).
  if (pathname === "/") return null;

  return (
    <div className="app-bg-root" aria-hidden="true">
      <div
        className="app-bg-layer"
        style={{
          background: "#000000",
        }}
      />
      <div
        className="app-bg-layer"
        style={{
          opacity: 0.4,
          backgroundImage:
            "radial-gradient(circle at 20% 18%, rgba(255,255,255,0.08) 0 1px, transparent 2px), radial-gradient(circle at 68% 30%, rgba(255,255,255,0.06) 0 1px, transparent 2px), radial-gradient(circle at 45% 72%, rgba(255,255,255,0.05) 0 1px, transparent 2px)",
        }}
      />
      <div
        className="app-bg-layer"
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.55) 55%, rgba(0,0,0,0.7) 100%)",
        }}
      />
    </div>
  );
};

export default AppBackground;
