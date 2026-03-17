import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import TestimonialsSection from "@/components/TestimonialsSection";

const TestimonialsPage = () => (
  <div className="min-h-screen" style={{ background: '#F2F2F7' }}>
    <SEOHead title="Testimonials, SkillBridge" description="Real stories from interns and businesses who found each other through SkillBridge and built something that mattered." path="/testimonials" />
    <Navbar />
    <main className="pt-32 pb-24">
      <TestimonialsSection />
    </main>
    <Footer />
  </div>
);

export default TestimonialsPage;
