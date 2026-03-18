import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import SEOHead from "@/components/SEOHead";
import { trackEvent } from "@/lib/analytics";

const ease = [0.16, 1, 0.3, 1] as const;

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

const ResourceCategory = ({ category, links }: { category: string; links: { label: string; url: string }[] }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="liquid-glass-strong rounded-2xl overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between p-6 text-left">
        <h2 className="text-h4 font-bold text-white" style={{ fontFamily: "var(--font-body)" }}>{category}</h2>
        <ChevronDown className={`h-5 w-5 text-white/40 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="px-6 pb-6 space-y-3">
          {links.map(l => (
            <a key={l.url} href={l.url} target="_blank" rel="noopener noreferrer" onClick={() => trackEvent('resource_link_clicked')} className="block text-body font-medium transition-colors" style={{ color: '#818CF8' }}>
              {l.label}
            </a>
          ))}
        </div>
      )}
    </div>
  );
};

const ResourcesPage = () => (
  <div className="min-h-screen" style={{ background: 'transparent' }}>
    <SEOHead title="Resources, SkillBridge" description="Free resume templates, interview guides, skill-building courses, and professional communication resources for young adults starting their careers." path="/resources" jsonLd={{"@context":"https://schema.org","@type":"CollectionPage","name":"SkillBridge Resources","hasPart": RESOURCES.map((r) => ({"@type":"CreativeWork","name": r.category}))}} />
    <Navbar />
    <main className="pt-32 pb-24 px-4 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <motion.h1 className="text-h1 font-bold text-white" style={{ fontFamily: "var(--font-display)", fontStyle: "italic" }} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease }}>
          Resources
        </motion.h1>
        <motion.p className="mt-4 text-lg text-white/50" style={{ fontFamily: "var(--font-body)" }} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05, duration: 0.5, ease }}>
          Everything you need to land your first paid internship and thrive once you do.
        </motion.p>

        <div className="mt-16 space-y-4">
          {RESOURCES.map((cat, i) => (
            <motion.div key={cat.category} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.05, duration: 0.5, ease }}>
              <ResourceCategory category={cat.category} links={cat.links} />
            </motion.div>
          ))}
        </div>

        <motion.div className="mt-16" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.5, ease }}>
          <Link to="/signup" className="liquid-glass-strong rounded-full px-8 py-4 text-sm text-white font-medium hover:scale-[1.03] transition-transform inline-block" style={{ fontFamily: "var(--font-body)" }}>
            Get Started Today
          </Link>
        </motion.div>
      </div>
    </main>
  </div>
);

export default ResourcesPage;
