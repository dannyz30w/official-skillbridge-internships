import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, AlertCircle } from "lucide-react";
import skillbridgeLogo from "@/assets/skillbridge-logo.png";
import SEOHead from "@/components/SEOHead";

const ease = [0.16, 1, 0.3, 1] as const;

const ForgotPassword = () => {
  return (
    <div className="min-h-screen flex flex-col relative z-10" style={{ background: 'transparent' }}>
      <SEOHead title="Reset Your Password, SkillBridge" description="Password reset is temporarily unavailable. Please contact support." path="/forgot-password" noIndex />
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.38, ease }} className="p-6">
        <Link to="/signin" className="inline-flex items-center gap-2 text-small font-medium auth-copy-muted hover:text-white transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to sign in
        </Link>
      </motion.div>
      <div className="flex-1 flex items-center justify-center px-4 pb-16">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.38, ease, delay: 0.04 }} className="w-full max-w-sm">
          <div className="text-center mb-8">
            <img src={skillbridgeLogo} alt="SkillBridge logo" className="h-10 w-auto mx-auto mb-6" width={160} height={40} />
            <h1 className="text-h2 font-bold text-white" style={{ fontFamily: "var(--font-display)", fontStyle: "italic" }}>Password Reset</h1>
          </div>
          <div className="liquid-glass-strong rounded-2xl p-8 text-center space-y-4">
            <AlertCircle className="h-12 w-12 mx-auto text-yellow-400" />
            <p className="text-body auth-copy-strong">Password reset is temporarily unavailable.</p>
            <p className="text-small auth-copy-muted">We're upgrading our email system. Please contact support at skillbridgeinternships@gmail.com if you need to reset your password.</p>
            <Link to="/signin" className="liquid-glass-strong rounded-full px-8 py-4 text-sm text-white font-medium hover:scale-[1.03] transition-transform inline-block mt-8">Back to Sign In</Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ForgotPassword;
