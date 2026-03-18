import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut, Menu, X, ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { trackEvent } from "@/lib/analytics";
import skillbridgeLogo from "@/assets/skillbridge-logo.png";

const RESOURCES = [
  { category: "Resume Builders and Templates", links: [
    { label: "Microsoft Resume Templates", url: "https://word.cloud.microsoft/create/en/resume-templates/" },
    { label: "Harvard Resume Template", url: "https://docs.google.com/document/d/1EujuYFWxVXZ2PUaJ2uizvK5raMoMsz1KMys-UYpUSk4/edit?tab=t.0" },
    { label: "West Virginia University Resume Templates", url: "https://careerservices.wvu.edu/resources/resume-templates/" },
    { label: "Ohio State University Resume Examples", url: "https://asccareersuccess.osu.edu/where-start/resume-templates-and-examples" },
    { label: "UPenn How To Write A Resume", url: "https://careerservices.upenn.edu/channels/resume/" },
    { label: "UC Davis Resume and CV Samples", url: "https://careercenter.ucdavis.edu/resumes-and-materials/resumes/resume-cv-samples" },
    { label: "UT Austin Resume Templates", url: "https://careerservices.cns.utexas.edu/resources/resumes/templates/" },
  ]},
  { category: "Interview Tips and Tricks", links: [
    { label: "Indeed Interview Preparation", url: "https://www.indeed.com/career-advice/interviewing/how-to-prepare-for-an-interview" },
    { label: "U.S. Department of Labor Interview Tips", url: "https://www.dol.gov/general/jobs/interview-tips" },
    { label: "Princeton University Interview Guide", url: "https://careerdevelopment.princeton.edu/sites/g/files/toruqf1041/files/media/interview_guide_5.pdf" },
    { label: "HBR Strategies for Effective Interviewing", url: "https://hbr.org/1964/01/strategies-of-effective-interviewing" },
    { label: "Columbia University Interview Guide", url: "https://www.careereducation.columbia.edu/resources/things-do-during-and-after-your-interview" },
    { label: "Experis 20 Tips for Great Interviews", url: "https://www.experis.com/en/insights/articles/20-tips-for-great-job-interviews" },
  ]},
  { category: "Skill Building", links: [
    { label: "Free Harvard Online Courses", url: "https://pll.harvard.edu/catalog/free" },
    { label: "Stanford Online Free Courses", url: "https://online.stanford.edu/free-courses" },
    { label: "MIT OpenCourseWare", url: "https://ocw.mit.edu/" },
    { label: "Open Yale Courses", url: "https://oyc.yale.edu/node/3" },
    { label: "UCLA xOpen Free Courses", url: "https://www.uclaextension.edu/courses/uclaxopen" },
    { label: "Code.org Computer Science Training", url: "https://code.org/en-US/students/middle-and-high-school" },
    { label: "Khan Academy", url: "https://khanacademy.org" },
  ]},
  { category: "Professional Etiquette and Communication", links: [
    { label: "UW-Madison Professional Email Guide", url: "https://writing.wisc.edu/handbook/assignments/advice-for-students-writing-a-professional-email/" },
    { label: "Rutgers Professional Email Dos and Donts", url: "https://it.rutgers.edu/2023/05/16/students-learn-the-dos-and-donts-of-writing-a-professional-email/" },
    { label: "UC Berkeley Improve Your Writing", url: "https://slc.berkeley.edu/writing-worksheets-and-other-writing-resources/nine-basic-ways-improve-your-style-academic-writing" },
  ]},
];

const LIGHT_ROUTES = ["/intern", "/business", "/admin"];

const Navbar = () => {
  const { user, accountType, signOut } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const [mobileResourcesOpen, setMobileResourcesOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const closeTimeoutRef = useRef<number | null>(null);
  const location = useLocation();

  const isLight = LIGHT_ROUTES.some(r => location.pathname.startsWith(r));
  const textColor = isLight ? 'rgba(60,60,67,0.72)' : 'rgba(255,255,255,0.72)';
  const textHover = isLight ? '#1C1C1E' : '#ffffff';
  const accentColor = isLight ? '#4F46E5' : '#818CF8';

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
    if (closeTimeoutRef.current) { window.clearTimeout(closeTimeoutRef.current); closeTimeoutRef.current = null; }
    setResourcesOpen(true);
  };
  const closeResourcesWithDelay = () => {
    if (closeTimeoutRef.current) window.clearTimeout(closeTimeoutRef.current);
    closeTimeoutRef.current = window.setTimeout(() => setResourcesOpen(false), 180);
  };

  const navBg = isDashboardRoute
    ? { background: 'rgba(236,253,255,0.72)', backdropFilter: 'blur(32px) saturate(240%)', WebkitBackdropFilter: 'blur(32px) saturate(240%)', borderBottom: '1px solid rgba(15,23,42,0.72)' }
    : { background: 'rgba(2,6,23,0.62)', backdropFilter: 'blur(32px) saturate(180%)', WebkitBackdropFilter: 'blur(32px) saturate(180%)', borderBottom: '1px solid rgba(148,163,184,0.14)' };

  const dropdownBg = isDashboardRoute || isOceanRoute
    ? { background: 'rgba(240,253,250,0.9)', backdropFilter: 'blur(24px) saturate(200%)', border: '1px solid rgba(255,255,255,0.6)', borderRadius: 16, boxShadow: '0 16px 48px rgba(0,0,0,0.1)' }
    : { background: 'rgba(20,20,30,0.92)', backdropFilter: 'blur(24px) saturate(200%)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, boxShadow: '0 16px 48px rgba(0,0,0,0.3)' };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 liquid-glass overflow-visible" style={{ ...navBg, height: 64, paddingTop: 'env(safe-area-inset-top)' }} aria-label="Main navigation">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2">
          <img src={skillbridgeLogo} alt="SkillBridge logo" className="h-9 w-auto" width={144} height={36} />
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link to="/how-it-works" className="text-small font-medium transition-colors" style={{ color: textColor }}>How It Works</Link>
          <Link to="/mission" className="text-small font-medium transition-colors" style={{ color: textColor }}>Mission</Link>
          <Link to="/for-businesses" className="text-small font-medium transition-colors" style={{ color: textColor }}>For Businesses</Link>
          <div className="relative" ref={dropdownRef} onMouseEnter={openResources} onMouseLeave={closeResourcesWithDelay}>
            <button
              onClick={() => { setResourcesOpen(!resourcesOpen); trackEvent('resources_opened'); }}
              className="text-small font-medium transition-colors inline-flex items-center gap-1"
              style={{ color: isLight ? '#111827' : '#f8fafc', textShadow: isLight ? 'none' : '0 1px 10px rgba(15,23,42,0.32)' }}
            >
              Resources <ChevronDown className={`h-3.5 w-3.5 transition-transform ${resourcesOpen ? 'rotate-180' : ''}`} />
            </button>
            {resourcesOpen && (
              <div style={{ position: "absolute", top: "100%", right: 0, width: 360, height: 16, background: "transparent" }} onMouseEnter={openResources} />
            )}
            <AnimatePresence>
              {resourcesOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.96 }}
                  transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute top-full right-0 mt-3 w-[360px] p-4 space-y-3 z-50"
                  style={dropdownBg}
                  onMouseEnter={openResources}
                  onMouseLeave={closeResourcesWithDelay}
                >
                  {RESOURCES.map(cat => (
                    <ResourceCategory key={cat.category} category={cat.category} links={cat.links} accentColor={accentColor} textColor={isLight ? '#111827' : '#f8fafc'} />
                  ))}
                  <div className="pt-2" style={{ borderTop: `1px solid ${isDashboardRoute || isOceanRoute ? 'rgba(148,163,184,0.16)' : 'rgba(255,255,255,0.06)'}` }}>
                    <Link to="/resources" onClick={() => setResourcesOpen(false)} className="text-small font-semibold" style={{ color: accentColor }}>View All Resources</Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-3">
          {user && accountType ? (
            <>
              <Link to={`/${accountType}`} className="text-small font-medium transition-colors" style={{ color: textColor }}>Dashboard</Link>
              <button onClick={signOut} className={isDashboardRoute ? "btn-glass-secondary" : "liquid-glass"} style={{ padding: '8px 16px', borderRadius: 12, fontSize: 14, color: isDashboardRoute || isOceanRoute ? '#f8fafc' : 'white' }}>
                <span className="inline-flex items-center gap-1.5"><LogOut className="h-3.5 w-3.5" /> Sign Out</span>
              </button>
            </>
          ) : (
            <>
              <Link to="/signin" className="text-small font-medium transition-colors" style={{ color: textColor }}>Sign In</Link>
              <Link to="/signup" className={isDashboardRoute ? "btn-glass-primary" : "liquid-glass-strong rounded-full"} style={{ padding: '8px 20px', borderRadius: isDashboardRoute ? 12 : 100, fontSize: 14, color: 'white' }}>Sign Up</Link>
            </>
          )}
        </div>

        <button className="md:hidden inline-flex items-center justify-center h-11 w-11 rounded-xl" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu" style={{ color: isDashboardRoute || isOceanRoute ? '#f8fafc' : 'white' }}>
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden fixed top-0 right-0 h-full z-50 px-6 py-6 space-y-4"
            style={{ width: '85%', background: isDashboardRoute || isOceanRoute ? 'rgba(2,6,23,0.96)' : 'rgba(10,10,15,0.95)', backdropFilter: 'blur(32px) saturate(200%)' }}
          >
            <div className="flex justify-end mb-4">
              <button onClick={() => setMobileOpen(false)} className="h-11 w-11 flex items-center justify-center rounded-xl" aria-label="Close menu" style={{ color: isDashboardRoute || isOceanRoute ? '#f8fafc' : 'white' }}><X className="h-5 w-5" /></button>
            </div>
            {[
              { to: "/how-it-works", label: "How It Works" },
              { to: "/mission", label: "Mission" },
              { to: "/for-businesses", label: "For Businesses" },
            ].map(l => (
              <Link key={l.to} to={l.to} className="block text-body font-medium py-3" style={{ color: isDashboardRoute || isOceanRoute ? '#f8fafc' : 'rgba(255,255,255,0.8)' }}>{l.label}</Link>
            ))}
            <div>
              <button onClick={() => { setMobileResourcesOpen(!mobileResourcesOpen); trackEvent('resources_opened'); }} className="w-full flex items-center justify-between py-3 text-body font-medium" style={{ color: isDashboardRoute || isOceanRoute ? '#f8fafc' : 'rgba(255,255,255,0.8)' }}>
                Resources <ChevronDown className={`h-4 w-4 transition-transform ${mobileResourcesOpen ? 'rotate-180' : ''}`} />
              </button>
              {mobileResourcesOpen && (
                <div className="pl-4 space-y-2 pb-2">
                  {RESOURCES.map(cat => (
                    <div key={cat.category}>
                      <p className="text-small font-semibold py-1" style={{ color: isLight ? '#111827' : '#f8fafc' }}>{cat.category}</p>
                      {cat.links.map(l => (
                        <a key={l.url} href={l.url} target="_blank" rel="noopener noreferrer" onClick={() => trackEvent('resource_link_clicked')} className="block text-small py-1" style={{ color: accentColor }}>{l.label}</a>
                      ))}
                    </div>
                  ))}
                  <Link to="/resources" className="block text-small font-semibold py-1" style={{ color: accentColor }}>View All</Link>
                </div>
              )}
            </div>
            <Link to="/contact" className="block text-body font-medium py-3" style={{ color: isDashboardRoute || isOceanRoute ? '#f8fafc' : 'rgba(255,255,255,0.8)' }}>Contact</Link>
            <div className="pt-4" style={{ borderTop: `1px solid ${isDashboardRoute || isOceanRoute ? 'rgba(148,163,184,0.16)' : 'rgba(255,255,255,0.06)'}` }}>
              {user && accountType ? (
                <div className="space-y-3">
                  <Link to={`/${accountType}`} className="block w-full text-center py-3 rounded-xl text-body font-medium" style={{ background: isDashboardRoute || isOceanRoute ? 'rgba(15,23,42,0.72)' : 'rgba(255,255,255,0.05)', color: isDashboardRoute || isOceanRoute ? '#f8fafc' : 'white' }}>Dashboard</Link>
                  <button onClick={() => { signOut(); setMobileOpen(false); }} className="block w-full text-center py-3 rounded-xl text-body font-medium" style={{ background: isDashboardRoute || isOceanRoute ? 'rgba(15,23,42,0.72)' : 'rgba(255,255,255,0.05)', color: isDashboardRoute || isOceanRoute ? '#f8fafc' : 'white' }}>Sign Out</button>
                </div>
              ) : (
                <div className="space-y-3">
                  <Link to="/signin" className="block w-full text-center py-3 rounded-xl text-body font-medium" style={{ background: isDashboardRoute || isOceanRoute ? 'rgba(15,23,42,0.72)' : 'rgba(255,255,255,0.05)', color: isDashboardRoute || isOceanRoute ? '#f8fafc' : 'white' }}>Sign In</Link>
                  <Link to="/signup" className="block w-full text-center py-3 rounded-xl text-body font-semibold" style={{ background: 'rgba(79,70,229,0.9)', color: 'white' }}>Sign Up</Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const ResourceCategory = ({ category, links, accentColor, textColor }: { category: string; links: { label: string; url: string }[]; accentColor: string; textColor: string }) => {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button onClick={() => { setOpen(!open); trackEvent('resource_link_clicked'); }} className="w-full flex items-center justify-between py-2 text-small font-semibold" style={{ color: textColor }}>
        {category} <ChevronDown className={`h-3.5 w-3.5 transition-transform ${open ? 'rotate-180' : ''}`} style={{ color: 'rgba(128,128,128,0.5)' }} />
      </button>
      {open && (
        <div className="pl-2 space-y-1 pb-2">
          {links.map(l => (
            <a key={l.url} href={l.url} target="_blank" rel="noopener noreferrer" onClick={() => trackEvent('resource_link_clicked')} className="block text-small py-1 transition-colors" style={{ color: accentColor }}>
              {l.label}
            </a>
          ))}
        </div>
      )}
    </div>
  );
};

export default Navbar;
