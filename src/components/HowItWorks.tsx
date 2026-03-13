import { motion } from "framer-motion";
import { Briefcase, Search, Send } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Browse Internships",
    description: "Search by category, location, or pay rate. Every listing is a real, paid opportunity from a vetted company.",
  },
  {
    icon: Send,
    title: "Apply in Two Clicks",
    description: "Your profile does the heavy lifting. Hit apply, add a short note, and you're done. No cover letter essays.",
  },
  {
    icon: Briefcase,
    title: "Start Building Skills",
    description: "Get matched, start working, and build real experience. Track your hours, earnings, and skills gained — all in one place.",
  },
];

const ease = [0.16, 1, 0.3, 1] as const;

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-12 sm:py-20 px-4 sm:px-6 bg-muted/40">
      <div className="container mx-auto max-w-4xl">
        <motion.h2
          className="font-display text-3xl font-bold text-foreground tracking-tight"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease }}
        >
          How It Works
        </motion.h2>
        <motion.p
          className="mt-2 text-muted-foreground"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, ease, delay: 0.05 }}
        >
          From signup to first paycheck — here's the path.
        </motion.p>

        <div className="grid sm:grid-cols-3 gap-6 mt-10">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, ease, delay: 0.1 + i * 0.08 }}
              whileHover={{ y: -2 }}
              className="bg-card rounded-xl border border-border shadow-card hover:shadow-card-hover transition-card p-6"
            >
              <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-accent mb-4">
                <step.icon className="h-5 w-5 text-accent-foreground" />
              </div>
              <span className="text-xs font-medium text-muted-foreground tracking-wide uppercase">
                Step {i + 1}
              </span>
              <h3 className="mt-1 text-lg font-bold text-foreground">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
