import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import StatsBar from "@/components/StatsBar";
import HowItWorks from "@/components/HowItWorks";
import ForBusinesses from "@/components/ForBusinesses";
import TestimonialsSection from "@/components/TestimonialsSection";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";

const MissionSection = () => (
  <section id="mission" className="py-20 px-4 sm:px-6">
    <div className="container mx-auto max-w-3xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-10 text-center">
          Our Mission
        </h2>
        <div className="space-y-6 text-base sm:text-lg leading-relaxed text-foreground/85">
          <p>
            Millions of young people graduate every year ready to work — but locked out of opportunity by a system that demands experience before giving them a chance. SkillBridge exists to break that cycle.
          </p>
          <p>
            We connect motivated young adults aged 16–22 with local businesses offering real, paid internships — not coffee runs, not unpaid favors, but genuine skill-building experiences that launch careers.
          </p>
          <p>
            Every listing on SkillBridge is paid. Every business is verified. Every young person deserves a fair shot regardless of who they know, where they grew up, or what their family earns.
          </p>
          <p>
            We are a <strong>WSI Impact League Finalist</strong> — recognized among the Top 80 of 2,500+ participants — because we believe access to opportunity should never be a privilege.
          </p>
          <p className="font-display font-bold text-xl text-foreground">
            SkillBridge. Built to close the opportunity gap.
          </p>
        </div>
      </motion.div>
    </div>
  </section>
);

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      <StatsBar />
      <HowItWorks />
      <MissionSection />
      <ForBusinesses />
      <TestimonialsSection />
      <Footer />
    </div>
  );
};

export default Index;
