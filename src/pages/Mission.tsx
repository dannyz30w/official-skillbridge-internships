import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import SEOHead from "@/components/SEOHead";

const ease = [0.16, 1, 0.3, 1] as const;

const Mission = () => (
  <div className="min-h-screen" style={{ background: 'transparent' }}>
    <SEOHead title="Our Mission, SkillBridge" description="SkillBridge was built to close the opportunity gap. Every listing is paid. Every business is verified. Every young person gets a fair shot." path="/mission" jsonLd={{"@context":"https://schema.org","@type":"AboutPage","name":"SkillBridge Mission","description":"SkillBridge exists to close the opportunity gap for young adults through verified paid internships."}} />
    <Navbar />

    <main className="pt-32 pb-24 px-4 sm:px-6">
      <div className="mx-auto max-w-[680px]">
        <motion.h1
          className="text-h1 font-bold mb-16 ocean-title"
          style={{ fontFamily: "var(--font-display)", fontStyle: "italic" }}
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease }}
        >
          Our Mission
        </motion.h1>

        <div className="space-y-8" style={{ fontSize: 17, lineHeight: 1.7, color: 'rgba(226,232,240,0.82)', fontFamily: "var(--font-body)" }}>
          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05, duration: 0.5, ease }}>
            Millions of young people graduate every year ready to work, but locked out of opportunity by a system that demands experience before giving them a chance. SkillBridge exists to break that cycle.
          </motion.p>

          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.5, ease }}>
            We connect motivated young adults aged 16 to 22 with local businesses offering real, paid internships. Not coffee runs, not unpaid favors, but genuine skill-building experiences that launch careers.
          </motion.p>

          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.5, ease }}>
            Every listing on SkillBridge is paid. Every business is verified. Every young person deserves a fair shot regardless of who they know, where they grew up, or what their family earns.
          </motion.p>

          <motion.p
            className="text-h3 pt-8 ocean-title"
            style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontWeight: 700 }}
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5, ease }}
          >
            SkillBridge. Built to close the opportunity gap.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25, duration: 0.5, ease }} className="pt-8">
            <Link to="/signup" className="liquid-glass-strong rounded-full px-8 py-4 text-sm text-white font-medium hover:scale-[1.03] transition-transform inline-block" style={{ fontFamily: "var(--font-body)" }}>
              Get Started Today
            </Link>
          </motion.div>
        </div>
      </div>
    </main>
  </div>
);

export default Mission;
