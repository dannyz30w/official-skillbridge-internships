import { useState } from "react";
import { motion } from "framer-motion";

const internSteps = [
  { num: "01", title: "Create your profile in five minutes", description: "Fill out your portfolio with your skills, school, and interests. No resume needed, no cover letter, no hassle." },
  { num: "02", title: "Browse paid internships near you or remote", description: "Search real opportunities from verified businesses. Filter by category, location, pay rate, and work setting." },
  { num: "03", title: "Apply with one click, no resume required", description: "Your profile does the heavy lifting. Hit apply and you are done. Businesses review your portfolio directly." },
  { num: "04", title: "Complete your internship and earn a verified skill certificate", description: "Build real experience, earn real pay, and grow your professional portfolio with every completed role." },
];

const businessSteps = [
  { num: "01", title: "Post your internship listing in ten minutes", description: "Fill out a simple form with role details, pay rate, and skills learned. Submit for a quick admin review." },
  { num: "02", title: "Browse matched applicants through the admin-verified queue", description: "Every listing goes through our review process before going live, ensuring quality on both sides." },
  { num: "03", title: "Interview and hire through the platform", description: "Review intern portfolios, accept top candidates, and message them directly to coordinate next steps." },
  { num: "04", title: "Build your talent pipeline for future hires", description: "Develop relationships with motivated young professionals who can grow with your business over time." },
];

const ease = [0.16, 1, 0.3, 1] as const;

const HowItWorks = () => {
  const [view, setView] = useState<'intern' | 'business'>('intern');
  const steps = view === 'intern' ? internSteps : businessSteps;

  return (
    <section id="how-it-works" className="py-16 sm:py-24 px-4 sm:px-6">
      <div className="container mx-auto max-w-3xl">
        <motion.h2
          className="font-display text-h2 font-bold text-center"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-48px" }}
          transition={{ duration: 0.38, ease }}
        >
          How It Works
        </motion.h2>

        <motion.div
          className="flex justify-center mt-8"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-48px" }}
          transition={{ duration: 0.38, ease, delay: 0.04 }}
        >
          <div className="glass-card-sm inline-flex p-1 gap-1" style={{ borderRadius: 100 }}>
            <button
              onClick={() => setView('intern')}
              className="px-6 py-2 rounded-full text-small font-semibold transition-fast"
              style={view === 'intern'
                ? { background: 'rgba(79, 70, 229, 0.9)', color: 'white' }
                : { color: 'rgba(60,60,67,0.6)' }
              }
            >
              For Interns
            </button>
            <button
              onClick={() => setView('business')}
              className="px-6 py-2 rounded-full text-small font-semibold transition-fast"
              style={view === 'business'
                ? { background: 'rgba(79, 70, 229, 0.9)', color: 'white' }
                : { color: 'rgba(60,60,67,0.6)' }
              }
            >
              For Businesses
            </button>
          </div>
        </motion.div>

        <div className="mt-16 space-y-16">
          {steps.map((step, i) => {
            const isEven = i % 2 === 0;
            return (
              <motion.div
                key={`${view}-${step.num}`}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-32px" }}
                transition={{ duration: 0.38, ease, delay: i * 0.04 }}
                className={`flex items-start gap-8 sm:gap-16 ${isEven ? '' : 'flex-row-reverse text-right'}`}
              >
                <div className="flex-shrink-0">
                  <span className="font-display font-bold" style={{ fontSize: 80, lineHeight: 1, color: 'rgba(79, 70, 229, 0.08)' }}>{step.num}</span>
                </div>
                <div className="pt-4">
                  <h3 className="font-display text-h4 font-bold">{step.title}</h3>
                  <p className="mt-3 text-body" style={{ color: 'rgba(60,60,67,0.6)' }}>{step.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
