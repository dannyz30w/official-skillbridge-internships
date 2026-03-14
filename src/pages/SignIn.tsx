import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Mail, Lock, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import skillbridgeLogo from "@/assets/skillbridge-logo.png";

const ease = [0.16, 1, 0.3, 1] as const;
const inputCls = "w-full h-[44px] pl-10 pr-4 rounded-xl text-[15px] text-foreground placeholder:text-muted-foreground/50 glass-input";

const SignIn = () => {
  const navigate = useNavigate();
  const { user, accountType } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user && accountType) navigate(`/${accountType}`, { replace: true });
  }, [user, accountType, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { setError("Please fill in all fields."); return; }
    setError("");
    setLoading(true);
    const { error: err } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (err) { setError(err.message); return; }
    toast.success("Welcome back!");
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease }} className="p-4 sm:p-6">
        <Link to="/" className="inline-flex items-center gap-2 text-[13px] font-medium text-muted-foreground hover:text-foreground transition-fast">
          <ArrowLeft className="h-4 w-4" /> Back to home
        </Link>
      </motion.div>
      <div className="flex-1 flex items-center justify-center px-4 pb-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease }} className="w-full max-w-sm">
          <div className="text-center mb-8">
            <img src={skillbridgeLogo} alt="SkillBridge" className="h-10 w-auto mx-auto mb-6" />
            <h1 className="font-display text-2xl font-bold tracking-tight">Welcome back</h1>
            <p className="mt-2 text-[15px] text-muted-foreground">Sign in to your SkillBridge account</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[13px] font-medium tracking-[0.01em] text-muted-foreground mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" className={inputCls} />
              </div>
            </div>
            <div>
              <label className="block text-[13px] font-medium tracking-[0.01em] text-muted-foreground mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" className={inputCls} />
              </div>
            </div>
            <AnimatePresence mode="wait">
              {error && <motion.p key="error" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} className="text-sm text-destructive">{error}</motion.p>}
            </AnimatePresence>
            <motion.button type="submit" disabled={loading} whileTap={{ scale: 0.97 }}
              className="w-full h-[44px] rounded-xl bg-primary text-primary-foreground text-[15px] font-semibold hover:opacity-92 disabled:opacity-50 inline-flex items-center justify-center gap-2 btn-press"
              style={{ transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)' }}>
              {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Signing in...</> : "Sign In"}
            </motion.button>
          </form>
          <div className="mt-4 text-center">
            <Link to="/reset-password" className="text-sm text-muted-foreground hover:text-primary transition-fast">Forgot password?</Link>
          </div>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Don't have an account? <Link to="/signup" className="font-medium text-primary hover:text-primary/80 transition-fast">Sign Up</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default SignIn;
