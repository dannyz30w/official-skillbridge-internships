import { useState, useEffect, useRef, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Mail, Lock, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import skillbridgeLogo from "@/assets/skillbridge-logo.png";
import SEOHead from "@/components/SEOHead";

const ease = [0.16, 1, 0.3, 1] as const;
const inputCls = "w-full h-[48px] pl-12 pr-4 rounded-xl text-[16px] bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:border-indigo-400/50 focus:outline-none focus:ring-1 focus:ring-indigo-400/20 transition-all";

const LOCKOUT_SCHEDULE: Record<number, number> = {
  3: 60, 4: 180, 5: 600, 6: 1800, 7: 3600, 8: 10800, 9: 36000,
};

const db = supabase as any;

const SignIn = () => {
  const navigate = useNavigate();
  const { user, accountType } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [lockoutEnd, setLockoutEnd] = useState<number | null>(null);
  const [countdown, setCountdown] = useState("");
  const timerRef = useRef<ReturnType<typeof setInterval>>();

  useEffect(() => {
    if (user && accountType) navigate(`/${accountType}`, { replace: true });
  }, [user, accountType, navigate]);

  useEffect(() => {
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  const formatTime = (secs: number) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    if (h > 0) return `${h}h ${m}m ${s}s`;
    if (m > 0) return `${m}m ${s}s`;
    return `${s}s`;
  };

  const startCountdown = useCallback((endTime: number) => {
    setLockoutEnd(endTime);
    if (timerRef.current) clearInterval(timerRef.current);
    const update = () => {
      const remaining = Math.max(0, Math.ceil((endTime - Date.now()) / 1000));
      if (remaining <= 0) {
        setLockoutEnd(null); setCountdown(""); setError("");
        if (timerRef.current) clearInterval(timerRef.current);
      } else { setCountdown(formatTime(remaining)); }
    };
    update();
    timerRef.current = setInterval(update, 1000);
  }, []);

  const checkLockout = async (emailAddr: string) => {
    const { data } = await db.from('login_attempts').select('*').eq('email', emailAddr).maybeSingle();
    if (data?.locked_until) {
      const lockEnd = new Date(data.locked_until).getTime();
      if (lockEnd > Date.now()) { startCountdown(lockEnd); return true; }
    }
    return false;
  };

  const recordFailedAttempt = async (emailAddr: string) => {
    const { data } = await db.from('login_attempts').select('*').eq('email', emailAddr).maybeSingle();
    const count = (data?.failed_count || 0) + 1;
    const lockoutSecs = count >= 10 ? 86400 : LOCKOUT_SCHEDULE[count];
    const lockedUntil = lockoutSecs ? new Date(Date.now() + lockoutSecs * 1000).toISOString() : null;
    if (data) {
      await db.from('login_attempts').update({ failed_count: count, locked_until: lockedUntil, last_attempt: new Date().toISOString() }).eq('email', emailAddr);
    } else {
      await db.from('login_attempts').insert({ email: emailAddr, failed_count: count, locked_until: lockedUntil });
    }
    if (lockedUntil) startCountdown(new Date(lockedUntil).getTime());
    return count;
  };

  const clearAttempts = async (emailAddr: string) => {
    await db.from('login_attempts').update({ failed_count: 0, locked_until: null }).eq('email', emailAddr);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { setError("Please fill in all fields."); return; }
    if (lockoutEnd && lockoutEnd > Date.now()) return;
    const locked = await checkLockout(email);
    if (locked) return;
    setError(""); setLoading(true);
    const { error: err } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (err) {
      const count = await recordFailedAttempt(email);
      if (count >= 3 && LOCKOUT_SCHEDULE[count]) {
        setError(`Too many failed attempts. Please try again in ${countdown || formatTime(LOCKOUT_SCHEDULE[count])}.`);
      } else if (count >= 10) {
        setError(`Too many failed attempts. Please try again in ${countdown || '24h'}.`);
      } else { setError(err.message); }
      return;
    }
    await clearAttempts(email);
    toast.success("Welcome back!");
  };

  const isLocked = lockoutEnd !== null && lockoutEnd > Date.now();

  return (
    <div className="min-h-screen flex flex-col relative z-10" style={{ background: 'transparent' }}>
      <SEOHead title="Sign In to SkillBridge" description="Sign in to SkillBridge to browse paid internships, manage applications, and connect with verified businesses." path="/signin" />
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.38, ease }} className="p-6">
        <Link to="/" className="inline-flex items-center gap-2 text-small font-medium text-white/50 hover:text-white transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to home
        </Link>
      </motion.div>
      <div className="flex-1 flex items-center justify-center px-4 pb-16">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.38, ease, delay: 0.04 }} className="w-full max-w-sm">
          <div className="text-center mb-8">
            <img src={skillbridgeLogo} alt="SkillBridge logo" className="h-10 w-auto mx-auto mb-6" width={160} height={40} loading="eager" />
            <h1 className="text-h2 font-bold text-white" style={{ fontFamily: "var(--font-display)", fontStyle: "italic" }}>Welcome back</h1>
            <p className="mt-2 text-body text-white/50" style={{ fontFamily: "var(--font-body)" }}>Sign in to your SkillBridge account</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="signin-email" className="block text-small font-medium mb-2 text-white/50">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none text-white/30" />
                <input id="signin-email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" className={inputCls} />
              </div>
            </div>
            <div>
              <label htmlFor="signin-password" className="block text-small font-medium mb-2 text-white/50">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none text-white/30" />
                <input id="signin-password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Your password" className={inputCls} />
              </div>
            </div>
            <div className="flex justify-end">
              <Link to="/forgot-password" className="text-small font-medium text-indigo-400 hover:text-indigo-300 transition-colors">Forgot your password?</Link>
            </div>
            <AnimatePresence mode="wait">
              {(error || isLocked) && (
                <motion.p key="error" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} className="text-small" style={{ color: '#FF6B6B' }}>
                  {isLocked ? `Too many failed attempts. Please try again in ${countdown}.` : error}
                </motion.p>
              )}
            </AnimatePresence>
            <button type="submit" disabled={loading || isLocked}
              className="w-full h-[48px] rounded-xl text-body font-semibold inline-flex items-center justify-center gap-2 liquid-glass-strong text-white hover:scale-[1.02] transition-transform disabled:opacity-50">
              {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Signing in...</> : "Sign In"}
            </button>
          </form>
          <p className="mt-6 text-center text-small text-white/40">
            Don't have an account? <Link to="/signup" className="font-semibold text-indigo-400 hover:text-indigo-300 transition-colors">Sign Up</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default SignIn;
