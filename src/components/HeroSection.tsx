import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const ease = [0.16, 1, 0.3, 1] as const;

const HeroSection = () => {
  return (
    <section className="pt-32 pb-12 sm:pb-20 px-4 sm:px-6">
      <div className="container mx-auto max-w-4xl">
        <div className="text-left">
          <motion.h1
            className="font-display font-bold tracking-tight text-foreground leading-[1.08]"
            style={{ fontSize: "clamp(2.25rem, 5vw, 4rem)" }}
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
            className="mt-6 text-lg leading-relaxed text-muted-foreground max-w-2xl"
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
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link
                to="/browse"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary text-primary-foreground h-12 px-6 text-base font-semibold hover:bg-primary/90 transition-smooth will-change-transform"
              >
                Find an Internship
                <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link
                to="/post-internship"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-primary/20 bg-background text-accent-foreground h-12 px-6 text-base font-medium hover:bg-accent transition-smooth will-change-transform"
              >
                Post an Internship
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
