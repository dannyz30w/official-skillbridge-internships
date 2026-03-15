import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Loader2, Building2, GraduationCap } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import skillbridgeLogo from "@/assets/skillbridge-logo.png";
import SEOHead from "@/components/SEOHead";

const BUSINESS_TYPES = ['Retail', 'Food & Beverage', 'Healthcare', 'Tech', 'Creative & Media', 'Trades & Construction', 'Education', 'Nonprofit', 'Finance', 'Other'];
const TRUSTED_DOMAINS = ['gmail.com', 'googlemail.com', 'yahoo.com', 'yahoo.co.uk', 'outlook.com', 'hotmail.com', 'live.com', 'msn.com', 'icloud.com', 'me.com', 'mac.com', 'aol.com', 'protonmail.com', 'proton.me', 'mail.com', 'zoho.com', 'yandex.com', 'gmx.com', 'gmx.net', 'fastmail.com', 'tutanota.com', 'hey.com', 'pm.me', 'comcast.net', 'verizon.net', 'att.net', 'sbcglobal.net', 'cox.net', 'charter.net', 'bellsouth.net', 'earthlink.net', 'aim.com'];

const inputCls = "w-full h-[48px] px-4 rounded-xl text-[15px] glass-input";
const labelCls = "block text-small font-medium mb-2";
const ease = [0.16, 1, 0.3, 1] as const;

const checkDomainAge = async (email: string): Promise<{ allowed: boolean; flagged: boolean }> => {
  const domain = email.split('@')[1]?.toLowerCase();
  if (!domain) return { allowed: false, flagged: false };
  if (TRUSTED_DOMAINS.some(d => domain === d || domain.endsWith('.' + d)) || domain.endsWith('.edu')) {
    return { allowed: true, flagged: false };
  }
  try {
    const { data, error } = await supabase.functions.invoke('check-domain-age', { body: { domain } });
    if (error || !data) return { allowed: true, flagged: true };
    if (data.age_days !== undefined && data.age_days < 30) return { allowed: false, flagged: false };
    if (data.age_days === null) return { allowed: true, flagged: true };
    return { allowed: true, flagged: false };
  } catch {
    return { allowed: true, flagged: true };
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

  useEffect(() => {
    if (user && accountType) navigate(`/${accountType}`, { replace: true });
  }, [user, accountType, navigate]);

  const handleInternSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !lastName || !email || !password || !confirmPassword || !dob) { setError("Please fill in all fields."); return; }
    if (password.length < 8) { setError("Password must be at least 8 characters."); return; }
    if (password !== confirmPassword) { setError("Passwords do not match."); return; }
    const age = calcAge(dob);
    if (age < 16) { setError("You must be at least 16 years old to create an intern account."); return; }
    if (age > 22) { setError("Intern accounts are for users aged 16 to 22."); return; }
    if (!agreeTerms) { setError("You must agree to the Terms of Service."); return; }

    setError(""); setLoading(true);
    const domainResult = await checkDomainAge(email);
    if (!domainResult.allowed) {
      setError("Please use an established email address to sign up.");
      setLoading(false); return;
    }

    const { error: err } = await supabase.auth.signUp({
      email, password,
      options: { data: { full_name: `${firstName} ${lastName}`, account_type: 'intern', first_name: firstName, last_name: lastName, date_of_birth: dob } },
    });
    setLoading(false);
    if (err) { setError(err.message); return; }
    toast.success("Account created! Welcome to SkillBridge.");
  };

  const handleBusinessSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bizName || !contactName || !bizEmail || !bizPassword || !bizConfirmPassword || !bizType) { setError("Please fill in all fields."); return; }
    if (bizPassword.length < 8) { setError("Password must be at least 8 characters."); return; }
    if (bizPassword !== bizConfirmPassword) { setError("Passwords do not match."); return; }
    if (!bizAgreeTerms) { setError("You must agree to the Terms of Service."); return; }

    setError(""); setLoading(true);
    const domainResult = await checkDomainAge(bizEmail);
    if (!domainResult.allowed) {
      setError("Please use an established email address to sign up.");
      setLoading(false); return;
    }

    const { error: err } = await supabase.auth.signUp({
      email: bizEmail, password: bizPassword,
      options: { data: { full_name: contactName, account_type: 'business', business_name: bizName, contact_name: contactName, business_type: bizType } },
    });
    setLoading(false);
    if (err) { setError(err.message); return; }
    toast.success("Account created! Welcome to SkillBridge.");
  };

  if (step === 'select') {
    return (
      <div className="min-h-screen flex flex-col" style={{ background: '#F2F2F7' }}>
        <SEOHead title="Create Your Free Account, SkillBridge" description="Join SkillBridge for free. Find paid internships near you or remote. No resume required. Takes less than five minutes to sign up." path="/signup" />
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.38, ease }} className="p-6">
          <Link to="/" className="inline-flex items-center gap-2 text-small font-medium transition-fast" style={{ color: 'rgba(60,60,67,0.6)' }}>
            <ArrowLeft className="h-4 w-4" /> Back to home
          </Link>
        </motion.div>
        <div className="flex-1 flex items-center justify-center px-4 pb-16">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.38, ease, delay: 0.04 }} className="w-full max-w-lg">
            <div className="text-center mb-8">
              <img src={skillbridgeLogo} alt="SkillBridge logo" className="h-10 w-auto mx-auto mb-6" width={160} height={40} loading="eager" />
              <h1 className="font-display text-h2 font-bold">Create your account</h1>
              <p className="mt-2 text-body" style={{ color: 'rgba(60,60,67,0.6)' }}>Choose how you want to use SkillBridge</p>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <button onClick={() => setStep('intern')} className="glass-card p-8 text-center card-hover cursor-pointer text-left">
                <div className="h-14 w-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: 'rgba(79, 70, 229, 0.1)' }}>
                  <GraduationCap className="h-7 w-7" style={{ color: '#4F46E5' }} />
                </div>
                <h3 className="font-display font-bold text-h4 text-center">I am looking for an internship</h3>
                <p className="text-small text-center mt-2" style={{ color: 'rgba(60,60,67,0.6)' }}>Browse and apply to paid internships near you</p>
              </button>
              <button onClick={() => setStep('business')} className="glass-card p-8 text-center card-hover cursor-pointer text-left">
                <div className="h-14 w-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: 'rgba(79, 70, 229, 0.1)' }}>
                  <Building2 className="h-7 w-7" style={{ color: '#4F46E5' }} />
                </div>
                <h3 className="font-display font-bold text-h4 text-center">I am a business looking to hire</h3>
                <p className="text-small text-center mt-2" style={{ color: 'rgba(60,60,67,0.6)' }}>Post internship listings and find talented interns</p>
              </button>
            </div>
            <p className="mt-8 text-center text-small" style={{ color: 'rgba(60,60,67,0.6)' }}>
              Already have an account? <Link to="/signin" className="font-semibold transition-fast" style={{ color: '#4F46E5' }}>Sign In</Link>
            </p>
          </motion.div>
        </div>
      </div>
    );
  }

  const isIntern = step === 'intern';

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#F2F2F7' }}>
      <SEOHead title="Create Your Free Account, SkillBridge" description="Join SkillBridge for free. Find paid internships near you or remote." path="/signup" />
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.38, ease }} className="p-6">
        <button onClick={() => { setStep('select'); setError(''); }} className="inline-flex items-center gap-2 text-small font-medium transition-fast" style={{ color: 'rgba(60,60,67,0.6)' }}>
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
      </motion.div>
      <div className="flex-1 flex items-center justify-center px-4 pb-16">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.38, ease, delay: 0.04 }} className="w-full max-w-sm">
          <div className="text-center mb-8">
            <img src={skillbridgeLogo} alt="SkillBridge logo" className="h-10 w-auto mx-auto mb-6" width={160} height={40} loading="eager" />
            <h1 className="font-display text-h3 font-bold">{isIntern ? 'Intern Sign Up' : 'Business Sign Up'}</h1>
          </div>
          <form onSubmit={isIntern ? handleInternSubmit : handleBusinessSubmit} className="space-y-4">
            {isIntern ? (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div><label htmlFor="fn" className={labelCls} style={{ color: 'rgba(60,60,67,0.6)' }}>First Name</label><input id="fn" type="text" value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="First" className={inputCls} /></div>
                  <div><label htmlFor="ln" className={labelCls} style={{ color: 'rgba(60,60,67,0.6)' }}>Last Name</label><input id="ln" type="text" value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Last" className={inputCls} /></div>
                </div>
                <div><label htmlFor="intern-email" className={labelCls} style={{ color: 'rgba(60,60,67,0.6)' }}>Email</label><input id="intern-email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" className={inputCls} /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label htmlFor="intern-pw" className={labelCls} style={{ color: 'rgba(60,60,67,0.6)' }}>Password</label><input id="intern-pw" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Min. 8 chars" className={inputCls} /></div>
                  <div><label htmlFor="intern-cpw" className={labelCls} style={{ color: 'rgba(60,60,67,0.6)' }}>Confirm</label><input id="intern-cpw" type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Confirm" className={inputCls} /></div>
                </div>
                <div><label htmlFor="dob" className={labelCls} style={{ color: 'rgba(60,60,67,0.6)' }}>Date of Birth</label><input id="dob" type="date" value={dob} onChange={e => setDob(e.target.value)} className={inputCls} /></div>
                <label className="flex items-start gap-2 text-small cursor-pointer" style={{ color: 'rgba(60,60,67,0.6)' }}>
                  <input type="checkbox" checked={agreeTerms} onChange={e => setAgreeTerms(e.target.checked)} className="mt-0.5 rounded" />
                  <span>I agree to the <a href="/terms" target="_blank" rel="noopener noreferrer" style={{ color: '#4F46E5' }} className="font-semibold">Terms of Service</a></span>
                </label>
              </>
            ) : (
              <>
                <div><label htmlFor="biz-name" className={labelCls} style={{ color: 'rgba(60,60,67,0.6)' }}>Business Name</label><input id="biz-name" type="text" value={bizName} onChange={e => setBizName(e.target.value)} placeholder="Your Business" className={inputCls} /></div>
                <div><label htmlFor="contact" className={labelCls} style={{ color: 'rgba(60,60,67,0.6)' }}>Contact Person</label><input id="contact" type="text" value={contactName} onChange={e => setContactName(e.target.value)} placeholder="Full Name" className={inputCls} /></div>
                <div><label htmlFor="biz-email" className={labelCls} style={{ color: 'rgba(60,60,67,0.6)' }}>Business Email</label><input id="biz-email" type="email" value={bizEmail} onChange={e => setBizEmail(e.target.value)} placeholder="contact@business.com" className={inputCls} /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label htmlFor="biz-pw" className={labelCls} style={{ color: 'rgba(60,60,67,0.6)' }}>Password</label><input id="biz-pw" type="password" value={bizPassword} onChange={e => setBizPassword(e.target.value)} placeholder="Min. 8 chars" className={inputCls} /></div>
                  <div><label htmlFor="biz-cpw" className={labelCls} style={{ color: 'rgba(60,60,67,0.6)' }}>Confirm</label><input id="biz-cpw" type="password" value={bizConfirmPassword} onChange={e => setBizConfirmPassword(e.target.value)} placeholder="Confirm" className={inputCls} /></div>
                </div>
                <div>
                  <label htmlFor="biz-type" className={labelCls} style={{ color: 'rgba(60,60,67,0.6)' }}>Business Type</label>
                  <select id="biz-type" value={bizType} onChange={e => setBizType(e.target.value)} className={inputCls}>
                    <option value="">Select type...</option>
                    {BUSINESS_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <label className="flex items-start gap-2 text-small cursor-pointer" style={{ color: 'rgba(60,60,67,0.6)' }}>
                  <input type="checkbox" checked={bizAgreeTerms} onChange={e => setBizAgreeTerms(e.target.checked)} className="mt-0.5 rounded" />
                  <span>I agree to the <a href="/terms" target="_blank" rel="noopener noreferrer" style={{ color: '#4F46E5' }} className="font-semibold">Terms of Service</a></span>
                </label>
              </>
            )}
            <AnimatePresence mode="wait">
              {error && <motion.p key="error" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} className="text-small" style={{ color: '#FF3B30' }}>{error}</motion.p>}
            </AnimatePresence>
            <button type="submit" disabled={loading}
              className="w-full h-[48px] rounded-xl text-body font-semibold inline-flex items-center justify-center gap-2 btn-glass-primary disabled:opacity-50">
              {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Creating account...</> : "Create Account"}
            </button>
          </form>
          <p className="mt-6 text-center text-small" style={{ color: 'rgba(60,60,67,0.6)' }}>
            Already have an account? <Link to="/signin" className="font-semibold transition-fast" style={{ color: '#4F46E5' }}>Sign In</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default SignUp;
