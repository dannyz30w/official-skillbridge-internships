import { useLocation } from "react-router-dom";
import { Boxes } from "@/components/ui/background-boxes";

const AppBackground = () => {
  const { pathname } = useLocation();

  if (pathname === "/") return null;

  return (
    <div className="app-bg-root" aria-hidden="true">
      <div
        className="app-bg-layer"
        style={{
          background:
            "linear-gradient(180deg, #030712 0%, #020617 45%, #000000 100%)",
        }}
      />
      <div
        className="app-bg-layer"
        style={{
          background:
            "radial-gradient(circle at 16% 18%, rgba(59,130,246,0.16), transparent 24%), radial-gradient(circle at 82% 16%, rgba(99,102,241,0.12), transparent 22%), radial-gradient(circle at 50% 78%, rgba(14,165,233,0.1), transparent 28%)",
          opacity: 0.85,
        }}
      />
      <div
        className="app-bg-layer"
        style={{
          background:
            "linear-gradient(180deg, rgba(2,6,23,0.12) 0%, rgba(2,6,23,0.38) 40%, rgba(0,0,0,0.62) 100%)",
        }}
      />
    </div>
  );
};

export default AppBackground;
