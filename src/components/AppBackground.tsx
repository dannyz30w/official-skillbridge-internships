import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";

type ThemeKey =
  | "landing"
  | "browse-ocean"
  | "mission-nebula"
  | "how-comet"
  | "resources-map"
  | "contact-orbit"
  | "testimonials-stars"
  | "terms-minimal"
  | "auth-moon"
  | "auth-moon-small"
  | "business-harbor"
  | "notfound";

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

  const isLight = LIGHT_ROUTES.some((route) => pathname.startsWith(route));
  const staticMode = reduceMotion || isMobile;
  const travel = staticMode ? 0 : Math.min(scrollY / 1000, 1);

  const theme = useMemo<ThemeKey>(() => {
    if (pathname.startsWith("/mission")) return "mission-nebula";
    if (pathname.startsWith("/how-it-works")) return "how-comet";
    if (pathname.startsWith("/resources")) return "resources-map";
    if (pathname.startsWith("/contact")) return "contact-orbit";
    if (pathname.startsWith("/testimonials")) return "testimonials-stars";
    if (pathname.startsWith("/terms")) return "terms-minimal";
    if (pathname.startsWith("/signin") || pathname.startsWith("/signup")) return "auth-moon";
    if (pathname.startsWith("/forgot-password") || pathname.startsWith("/reset-password")) return "auth-moon-small";
    if (pathname.startsWith("/browse")) return "browse-ocean";
    if (pathname.startsWith("/for-businesses")) return "business-harbor";
    if (pathname === "*" || pathname.startsWith("/404")) return "notfound";
    return "landing";
  }, [pathname]);

  return (
    <div className="app-bg-root" style={{ ["--scroll-y" as string]: `${scrollY}px` }}>
      <div className={`app-bg-layer ${isLight ? "app-bg-light" : "app-bg-dark"}`} />

      {theme === "browse-ocean" && (
        <>
          <div style={{ position: "absolute", inset: 0, opacity: 0.75, backgroundImage: "radial-gradient(circle at 15% 18%, rgba(255,255,255,0.16) 0 1px, transparent 2px), radial-gradient(circle at 78% 22%, rgba(255,255,255,0.12) 0 1px, transparent 2px), radial-gradient(circle at 56% 35%, rgba(255,255,255,0.1) 0 1px, transparent 2px)" }} />
          <div style={{ position: "absolute", left: "50%", bottom: "-20%", width: 640, height: 640, borderRadius: "50%", transform: `translateX(-50%) scale(${0.85 + travel * 0.25})`, background: "radial-gradient(circle at 38% 28%, rgba(125,211,252,0.2), rgba(14,116,144,0.12) 55%, rgba(14,116,144,0.01) 100%)", boxShadow: "0 0 80px rgba(14,116,144,0.18)" }} />
        </>
      )}

      {theme === "mission-nebula" && (
        <>
          <div className="app-bg-orb" style={{ width: 420, height: 420, top: "8%", left: "8%", opacity: 0.9, background: "rgba(56,189,248,0.08)", transform: `translateY(${travel * 16}px)` }} />
          <div className="app-bg-orb" style={{ width: 460, height: 460, top: "30%", right: "8%", opacity: 0.9, background: "rgba(20,184,166,0.06)", transform: `translateY(${travel * 20}px)` }} />
          <div className="app-bg-orb" style={{ width: 360, height: 360, bottom: "8%", left: "40%", opacity: 0.8, background: "rgba(251,191,36,0.05)", transform: `translateY(${travel * 10}px)` }} />
        </>
      )}

      {theme === "how-comet" && <div style={{ position: "absolute", inset: 0, background: "linear-gradient(128deg, transparent 35%, rgba(224,242,254,0.14) 48%, rgba(56,189,248,0.16) 52%, transparent 65%)" }} />}

      {theme === "resources-map" && (
        <>
          <div style={{ position: "absolute", inset: 0, opacity: 0.85, backgroundImage: "radial-gradient(circle at 22% 26%, rgba(255,255,255,0.16) 0 2px, transparent 3px), radial-gradient(circle at 44% 42%, rgba(255,255,255,0.14) 0 2px, transparent 3px), radial-gradient(circle at 72% 30%, rgba(255,255,255,0.18) 0 2px, transparent 3px), radial-gradient(circle at 64% 64%, rgba(255,255,255,0.12) 0 2px, transparent 3px), radial-gradient(circle at 30% 66%, rgba(255,255,255,0.1) 0 2px, transparent 3px)" }} />
          <svg viewBox="0 0 1200 800" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.2 }} aria-hidden="true">
            <path d="M260 210 L530 320 L820 240" stroke="rgba(255,255,255,0.2)" strokeWidth="1" fill="none" />
            <path d="M530 320 L760 500 L410 540" stroke="rgba(255,255,255,0.2)" strokeWidth="1" fill="none" />
          </svg>
        </>
      )}

      {(theme === "contact-orbit" || theme === "auth-moon" || theme === "auth-moon-small") && (
        <div style={{ position: "absolute", top: "8%", left: "50%", transform: "translateX(-50%)", width: theme === "auth-moon-small" ? 180 : 260, height: theme === "auth-moon-small" ? 180 : 260, borderRadius: "50%", background: "rgba(255,255,255,0.07)", boxShadow: "0 0 40px rgba(255,255,255,0.15)" }}>
          {theme === "contact-orbit" && <div style={{ position: "absolute", top: "45%", left: "-14%", right: "-14%", height: 40, borderRadius: "999px", border: "1px solid rgba(255,255,255,0.2)", transform: "rotate(-18deg)" }} />}
        </div>
      )}

      {theme === "testimonials-stars" && (
        <>
          <div style={{ position: "absolute", inset: 0, opacity: 0.2, transform: `translateY(${travel * 8}px)`, backgroundImage: "radial-gradient(circle at 20% 18%, rgba(255,255,255,0.8) 0 1px, transparent 2px), radial-gradient(circle at 65% 24%, rgba(255,255,255,0.75) 0 1px, transparent 2px), radial-gradient(circle at 80% 68%, rgba(255,255,255,0.6) 0 1px, transparent 2px)" }} />
          <div style={{ position: "absolute", inset: 0, opacity: 0.4, transform: `translateY(${travel * 12}px)`, backgroundImage: "radial-gradient(circle at 10% 42%, rgba(255,255,255,0.7) 0 1px, transparent 2px), radial-gradient(circle at 44% 14%, rgba(255,255,255,0.6) 0 1px, transparent 2px), radial-gradient(circle at 72% 48%, rgba(255,255,255,0.62) 0 1px, transparent 2px)" }} />
        </>
      )}

      {theme === "terms-minimal" && <div style={{ position: "absolute", inset: 0, opacity: 0.07, backgroundImage: "radial-gradient(circle at 25% 20%, rgba(255,255,255,0.9) 0 1px, transparent 2px), radial-gradient(circle at 60% 34%, rgba(255,255,255,0.8) 0 1px, transparent 2px)" }} />}

      {theme === "business-harbor" && (
        <>
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(56,189,248,0.08) 0%, transparent 45%)" }} />
          <svg viewBox="0 0 1200 500" style={{ position: "absolute", bottom: "8%", left: 0, width: "100%", opacity: 0.18 }} aria-hidden="true">
            <path d="M0 300 C200 250 320 340 500 300 C680 260 840 340 1200 290" stroke="rgba(125,211,252,0.5)" strokeWidth="2" fill="none" />
            <path d="M130 315 L250 250 L370 315" stroke="rgba(224,242,254,0.4)" strokeWidth="2" fill="none" />
            <path d="M760 315 L880 250 L1000 315" stroke="rgba(224,242,254,0.4)" strokeWidth="2" fill="none" />
          </svg>
        </>
      )}

      {isLight && <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 70% 30% at 50% 0%, rgba(59,130,246,0.05) 0%, transparent 60%)" }} />}
      <div className="app-bg-orb" style={{ width: 320, height: 320, top: "10%", left: "8%", background: isLight ? "rgba(56,189,248,0.02)" : "rgba(56,189,248,0.04)" }} />
      <div className="app-bg-orb" style={{ width: 360, height: 360, top: "36%", right: "10%", background: isLight ? "rgba(20,184,166,0.02)" : "rgba(20,184,166,0.03)" }} />
      <div className="app-bg-orb" style={{ width: 280, height: 280, bottom: "6%", left: "42%", background: isLight ? "rgba(251,191,36,0.02)" : "rgba(251,191,36,0.03)" }} />
    </div>
  );
};

export default AppBackground;
