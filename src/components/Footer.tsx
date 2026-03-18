import { Link } from "react-router-dom";
import skillbridgeLogo from "@/assets/skillbridge-logo.png";

const Footer = () => (
  <footer className="relative z-10 px-4 py-16 sm:px-6" style={{ borderTop: "1px solid rgba(148,163,184,0.14)" }} role="contentinfo">
    <div className="container mx-auto max-w-4xl">
      <div className="flex flex-col items-start justify-between gap-8 sm:flex-row">
        <div>
          <Link to="/"><img src={skillbridgeLogo} alt="SkillBridge logo" className="mb-4 h-8 w-auto opacity-90" width={128} height={32} loading="lazy" /></Link>
          <p className="max-w-xs text-small" style={{ fontFamily: "var(--font-body)", color: "rgba(226,232,240,0.76)" }}>
            Connecting young adults with paid internships that build real skills.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-x-16 gap-y-4 text-small sm:grid-cols-3">
          <div>
            <h4 className="mb-4 font-bold" style={{ fontSize: 14, fontFamily: "var(--font-body)", color: "rgba(248,250,252,0.92)" }}>Platform</h4>
            <ul className="space-y-3" style={{ color: "rgba(226,232,240,0.72)" }}>
              <li><Link to="/how-it-works" className="transition-colors hover:text-white">How It Works</Link></li>
              <li><Link to="/for-businesses" className="transition-colors hover:text-white">For Businesses</Link></li>
              <li><Link to="/resources" className="transition-colors hover:text-white">Resources</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 font-bold" style={{ fontSize: 14, fontFamily: "var(--font-body)", color: "rgba(248,250,252,0.92)" }}>Company</h4>
            <ul className="space-y-3" style={{ color: "rgba(226,232,240,0.72)" }}>
              <li><Link to="/mission" className="transition-colors hover:text-white">Mission</Link></li>
              <li><Link to="/contact" className="transition-colors hover:text-white">Contact</Link></li>
              <li><Link to="/terms" className="transition-colors hover:text-white">Terms of Service</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 font-bold" style={{ fontSize: 14, fontFamily: "var(--font-body)", color: "rgba(248,250,252,0.92)" }}>Account</h4>
            <ul className="space-y-3" style={{ color: "rgba(226,232,240,0.72)" }}>
              <li><Link to="/signin" className="transition-colors hover:text-white">Sign In</Link></li>
              <li><Link to="/signup" className="transition-colors hover:text-white">Sign Up</Link></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="mt-12 pt-8 text-caption" style={{ borderTop: "1px solid rgba(148,163,184,0.14)", color: "rgba(191,219,254,0.56)" }}>
        <p>&copy; {new Date().getFullYear()} SkillBridge. All rights reserved.</p>
      </div>
    </div>
  </footer>
);

export default Footer;
