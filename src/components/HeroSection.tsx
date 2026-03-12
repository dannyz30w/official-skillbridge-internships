import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const springTransition = { type: "spring" as const, duration: 0.4, bounce: 0 };

const HeroSection = () => {
  return (
    <section className="pt-32 pb-12 sm:pb-20 px-4 sm:px-6">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="text-left"
        >
          <h1 className="font-display font-bold tracking-tight text-foreground leading-[1.1]"
            style={{ fontSize: "clamp(2.25rem, 5vw, 4rem)" }}
          >
            Paid Internships That{" "}
            <span className="text-primary">Build Your Career.</span>
          </h1>

          <p className="mt-6 text-lg leading-relaxed text-muted-foreground max-w-2xl">
            SkillBridge connects you with local and remote companies offering paid internships that actually matter. Real work, real pay, real skills.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              transition={springTransition}
            >
              <Link
                to="/browse"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary text-primary-foreground h-12 px-6 text-base font-semibold hover:bg-primary/90 transition-smooth will-change-transform"
              >
                Find an Internship
                <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              transition={springTransition}
            >
              <Link
                to="/post-internship"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-primary/20 bg-background text-accent-foreground h-12 px-6 text-base font-medium hover:bg-accent transition-smooth will-change-transform"
              >
                Post an Internship
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
