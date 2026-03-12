import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const springTransition = { type: "spring" as const, duration: 0.4, bounce: 0 };

const ForBusinesses = () => {
  return (
    <section id="businesses" className="py-12 sm:py-20 px-4 sm:px-6">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="bg-card rounded-xl border border-border shadow-card p-8 sm:p-12"
        >
          <div className="max-w-xl">
            <span className="text-xs font-medium text-muted-foreground tracking-wide uppercase">
              For Businesses
            </span>
            <h2 className="mt-2 font-display text-3xl font-bold text-foreground tracking-tight">
              Hire Ambitious Young Talent
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Post internships in minutes, reach motivated candidates aged 16–22, and build your pipeline of future employees. No recruitment fees, no complexity.
            </p>
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              transition={springTransition}
              className="mt-6 inline-block"
            >
              <Link
                to="/post-internship"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary text-primary-foreground h-11 px-6 text-sm font-semibold hover:bg-primary/90 transition-smooth will-change-transform"
              >
                Post an Internship <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ForBusinesses;
