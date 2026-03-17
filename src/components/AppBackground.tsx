import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";

type ThemeKey =
  | "landing"
  | "browse-tide"
  | "mission-trench"
  | "how-currents"
  | "resources-chart"
  | "contact-lighthouse"
  | "testimonials-bioluminescence"
  | "terms-calm"
  | "auth-moon-harbor"
  | "auth-moon-harbor-distant"
  | "business-openwater"
  | "default-sea";

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
  const travel = staticMode ? 0 : Math.min(scrollY / 1200, 1);

  const theme = useMemo<ThemeKey>(() => {
    if (pathname === "/") return "landing";
    if (pathname.startsWith("/browse")) return "browse-tide";
    if (pathname.startsWith("/mission")) return "mission-trench";
    if (pathname.startsWith("/how-it-works")) return "how-currents";
    if (pathname.startsWith("/resources")) return "resources-chart";
    if (pathname.startsWith("/contact")) return "contact-lighthouse";
    if (pathname.startsWith("/testimonials")) return "testimonials-bioluminescence";
    if (pathname.startsWith("/terms")) return "terms-calm";
    if (pathname.startsWith("/signin") || pathname.startsWith("/signup")) return "auth-moon-harbor";
    if (pathname.startsWith("/forgot-password") || pathname.startsWith("/reset-password")) return "auth-moon-harbor-distant";
    if (pathname.startsWith("/for-businesses")) return "business-openwater";
    return "default-sea";
  }, [pathname]);

  return (
    <div className="app-bg-root" style={{ ["--scroll-y" as string]: `${scrollY}px` }}>
      <div className={`app-bg-layer ${isLight ? "app-bg-light" : "app-bg-dark"}`} />

      {theme === "browse-tide" && (
        <>
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(8,47,73,0.34) 0%, rgba(6,26,40,0) 42%, rgba(3,10,18,0.44) 100%)" }} />
          <div style={{ position: "absolute", left: "50%", bottom: "-22%", width: 640, height: 640, borderRadius: "50%", transform: `translateX(-50%) scale(${0.86 + travel * 0.2})`, background: "radial-gradient(circle at 38% 30%, rgba(125,211,252,0.22), rgba(14,116,144,0.11) 58%, rgba(14,116,144,0) 100%)", boxShadow: "0 0 90px rgba(14,116,144,0.2)" }} />
        </>
      )}

      {theme === "mission-trench" && (
        <>
          <div className="app-bg-orb" style={{ width: 460, height: 460, top: "6%", left: "7%", background: "rgba(34,211,238,0.08)", transform: `translateY(${travel * 20}px)` }} />
          <div className="app-bg-orb" style={{ width: 520, height: 520, top: "25%", right: "8%", background: "rgba(45,212,191,0.08)", transform: `translateY(${travel * 24}px)` }} />
          <div className="app-bg-orb" style={{ width: 390, height: 390, bottom: "8%", left: "38%", background: "rgba(56,189,248,0.06)", transform: `translateY(${travel * 14}px)` }} />
        </>
      )}

      {theme === "how-currents" && (
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(130deg, transparent 30%, rgba(186,230,253,0.16) 46%, rgba(34,211,238,0.16) 51%, rgba(14,116,144,0.08) 58%, transparent 70%)" }} />
      )}

      {theme === "resources-chart" && (
        <>
          <div style={{ position: "absolute", inset: 0, opacity: 0.85, backgroundImage: "radial-gradient(circle at 19% 28%, rgba(224,242,254,0.2) 0 2px, transparent 3px), radial-gradient(circle at 36% 47%, rgba(224,242,254,0.18) 0 2px, transparent 3px), radial-gradient(circle at 64% 34%, rgba(224,242,254,0.2) 0 2px, transparent 3px), radial-gradient(circle at 76% 52%, rgba(224,242,254,0.16) 0 2px, transparent 3px), radial-gradient(circle at 52% 70%, rgba(224,242,254,0.14) 0 2px, transparent 3px)" }} />
          <svg viewBox="0 0 1200 800" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.24 }} aria-hidden="true">
            <path d="M240 230 L430 380 L700 300 L860 470" stroke="rgba(186,230,253,0.4)" strokeWidth="1" fill="none" />
            <path d="M430 380 L500 590 L760 520" stroke="rgba(186,230,253,0.3)" strokeWidth="1" fill="none" />
          </svg>
        </>
      )}

      {(theme === "contact-lighthouse" || theme === "auth-moon-harbor" || theme === "auth-moon-harbor-distant") && (
        <div style={{ position: "absolute", top: "8%", left: "50%", transform: "translateX(-50%)", width: theme === "auth-moon-harbor-distant" ? 170 : 250, height: theme === "auth-moon-harbor-distant" ? 170 : 250, borderRadius: "50%", background: "rgba(226,232,240,0.08)", boxShadow: "0 0 48px rgba(224,242,254,0.18)" }}>
          {theme === "contact-lighthouse" && <div style={{ position: "absolute", top: "44%", left: "-18%", right: "-18%", height: 42, borderRadius: "999px", border: "1px solid rgba(224,242,254,0.25)", transform: "rotate(-16deg)" }} />}
        </div>
      )}

      {theme === "testimonials-bioluminescence" && (
        <>
          <div style={{ position: "absolute", inset: 0, opacity: 0.24, transform: `translateY(${travel * 8}px)`, backgroundImage: "radial-gradient(circle at 16% 20%, rgba(224,242,254,0.9) 0 1px, transparent 2px), radial-gradient(circle at 66% 24%, rgba(186,230,253,0.8) 0 1px, transparent 2px), radial-gradient(circle at 76% 66%, rgba(34,211,238,0.75) 0 1px, transparent 2px)" }} />
          <div style={{ position: "absolute", inset: 0, opacity: 0.42, transform: `translateY(${travel * 14}px)`, backgroundImage: "radial-gradient(circle at 12% 45%, rgba(186,230,253,0.8) 0 1px, transparent 2px), radial-gradient(circle at 44% 15%, rgba(224,242,254,0.72) 0 1px, transparent 2px), radial-gradient(circle at 72% 50%, rgba(45,212,191,0.7) 0 1px, transparent 2px)" }} />
        </>
      )}

      {theme === "terms-calm" && (
        <div style={{ position: "absolute", inset: 0, opacity: 0.08, backgroundImage: "radial-gradient(circle at 24% 20%, rgba(226,232,240,0.92) 0 1px, transparent 2px), radial-gradient(circle at 58% 30%, rgba(226,232,240,0.82) 0 1px, transparent 2px)" }} />
      )}

      {theme === "business-openwater" && (
        <>
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(34,211,238,0.08) 0%, rgba(6,26,40,0) 45%)" }} />
          <svg viewBox="0 0 1200 500" style={{ position: "absolute", bottom: "7%", left: 0, width: "100%", opacity: 0.2 }} aria-hidden="true">
            <path d="M0 305 C180 258 330 350 520 300 C720 248 870 348 1200 292" stroke="rgba(186,230,253,0.55)" strokeWidth="2" fill="none" />
            <path d="M145 316 L255 255 L365 316" stroke="rgba(224,242,254,0.4)" strokeWidth="2" fill="none" />
            <path d="M760 318 L875 255 L990 318" stroke="rgba(224,242,254,0.4)" strokeWidth="2" fill="none" />
          </svg>
        </>
      )}

      {theme === "default-sea" && (
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(14,116,144,0.1) 0%, rgba(6,26,40,0) 38%)" }} />
      )}

      {isLight && <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 70% 30% at 50% 0%, rgba(14,165,233,0.06) 0%, transparent 60%)" }} />}
      {!isLight && theme !== "landing" && <div style={{ position: "absolute", inset: 0, background: "rgba(2,6,23,0.22)" }} />}

      {theme !== "landing" && (
        <>
          <div className="app-bg-orb" style={{ width: 320, height: 320, top: "10%", left: "8%", background: isLight ? "rgba(56,189,248,0.02)" : "rgba(56,189,248,0.04)" }} />
          <div className="app-bg-orb" style={{ width: 360, height: 360, top: "36%", right: "10%", background: isLight ? "rgba(45,212,191,0.02)" : "rgba(45,212,191,0.03)" }} />
          <div className="app-bg-orb" style={{ width: 280, height: 280, bottom: "6%", left: "42%", background: isLight ? "rgba(186,230,253,0.02)" : "rgba(186,230,253,0.03)" }} />
        </>
      )}
    </div>
  );
};

export default AppBackground;
