import { Link, useLocation } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { trackEvent } from "@/lib/analytics";
import skillbridgeLogo from "@/assets/skillbridge-logo.png";

const NAV_LINKS = [
  { label: "How It Works", to: "/how-it-works" },
  { label: "Mission", to: "/mission" },
  { label: "For Businesses", to: "/for-businesses" },
];

const RESOURCES = [
  { label: "Microsoft Resume Templates", url: "https://word.cloud.microsoft/create/en/resume-templates/" },
  { label: "Harvard Resume Template", url: "https://docs.google.com/document/d/1EujuYFWxVXZ2PUaJ2uizvK5raMoMsz1KMys-UYpUSk4/edit?tab=t.0" },
  { label: "Indeed Interview Preparation", url: "https://www.indeed.com/career-advice/interviewing/how-to-prepare-for-an-interview" },
  { label: "MIT OpenCourseWare", url: "https://ocw.mit.edu/" },
  { label: "UW-Madison Professional Email Guide", url: "https://writing.wisc.edu/handbook/assignments/advice-for-students-writing-a-professional-email/" },
];

const LandingNav = () => {
  const { user, accountType } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const closeTimeoutRef = useRef<number | null>(null);
  const location = useLocation();

  useEffect(() => { setMobileOpen(false); }, [location.pathname]);
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setResourcesOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  useEffect(() => () => { if (closeTimeoutRef.current) window.clearTimeout(closeTimeoutRef.current); }, []);

  const openResources = () => {
    if (closeTimeoutRef.current) {
      window.clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setResourcesOpen(true);
  };

  const closeResourcesWithDelay = () => {
    if (closeTimeoutRef.current) window.clearTimeout(closeTimeoutRef.current);
    closeTimeoutRef.current = window.setTimeout(() => setResourcesOpen(false), 180);
  };

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
        <div className="relative z-[60]" ref={dropdownRef} onMouseEnter={openResources} onMouseLeave={closeResourcesWithDelay}>
        <div className="relative z-[60]" ref={dropdownRef} onMouseEnter={() => setResourcesOpen(true)} onMouseLeave={() => setResourcesOpen(false)}>
          <button onClick={() => { setResourcesOpen(!resourcesOpen); trackEvent('resources_opened'); }} className="text-sm text-white/60 hover:text-white transition-colors inline-flex items-center gap-1" style={{ fontFamily: "var(--font-body)" }}>
            Resources <ChevronDown className={`h-3.5 w-3.5 transition-transform ${resourcesOpen ? 'rotate-180' : ''}`} />
          </button>
          <AnimatePresence>
            {resourcesOpen && (
              <motion.div initial={{ opacity: 0, y: 8, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8, scale: 0.96 }} transition={{ duration: 0.2 }}
                className="absolute top-full right-0 mt-3 w-[360px] p-4 space-y-2 z-[60]"
                style={{ background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(24px)', border: '1px solid rgba(255,255,255,0.7)', borderRadius: 16 }}>
                {RESOURCES.map((l) => <a key={l.url} href={l.url} target="_blank" rel="noopener noreferrer" onClick={() => trackEvent('resource_link_clicked')} className="block text-small" style={{ color: '#4F46E5' }}>{l.label}</a>)}
                <Link to="/resources" onClick={() => setResourcesOpen(false)} className="block text-small font-semibold pt-2" style={{ color: '#4F46E5' }}>View All Resources</Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
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
            <Link to="/resources" className="block text-lg text-white/80 py-3" style={{ fontFamily: "var(--font-body)" }}>Resources</Link>
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
