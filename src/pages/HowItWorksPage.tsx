import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import HowItWorks from "@/components/HowItWorks";
import SEOHead from "@/components/SEOHead";

const HowItWorksPage = () => (
  <div className="min-h-screen ocean-page">
    <SEOHead title="How SkillBridge Works" description="See how SkillBridge works. Create a profile, browse paid internships, apply in one click, earn a skill certificate. Simple and free." path="/how-it-works" />
    <Navbar />
    <main className="pt-16">
      <HowItWorks />
    </main>
  </div>
);

export default HowItWorksPage;
