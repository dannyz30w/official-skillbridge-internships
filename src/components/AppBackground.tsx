import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";

type ThemeKey =
  | "landing"
  | "browse"
  | "mission"
  | "how-it-works"
  | "resources"
  | "contact"
  | "testimonials"
  | "terms"
  | "auth"
  | "auth-minimal"
  | "for-businesses"
  | "dashboard-intern"
  | "dashboard-business"
  | "dashboard-admin"
  | "default";

const LIGHT_ROUTES = ["/intern", "/business", "/admin"];

// SVG dot grid for terms
const DOT_GRID_SVG = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32'%3E%3Ccircle cx='16' cy='16' r='0.6' fill='rgba(255,255,255,0.04)'/%3E%3C/svg%3E")`;

// SVG nautical grid for resources
const NAUTICAL_GRID_SVG = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 64 64'%3E%3Cpath d='M64 0H0V64' fill='none' stroke='rgba(255,255,255,0.025)' stroke-width='0.5'/%3E%3C/svg%3E")`;

const AppBackground = () => {
  const { pathname } = useLocation();
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(media.matches);
    const handler = () => setReduceMotion(media.matches);
    media.addEventListener("change", handler);
    return () => media.removeEventListener("change", handler);
  }, []);

  const isLight = LIGHT_ROUTES.some((r) => pathname.startsWith(r));

  const theme = useMemo<ThemeKey>(() => {
    if (pathname === "/") return "landing";
    if (pathname.startsWith("/browse")) return "browse";
    if (pathname.startsWith("/mission")) return "mission";
    if (pathname.startsWith("/how-it-works")) return "how-it-works";
    if (pathname.startsWith("/resources")) return "resources";
    if (pathname.startsWith("/contact")) return "contact";
    if (pathname.startsWith("/testimonials")) return "testimonials";
    if (pathname.startsWith("/terms")) return "terms";
    if (pathname.startsWith("/signin") || pathname.startsWith("/signup")) return "auth";
    if (pathname.startsWith("/forgot-password") || pathname.startsWith("/reset-password")) return "auth-minimal";
    if (pathname.startsWith("/for-businesses")) return "for-businesses";
    if (pathname.startsWith("/intern")) return "dashboard-intern";
    if (pathname.startsWith("/business")) return "dashboard-business";
    if (pathname.startsWith("/admin")) return "dashboard-admin";
    return "default";
  }, [pathname]);

  // Landing page has its own bg in Index.tsx
  if (theme === "landing") return null;

  const base = isLight ? "#f2f2f7" : "#0a0a0f";

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", overflow: "hidden", backgroundColor: base }}>

      {/* Browse: Ocean floor depth bands + plankton dots */}
      {theme === "browse" && (
        <>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "33%", background: "rgba(14,116,144,0.04)" }} />
          <div style={{ position: "absolute", top: "33%", left: 0, right: 0, height: "34%", background: "rgba(8,47,73,0.03)" }} />
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "33%", background: "rgba(3,10,18,0.05)" }} />
          {/* Static plankton dots */}
          <div style={{ position: "absolute", inset: 0, opacity: 1, backgroundImage: "radial-gradient(circle at 12% 18%, rgba(255,255,255,0.06) 0 1px, transparent 2px), radial-gradient(circle at 34% 42%, rgba(255,255,255,0.05) 0 1px, transparent 2px), radial-gradient(circle at 56% 28%, rgba(255,255,255,0.07) 0 1px, transparent 2px), radial-gradient(circle at 78% 62%, rgba(255,255,255,0.04) 0 1px, transparent 2px), radial-gradient(circle at 22% 74%, rgba(255,255,255,0.06) 0 1px, transparent 2px), radial-gradient(circle at 45% 88%, rgba(255,255,255,0.05) 0 1px, transparent 2px), radial-gradient(circle at 88% 34%, rgba(255,255,255,0.08) 0 1px, transparent 2px), radial-gradient(circle at 65% 52%, rgba(255,255,255,0.04) 0 1px, transparent 2px), radial-gradient(circle at 8% 55%, rgba(255,255,255,0.05) 0 1.5px, transparent 2px), radial-gradient(circle at 92% 78%, rgba(255,255,255,0.06) 0 1px, transparent 2px)" }} />
        </>
      )}

      {/* Mission: Horizon line at golden hour */}
      {theme === "mission" && (
        <>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "60%", background: "#0d1117" }} />
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "40%", background: "#080c12" }} />
          <div style={{ position: "absolute", top: "60%", left: "10%", right: "10%", height: 1, background: "rgba(245,158,11,0.08)" }} />
          <div style={{ position: "absolute", top: "48%", left: "50%", transform: "translateX(-50%)", width: 400, height: 400, borderRadius: "50%", background: "rgba(245,158,11,0.04)" }} />
        </>
      )}

      {/* How It Works: Looking up through water */}
      {theme === "how-it-works" && (
        <>
          <div style={{ position: "absolute", top: "-10%", left: "50%", transform: "translateX(-50%)", width: 600, height: 600, borderRadius: "50%", background: "rgba(79,70,229,0.06)" }} />
          {[280, 400, 560].map((size, i) => (
            <div key={i} style={{ position: "absolute", top: "15%", left: "50%", transform: "translateX(-50%)", width: size, height: size, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.03)" }} />
          ))}
        </>
      )}

      {/* Resources: Nautical chart grid */}
      {theme === "resources" && (
        <>
          <div style={{ position: "absolute", inset: 0, backgroundImage: NAUTICAL_GRID_SVG }} />
          {[
            { top: "20%", left: "25%", size: 200 },
            { top: "55%", left: "65%", size: 160 },
            { top: "75%", left: "15%", size: 120 },
          ].map((c, i) => (
            <div key={i} style={{ position: "absolute", top: c.top, left: c.left, width: c.size, height: c.size, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.02)" }} />
          ))}
        </>
      )}

      {/* Contact: Lighthouse beam */}
      {theme === "contact" && (
        <>
          <div style={{ position: "absolute", top: "5%", right: "8%", width: 60, height: 60, borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} />
          <div style={{ position: "absolute", top: "8%", right: "10%", width: 300, height: 600, transform: "rotate(25deg)", background: "rgba(255,255,255,0.03)", clipPath: "polygon(45% 0%, 55% 0%, 100% 100%, 0% 100%)" }} />
        </>
      )}

      {/* Testimonials: Moonlit water */}
      {theme === "testimonials" && (
        <>
          <div style={{ position: "absolute", top: "8%", left: "50%", transform: "translateX(-50%)", width: 200, height: 200, borderRadius: "50%", background: "rgba(255,255,255,0.04)" }} />
          <div style={{ position: "absolute", top: "20%", left: "50%", transform: "translateX(-50%)", width: 2, height: "60%", background: "rgba(255,255,255,0.06)", filter: "blur(8px)" }} />
        </>
      )}

      {/* Terms: Minimal dot grid */}
      {theme === "terms" && (
        <div style={{ position: "absolute", inset: 0, backgroundImage: DOT_GRID_SVG }} />
      )}

      {/* Auth: Dock at night */}
      {(theme === "auth" || theme === "auth-minimal") && (
        <>
          <div style={{ position: "absolute", top: "50%", left: "10%", right: "10%", height: 1, background: "rgba(255,255,255,0.04)" }} />
          {theme === "auth" && (
            <>
              <div style={{ position: "absolute", top: "50%", left: "38%", width: 1, height: "40%", background: "rgba(255,255,255,0.03)" }} />
              <div style={{ position: "absolute", top: "50%", left: "62%", width: 1, height: "40%", background: "rgba(255,255,255,0.03)" }} />
            </>
          )}
        </>
      )}

      {/* For Businesses */}
      {theme === "for-businesses" && (
        <>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "40%", background: "rgba(14,116,144,0.03)" }} />
        </>
      )}

      {/* Dashboard light mode backgrounds */}
      {theme === "dashboard-intern" && (
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 300, background: "radial-gradient(ellipse 70% 100% at 50% 0%, rgba(79,70,229,0.05), transparent)" }} />
      )}
      {theme === "dashboard-business" && (
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 300, background: "radial-gradient(ellipse 70% 100% at 50% 0%, rgba(16,185,129,0.04), transparent)" }} />
      )}
      {theme === "dashboard-admin" && (
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 300, background: "radial-gradient(ellipse 70% 100% at 50% 0%, rgba(16,185,129,0.04), transparent)" }} />
      )}

      {/* Default sea */}
      {theme === "default" && (
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "35%", background: "rgba(14,116,144,0.04)" }} />
      )}
    </div>
  );
};

export default AppBackground;
