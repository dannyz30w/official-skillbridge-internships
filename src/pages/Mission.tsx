import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import skillbridgeLogo from "@/assets/skillbridge-logo.png";
import SEOHead from "@/components/SEOHead";

const ease = [0.16, 1, 0.3, 1] as const;

const Mission = () => (
  <div className="min-h-screen" style={{ background: '#F2F2F7' }}>
    <SEOHead title="Our Mission, SkillBridge" description="SkillBridge exists to close the opportunity gap. Every listing is paid. Every business is verified. Every young person deserves a fair shot." path="/mission" />
    <nav className="sticky top-0 z-50 liquid-glass" style={{ height: 64 }} aria-label="Mission page navigation">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2">
          <img src={skillbridgeLogo} alt="SkillBridge logo" className="h-9 w-auto" width={144} height={36} />
        </Link>
        <Link to="/" className="inline-flex items-center gap-2 text-small font-medium transition-fast" style={{ color: 'rgba(60,60,67,0.6)' }}>
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>
      </div>
    </nav>

    <main className="py-24 sm:py-32 px-4 sm:px-6">
      <div className="mx-auto max-w-[680px]">
        <motion.h1
          className="font-display text-h1 font-bold mb-16"
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.38, ease }}
        >
          Our Mission
        </motion.h1>

        <div className="space-y-8" style={{ fontSize: 17, lineHeight: 1.7, color: 'rgba(28,28,30,0.85)' }}>
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.04, duration: 0.38, ease }}>
            Millions of young people graduate every year ready to work, but locked out of opportunity by a system that demands experience before giving them a chance. SkillBridge exists to break that cycle.
          </motion.p>

          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08, duration: 0.38, ease }}>
            We connect motivated young adults aged 16 to 22 with local businesses offering real, paid internships. Not coffee runs, not unpaid favors, but genuine skill-building experiences that launch careers.
          </motion.p>

          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12, duration: 0.38, ease }}>
            Every listing on SkillBridge is paid. Every business is verified. Every young person deserves a fair shot regardless of who they know, where they grew up, or what their family earns.
          </motion.p>

          <motion.p
            className="font-display font-bold text-h3 pt-8"
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.16, duration: 0.38, ease }}
          >
            SkillBridge. Built to close the opportunity gap.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.38, ease }} className="pt-8">
            <Link to="/signup" className="btn-glass-primary inline-flex items-center justify-center h-12 px-8">
              Get Started Today
            </Link>
          </motion.div>
        </div>
      </div>
    </main>
  </div>
);

export default Mission;
