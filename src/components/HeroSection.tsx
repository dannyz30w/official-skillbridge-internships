import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const ease = [0.16, 1, 0.3, 1] as const;

const HeroSection = () => (
  <section className="pt-32 pb-16 sm:pb-24 px-4 sm:px-6">
    <div className="container mx-auto max-w-4xl">
      <div className="text-left">
        <motion.h1
          className="font-display font-bold"
          style={{ fontSize: "clamp(2.5rem, 5vw, 3.5rem)", lineHeight: 1.08, letterSpacing: '-0.02em' }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.38, ease }}
        >
          Paid Internships That{" "}
          <motion.span
            style={{ color: '#4F46E5' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.38, ease, delay: 0.12 }}
          >
            Build Your Career.
          </motion.span>
        </motion.h1>

        <motion.p
          className="mt-6 text-body max-w-2xl"
          style={{ color: 'rgba(60, 60, 67, 0.6)', fontSize: 18, lineHeight: 1.65 }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.38, ease, delay: 0.04 }}
        >
          SkillBridge connects you with local and remote companies offering paid internships that actually matter. Real work, real pay, real skills.
        </motion.p>

        <motion.div
          className="mt-8 flex flex-wrap items-center gap-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.38, ease, delay: 0.08 }}
        >
          <Link to="/signup" className="btn-glass-primary inline-flex items-center justify-center gap-2 h-12 px-8">
            Find an Internship <ArrowRight className="h-4 w-4" />
          </Link>
          <Link to="/for-businesses" className="btn-glass-secondary inline-flex items-center justify-center gap-2 h-12 px-8">
            Post an Internship
          </Link>
        </motion.div>
      </div>
    </div>
  </section>
);

export default HeroSection;
