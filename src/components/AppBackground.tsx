import { useEffect, useMemo, useState } from "react";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const LIGHT_ROUTES = ["/intern", "/business", "/admin"];

const AppBackground = () => {
  const { pathname } = useLocation();
  const [scrollY, setScrollY] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const check = () => {
      setReduceMotion(media.matches);
      setIsMobile(window.innerWidth < 768);
    };
    check();
    media.addEventListener("change", check);
    window.addEventListener("resize", check);
    return () => {
      media.removeEventListener("change", check);
      window.removeEventListener("resize", check);
    };
  }, []);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY || 0);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isLight = LIGHT_ROUTES.some((p) => pathname.startsWith(p));
  const staticMode = reduceMotion || isMobile;
  const travel = staticMode ? 0 : Math.min(scrollY / 1000, 1);

  const theme = useMemo(() => {
    if (pathname.startsWith("/mission")) return "mission";
    if (pathname.startsWith("/how-it-works")) return "comet";
    if (pathname.startsWith("/resources")) return "constellation";
    if (pathname.startsWith("/contact")) return "saturn";
    if (pathname.startsWith("/testimonials")) return "stars";
    if (pathname.startsWith("/terms")) return "terms";
    if (pathname.startsWith("/signin") || pathname.startsWith("/signup")) return "moon";
    if (pathname.startsWith("/forgot-password") || pathname.startsWith("/reset-password")) return "moon-small";
    if (pathname.startsWith("/browse")) return "planet";
    if (pathname.startsWith("/intern")) return "intern-light";
    if (pathname.startsWith("/business") || pathname.startsWith("/admin")) return "business-light";
    return "landing";
  }, [pathname]);

  return (
    <div className="app-bg-root" style={{ ["--scroll-y" as string]: `${scrollY}px` }}>
      <div className={`app-bg-layer ${isLight ? "app-bg-light" : "app-bg-dark"}`} />
      {theme === "planet" && <div style={{ position: "absolute", left: "50%", bottom: "-18%", width: 560, height: 560, borderRadius: "50%", transform: `translateX(-50%) scale(${0.8 + travel * 0.3})`, background: "radial-gradient(circle at 35% 30%, rgba(129,140,248,0.22), rgba(79,70,229,0.08) 55%, rgba(79,70,229,0.02) 100%)", boxShadow: "0 0 60px rgba(79,70,229,0.2)" }} />}
      {theme === "mission" && <>
        <div className="app-bg-orb" style={{ width: 420, height: 420, top: "8%", left: "10%", opacity: 0.9, background: "rgba(79,70,229,0.08)", transform: `translateY(${travel * 16}px)` }} />
        <div className="app-bg-orb" style={{ width: 460, height: 460, top: "28%", right: "8%", opacity: 0.9, background: "rgba(16,185,129,0.06)", transform: `translateY(${travel * 20}px)` }} />
        <div className="app-bg-orb" style={{ width: 360, height: 360, bottom: "10%", left: "40%", opacity: 0.8, background: "rgba(245,158,11,0.05)", transform: `translateY(${travel * 12}px)` }} />
      </>}
      {theme === "comet" && <div style={{ position: "absolute", inset: 0, background: "linear-gradient(130deg, transparent 35%, rgba(255,255,255,0.12) 48%, rgba(99,102,241,0.16) 52%, transparent 65%)" }} />}
      {theme === "constellation" && <div style={{ position: "absolute", inset: 0, opacity: 0.8, backgroundImage: "radial-gradient(circle at 20% 25%, rgba(255,255,255,0.18) 0 2px, transparent 3px), radial-gradient(circle at 42% 40%, rgba(255,255,255,0.16) 0 2px, transparent 3px), radial-gradient(circle at 70% 28%, rgba(255,255,255,0.2) 0 2px, transparent 3px), radial-gradient(circle at 62% 60%, rgba(255,255,255,0.14) 0 2px, transparent 3px)" }} />}
      {(theme === "saturn" || theme === "moon" || theme === "moon-small") && (
        <div style={{ position: "absolute", top: "9%", left: "50%", transform: "translateX(-50%)", width: theme === "moon-small" ? 180 : 260, height: theme === "moon-small" ? 180 : 260, borderRadius: "50%", background: "rgba(255,255,255,0.07)", boxShadow: "0 0 40px rgba(255,255,255,0.15)" }}>
          {theme === "saturn" && <div style={{ position: "absolute", top: "46%", left: "-14%", right: "-14%", height: 40, borderRadius: "999px", border: "1px solid rgba(255,255,255,0.2)", transform: "rotate(-18deg)" }} />}
        </div>
      )}
      {theme === "intern-light" && <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 60% 30% at 50% 0%, rgba(79,70,229,0.06) 0%, transparent 60%)" }} />}
      {theme === "business-light" && <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 60% 30% at 50% 0%, rgba(16,185,129,0.04) 0%, transparent 60%)" }} />}
      <div className="app-bg-orb" style={{ width: 320, height: 320, top: "10%", left: "8%", background: isLight ? "rgba(79,70,229,0.025)" : "rgba(79,70,229,0.04)" }} />
      <div className="app-bg-orb" style={{ width: 360, height: 360, top: "36%", right: "10%", background: isLight ? "rgba(16,185,129,0.02)" : "rgba(16,185,129,0.03)" }} />
      <div className="app-bg-orb" style={{ width: 280, height: 280, bottom: "6%", left: "42%", background: isLight ? "rgba(245,158,11,0.02)" : "rgba(245,158,11,0.03)" }} />
    </div>
  );
};

export default AppBackground;
