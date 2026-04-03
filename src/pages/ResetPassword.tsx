import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import skillbridgeLogo from "@/assets/skillbridge-logo.png";
import SEOHead from "@/components/SEOHead";

const inputCls = "ocean-input w-full h-[48px] px-4 rounded-xl text-[16px] focus:border-indigo-400/40 focus:outline-none focus:ring-1 focus:ring-indigo-400/20 transition-all";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isRecovery, setIsRecovery] = useState(false);

  useEffect(() => {
    const hash = window.location.hash;
    if (hash.includes('type=recovery')) setIsRecovery(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 10) { toast.error("Password must be at least 10 characters."); return; }
    if (password !== confirmPassword) { toast.error("Passwords do not match."); return; }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Password updated successfully. Please sign in.");
    navigate("/signin");
  };

  if (!isRecovery) {
    return (
      <div className="min-h-screen flex flex-col" style={{ background: 'transparent' }}>
        <SEOHead title="Reset Password" description="Reset your SkillBridge password." path="/reset-password" noIndex />
        <div className="p-6">
          <Link to="/signin" className="inline-flex items-center gap-2 text-small font-medium auth-copy-muted hover:text-white transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back to sign in
          </Link>
        </div>
        <div className="flex-1 flex items-center justify-center px-4 pb-16">
          <div className="w-full max-w-sm text-center">
            <img src={skillbridgeLogo} alt="SkillBridge logo" className="h-10 w-auto mx-auto mb-6" width={160} height={40} />
            <h1 className="text-h2 font-bold text-white" style={{ fontFamily: "var(--font-display)", fontStyle: "italic" }}>Password Reset</h1>
            <p className="text-body mt-4 auth-copy-muted" style={{ fontFamily: "var(--font-body)" }}>
              Use the link from your email to reset your password, or contact support at skillbridgeintern@gmail.com.
            </p>
            <Link to="/signin" className="liquid-glass-strong rounded-full px-8 py-4 text-sm text-white font-medium hover:scale-[1.03] transition-transform inline-block mt-8">Back to Sign In</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'transparent' }}>
      <SEOHead title="Set New Password" description="Set your new SkillBridge password." path="/reset-password" noIndex />
      <div className="p-6">
        <Link to="/signin" className="inline-flex items-center gap-2 text-small font-medium auth-copy-muted hover:text-white transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to sign in
        </Link>
      </div>
      <div className="flex-1 flex items-center justify-center px-4 pb-16">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <img src={skillbridgeLogo} alt="SkillBridge logo" className="h-10 w-auto mx-auto mb-6" width={160} height={40} />
            <h1 className="text-h2 font-bold text-white" style={{ fontFamily: "var(--font-display)", fontStyle: "italic" }}>Set New Password</h1>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="rp-pw" className="block text-small font-medium mb-2 auth-copy-muted">New Password</label>
              <input id="rp-pw" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Min. 10 characters" className={inputCls} />
            </div>
            <div>
              <label htmlFor="rp-cpw" className="block text-small font-medium mb-2 auth-copy-muted">Confirm Password</label>
              <input id="rp-cpw" type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Confirm" className={inputCls} />
            </div>
            <button type="submit" disabled={loading} className="w-full h-[48px] liquid-glass-strong rounded-xl text-white font-semibold inline-flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform disabled:opacity-50">
              {loading ? "Updating..." : "Update Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;