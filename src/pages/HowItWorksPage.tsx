import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HowItWorks from "@/components/HowItWorks";
import SEOHead from "@/components/SEOHead";

const HowItWorksPage = () => (
  <div className="min-h-screen" style={{ background: '#F2F2F7' }}>
    <SEOHead title="How SkillBridge Works" description="See how SkillBridge works. Create a profile, browse paid internships, apply in one click, earn a skill certificate. Simple and free." path="/how-it-works" />
    <Navbar />
    <main className="pt-16">
      <HowItWorks />
    </main>
    <Footer />
  </div>
);

export default HowItWorksPage;
