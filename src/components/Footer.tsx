import { Link } from "react-router-dom";
import skillbridgeLogo from "@/assets/skillbridge-logo.png";

const Footer = () => {
  return (
    <footer className="border-t border-border py-12 px-4 sm:px-6">
      <div className="container mx-auto max-w-4xl">
        <div className="flex flex-col sm:flex-row items-start justify-between gap-8">
          <div>
            <Link to="/">
              <img
                src={skillbridgeLogo}
                alt="SkillBridge"
                className="h-8 w-auto mb-3"
              />
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs">
              Building bridges, not barriers. Connecting young adults with paid internships that build real skills.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-x-16 gap-y-4 text-sm">
            <div>
              <h4 className="font-semibold text-foreground mb-3">Platform</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link to="/browse" className="hover:text-foreground transition-smooth">Browse Internships</Link></li>
                <li><Link to="/post-internship" className="hover:text-foreground transition-smooth">For Businesses</Link></li>
                <li><a href="/#how-it-works" className="hover:text-foreground transition-smooth">How It Works</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-3">Account</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link to="/signin" className="hover:text-foreground transition-smooth">Sign In</Link></li>
                <li><Link to="/signup" className="hover:text-foreground transition-smooth">Get Started</Link></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} SkillBridge. All rights reserved.</p>
          <p>WSI Impact League Finalist · Top 80 / 2,500+ · Built to close the opportunity gap</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
