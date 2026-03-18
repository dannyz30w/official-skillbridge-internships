import { Link } from "react-router-dom";
import skillbridgeLogo from "@/assets/skillbridge-logo.png";

const Footer = () => (
  <footer className="py-16 px-4 sm:px-6 relative z-10" style={{ borderTop: '1px solid rgba(8,47,73,0.08)' }} role="contentinfo">
    <div className="container mx-auto max-w-4xl">
      <div className="flex flex-col sm:flex-row items-start justify-between gap-8">
        <div>
          <Link to="/"><img src={skillbridgeLogo} alt="SkillBridge logo" className="h-8 w-auto mb-4 opacity-80" width={128} height={32} loading="lazy" /></Link>
          <p className="text-small max-w-xs" style={{ fontFamily: "var(--font-body)", color: 'rgba(8,47,73,0.72)' }}>Connecting young adults with paid internships that build real skills.</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-16 gap-y-4 text-small">
          <div>
            <h4 className="font-bold mb-4" style={{ fontSize: 14, fontFamily: "var(--font-body)", color: 'rgba(8,47,73,0.78)' }}>Platform</h4>
            <ul className="space-y-3" style={{ color: 'rgba(8,47,73,0.66)' }}>
              <li><Link to="/how-it-works" className="hover:text-sky-900 transition-colors">How It Works</Link></li>
              <li><Link to="/for-businesses" className="hover:text-sky-900 transition-colors">For Businesses</Link></li>
              <li><Link to="/resources" className="hover:text-sky-900 transition-colors">Resources</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4" style={{ fontSize: 14, fontFamily: "var(--font-body)", color: 'rgba(8,47,73,0.78)' }}>Company</h4>
            <ul className="space-y-3" style={{ color: 'rgba(8,47,73,0.66)' }}>
              <li><Link to="/mission" className="hover:text-sky-900 transition-colors">Mission</Link></li>
              <li><Link to="/contact" className="hover:text-sky-900 transition-colors">Contact</Link></li>
              <li><Link to="/terms" className="hover:text-sky-900 transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4" style={{ fontSize: 14, fontFamily: "var(--font-body)", color: 'rgba(8,47,73,0.78)' }}>Account</h4>
            <ul className="space-y-3" style={{ color: 'rgba(8,47,73,0.66)' }}>
              <li><Link to="/signin" className="hover:text-sky-900 transition-colors">Sign In</Link></li>
              <li><Link to="/signup" className="hover:text-sky-900 transition-colors">Sign Up</Link></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="mt-12 pt-8 text-caption" style={{ borderTop: '1px solid rgba(8,47,73,0.08)', color: 'rgba(8,47,73,0.54)' }}>
        <p>&copy; {new Date().getFullYear()} SkillBridge. All rights reserved.</p>
      </div>
    </div>
  </footer>
);

export default Footer;
