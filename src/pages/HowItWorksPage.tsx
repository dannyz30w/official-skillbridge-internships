import Navbar from "@/components/Navbar";
import SEOHead from "@/components/SEOHead";

const HowItWorksPage = () => (
  <div className="min-h-screen" style={{ background: 'transparent' }}>
    <SEOHead title="How SkillBridge Works" description="See how SkillBridge works. Create a profile, browse paid internships, apply in one click, earn a skill certificate. Simple and free." path="/how-it-works" />
    <Navbar />
    <main className="pt-16">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-h1 font-bold mb-8 ocean-title">How SkillBridge Works</h1>
        <p className="text-body ocean-copy mb-8">Coming soon. Learn how to get started with SkillBridge.</p>
      </div>
    </main>
  </div>
);

export default HowItWorksPage;
