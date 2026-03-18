import { useLocation } from "react-router-dom";

const AppBackground = () => {
  const { pathname } = useLocation();

  if (pathname === "/") return null;

  return (
    <div className="app-bg-root" aria-hidden="true">
      <div
        className="app-bg-layer"
        style={{
          background:
            "linear-gradient(180deg, #020617 0%, #030712 48%, #000000 100%)",
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
