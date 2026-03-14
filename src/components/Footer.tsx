import { Link } from "react-router-dom";
import skillbridgeLogo from "@/assets/skillbridge-logo.png";

const Footer = () => (
  <footer className="py-12 px-4 sm:px-6" style={{ borderTop: '1px solid rgba(0,0,0,0.06)' }}>
    <div className="container mx-auto max-w-4xl">
      <div className="flex flex-col sm:flex-row items-start justify-between gap-8">
        <div>
          <Link to="/"><img src={skillbridgeLogo} alt="SkillBridge" className="h-8 w-auto mb-3" /></Link>
          <p className="text-sm text-muted-foreground max-w-xs">Connecting young adults with paid internships that build real skills.</p>
        </div>
        <div className="grid grid-cols-2 gap-x-16 gap-y-4 text-sm">
          <div>
            <h4 className="font-semibold text-foreground mb-3">Platform</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li><Link to="/signup" className="hover:text-foreground transition-fast">Browse Internships</Link></li>
              <li><Link to="/signup" className="hover:text-foreground transition-fast">For Businesses</Link></li>
              <li><a href="/#how-it-works" className="hover:text-foreground transition-fast">How It Works</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-3">Company</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li><Link to="/mission" className="hover:text-foreground transition-fast">Mission</Link></li>
              <li><Link to="/terms" className="hover:text-foreground transition-fast">Terms of Service</Link></li>
              <li><Link to="/signin" className="hover:text-foreground transition-fast">Sign In</Link></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="mt-10 pt-6 text-xs text-muted-foreground" style={{ borderTop: '1px solid rgba(0,0,0,0.06)' }}>
        <p>&copy; {new Date().getFullYear()} SkillBridge. All rights reserved.</p>
      </div>
    </div>
  </footer>
);

export default Footer;
