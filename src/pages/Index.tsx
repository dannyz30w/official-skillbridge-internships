import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import StatsBar from "@/components/StatsBar";
import FeaturedListings from "@/components/FeaturedListings";
import HowItWorks from "@/components/HowItWorks";
import ForBusinesses from "@/components/ForBusinesses";
import TestimonialsSection from "@/components/TestimonialsSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <StatsBar />
      <FeaturedListings />
      <HowItWorks />
      <ForBusinesses />
      <TestimonialsSection />
      <Footer />
    </div>
  );
};

export default Index;