import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const ease = [0.16, 1, 0.3, 1] as const;

const ForBusinesses = () => (
  <section id="businesses" className="py-16 sm:py-24 px-4 sm:px-6">
    <div className="container mx-auto max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-48px" }}
        transition={{ duration: 0.38, ease }}
        className="glass-card p-8 sm:p-12"
      >
        <div className="max-w-xl">
          <span className="text-caption font-semibold uppercase tracking-wider" style={{ color: 'rgba(60,60,67,0.6)' }}>For Businesses</span>
          <h2 className="mt-2 font-display text-h2 font-bold">Hire Ambitious Young Talent</h2>
          <p className="mt-4 text-body" style={{ color: 'rgba(60,60,67,0.6)' }}>
            Post internships in minutes, reach motivated candidates aged 16 to 22, and build your pipeline of future employees. No recruitment fees, no complexity.
          </p>
          <div className="mt-8">
            <Link to="/for-businesses" className="btn-glass-primary inline-flex items-center justify-center gap-2 h-12 px-8">
              Learn More <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  </section>
);

export default ForBusinesses;
