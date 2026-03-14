import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import StatsBar from "@/components/StatsBar";
import HowItWorks from "@/components/HowItWorks";
import ForBusinesses from "@/components/ForBusinesses";
import TestimonialsSection from "@/components/TestimonialsSection";
import Footer from "@/components/Footer";

const Index = () => (
  <div className="min-h-screen">
    <Navbar />
    <HeroSection />
    <StatsBar />
    <HowItWorks />
    <ForBusinesses />
    <TestimonialsSection />
    <Footer />
  </div>
);

export default Index;
