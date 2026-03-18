import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import skillbridgeLogo from "@/assets/skillbridge-logo.png";
import SEOHead from "@/components/SEOHead";

const ease = [0.16, 1, 0.3, 1] as const;
const inputCls = "w-full h-[48px] px-4 rounded-xl text-[16px] bg-white/5 border border-white/10 text-white placeholder:text-slate-300/45 focus:border-indigo-400/50 focus:outline-none focus:ring-1 focus:ring-indigo-400/20 transition-all";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setLoading(false);
    if (error) { toast.error(error.message); return; }
    setSent(true);
    toast.success("If that email exists, a reset link has been sent.");
  };

  return (
    <div className="min-h-screen flex flex-col relative z-10" style={{ background: 'transparent' }}>
      <SEOHead title="Reset Your Password, SkillBridge" description="Forgot your password? Enter your email and we will send you a reset link." path="/forgot-password" />
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.38, ease }} className="p-6">
        <Link to="/signin" className="inline-flex items-center gap-2 text-small font-medium auth-copy-muted hover:text-white transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to sign in
        </Link>
      </motion.div>
      <div className="flex-1 flex items-center justify-center px-4 pb-16">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.38, ease, delay: 0.04 }} className="w-full max-w-sm">
          <div className="text-center mb-8">
            <img src={skillbridgeLogo} alt="SkillBridge logo" className="h-10 w-auto mx-auto mb-6" width={160} height={40} />
            <h1 className="text-h2 font-bold text-white" style={{ fontFamily: "var(--font-display)", fontStyle: "italic" }}>Reset Password</h1>
            <p className="mt-2 text-body auth-copy-muted" style={{ fontFamily: "var(--font-body)" }}>Enter your email to receive a reset link.</p>
          </div>
          {sent ? (
            <div className="liquid-glass-strong rounded-2xl p-8 text-center">
              <p className="text-body auth-copy-strong">Check your inbox for a password reset link. If you do not see it, check your spam folder.</p>
              <Link to="/signin" className="liquid-glass-strong rounded-full px-8 py-4 text-sm text-white font-medium hover:scale-[1.03] transition-transform inline-block mt-8">Back to Sign In</Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="fp-email" className="block text-small font-medium mb-2 auth-copy-muted">Email</label>
                <input id="fp-email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" className={inputCls} />
              </div>
              <button type="submit" disabled={loading} className="w-full h-[48px] liquid-glass-strong rounded-xl text-white font-semibold inline-flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform disabled:opacity-50">
                {loading ? "Sending..." : "Send Reset Link"}
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ForgotPassword;
