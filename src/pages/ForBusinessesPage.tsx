import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import skillbridgeLogo from "@/assets/skillbridge-logo.png";
import SEOHead from "@/components/SEOHead";

const ease = [0.16, 1, 0.3, 1] as const;

const features = [
  { title: "Post in minutes", desc: "Our listing form is simple and fast. Describe the role, set the pay, and submit for review." },
  { title: "Verified applicants", desc: "Every intern on SkillBridge is age-verified and has a complete portfolio ready for your review." },
  { title: "No recruitment fees", desc: "SkillBridge is free for businesses. Post listings, review applicants, and hire without any cost." },
  { title: "Admin-reviewed quality", desc: "Every listing goes through our admin queue before going live, ensuring quality across the platform." },
];

const ForBusinessesPage = () => (
  <div className="min-h-screen" style={{ background: '#F2F2F7' }}>
    <SEOHead title="Post a Paid Internship, SkillBridge for Businesses" description="Find motivated young talent for your business. Post a paid internship listing on SkillBridge and reach thousands of qualified applicants aged 16 to 22." path="/for-businesses" />
    <nav className="sticky top-0 z-50 liquid-glass" style={{ height: 64 }} aria-label="For Businesses page navigation">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
        <Link to="/"><img src={skillbridgeLogo} alt="SkillBridge logo" className="h-9 w-auto" width={144} height={36} /></Link>
        <Link to="/" className="inline-flex items-center gap-2 text-small font-medium transition-fast" style={{ color: 'rgba(60,60,67,0.6)' }}><ArrowLeft className="h-4 w-4" /> Back</Link>
      </div>
    </nav>

    <main className="py-24 sm:py-32 px-4 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <motion.h1 className="font-display text-h1 font-bold" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.38, ease }}>
          Hire ambitious young talent for your business.
        </motion.h1>
        <motion.p className="mt-6 text-body max-w-xl" style={{ color: 'rgba(60,60,67,0.6)', fontSize: 18 }} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.04, duration: 0.38, ease }}>
          Post paid internships, review verified applicants, and build your pipeline of future employees. All at no cost to you.
        </motion.p>

        <div className="mt-16 grid sm:grid-cols-2 gap-6">
          {features.map((f, i) => (
            <motion.div key={f.title} className="glass-card p-8" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 + i * 0.04, duration: 0.38, ease }}>
              <h3 className="font-display text-h4 font-bold">{f.title}</h3>
              <p className="mt-3 text-body" style={{ color: 'rgba(60,60,67,0.6)' }}>{f.desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.div className="mt-16" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.24, duration: 0.38, ease }}>
          <Link to="/signup?role=business" className="btn-glass-primary inline-flex items-center justify-center gap-2 h-12 px-8">
            Get Started <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </div>
    </main>
  </div>
);

export default ForBusinessesPage;
