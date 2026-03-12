import { Link } from "react-router-dom";
import skillbridgeLogo from "@/assets/skillbridge-logo.png";

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2">
          <img
            src={skillbridgeLogo}
            alt="SkillBridge"
            className="h-9 w-auto"
          />
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link to="/browse" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-smooth">
            Browse Internships
          </Link>
          <a href="#how-it-works" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-smooth">
            How It Works
          </a>
          <Link to="/post-internship" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-smooth">
            For Businesses
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/signin" className="hidden sm:inline-flex text-sm font-medium text-muted-foreground hover:text-foreground transition-smooth">
            Sign In
          </Link>
          <Link to="/signup" className="inline-flex items-center justify-center rounded-lg bg-primary text-primary-foreground h-9 px-4 text-sm font-medium hover:bg-primary/90 transition-smooth will-change-transform">
            Get Started
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
