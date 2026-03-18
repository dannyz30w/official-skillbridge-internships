import { Link } from "react-router-dom";
import skillbridgeLogo from "@/assets/skillbridge-logo.png";

const Footer = () => (
  <footer className="py-16 px-4 sm:px-6 relative z-10" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }} role="contentinfo">
    <div className="container mx-auto max-w-4xl">
      <div className="flex flex-col sm:flex-row items-start justify-between gap-8">
        <div>
          <Link to="/"><img src={skillbridgeLogo} alt="SkillBridge logo" className="h-8 w-auto mb-4 opacity-60" width={128} height={32} loading="lazy" /></Link>
          <p className="text-small max-w-xs text-white/40" style={{ fontFamily: "var(--font-body)" }}>Connecting young adults with paid internships that build real skills.</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-16 gap-y-4 text-small">
          <div>
            <h4 className="font-bold mb-4 text-white/60" style={{ fontSize: 14, fontFamily: "var(--font-body)" }}>Platform</h4>
            <ul className="space-y-3 text-white/40">
              <li><Link to="/how-it-works" className="hover:text-white/70 transition-colors">How It Works</Link></li>
              <li><Link to="/for-businesses" className="hover:text-white/70 transition-colors">For Businesses</Link></li>
              <li><Link to="/resources" className="hover:text-white/70 transition-colors">Resources</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-white/60" style={{ fontSize: 14, fontFamily: "var(--font-body)" }}>Company</h4>
            <ul className="space-y-3 text-white/40">
              <li><Link to="/mission" className="hover:text-white/70 transition-colors">Mission</Link></li>
              <li><Link to="/contact" className="hover:text-white/70 transition-colors">Contact</Link></li>
              <li><Link to="/terms" className="hover:text-white/70 transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-white/60" style={{ fontSize: 14, fontFamily: "var(--font-body)" }}>Account</h4>
            <ul className="space-y-3 text-white/40">
              <li><Link to="/signin" className="hover:text-white/70 transition-colors">Sign In</Link></li>
              <li><Link to="/signup" className="hover:text-white/70 transition-colors">Sign Up</Link></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="mt-12 pt-8 text-caption text-white/25" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <p>&copy; {new Date().getFullYear()} SkillBridge. All rights reserved.</p>
      </div>
    </div>
  </footer>
);

export default Footer;
