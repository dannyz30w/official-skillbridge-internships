import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import skillbridgeLogo from "@/assets/skillbridge-logo.png";
import SEOHead from "@/components/SEOHead";

const ease = [0.16, 1, 0.3, 1] as const;
const inputCls = "w-full h-[48px] pl-4 pr-4 rounded-xl text-[16px] glass-input";

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
    <div className="min-h-screen flex flex-col" style={{ background: '#F2F2F7' }}>
      <SEOHead title="Reset Your Password, SkillBridge" description="Forgot your password? Enter your email and we will send you a reset link." path="/forgot-password" />
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.38, ease }} className="p-6">
        <Link to="/signin" className="inline-flex items-center gap-2 text-small font-medium transition-fast" style={{ color: 'rgba(60,60,67,0.6)' }}>
          <ArrowLeft className="h-4 w-4" /> Back to sign in
        </Link>
      </motion.div>
      <div className="flex-1 flex items-center justify-center px-4 pb-16">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.38, ease, delay: 0.04 }} className="w-full max-w-sm">
          <div className="text-center mb-8">
            <img src={skillbridgeLogo} alt="SkillBridge logo" className="h-10 w-auto mx-auto mb-6" width={160} height={40} />
            <h1 className="font-display text-h2 font-bold">Reset Password</h1>
            <p className="mt-2 text-body" style={{ color: 'rgba(60,60,67,0.6)' }}>Enter your email to receive a reset link.</p>
          </div>
          {sent ? (
            <div className="glass-card p-8 text-center">
              <p className="text-body" style={{ color: 'rgba(60,60,67,0.6)' }}>Check your inbox for a password reset link. If you do not see it, check your spam folder.</p>
              <Link to="/signin" className="btn-glass-primary inline-flex items-center justify-center h-12 px-8 mt-8">Back to Sign In</Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="fp-email" className="block text-small font-medium mb-2" style={{ color: 'rgba(60,60,67,0.6)' }}>Email</label>
                <input id="fp-email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" className={inputCls} />
              </div>
              <button type="submit" disabled={loading} className="w-full h-[48px] btn-glass-primary inline-flex items-center justify-center gap-2 disabled:opacity-50">
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
