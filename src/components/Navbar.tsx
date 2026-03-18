import { Link } from "react-router-dom";
import { Menu } from "lucide-react";
import skillbridgeLogo from "@/assets/skillbridge-logo.png";
import { useAuth } from "@/contexts/AuthContext";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuList, NavigationMenuTrigger } from "@/components/ui/navigation-menu";
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

const navLinkClass = "text-sm text-white/80 hover:text-white transition-colors";

const Navbar = () => {
  const { user, accountType } = useAuth();

  return (
    <nav className="fixed top-0 inset-x-0 z-50 border-b border-white/10 bg-[rgba(10,10,15,0.68)] backdrop-blur-2xl">
      <div className="container mx-auto h-16 px-4 sm:px-6 flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2">
          <img src={skillbridgeLogo} alt="SkillBridge logo" className="h-9 w-auto" />
          <span className="text-white font-semibold">SkillBridge</span>
        </Link>

        <div className="hidden md:flex items-center gap-2">
          <NavigationMenu>
            <NavigationMenuList className="gap-1">
              <NavigationMenuItem><Link to="/" className={navLinkClass + " px-3 py-2"}>Home</Link></NavigationMenuItem>
              <NavigationMenuItem><Link to="/browse" className={navLinkClass + " px-3 py-2"}>Browse</Link></NavigationMenuItem>
              <NavigationMenuItem><Link to="/how-it-works" className={navLinkClass + " px-3 py-2"}>How It Works</Link></NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent text-white/80 hover:text-white hover:bg-transparent data-[state=open]:bg-transparent">Resources</NavigationMenuTrigger>
                <NavigationMenuContent className="p-4 rounded-xl border border-white/10 bg-[#14141e]/95 backdrop-blur-xl w-[460px]">
                  <div className="grid grid-cols-2 gap-3">
                    {RESOURCES.map((group) => (
                      <div key={group.category}>
                        <p className="text-xs text-white/70 font-semibold mb-2">{group.category}</p>
                        <div className="space-y-1">
                          {group.links.map((link) => (
                            <a key={link.url} href={link.url} target="_blank" rel="noopener noreferrer" className="block text-xs text-indigo-300 hover:text-indigo-200">
                              {link.label}
                            </a>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem><Link to="/mission" className={navLinkClass + " px-3 py-2"}>Mission</Link></NavigationMenuItem>
              <NavigationMenuItem><Link to="/for-businesses" className={navLinkClass + " px-3 py-2"}>For Businesses</Link></NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <div className="hidden md:flex items-center gap-3">
          {user && accountType ? (
            <Link to={`/${accountType}`} className="liquid-glass rounded-full px-5 py-2 text-sm text-white">Dashboard</Link>
          ) : (
            <>
              <Link to="/signin" className={navLinkClass}>Sign In</Link>
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
