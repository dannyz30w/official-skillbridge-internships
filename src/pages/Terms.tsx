import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import skillbridgeLogo from "@/assets/skillbridge-logo.png";

const sections = [
  { title: "1. Acceptance of Terms", body: "By accessing or using SkillBridge, users agree to be bound by these Terms of Service and all applicable laws and regulations." },
  { title: "2. Platform Description", body: "SkillBridge is an online marketplace connecting young adults aged 16 to 22 with businesses offering paid internships. SkillBridge facilitates connections but is not a party to any internship agreement between interns and businesses." },
  { title: "3. Eligibility", body: "Intern accounts require users to be at least 16 years of age. Business accounts require users to represent a legitimate business entity. All accounts require a valid established email address." },
  { title: "4. User Conduct", body: "Users agree not to post false, misleading, or fraudulent information. Businesses agree that all listed internships are paid at or above applicable minimum wage. Users agree not to use the platform for any unlawful purpose." },
  { title: "5. Internship Listings", body: "All listings are subject to review and approval by SkillBridge administrators. SkillBridge reserves the right to reject or remove any listing that violates platform guidelines or applicable law." },
  { title: "6. Privacy", body: "Intern profile information including phone numbers is shared only with businesses that have accepted the intern's application. SkillBridge does not sell user data to third parties." },
  { title: "7. Intellectual Property", body: "All content, branding, and technology on SkillBridge is owned by SkillBridge. Users may not reproduce or redistribute platform content without written permission." },
  { title: "8. Limitation of Liability", body: "SkillBridge is not responsible for the conduct of any user, the quality of any internship, or any outcomes resulting from connections made through the platform." },
  { title: "9. Termination", body: "SkillBridge reserves the right to suspend or terminate any account that violates these terms at any time without notice." },
  { title: "10. Changes to Terms", body: "SkillBridge may update these terms at any time. Continued use of the platform constitutes acceptance of updated terms." },
  { title: "11. Contact", body: "For questions about these terms, contact us at legal@skillbridge.app" },
];

const Terms = () => (
  <div className="min-h-screen bg-background">
    <nav className="sticky top-0 z-50 liquid-glass">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2">
          <img src={skillbridgeLogo} alt="SkillBridge" className="h-9 w-auto" />
        </Link>
        <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-fast">
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>
      </div>
    </nav>

    <main className="py-16 sm:py-24 px-4 sm:px-6">
      <motion.div
        className="mx-auto max-w-[680px]"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        <h1 className="font-display text-3xl font-bold tracking-tight mb-2">Terms of Service</h1>
        <p className="text-sm text-muted-foreground mb-12">Last updated: March 2026</p>

        <div className="space-y-10">
          {sections.map((s, i) => (
            <section key={i}>
              <h2 className="font-display text-lg font-bold mb-3">{s.title}</h2>
              <p className="text-[15px] leading-[1.7] text-foreground/80">{s.body}</p>
            </section>
          ))}
        </div>
      </motion.div>
    </main>
  </div>
);

export default Terms;
