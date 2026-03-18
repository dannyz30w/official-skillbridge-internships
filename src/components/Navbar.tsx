import { Link } from "react-router-dom";
import { Menu, ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import skillbridgeLogo from "@/assets/skillbridge-logo.png";
import { useAuth } from "@/contexts/AuthContext";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const RESOURCES = [
  {
    category: "Resume Builders and Templates",
    links: [
      { label: "Microsoft Resume Templates", url: "https://word.cloud.microsoft/create/en/resume-templates/" },
      { label: "Harvard Resume Template", url: "https://docs.google.com/document/d/1EujuYFWxVXZ2PUaJ2uizvK5raMoMsz1KMys-UYpUSk4/edit?tab=t.0" },
    ],
  },
  {
    category: "Interview Tips and Tricks",
    links: [
      { label: "Indeed Interview Preparation", url: "https://www.indeed.com/career-advice/interviewing/how-to-prepare-for-an-interview" },
      { label: "U.S. Department of Labor Interview Tips", url: "https://www.dol.gov/general/jobs/interview-tips" },
    ],
  },
  {
    category: "Skill Building",
    links: [
      { label: "Free Harvard Online Courses", url: "https://pll.harvard.edu/catalog/free" },
      { label: "MIT OpenCourseWare", url: "https://ocw.mit.edu/" },
    ],
  },
  {
    category: "Professional Etiquette and Communication",
    links: [
      { label: "UW-Madison Professional Email Guide", url: "https://writing.wisc.edu/handbook/assignments/advice-for-students-writing-a-professional-email/" },
      { label: "Rutgers Professional Email Dos and Donts", url: "https://it.rutgers.edu/2023/05/16/students-learn-the-dos-and-donts-of-writing-a-professional-email/" },
    ],
  },
];

const navLinkClass = "text-sm text-white/80 hover:text-white transition-colors px-3 py-2";

const Navbar = () => {
  const { user, accountType } = useAuth();
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const resourcesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!resourcesRef.current) return;
      if (!resourcesRef.current.contains(e.target as Node)) setResourcesOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  return (
    <nav className="fixed top-0 inset-x-0 z-50 border-b border-white/10 bg-[rgba(10,10,15,0.68)] backdrop-blur-2xl">
      <div className="container mx-auto h-16 px-4 sm:px-6 flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2">
          <img src={skillbridgeLogo} alt="SkillBridge logo" className="h-9 w-auto" />
          <span className="text-white font-semibold">SkillBridge</span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          <Link to="/" className={navLinkClass}>Home</Link>
          <Link to="/browse" className={navLinkClass}>Browse</Link>
          <Link to="/how-it-works" className={navLinkClass}>How It Works</Link>

          <div ref={resourcesRef} className="relative" onMouseEnter={() => setResourcesOpen(true)} onMouseLeave={() => setResourcesOpen(false)}>
            <button
              type="button"
              onClick={() => setResourcesOpen((v) => !v)}
              className="inline-flex items-center gap-1 text-sm text-white/80 hover:text-white transition-colors px-3 py-2"
            >
              Resources <ChevronDown className={`h-4 w-4 transition-transform ${resourcesOpen ? "rotate-180" : ""}`} />
            </button>

            {resourcesOpen && (
              <div className="absolute top-full mt-2 right-0 w-[560px] rounded-xl border border-white/10 bg-[#14141e]/95 backdrop-blur-xl p-4 shadow-2xl">
                <div className="grid grid-cols-2 gap-4">
                  {RESOURCES.map((group) => (
                    <div key={group.category}>
                      <p className="text-xs text-white/70 font-semibold mb-2">{group.category}</p>
                      <div className="space-y-1">
                        {group.links.map((link) => (
                          <a
                            key={link.url}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block text-xs text-indigo-300 hover:text-indigo-200"
                          >
                            {link.label}
                          </a>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <Link to="/mission" className={navLinkClass}>Mission</Link>
          <Link to="/for-businesses" className={navLinkClass}>For Businesses</Link>
        </div>

        <div className="hidden md:flex items-center gap-3">
          {user && accountType ? (
            <Link to={`/${accountType}`} className="liquid-glass rounded-full px-5 py-2 text-sm text-white">Dashboard</Link>
          ) : (
            <>
              <Link to="/signin" className="text-sm text-white/80 hover:text-white transition-colors">Sign In</Link>
              <Link to="/signup" className="liquid-glass-strong rounded-full px-5 py-2 text-sm text-white">Get Started</Link>
            </>
          )}
        </div>

        <div className="md:hidden">
          <Sheet>
            <SheetTrigger className="h-10 w-10 inline-flex items-center justify-center rounded-xl text-white" aria-label="Open menu">
              <Menu className="h-5 w-5" />
            </SheetTrigger>
            <SheetContent className="bg-[#0f1117] border-l border-white/10 text-white w-[90%] max-w-sm">
              <div className="mt-8 space-y-2">
                {[
                  ["Home", "/"],
                  ["Browse", "/browse"],
                  ["How It Works", "/how-it-works"],
                  ["Mission", "/mission"],
                  ["For Businesses", "/for-businesses"],
                  ["Contact", "/contact"],
                ].map(([label, to]) => (
                  <Link key={to} to={to} className="block py-2 text-white/85">{label}</Link>
                ))}

                <Accordion type="single" collapsible className="border-white/10">
                  <AccordionItem value="resources" className="border-white/10">
                    <AccordionTrigger className="py-2">Resources</AccordionTrigger>
                    <AccordionContent>
                      {RESOURCES.map((group) => (
                        <div key={group.category} className="mb-3">
                          <p className="text-xs text-white/70 mb-1">{group.category}</p>
                          {group.links.map((link) => (
                            <a key={link.url} href={link.url} target="_blank" rel="noopener noreferrer" className="block text-xs text-indigo-300 py-0.5">
                              {link.label}
                            </a>
                          ))}
                        </div>
                      ))}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>

                <div className="pt-4 border-t border-white/10 space-y-2">
                  <Link to="/signin" className="block py-2 text-white/85">Sign In</Link>
                  <Link to="/signup" className="inline-block liquid-glass-strong rounded-full px-5 py-2 text-sm text-white">Get Started</Link>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
