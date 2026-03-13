import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { LogOut, Menu, X } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import skillbridgeLogo from "@/assets/skillbridge-logo.png";

const Navbar = () => {
  const { user, accountType, signOut } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 liquid-glass border-b border-border/20">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2">
          <img src={skillbridgeLogo} alt="SkillBridge" className="h-9 w-auto" />
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <a href="#how-it-works" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-smooth">How It Works</a>
          <a href="#mission" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-smooth">Mission</a>
        </div>

        <div className="hidden md:flex items-center gap-3">
          {user && accountType ? (
            <>
              <Link to={`/${accountType}`} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-smooth">Dashboard</Link>
              <button onClick={signOut}
                className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-border/50 bg-background/50 text-muted-foreground h-9 px-3 text-sm font-medium hover:text-foreground transition-smooth">
                <LogOut className="h-3.5 w-3.5" /> Sign Out
              </button>
            </>
          ) : (
            <>
              <Link to="/signin" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-smooth">Sign In</Link>
              <Link to="/signup" className="inline-flex items-center justify-center rounded-xl bg-primary text-primary-foreground h-9 px-4 text-sm font-medium hover:bg-primary/90 transition-smooth">Sign Up</Link>
            </>
          )}
        </div>

        <button className="md:hidden inline-flex items-center justify-center h-9 w-9 rounded-xl border border-border/50 hover:bg-accent transition-smooth"
          onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </div>

      {mobileOpen && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}
          className="md:hidden border-t border-border/20 liquid-glass px-4 py-4 space-y-3">
          <a href="#how-it-works" onClick={() => setMobileOpen(false)} className="block text-sm font-medium text-muted-foreground hover:text-foreground py-2">How It Works</a>
          <a href="#mission" onClick={() => setMobileOpen(false)} className="block text-sm font-medium text-muted-foreground hover:text-foreground py-2">Mission</a>
          <div className="pt-2 border-t border-border/20">
            {user && accountType ? (
              <div className="flex gap-3">
                <Link to={`/${accountType}`} onClick={() => setMobileOpen(false)} className="flex-1 inline-flex items-center justify-center rounded-xl border border-border/50 bg-background/50 h-10 text-sm font-medium">Dashboard</Link>
                <button onClick={() => { signOut(); setMobileOpen(false); }} className="flex-1 inline-flex items-center justify-center rounded-xl border border-border/50 bg-background/50 h-10 text-sm font-medium gap-1.5"><LogOut className="h-3.5 w-3.5" /> Sign Out</button>
              </div>
            ) : (
              <div className="flex gap-3">
                <Link to="/signin" onClick={() => setMobileOpen(false)} className="flex-1 inline-flex items-center justify-center rounded-xl border border-border/50 bg-background/50 h-10 text-sm font-medium">Sign In</Link>
                <Link to="/signup" onClick={() => setMobileOpen(false)} className="flex-1 inline-flex items-center justify-center rounded-xl bg-primary text-primary-foreground h-10 text-sm font-medium">Sign Up</Link>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar;
