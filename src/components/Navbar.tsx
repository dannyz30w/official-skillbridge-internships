import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { LogOut, Menu, X } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import skillbridgeLogo from "@/assets/skillbridge-logo.png";

const Navbar = () => {
  const { user, signOut } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2">
          <img src={skillbridgeLogo} alt="SkillBridge" className="h-9 w-auto" />
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

        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              <span className="text-sm text-muted-foreground truncate max-w-[160px]">
                {user.user_metadata?.full_name || user.email}
              </span>
              <button
                onClick={signOut}
                className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-input bg-background text-muted-foreground h-9 px-3 text-sm font-medium hover:text-foreground hover:border-ring transition-smooth"
              >
                <LogOut className="h-3.5 w-3.5" /> Sign Out
              </button>
            </>
          ) : (
            <>
              <Link to="/signin" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-smooth">
                Sign In
              </Link>
              <Link to="/signup" className="inline-flex items-center justify-center rounded-lg bg-primary text-primary-foreground h-9 px-4 text-sm font-medium hover:bg-primary/90 transition-smooth will-change-transform">
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden inline-flex items-center justify-center h-9 w-9 rounded-lg border border-input hover:bg-accent transition-smooth"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
          className="md:hidden border-t border-border bg-background px-4 py-4 space-y-3"
        >
          <Link to="/browse" onClick={() => setMobileOpen(false)} className="block text-sm font-medium text-muted-foreground hover:text-foreground transition-smooth py-2">
            Browse Internships
          </Link>
          <a href="#how-it-works" onClick={() => setMobileOpen(false)} className="block text-sm font-medium text-muted-foreground hover:text-foreground transition-smooth py-2">
            How It Works
          </a>
          <Link to="/post-internship" onClick={() => setMobileOpen(false)} className="block text-sm font-medium text-muted-foreground hover:text-foreground transition-smooth py-2">
            For Businesses
          </Link>
          <div className="pt-2 border-t border-border">
            {user ? (
              <button
                onClick={() => { signOut(); setMobileOpen(false); }}
                className="w-full inline-flex items-center justify-center gap-1.5 rounded-lg border border-input bg-background text-muted-foreground h-10 text-sm font-medium hover:text-foreground transition-smooth"
              >
                <LogOut className="h-3.5 w-3.5" /> Sign Out
              </button>
            ) : (
              <div className="flex gap-3">
                <Link to="/signin" onClick={() => setMobileOpen(false)} className="flex-1 inline-flex items-center justify-center rounded-lg border border-input bg-background text-muted-foreground h-10 text-sm font-medium hover:text-foreground transition-smooth">
                  Sign In
                </Link>
                <Link to="/signup" onClick={() => setMobileOpen(false)} className="flex-1 inline-flex items-center justify-center rounded-lg bg-primary text-primary-foreground h-10 text-sm font-medium hover:bg-primary/90 transition-smooth">
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar;
