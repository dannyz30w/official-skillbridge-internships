import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import HowItWorks from "@/components/HowItWorks";
import ForBusinesses from "@/components/ForBusinesses";
import TestimonialsSection from "@/components/TestimonialsSection";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "SkillBridge",
  "url": "https://skillbridgeintern.org",
  "description": "SkillBridge connects young adults aged 16 to 22 with businesses offering paid internships.",
  "foundingDate": "2025",
  "sameAs": []
};

const Index = () => (
  <div className="min-h-screen">
    <SEOHead
      title="SkillBridge, Paid Internships for Young Adults Aged 16 to 22"
      description="SkillBridge connects motivated young adults aged 16 to 22 with local and remote businesses offering real paid internships. No experience required. Apply in minutes."
      path="/"
      keywords="paid internships for teens, internships for high school students, paid internships no experience, internships for 16 year olds, entry level internships, local internships for students"
      jsonLd={jsonLd}
    />
    <Navbar />
    <main>
      <HeroSection />
      <HowItWorks />
      <ForBusinesses />
      <TestimonialsSection />
    </main>
    <Footer />
  </div>
);

export default Index;
