import { motion } from "framer-motion";
import { MessageSquare } from "lucide-react";

const ease = [0.16, 1, 0.3, 1] as const;

const TestimonialsSection = () => (
  <section className="py-16 sm:py-24 px-4 sm:px-6">
    <div className="container mx-auto max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.38, ease }}
      >
        <h2 className="font-display text-h2 font-bold">What People Are Saying</h2>
        <p className="mt-2 text-body" style={{ color: 'rgba(60,60,67,0.6)' }}>
          We are building something real, and the stories will follow.
        </p>

        <div className="mt-8 glass-card p-12 flex flex-col items-center justify-center text-center" style={{ border: '2px dashed rgba(0,0,0,0.08)' }}>
          <MessageSquare className="h-8 w-8 mb-4" style={{ color: 'rgba(60,60,67,0.3)' }} />
          <p className="text-small font-medium" style={{ color: 'rgba(60,60,67,0.6)' }}>
            Real stories from our first cohort are coming soon.
          </p>
          <p className="text-caption mt-1" style={{ color: 'rgba(60,60,67,0.4)' }}>
            We do not do fake testimonials.
          </p>
        </div>
      </motion.div>
    </div>
  </section>
);

export default TestimonialsSection;
