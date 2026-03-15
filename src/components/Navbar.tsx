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
    <nav className="fixed top-0 left-0 right-0 z-50 liquid-glass" style={{ height: 64 }} aria-label="Main navigation">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2">
          <img src={skillbridgeLogo} alt="SkillBridge logo" className="h-9 w-auto" width={144} height={36} />
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <a href="/#how-it-works" className="text-small font-medium transition-fast" style={{ color: 'rgba(60,60,67,0.6)' }}>How It Works</a>
          <Link to="/mission" className="text-small font-medium transition-fast" style={{ color: 'rgba(60,60,67,0.6)' }}>Mission</Link>
          <Link to="/for-businesses" className="text-small font-medium transition-fast" style={{ color: 'rgba(60,60,67,0.6)' }}>For Businesses</Link>
        </div>

        <div className="hidden md:flex items-center gap-3">
          {user && accountType ? (
            <>
              <Link to={`/${accountType}`} className="text-small font-medium transition-fast" style={{ color: 'rgba(60,60,67,0.6)' }}>Dashboard</Link>
              <button onClick={signOut} className="btn-glass-secondary inline-flex items-center justify-center gap-1.5 h-9 px-4 text-small" style={{ padding: '8px 16px' }}>
                <LogOut className="h-3.5 w-3.5" /> Sign Out
              </button>
            </>
          ) : (
            <>
              <Link to="/signin" className="text-small font-medium transition-fast" style={{ color: 'rgba(60,60,67,0.6)' }}>Sign In</Link>
              <Link to="/signup" className="btn-glass-primary inline-flex items-center justify-center h-9 px-4 text-small" style={{ padding: '8px 20px' }}>Sign Up</Link>
            </>
          )}
        </div>

        <button className="md:hidden inline-flex items-center justify-center h-9 w-9 rounded-xl transition-fast" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu">
          {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </div>

      {mobileOpen && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}
          className="md:hidden px-4 py-4 space-y-3" style={{ background: 'rgba(242,242,247,0.95)', backdropFilter: 'blur(24px)', borderTop: '1px solid rgba(255,255,255,0.5)' }}>
          <a href="/#how-it-works" onClick={() => setMobileOpen(false)} className="block text-small font-medium py-2" style={{ color: 'rgba(60,60,67,0.6)' }}>How It Works</a>
          <Link to="/mission" onClick={() => setMobileOpen(false)} className="block text-small font-medium py-2" style={{ color: 'rgba(60,60,67,0.6)' }}>Mission</Link>
          <Link to="/for-businesses" onClick={() => setMobileOpen(false)} className="block text-small font-medium py-2" style={{ color: 'rgba(60,60,67,0.6)' }}>For Businesses</Link>
          <div className="pt-2" style={{ borderTop: '1px solid rgba(255,255,255,0.5)' }}>
            {user && accountType ? (
              <div className="flex gap-3">
                <Link to={`/${accountType}`} onClick={() => setMobileOpen(false)} className="flex-1 btn-glass-secondary inline-flex items-center justify-center h-10 text-small font-medium">Dashboard</Link>
                <button onClick={() => { signOut(); setMobileOpen(false); }} className="flex-1 btn-glass-secondary inline-flex items-center justify-center h-10 text-small font-medium gap-1.5"><LogOut className="h-3.5 w-3.5" /> Sign Out</button>
              </div>
            ) : (
              <div className="flex gap-3">
                <Link to="/signin" onClick={() => setMobileOpen(false)} className="flex-1 btn-glass-secondary inline-flex items-center justify-center h-10 text-small font-medium">Sign In</Link>
                <Link to="/signup" onClick={() => setMobileOpen(false)} className="flex-1 btn-glass-primary inline-flex items-center justify-center h-10 text-small font-semibold">Sign Up</Link>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar;
