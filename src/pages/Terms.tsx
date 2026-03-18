import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";

const sections = [
  { title: "1. Acceptance of Terms", body: "By accessing or using SkillBridge you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms you are prohibited from using this platform." },
  { title: "2. Platform Description", body: "SkillBridge is an online marketplace connecting young adults aged 16 to 22 with businesses offering paid internships. SkillBridge facilitates connections between interns and businesses but is not a party to any internship agreement formed through the platform." },
  { title: "3. Eligibility", body: "Intern accounts require users to be between 16 and 22 years of age at the time of registration. Business accounts require users to represent a legitimate business entity. All accounts require a valid established email address that has been active for at least 30 days." },
  { title: "4. User Conduct", body: "Users agree not to post false, misleading, or fraudulent information. Businesses agree that all listed internships are compensated at or above the applicable minimum wage. Users agree not to use the platform for any unlawful purpose or in any way that could harm other users." },
  { title: "5. Internship Listings", body: "All listings submitted by businesses are subject to review and approval by SkillBridge administrators before becoming visible to interns. SkillBridge reserves the right to reject or remove any listing that violates platform guidelines or applicable law without notice." },
  { title: "6. Privacy and Data", body: "Intern profile information including phone numbers is only shared with businesses that have formally accepted the intern's application. SkillBridge does not sell, rent, or trade user data to third parties under any circumstances." },
  { title: "7. Intellectual Property", body: "All content, branding, design, and technology on SkillBridge is the property of SkillBridge. Users may not reproduce, redistribute, or repurpose any platform content without explicit written permission." },
  { title: "8. Limitation of Liability", body: "SkillBridge is not responsible for the conduct of any user, the quality or safety of any internship, or any outcome resulting from connections made through the platform. Use of the platform is at the user's own risk." },
  { title: "9. Account Termination", body: "SkillBridge reserves the right to suspend or permanently terminate any account that violates these terms at any time without prior notice." },
  { title: "10. Modifications to Terms", body: "SkillBridge may update these Terms of Service at any time. Continued use of the platform after changes are posted constitutes acceptance of the updated terms." },
  { title: "11. Contact", body: "For questions about these terms contact us at skillbridgeintern@gmail.com" },
];

const Terms = () => (
  <div className="min-h-screen ocean-page">
    <SEOHead title="Terms of Service, SkillBridge" description="SkillBridge Terms of Service. All internships are paid. All businesses are verified. Read our full platform policies." path="/terms" />
    <Navbar />

    <main className="pt-32 pb-24 px-4 sm:px-6">
      <motion.div
        className="mx-auto max-w-[720px]"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <h1 className="text-h1 font-bold mb-2 ocean-title" style={{ fontFamily: "var(--font-display)", fontStyle: "italic" }}>SkillBridge Terms of Service</h1>
        <p className="text-small mb-16 text-slate-700/80" style={{ fontFamily: "var(--font-body)" }}>Last updated: March 2026</p>

        <div className="space-y-12">
          {sections.map((s, i) => (
            <section key={i}>
              <h2 className="text-h4 font-bold mb-4 text-slate-900" style={{ fontFamily: "var(--font-body)" }}>{s.title}</h2>
              <p style={{ fontSize: 16, lineHeight: 1.7, color: 'rgba(8,47,73,0.74)', fontFamily: "var(--font-body)" }}>{s.body}</p>
            </section>
          ))}
        </div>

        <div className="mt-16 pt-8" style={{ borderTop: '1px solid rgba(8,47,73,0.08)' }}>
          <Link to="/signup" className="text-small font-semibold transition-fast" style={{ color: '#0f766e' }}>Back to Sign Up</Link>
        </div>
      </motion.div>
    </main>
  </div>
);

export default Terms;
