import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const ease = [0.16, 1, 0.3, 1] as const;

const HeroSection = () => (
  <section className="pt-32 pb-12 sm:pb-20 px-4 sm:px-6">
    <div className="container mx-auto max-w-4xl">
      <div className="text-left">
        <motion.h1
          className="font-display font-bold tracking-tight leading-[1.08]"
          style={{ fontSize: "clamp(2.25rem, 5vw, 3.5rem)", color: "hsl(240, 6%, 10%)" }}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease }}
        >
          Paid Internships That{" "}
          <motion.span
            className="text-primary"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, ease, delay: 0.3 }}
          >
            Build Your Career.
          </motion.span>
        </motion.h1>

        <motion.p
          className="mt-6 text-lg leading-relaxed max-w-2xl"
          style={{ color: "rgba(60, 60, 67, 0.6)" }}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease, delay: 0.15 }}
        >
          SkillBridge connects you with local and remote companies offering paid internships that actually matter. Real work, real pay, real skills.
        </motion.p>

        <motion.div
          className="mt-8 flex flex-wrap items-center gap-4"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease, delay: 0.25 }}
        >
          <Link to="/signup"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary text-primary-foreground h-12 px-6 text-base font-semibold hover:opacity-92 btn-press"
            style={{ transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)' }}>
            Find an Internship <ArrowRight className="h-4 w-4" />
          </Link>
          <Link to="/signup"
            className="inline-flex items-center justify-center gap-2 rounded-xl h-12 px-6 text-base font-medium btn-press"
            style={{ background: 'rgba(255,255,255,0.6)', border: '1px solid rgba(0,0,0,0.08)', transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)' }}>
            Post an Internship
          </Link>
        </motion.div>
      </div>
    </div>
  </section>
);

export default HeroSection;
