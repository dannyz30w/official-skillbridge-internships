import { Link } from "react-router-dom";
import skillbridgeLogo from "@/assets/skillbridge-logo.png";

const LandingFooter = () => (
  <footer className="mt-24 pt-8 px-8 pb-8" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }} role="contentinfo">
    <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-2">
        <img src={skillbridgeLogo} alt="SkillBridge" className="h-6 w-auto opacity-60" width={96} height={24} loading="lazy" />
        <span className="text-xs text-white/30" style={{ fontFamily: "var(--font-body)" }}>&copy; 2026 SkillBridge.</span>
      </div>
      <div className="flex gap-6">
        {[
          { label: "Terms", to: "/terms" },
          { label: "Contact", to: "/contact" },
          { label: "Mission", to: "/mission" },
        ].map(l => (
          <Link key={l.to} to={l.to} className="text-xs text-white/30 hover:text-white/60 transition-colors" style={{ fontFamily: "var(--font-body)" }}>{l.label}</Link>
        ))}
      </div>
    </div>
  </footer>
);

export default LandingFooter;
