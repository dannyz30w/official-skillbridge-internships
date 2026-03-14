import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import skillbridgeLogo from "@/assets/skillbridge-logo.png";

const ease = [0.16, 1, 0.3, 1] as const;

const Mission = () => (
  <div className="min-h-screen bg-background">
    <nav className="sticky top-0 z-50 liquid-glass">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2">
          <img src={skillbridgeLogo} alt="SkillBridge" className="h-9 w-auto" />
        </Link>
        <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-fast">
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>
      </div>
    </nav>

    <main className="py-20 sm:py-32 px-4 sm:px-6">
      <div className="mx-auto max-w-[680px] stagger-children">
        <motion.h1
          className="font-display text-3xl sm:text-4xl font-bold tracking-tight mb-12"
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease }}
        >
          Our Mission
        </motion.h1>

        <div className="space-y-8 text-[17px] leading-[1.7] text-foreground/85">
          <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05, duration: 0.4, ease }}>
            Millions of young people graduate every year ready to work, but locked out of opportunity by a system that demands experience before giving them a chance. SkillBridge exists to break that cycle.
          </motion.p>

          <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.4, ease }}>
            We connect motivated young adults aged 16 to 22 with local businesses offering real, paid internships. Not coffee runs, not unpaid favors, but genuine skill-building experiences that launch careers.
          </motion.p>

          <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.4, ease }}>
            Every listing on SkillBridge is paid. Every business is verified. Every young person deserves a fair shot regardless of who they know, where they grew up, or what their family earns.
          </motion.p>

          <motion.p
            className="font-display font-bold text-xl text-foreground pt-4"
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4, ease }}
          >
            SkillBridge. Built to close the opportunity gap.
          </motion.p>
        </div>
      </div>
    </main>
  </div>
);

export default Mission;
