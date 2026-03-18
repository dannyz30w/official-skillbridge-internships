import { useLocation } from "react-router-dom";

const AppBackground = () => {
  const { pathname } = useLocation();

  if (pathname === "/") return null;

  return (
    <div className="app-bg-root app-bg-ocean" aria-hidden="true">
      <div className="app-bg-layer app-bg-ocean-base" />
      <div className="app-bg-layer app-bg-ocean-glow" />
      <div className="app-bg-layer app-bg-ocean-waves" />
      <div className="app-bg-layer app-bg-ocean-foam" />
    </div>
  );
};

export default AppBackground;
