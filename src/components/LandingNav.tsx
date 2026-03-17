import { Link, useLocation } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { trackEvent } from "@/lib/analytics";
import skillbridgeLogo from "@/assets/skillbridge-logo.png";

const NAV_LINKS = [
  { label: "How It Works", to: "/how-it-works" },
  { label: "Resources", to: "/resources" },
  { label: "Mission", to: "/mission" },
];

const LandingNav = () => {
  const { user, accountType } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  return (
    <nav className="relative z-10 flex items-center justify-between px-6 md:px-8 py-6 max-w-7xl mx-auto" aria-label="Main navigation">
      <Link to="/" className="flex items-center gap-2.5">
        <img src={skillbridgeLogo} alt="SkillBridge logo" className="h-8 w-auto" width={128} height={32} />
        <span className="text-xl italic text-white" style={{ fontFamily: "var(--font-display)" }}>SkillBridge</span>
      </Link>

      {/* Desktop nav */}
      <div className="hidden md:flex items-center gap-8">
        {NAV_LINKS.map(l => (
          <Link key={l.to} to={l.to} className="text-sm text-white/60 hover:text-white transition-colors" style={{ fontFamily: "var(--font-body)" }}>
            {l.label}
          </Link>
        ))}
      </div>

      <div className="hidden md:flex items-center gap-4">
        {user && accountType ? (
          <Link to={`/${accountType}`} className="liquid-glass-strong rounded-full px-6 py-2.5 text-sm text-white font-medium hover:scale-[1.03] transition-transform" style={{ fontFamily: "var(--font-body)" }}>
            Dashboard
          </Link>
        ) : (
          <>
            <Link to="/signin" className="text-sm text-white/70 hover:text-white transition-colors" style={{ fontFamily: "var(--font-body)" }}>Sign In</Link>
            <Link to="/signup" className="liquid-glass-strong rounded-full px-6 py-2.5 text-sm text-white font-medium hover:scale-[1.03] transition-transform" style={{ fontFamily: "var(--font-body)" }}>
              Get Started
            </Link>
          </>
        )}
      </div>

      {/* Mobile hamburger */}
      <button className="md:hidden text-white h-11 w-11 flex items-center justify-center" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu">
        {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Mobile panel */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden fixed top-0 right-0 h-full z-50 px-6 py-6 space-y-4"
            style={{ width: "85%", background: "rgba(10,10,15,0.95)", backdropFilter: "blur(32px)" }}
          >
            <div className="flex justify-end mb-4">
              <button onClick={() => setMobileOpen(false)} className="h-11 w-11 flex items-center justify-center text-white" aria-label="Close menu"><X className="h-5 w-5" /></button>
            </div>
            {NAV_LINKS.map(l => (
              <Link key={l.to} to={l.to} className="block text-lg text-white/80 py-3" style={{ fontFamily: "var(--font-body)" }}>{l.label}</Link>
            ))}
            <div className="pt-4 space-y-3" style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}>
              {user && accountType ? (
                <Link to={`/${accountType}`} className="block w-full text-center py-3 rounded-full text-white liquid-glass-strong" style={{ fontFamily: "var(--font-body)" }}>Dashboard</Link>
              ) : (
                <>
                  <Link to="/signin" className="block w-full text-center py-3 text-white/70" style={{ fontFamily: "var(--font-body)" }}>Sign In</Link>
                  <Link to="/signup" className="block w-full text-center py-3 rounded-full text-white liquid-glass-strong" style={{ fontFamily: "var(--font-body)" }}>Get Started</Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default LandingNav;
