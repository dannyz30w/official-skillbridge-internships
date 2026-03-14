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
    <nav className="fixed top-0 left-0 right-0 z-50 liquid-glass" style={{ height: 64 }}>
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2">
          <img src={skillbridgeLogo} alt="SkillBridge" className="h-9 w-auto" />
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <a href="/#how-it-works" className="text-[13px] font-medium tracking-[0.01em] text-muted-foreground hover:text-foreground transition-fast">How It Works</a>
          <Link to="/mission" className="text-[13px] font-medium tracking-[0.01em] text-muted-foreground hover:text-foreground transition-fast">Mission</Link>
        </div>

        <div className="hidden md:flex items-center gap-3">
          {user && accountType ? (
            <>
              <Link to={`/${accountType}`} className="text-[13px] font-medium text-muted-foreground hover:text-foreground transition-fast">Dashboard</Link>
              <button onClick={signOut}
                className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-foreground/5 h-9 px-3 text-[13px] font-medium text-muted-foreground hover:text-foreground hover:bg-foreground/10 transition-fast btn-press">
                <LogOut className="h-3.5 w-3.5" /> Sign Out
              </button>
            </>
          ) : (
            <>
              <Link to="/signin" className="text-[13px] font-medium text-muted-foreground hover:text-foreground transition-fast">Sign In</Link>
              <Link to="/signup" className="inline-flex items-center justify-center rounded-xl bg-primary text-primary-foreground h-9 px-4 text-[13px] font-semibold hover:opacity-90 transition-fast btn-press">Sign Up</Link>
            </>
          )}
        </div>

        <button className="md:hidden inline-flex items-center justify-center h-9 w-9 rounded-xl hover:bg-foreground/5 transition-fast"
          onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </div>

      {mobileOpen && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}
          className="md:hidden liquid-glass px-4 py-4 space-y-3" style={{ borderTop: '1px solid rgba(0,0,0,0.06)' }}>
          <a href="/#how-it-works" onClick={() => setMobileOpen(false)} className="block text-sm font-medium text-muted-foreground hover:text-foreground py-2">How It Works</a>
          <Link to="/mission" onClick={() => setMobileOpen(false)} className="block text-sm font-medium text-muted-foreground hover:text-foreground py-2">Mission</Link>
          <div className="pt-2" style={{ borderTop: '1px solid rgba(0,0,0,0.06)' }}>
            {user && accountType ? (
              <div className="flex gap-3">
                <Link to={`/${accountType}`} onClick={() => setMobileOpen(false)} className="flex-1 inline-flex items-center justify-center rounded-xl bg-foreground/5 h-10 text-sm font-medium btn-press">Dashboard</Link>
                <button onClick={() => { signOut(); setMobileOpen(false); }} className="flex-1 inline-flex items-center justify-center rounded-xl bg-foreground/5 h-10 text-sm font-medium gap-1.5 btn-press"><LogOut className="h-3.5 w-3.5" /> Sign Out</button>
              </div>
            ) : (
              <div className="flex gap-3">
                <Link to="/signin" onClick={() => setMobileOpen(false)} className="flex-1 inline-flex items-center justify-center rounded-xl bg-foreground/5 h-10 text-sm font-medium btn-press">Sign In</Link>
                <Link to="/signup" onClick={() => setMobileOpen(false)} className="flex-1 inline-flex items-center justify-center rounded-xl bg-primary text-primary-foreground h-10 text-sm font-semibold btn-press">Sign Up</Link>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar;
