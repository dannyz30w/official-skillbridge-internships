import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import skillbridgeLogo from "@/assets/skillbridge-logo.png";
import SEOHead from "@/components/SEOHead";

const ResetPassword = () => (
  <div className="min-h-screen flex flex-col" style={{ background: '#F2F2F7' }}>
    <SEOHead title="Reset Password" description="Reset your SkillBridge password." path="/reset-password" noIndex />
    <div className="p-6">
      <Link to="/signin" className="inline-flex items-center gap-2 text-small font-medium transition-fast" style={{ color: 'rgba(60,60,67,0.6)' }}>
        <ArrowLeft className="h-4 w-4" /> Back to sign in
      </Link>
    </div>
    <div className="flex-1 flex items-center justify-center px-4 pb-16">
      <div className="w-full max-w-sm text-center">
        <img src={skillbridgeLogo} alt="SkillBridge logo" className="h-10 w-auto mx-auto mb-6" width={160} height={40} />
        <h1 className="font-display text-h2 font-bold mb-4">Password Reset</h1>
        <p className="text-body" style={{ color: 'rgba(60,60,67,0.6)' }}>
          Password reset via email is not available. Please contact support at legal@skillbridge.app for assistance.
        </p>
        <Link to="/signin" className="btn-glass-primary inline-flex items-center justify-center h-12 px-8 mt-8">
          Back to Sign In
        </Link>
      </div>
    </div>
  </div>
);

export default ResetPassword;
