import { motion } from "framer-motion";
import { MessageSquare } from "lucide-react";

const TestimonialsSection = () => {
  return (
    <section className="py-12 sm:py-20 px-4 sm:px-6 bg-muted/40">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 className="font-display text-3xl font-bold text-foreground tracking-tight">
            What People Are Saying
          </h2>
          <p className="mt-2 text-muted-foreground">
            We're building something real — and the stories will follow.
          </p>

          <div className="mt-10 rounded-xl border-2 border-dashed border-border p-10 flex flex-col items-center justify-center text-center">
            <MessageSquare className="h-8 w-8 text-muted-foreground/50 mb-4" />
            <p className="text-sm font-medium text-muted-foreground">
              Real stories from our first cohort are coming soon.
            </p>
            <p className="text-xs text-muted-foreground/70 mt-1">
              We don't do fake testimonials.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialsSection;