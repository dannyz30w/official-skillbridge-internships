import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import SEOHead from "@/components/SEOHead";

const TestimonialsPage = () => (
  <div className="min-h-screen" style={{ background: 'transparent' }}>
    <SEOHead title="Testimonials, SkillBridge" description="Real stories from interns and businesses who found each other through SkillBridge and built something that mattered." path="/testimonials" />
    <Navbar />
    <main className="pt-32 pb-24 px-4 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <motion.h1
          className="text-h1 font-bold text-white"
          style={{ fontFamily: "var(--font-display)", fontStyle: "italic" }}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          Testimonials
        </motion.h1>
        <motion.p
          className="mt-4 text-lg text-white/50"
          style={{ fontFamily: "var(--font-body)" }}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          Real stories from interns and businesses who connected through SkillBridge.
        </motion.p>
        <motion.div
          className="mt-16 liquid-glass-strong rounded-2xl p-12 text-center"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="text-white/50 text-body" style={{ fontFamily: "var(--font-body)" }}>
            Testimonials from our first cohort of interns and businesses are coming soon. SkillBridge is actively building partnerships with verified businesses to create real paid opportunities.
          </p>
        </motion.div>
      </div>
    </main>
  </div>
);

export default TestimonialsPage;
