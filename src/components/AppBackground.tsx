import { useLocation } from "react-router-dom";
import { Boxes } from "@/components/ui/background-boxes";

const AppBackground = () => {
  const { pathname } = useLocation();

  if (pathname === "/") return null;

  return (
    <div className="app-bg-root" aria-hidden="true">
      <div className="app-bg-layer bg-[#020617]" />
      <Boxes className="app-bg-boxes" />
      <div className="app-bg-layer app-bg-boxes-glow" />
      <div className="app-bg-layer app-bg-boxes-vignette" />
    </div>
  );
};

export default AppBackground;
