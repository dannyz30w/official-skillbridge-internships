import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";

const ease = [0.16, 1, 0.3, 1] as const;

const features = [
  { title: "Post in minutes", desc: "Our listing form is simple and fast. Describe the role, set the pay, and submit for review." },
  { title: "Verified applicants", desc: "Every intern on SkillBridge is age-verified and has a complete portfolio ready for your review." },
  { title: "No recruitment fees", desc: "SkillBridge is free for businesses. Post listings, review applicants, and hire without any cost." },
  { title: "Admin-reviewed quality", desc: "Every listing goes through our admin queue before going live, ensuring quality across the platform." },
];

const ForBusinessesPage = () => (
  <div className="min-h-screen ocean-page">
    <SEOHead title="Post a Paid Internship, SkillBridge for Businesses" description="Post a paid internship on SkillBridge and reach thousands of motivated young adults aged 16-22. Admin-verified platform. Start free." path="/for-businesses" />
    <Navbar />

    <main className="pt-32 pb-24 px-4 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <motion.h1 className="font-display text-h1 font-bold ocean-title" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease }}>
          Hire ambitious young talent for your business.
        </motion.h1>
        <motion.p className="mt-6 text-body max-w-xl ocean-copy" style={{ fontSize: 18 }} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05, duration: 0.5, ease }}>
          Post paid internships, review verified applicants, and build your pipeline of future employees. All at no cost to you.
        </motion.p>

        <div className="mt-16 grid sm:grid-cols-2 gap-6">
          {features.map((f, i) => (
            <motion.div key={f.title} className="ocean-panel rounded-[24px] p-8" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.05, duration: 0.5, ease }}>
              <h3 className="font-display text-h4 font-bold ocean-title">{f.title}</h3>
              <p className="mt-3 text-body ocean-copy">{f.desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.div className="mt-16" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.5, ease }}>
          <Link to="/signup?role=business" className="btn-glass-primary inline-flex items-center justify-center gap-2 h-12 px-8">
            Get Started <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </div>
    </main>
    <Footer />
  </div>
);

export default ForBusinessesPage;
