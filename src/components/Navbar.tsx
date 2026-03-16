import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut, Menu, X, ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { trackEvent } from "@/lib/analytics";
import skillbridgeLogo from "@/assets/skillbridge-logo.png";

const RESOURCES = [
  {
    category: "Resume Builders and Templates",
    links: [
      { label: "Microsoft Resume Templates", url: "https://word.cloud.microsoft/create/en/resume-templates/" },
      { label: "Harvard Resume Template", url: "https://docs.google.com/document/d/1EujuYFWxVXZ2PUaJ2uizvK5raMoMsz1KMys-UYpUSk4/edit?tab=t.0" },
      { label: "West Virginia University Resume Templates", url: "https://careerservices.wvu.edu/resources/resume-templates/" },
      { label: "Ohio State University Resume Examples", url: "https://asccareersuccess.osu.edu/where-start/resume-templates-and-examples" },
      { label: "UPenn How To Write A Resume", url: "https://careerservices.upenn.edu/channels/resume/" },
      { label: "UC Davis Resume and CV Samples", url: "https://careercenter.ucdavis.edu/resumes-and-materials/resumes/resume-cv-samples" },
      { label: "UT Austin Resume Templates", url: "https://careerservices.cns.utexas.edu/resources/resumes/templates/" },
    ]
  },
  {
    category: "Interview Tips and Tricks",
    links: [
      { label: "Indeed Interview Preparation", url: "https://www.indeed.com/career-advice/interviewing/how-to-prepare-for-an-interview" },
      { label: "U.S. Department of Labor Interview Tips", url: "https://www.dol.gov/general/jobs/interview-tips" },
      { label: "Princeton University Interview Guide", url: "https://careerdevelopment.princeton.edu/sites/g/files/toruqf1041/files/media/interview_guide_5.pdf" },
      { label: "HBR Strategies for Effective Interviewing", url: "https://hbr.org/1964/01/strategies-of-effective-interviewing" },
      { label: "Columbia University Interview Guide", url: "https://www.careereducation.columbia.edu/resources/things-do-during-and-after-your-interview" },
      { label: "Experis 20 Tips for Great Interviews", url: "https://www.experis.com/en/insights/articles/20-tips-for-great-job-interviews" },
    ]
  },
  {
    category: "Skill Building",
    links: [
      { label: "Free Harvard Online Courses", url: "https://pll.harvard.edu/catalog/free" },
      { label: "Stanford Online Free Courses", url: "https://online.stanford.edu/free-courses" },
      { label: "MIT OpenCourseWare", url: "https://ocw.mit.edu/" },
      { label: "Open Yale Courses", url: "https://oyc.yale.edu/node/3" },
      { label: "UCLA xOpen Free Courses", url: "https://www.uclaextension.edu/courses/uclaxopen" },
      { label: "Code.org Computer Science Training", url: "https://code.org/en-US/students/middle-and-high-school" },
      { label: "Khan Academy", url: "https://khanacademy.org" },
    ]
  },
  {
    category: "Professional Etiquette and Communication",
    links: [
      { label: "UW-Madison Professional Email Guide", url: "https://writing.wisc.edu/handbook/assignments/advice-for-students-writing-a-professional-email/" },
      { label: "Rutgers Professional Email Dos and Donts", url: "https://it.rutgers.edu/2023/05/16/students-learn-the-dos-and-donts-of-writing-a-professional-email/" },
      { label: "UC Berkeley Improve Your Writing", url: "https://slc.berkeley.edu/writing-worksheets-and-other-writing-resources/nine-basic-ways-improve-your-style-academic-writing" },
    ]
  },
];

const Navbar = () => {
  const { user, accountType, signOut } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const [mobileResourcesOpen, setMobileResourcesOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setResourcesOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 liquid-glass" style={{ height: 64, paddingTop: 'env(safe-area-inset-top)' }} aria-label="Main navigation">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2">
          <img src={skillbridgeLogo} alt="SkillBridge logo" className="h-9 w-auto" width={144} height={36} />
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link to="/how-it-works" className="text-small font-medium transition-fast" style={{ color: 'rgba(60,60,67,0.6)' }}>How It Works</Link>
          <Link to="/mission" className="text-small font-medium transition-fast" style={{ color: 'rgba(60,60,67,0.6)' }}>Mission</Link>
          <Link to="/for-businesses" className="text-small font-medium transition-fast" style={{ color: 'rgba(60,60,67,0.6)' }}>For Businesses</Link>
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => { setResourcesOpen(!resourcesOpen); trackEvent('resources_opened'); }}
              className="text-small font-medium transition-fast inline-flex items-center gap-1"
              style={{ color: 'rgba(60,60,67,0.6)' }}
            >
              Resources <ChevronDown className={`h-3.5 w-3.5 transition-transform ${resourcesOpen ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
              {resourcesOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.96 }}
                  transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute top-full right-0 mt-3 w-[360px] p-4 space-y-3 z-50"
                  style={{
                    background: 'rgba(255,255,255,0.85)',
                    backdropFilter: 'blur(24px) saturate(200%)',
                    WebkitBackdropFilter: 'blur(24px) saturate(200%)',
                    border: '1px solid rgba(255,255,255,0.6)',
                    borderRadius: 16,
                    boxShadow: '0 16px 48px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.7)',
                  }}
                >
                  {RESOURCES.map(cat => (
                    <ResourceCategory key={cat.category} category={cat.category} links={cat.links} />
                  ))}
                  <div className="pt-2" style={{ borderTop: '1px solid rgba(0,0,0,0.06)' }}>
                    <Link to="/resources" onClick={() => setResourcesOpen(false)} className="text-small font-semibold" style={{ color: '#4F46E5' }}>View All Resources</Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-3">
          {user && accountType ? (
            <>
              <Link to={`/${accountType}`} className="text-small font-medium transition-fast" style={{ color: 'rgba(60,60,67,0.6)' }}>Dashboard</Link>
              <button onClick={signOut} className="btn-glass-secondary inline-flex items-center justify-center gap-1.5 h-9 px-4 text-small" style={{ padding: '8px 16px' }}>
                <LogOut className="h-3.5 w-3.5" /> Sign Out
              </button>
            </>
          ) : (
            <>
              <Link to="/signin" className="text-small font-medium transition-fast" style={{ color: 'rgba(60,60,67,0.6)' }}>Sign In</Link>
              <Link to="/signup" className="btn-glass-primary inline-flex items-center justify-center h-9 px-4 text-small" style={{ padding: '8px 20px' }}>Sign Up</Link>
            </>
          )}
        </div>

        <button className="md:hidden inline-flex items-center justify-center h-11 w-11 rounded-xl transition-fast" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu">
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
            style={{ width: '85%', background: 'rgba(245,245,250,0.95)', backdropFilter: 'blur(32px) saturate(200%)', WebkitBackdropFilter: 'blur(32px) saturate(200%)' }}
          >
            <div className="flex justify-end mb-4">
              <button onClick={() => setMobileOpen(false)} className="h-11 w-11 flex items-center justify-center rounded-xl" aria-label="Close menu"><X className="h-5 w-5" /></button>
            </div>
            <Link to="/how-it-works" className="block text-body font-medium py-3" style={{ color: '#1C1C1E' }}>How It Works</Link>
            <Link to="/mission" className="block text-body font-medium py-3" style={{ color: '#1C1C1E' }}>Mission</Link>
            <Link to="/for-businesses" className="block text-body font-medium py-3" style={{ color: '#1C1C1E' }}>For Businesses</Link>
            <div>
              <button onClick={() => { setMobileResourcesOpen(!mobileResourcesOpen); trackEvent('resources_opened'); }} className="w-full flex items-center justify-between py-3 text-body font-medium" style={{ color: '#1C1C1E' }}>
                Resources <ChevronDown className={`h-4 w-4 transition-transform ${mobileResourcesOpen ? 'rotate-180' : ''}`} />
              </button>
              {mobileResourcesOpen && (
                <div className="pl-4 space-y-2 pb-2">
                  {RESOURCES.map(cat => (
                    <div key={cat.category}>
                      <p className="text-small font-semibold py-1" style={{ color: 'rgba(60,60,67,0.6)' }}>{cat.category}</p>
                      {cat.links.map(l => (
                        <a key={l.url} href={l.url} target="_blank" rel="noopener noreferrer" onClick={() => trackEvent('resource_link_clicked')} className="block text-small py-1 transition-fast" style={{ color: '#4F46E5' }}>{l.label}</a>
                      ))}
                    </div>
                  ))}
                  <Link to="/resources" className="block text-small font-semibold py-1" style={{ color: '#4F46E5' }}>View All</Link>
                </div>
              )}
            </div>
            <Link to="/contact" className="block text-body font-medium py-3" style={{ color: '#1C1C1E' }}>Contact</Link>
            <div className="pt-4" style={{ borderTop: '1px solid rgba(0,0,0,0.06)' }}>
              {user && accountType ? (
                <div className="space-y-3">
                  <Link to={`/${accountType}`} className="block w-full btn-glass-secondary text-center py-3 text-body font-medium">Dashboard</Link>
                  <button onClick={() => { signOut(); setMobileOpen(false); }} className="block w-full btn-glass-secondary text-center py-3 text-body font-medium">Sign Out</button>
                </div>
              ) : (
                <div className="space-y-3">
                  <Link to="/signin" className="block w-full btn-glass-secondary text-center py-3 text-body font-medium">Sign In</Link>
                  <Link to="/signup" className="block w-full btn-glass-primary text-center py-3 text-body font-semibold">Sign Up</Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const ResourceCategory = ({ category, links }: { category: string; links: { label: string; url: string }[] }) => {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button onClick={() => { setOpen(!open); trackEvent('resource_link_clicked'); }} className="w-full flex items-center justify-between py-2 text-small font-semibold" style={{ color: '#1C1C1E' }}>
        {category} <ChevronDown className={`h-3.5 w-3.5 transition-transform ${open ? 'rotate-180' : ''}`} style={{ color: 'rgba(60,60,67,0.4)' }} />
      </button>
      {open && (
        <div className="pl-2 space-y-1 pb-2">
          {links.map(l => (
            <a key={l.url} href={l.url} target="_blank" rel="noopener noreferrer" onClick={() => trackEvent('resource_link_clicked')} className="block text-small py-1 transition-fast" style={{ color: '#4F46E5' }}>
              {l.label}
            </a>
          ))}
        </div>
      )}
    </div>
  );
};

export default Navbar;
