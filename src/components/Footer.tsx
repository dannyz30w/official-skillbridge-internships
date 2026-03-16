import { Link } from "react-router-dom";
import skillbridgeLogo from "@/assets/skillbridge-logo.png";

const Footer = () => (
  <footer className="py-16 px-4 sm:px-6" style={{ borderTop: '1px solid rgba(0,0,0,0.06)' }} role="contentinfo">
    <div className="container mx-auto max-w-4xl">
      <div className="flex flex-col sm:flex-row items-start justify-between gap-8">
        <div>
          <Link to="/"><img src={skillbridgeLogo} alt="SkillBridge logo" className="h-8 w-auto mb-4" width={128} height={32} loading="lazy" /></Link>
          <p className="text-small max-w-xs" style={{ color: 'rgba(60,60,67,0.6)' }}>Connecting young adults with paid internships that build real skills.</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-16 gap-y-4 text-small">
          <div>
            <h4 className="font-display font-bold mb-4" style={{ fontSize: 14 }}>Platform</h4>
            <ul className="space-y-3" style={{ color: 'rgba(60,60,67,0.6)' }}>
              <li><Link to="/how-it-works" className="transition-fast hover:text-foreground">How It Works</Link></li>
              <li><Link to="/for-businesses" className="transition-fast hover:text-foreground">For Businesses</Link></li>
              <li><Link to="/resources" className="transition-fast hover:text-foreground">Resources</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-display font-bold mb-4" style={{ fontSize: 14 }}>Company</h4>
            <ul className="space-y-3" style={{ color: 'rgba(60,60,67,0.6)' }}>
              <li><Link to="/mission" className="transition-fast hover:text-foreground">Mission</Link></li>
              <li><Link to="/contact" className="transition-fast hover:text-foreground">Contact</Link></li>
              <li><Link to="/terms" className="transition-fast hover:text-foreground">Terms of Service</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-display font-bold mb-4" style={{ fontSize: 14 }}>Account</h4>
            <ul className="space-y-3" style={{ color: 'rgba(60,60,67,0.6)' }}>
              <li><Link to="/signin" className="transition-fast hover:text-foreground">Sign In</Link></li>
              <li><Link to="/signup" className="transition-fast hover:text-foreground">Sign Up</Link></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="mt-12 pt-8 text-caption" style={{ borderTop: '1px solid rgba(0,0,0,0.06)', color: 'rgba(60,60,67,0.4)' }}>
        <p>&copy; {new Date().getFullYear()} SkillBridge. All rights reserved.</p>
      </div>
    </div>
  </footer>
);

export default Footer;
