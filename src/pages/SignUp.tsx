import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Loader2, Building2, GraduationCap } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { trackEvent } from "@/lib/analytics";
import skillbridgeLogo from "@/assets/skillbridge-logo.png";
import SEOHead from "@/components/SEOHead";
import { Typewriter } from "@/components/ui/typewriter-text";
// Email sending disabled until Lovable Pro is available
// import { sendInternWelcomeEmail, sendBusinessWelcomeEmail } from "@/lib/email";

const BUSINESS_TYPES = ['Retail', 'Food & Beverage', 'Healthcare', 'Tech', 'Creative & Media', 'Trades & Construction', 'Education', 'Nonprofit', 'Finance', 'Other'];
const TRUSTED_DOMAINS = ['gmail.com', 'googlemail.com', 'yahoo.com', 'yahoo.co.uk', 'outlook.com', 'hotmail.com', 'live.com', 'msn.com', 'icloud.com', 'me.com', 'mac.com', 'aol.com', 'protonmail.com', 'proton.me', 'mail.com', 'zoho.com', 'yandex.com', 'gmx.com', 'gmx.net', 'fastmail.com', 'tutanota.com', 'hey.com', 'pm.me', 'comcast.net', 'verizon.net', 'att.net', 'sbcglobal.net', 'cox.net', 'charter.net', 'bellsouth.net', 'earthlink.net', 'aim.com'];

const inputCls = "w-full h-[48px] px-4 rounded-xl text-[16px] bg-white/5 border border-white/10 text-white placeholder:text-slate-300/45 focus:border-indigo-400/50 focus:outline-none focus:ring-1 focus:ring-indigo-400/20 transition-all";
const labelCls = "block text-small font-medium mb-2 auth-copy-muted";
const ease = [0.16, 1, 0.3, 1] as const;

const checkEmailAge = async (email: string): Promise<{ allowed: boolean; reason?: string }> => {
  const domain = email.split('@')[1]?.toLowerCase();
  if (!domain) return { allowed: false, reason: 'Invalid email' };
  if (TRUSTED_DOMAINS.some(d => domain === d || domain.endsWith('.' + d)) || domain.endsWith('.edu')) return { allowed: true };
  try {
    const { data, error } = await supabase.functions.invoke('check-email-age', { body: { email } });
    if (error || !data) return { allowed: true };
    if (data.age_days !== undefined && data.age_days < 30) {
      return { allowed: false, reason: `Email must be at least 30 days old. Your email is ${data.age_days} days old.` };
    }
    if (data.age_days === null) return { allowed: true };
    return { allowed: true };
  } catch (err) {
    console.error('Email age check error:', err);
    return { allowed: true };
  }
};

const calcAge = (dateStr: string) => {
  const birth = new Date(dateStr);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
};

const passwordStrength = (pw: string) => {
  let score = 0;
  if (pw.length >= 10) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return score;
};

const SignUp = () => {
  const navigate = useNavigate();
  const { user, accountType } = useAuth();
  const [step, setStep] = useState<'select' | 'intern' | 'business'>('select');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [dob, setDob] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [bizName, setBizName] = useState("");
  const [contactName, setContactName] = useState("");
  const [bizEmail, setBizEmail] = useState("");
  const [bizPassword, setBizPassword] = useState("");
  const [bizConfirmPassword, setBizConfirmPassword] = useState("");
  const [bizType, setBizType] = useState("");
  const [bizAgreeTerms, setBizAgreeTerms] = useState(false);

  useEffect(() => { if (user && accountType) navigate(`/${accountType}`, { replace: true }); }, [user, accountType, navigate]);

  const validatePassword = (pw: string) => {
    if (pw.length < 10) return "Password must be at least 10 characters.";
    if (!/[A-Z]/.test(pw)) return "Password must contain an uppercase letter.";
    if (!/[0-9]/.test(pw)) return "Password must contain a number.";
    if (!/[^A-Za-z0-9]/.test(pw)) return "Password must contain a special character.";
    return null;
  };

  const handleInternSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !lastName || !email || !password || !confirmPassword || !dob) { setError("Please fill in all fields."); return; }
    const pwErr = validatePassword(password);
    if (pwErr) { setError(pwErr); return; }
    if (password !== confirmPassword) { setError("Passwords do not match."); return; }
    const age = calcAge(dob);
    if (age < 16) { setError("You must be at least 16 years old to create an intern account."); return; }
    if (age > 22) { setError("Intern accounts are for users aged 16 to 22."); return; }
    if (!agreeTerms) { setError("You must agree to the Terms of Service."); return; }
    setError(""); setLoading(true);
    const emailAgeResult = await checkEmailAge(email);
    if (!emailAgeResult.allowed) { setError(emailAgeResult.reason || "Please use an established email address to sign up."); setLoading(false); return; }
    const { error: err } = await supabase.auth.signUp({ email, password, options: { data: { full_name: `${firstName} ${lastName}`, account_type: 'intern', first_name: firstName, last_name: lastName, date_of_birth: dob } } });
    setLoading(false);
    if (err) { setError(err.message); return; }
    trackEvent('intern_signup');
    // Email sending disabled until Lovable Pro
    // try {
    //   await sendInternWelcomeEmail(email, firstName);
    // } catch (emailErr) {
    //   console.error('Welcome email failed:', emailErr);
    // }
    toast.success("Account created! Welcome to SkillBridge. You can now sign in.");
  };

  const handleBusinessSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bizName || !contactName || !bizEmail || !bizPassword || !bizConfirmPassword || !bizType) { setError("Please fill in all fields."); return; }
    const pwErr = validatePassword(bizPassword);
    if (pwErr) { setError(pwErr); return; }
    if (bizPassword !== bizConfirmPassword) { setError("Passwords do not match."); return; }
    if (!bizAgreeTerms) { setError("You must agree to the Terms of Service."); return; }
    setError(""); setLoading(true);
    const emailAgeResult = await checkEmailAge(bizEmail);
    if (!emailAgeResult.allowed) { setError(emailAgeResult.reason || "Please use an established email address to sign up."); setLoading(false); return; }
    const { error: err } = await supabase.auth.signUp({ email: bizEmail, password: bizPassword, options: { data: { full_name: contactName, account_type: 'business', business_name: bizName, contact_name: contactName, business_type: bizType } } });
    setLoading(false);
    if (err) { setError(err.message); return; }
    trackEvent('business_signup');
    // Email sending disabled until Lovable Pro
    // try {
    //   await sendBusinessWelcomeEmail(bizEmail, bizName);
    // } catch (emailErr) {
    //   console.error('Welcome email failed:', emailErr);
    // }
    toast.success("Account created! Welcome to SkillBridge. You can now sign in.");
  };

  const isIntern = step === 'intern';
  const activePw = isIntern ? password : bizPassword;
  const pwScore = passwordStrength(activePw);
  const pwColors = ['#FF6B6B', '#F59E0B', '#F59E0B', '#10B981', '#10B981'];
  const pwLabels = ['Weak', 'Fair', 'Fair', 'Strong', 'Very Strong'];

  if (step === 'select') {
    return (
      <div className="min-h-screen flex flex-col" style={{ background: 'transparent' }}>
        <SEOHead title="Create Your Free Account, SkillBridge" description="Join SkillBridge free in under 5 minutes. Find paid internships near you or remote. No resume required. For ages 16-22." path="/signup" />
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.38, ease }} className="p-6">
          <Link to="/" className="inline-flex items-center gap-2 text-small font-medium auth-copy-muted hover:text-white transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back to home
          </Link>
        </motion.div>
        <div className="flex-1 flex items-center justify-center px-4 pb-16">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.38, ease, delay: 0.04 }} className="w-full max-w-lg">
            <div className="text-center mb-8">
              <img src={skillbridgeLogo} alt="SkillBridge logo" className="h-10 w-auto mx-auto mb-6" width={160} height={40} loading="eager" />
              <h1 className="text-h2 font-bold text-white" style={{ fontFamily: "var(--font-display)", fontStyle: "italic" }}><Typewriter text="Create your account" speed={70} className="text-white" /></h1>
              <p className="mt-2 text-body auth-copy-muted">Choose how you want to use SkillBridge</p>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <button onClick={() => setStep('intern')} className="liquid-glass-strong rounded-2xl p-8 text-center hover:scale-[1.02] transition-transform cursor-pointer">
                <div className="h-14 w-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: 'rgba(79, 70, 229, 0.15)' }}>
                  <GraduationCap className="h-7 w-7 text-indigo-400" />
                </div>
                <h3 className="font-bold text-h4 text-white text-center" style={{ fontFamily: "var(--font-body)" }}>I am looking for an internship</h3>
                <p className="text-small text-center mt-2 auth-copy-muted">Browse and apply to paid internships near you</p>
              </button>
              <button onClick={() => setStep('business')} className="liquid-glass-strong rounded-2xl p-8 text-center hover:scale-[1.02] transition-transform cursor-pointer">
                <div className="h-14 w-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: 'rgba(79, 70, 229, 0.15)' }}>
                  <Building2 className="h-7 w-7 text-indigo-400" />
                </div>
                <h3 className="font-bold text-h4 text-white text-center" style={{ fontFamily: "var(--font-body)" }}>I am a business looking to hire</h3>
                <p className="text-small text-center mt-2 auth-copy-muted">Post internship listings and find talented interns</p>
              </button>
            </div>
            <p className="mt-8 text-center text-small auth-copy-muted">
              Already have an account? <Link to="/signin" className="font-semibold text-indigo-400">Sign In</Link>
            </p>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'transparent' }}>
      <SEOHead title="Create Your Free Account, SkillBridge" description="Join SkillBridge free in under 5 minutes. Find paid internships near you or remote. No resume required. For ages 16-22." path="/signup" />
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.38, ease }} className="p-6">
        <button onClick={() => { setStep('select'); setError(''); }} className="inline-flex items-center gap-2 text-small font-medium auth-copy-muted hover:text-white transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
      </motion.div>
      <div className="flex-1 flex items-center justify-center px-4 pb-16">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.38, ease, delay: 0.04 }} className="w-full max-w-sm">
          <div className="text-center mb-8">
            <img src={skillbridgeLogo} alt="SkillBridge logo" className="h-10 w-auto mx-auto mb-6" width={160} height={40} loading="eager" />
            <h1 className="text-h3 font-bold text-white" style={{ fontFamily: "var(--font-display)", fontStyle: "italic" }}><Typewriter text={isIntern ? 'Intern Sign Up' : 'Business Sign Up'} speed={70} className="text-white" /></h1>
          </div>
          <form onSubmit={isIntern ? handleInternSubmit : handleBusinessSubmit} className="space-y-4">
            {isIntern ? (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div><label htmlFor="fn" className={labelCls}>First Name</label><input id="fn" type="text" value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="First" className={inputCls} /></div>
                  <div><label htmlFor="ln" className={labelCls}>Last Name</label><input id="ln" type="text" value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Last" className={inputCls} /></div>
                </div>
                <div><label htmlFor="intern-email" className={labelCls}>Email</label><input id="intern-email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" className={inputCls} /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label htmlFor="intern-pw" className={labelCls}>Password</label><input id="intern-pw" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Min. 10 chars" className={inputCls} /></div>
                  <div><label htmlFor="intern-cpw" className={labelCls}>Confirm</label><input id="intern-cpw" type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Confirm" className={inputCls} /></div>
                </div>
                {activePw.length > 0 && (
                  <div className="flex items-center gap-2">
                    <div className="flex-1 flex gap-1">{[0,1,2,3].map(i => <div key={i} className="flex-1 h-1 rounded-full" style={{ background: i < pwScore ? pwColors[pwScore] : 'rgba(255,255,255,0.06)' }} />)}</div>
                    <span className="text-caption font-medium" style={{ color: pwColors[pwScore] }}>{pwLabels[pwScore]}</span>
                  </div>
                )}
                <div><label htmlFor="dob" className={labelCls}>Date of Birth</label><input id="dob" type="date" value={dob} onChange={e => setDob(e.target.value)} className={inputCls} /></div>
                <label className="flex items-start gap-2 text-small cursor-pointer auth-copy-muted">
                  <input type="checkbox" checked={agreeTerms} onChange={e => setAgreeTerms(e.target.checked)} className="mt-0.5 rounded" />
                  <span>I agree to the <a href="/terms" target="_blank" rel="noopener noreferrer" className="font-semibold text-indigo-400">Terms of Service</a></span>
                </label>
              </>
            ) : (
              <>
                <div><label htmlFor="biz-name" className={labelCls}>Business Name</label><input id="biz-name" type="text" value={bizName} onChange={e => setBizName(e.target.value)} placeholder="Your Business" className={inputCls} /></div>
                <div><label htmlFor="contact" className={labelCls}>Contact Person</label><input id="contact" type="text" value={contactName} onChange={e => setContactName(e.target.value)} placeholder="Full Name" className={inputCls} /></div>
                <div><label htmlFor="biz-email" className={labelCls}>Business Email</label><input id="biz-email" type="email" value={bizEmail} onChange={e => setBizEmail(e.target.value)} placeholder="contact@business.com" className={inputCls} /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label htmlFor="biz-pw" className={labelCls}>Password</label><input id="biz-pw" type="password" value={bizPassword} onChange={e => setBizPassword(e.target.value)} placeholder="Min. 10 chars" className={inputCls} /></div>
                  <div><label htmlFor="biz-cpw" className={labelCls}>Confirm</label><input id="biz-cpw" type="password" value={bizConfirmPassword} onChange={e => setBizConfirmPassword(e.target.value)} placeholder="Confirm" className={inputCls} /></div>
                </div>
                {activePw.length > 0 && (
                  <div className="flex items-center gap-2">
                    <div className="flex-1 flex gap-1">{[0,1,2,3].map(i => <div key={i} className="flex-1 h-1 rounded-full" style={{ background: i < pwScore ? pwColors[pwScore] : 'rgba(255,255,255,0.06)' }} />)}</div>
                    <span className="text-caption font-medium" style={{ color: pwColors[pwScore] }}>{pwLabels[pwScore]}</span>
                  </div>
                )}
                <div>
                  <label htmlFor="biz-type" className={labelCls}>Business Type</label>
                  <select id="biz-type" value={bizType} onChange={e => setBizType(e.target.value)} className={inputCls}>
                    <option value="">Select type...</option>
                    {BUSINESS_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <label className="flex items-start gap-2 text-small cursor-pointer auth-copy-muted">
                  <input type="checkbox" checked={bizAgreeTerms} onChange={e => setBizAgreeTerms(e.target.checked)} className="mt-0.5 rounded" />
                  <span>I agree to the <a href="/terms" target="_blank" rel="noopener noreferrer" className="font-semibold text-indigo-400">Terms of Service</a></span>
                </label>
              </>
            )}
            <AnimatePresence mode="wait">
              {error && <motion.p key="error" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} className="text-small" style={{ color: '#FF6B6B' }}>{error}</motion.p>}
            </AnimatePresence>
            <button type="submit" disabled={loading}
              className="w-full h-[48px] rounded-xl text-body font-semibold inline-flex items-center justify-center gap-2 liquid-glass-strong text-white hover:scale-[1.02] transition-transform disabled:opacity-50">
              {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Creating account...</> : "Create Account"}
            </button>
          </form>
          <p className="mt-6 text-center text-small auth-copy-muted">
            Already have an account? <Link to="/signin" className="font-semibold text-indigo-400">Sign In</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default SignUp;
