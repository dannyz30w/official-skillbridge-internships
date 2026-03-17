import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const LIGHT_ROUTES = ["/intern", "/business", "/admin"];

const AppBackground = () => {
  const { pathname } = useLocation();
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY || 0);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isLight = LIGHT_ROUTES.some((p) => pathname.startsWith(p));

  return (
    <div className="app-bg-root" style={{ ["--scroll-y" as string]: `${scrollY}px` }}>
      <div className={`app-bg-layer ${isLight ? "app-bg-light" : "app-bg-dark"}`} />
      <div className="app-bg-orb" style={{ width: 320, height: 320, top: "10%", left: "8%", background: isLight ? "rgba(79,70,229,0.025)" : "rgba(79,70,229,0.04)" }} />
      <div className="app-bg-orb" style={{ width: 360, height: 360, top: "36%", right: "10%", background: isLight ? "rgba(16,185,129,0.02)" : "rgba(16,185,129,0.03)" }} />
      <div className="app-bg-orb" style={{ width: 280, height: 280, bottom: "6%", left: "42%", background: isLight ? "rgba(245,158,11,0.02)" : "rgba(245,158,11,0.03)" }} />
    </div>
  );
};

export default AppBackground;
