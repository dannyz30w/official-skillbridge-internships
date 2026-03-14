import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Loader2, CheckCircle2, Building2, GraduationCap } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import skillbridgeLogo from "@/assets/skillbridge-logo.png";

const BUSINESS_TYPES = ['Retail', 'Food & Beverage', 'Healthcare', 'Tech', 'Creative & Media', 'Trades & Construction', 'Education', 'Nonprofit', 'Finance', 'Other'];

const TRUSTED_DOMAINS = ['gmail.com', 'googlemail.com', 'yahoo.com', 'yahoo.co.uk', 'outlook.com', 'hotmail.com', 'live.com', 'msn.com', 'icloud.com', 'me.com', 'mac.com', 'aol.com', 'protonmail.com', 'proton.me', 'mail.com', 'zoho.com', 'yandex.com', 'gmx.com', 'gmx.net', 'fastmail.com', 'tutanota.com', 'hey.com', 'pm.me', 'comcast.net', 'verizon.net', 'att.net', 'sbcglobal.net', 'cox.net', 'charter.net', 'bellsouth.net', 'earthlink.net', 'aim.com', 'edu'];

const inputCls = "w-full h-[44px] px-4 rounded-xl text-[15px] text-foreground placeholder:text-muted-foreground/50 glass-input";
const labelCls = "block text-[13px] font-medium tracking-[0.01em] text-muted-foreground mb-1.5";

const ease = [0.16, 1, 0.3, 1] as const;

const checkDomainAge = async (email: string): Promise<{ allowed: boolean; flagged: boolean }> => {
  const domain = email.split('@')[1]?.toLowerCase();
  if (!domain) return { allowed: false, flagged: false };
  // Known trusted domains pass automatically
  if (TRUSTED_DOMAINS.some(d => domain === d || domain.endsWith('.' + d) || domain.endsWith('.edu'))) {
    return { allowed: true, flagged: false };
  }
  // For unknown domains, try a WHOIS/domain age check via edge function
  try {
    const { data, error } = await supabase.functions.invoke('check-domain-age', { body: { domain } });
    if (error || !data) return { allowed: true, flagged: true }; // allow but flag
    if (data.age_days !== undefined && data.age_days < 30) return { allowed: false, flagged: false };
    if (data.age_days === null) return { allowed: true, flagged: true }; // couldn't determine
    return { allowed: true, flagged: false };
  } catch {
    return { allowed: true, flagged: true }; // network error = allow but flag
  }
};

const SignUp = () => {
  const navigate = useNavigate();
  const { user, accountType } = useAuth();
  const [step, setStep] = useState<'select' | 'intern' | 'business'>('select');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Intern fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [dob, setDob] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);

  // Business fields
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

  const validateAge = (dateStr: string) => {
    const birth = new Date(dateStr);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return age >= 16;
  };

  const handleInternSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !lastName || !email || !password || !confirmPassword || !dob) { setError("Please fill in all fields."); return; }
    if (password.length < 8) { setError("Password must be at least 8 characters."); return; }
    if (password !== confirmPassword) { setError("Passwords do not match."); return; }
    if (!validateAge(dob)) { setError("You must be at least 16 years old to sign up."); return; }
    if (!agreeTerms) { setError("You must agree to the Terms of Service."); return; }

    setError(""); setLoading(true);

    // Domain age check
    const domainResult = await checkDomainAge(email);
    if (!domainResult.allowed) {
      setError("We couldn't verify your email. Please use an established email address to sign up.");
      setLoading(false);
      return;
    }

    const { error: err } = await supabase.auth.signUp({
      email, password,
      options: {
        data: { full_name: `${firstName} ${lastName}`, account_type: 'intern', first_name: firstName, last_name: lastName, date_of_birth: dob },
      },
    });
    setLoading(false);
    if (err) { setError(err.message); return; }
    toast.success("Account created! Welcome to SkillBridge.");
    // Auto-confirm is enabled, user is immediately signed in via onAuthStateChange
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
      setError("We couldn't verify your email. Please use an established email address to sign up.");
      setLoading(false);
      return;
    }

    const { error: err } = await supabase.auth.signUp({
      email: bizEmail, password: bizPassword,
      options: {
        data: { full_name: contactName, account_type: 'business', business_name: bizName, contact_name: contactName, business_type: bizType },
      },
    });
    setLoading(false);
    if (err) { setError(err.message); return; }
    toast.success("Account created! Welcome to SkillBridge.");
  };

  if (step === 'select') {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="p-4 sm:p-6">
          <Link to="/" className="inline-flex items-center gap-2 text-[13px] font-medium text-muted-foreground hover:text-foreground transition-fast">
            <ArrowLeft className="h-4 w-4" /> Back to home
          </Link>
        </motion.div>
        <div className="flex-1 flex items-center justify-center px-4 pb-16">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease }} className="w-full max-w-lg">
            <div className="text-center mb-8">
              <img src={skillbridgeLogo} alt="SkillBridge" className="h-10 w-auto mx-auto mb-6" />
              <h1 className="font-display text-2xl font-bold tracking-tight">Create your account</h1>
              <p className="mt-2 text-[15px] text-muted-foreground">Choose how you'd like to use SkillBridge</p>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <motion.button onClick={() => setStep('intern')} whileHover={{ y: -2, scale: 1.005 }} whileTap={{ scale: 0.97 }}
                className="glass-card rounded-2xl p-8 text-center card-hover group cursor-pointer">
                <div className="h-14 w-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: 'rgba(79, 70, 229, 0.1)' }}>
                  <GraduationCap className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-display font-bold text-lg">I'm looking for an internship</h3>
                <p className="text-sm text-muted-foreground mt-2">Browse and apply to paid internships near you</p>
              </motion.button>
              <motion.button onClick={() => setStep('business')} whileHover={{ y: -2, scale: 1.005 }} whileTap={{ scale: 0.97 }}
                className="glass-card rounded-2xl p-8 text-center card-hover group cursor-pointer">
                <div className="h-14 w-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: 'rgba(79, 70, 229, 0.1)' }}>
                  <Building2 className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-display font-bold text-lg">I'm a business looking to hire</h3>
                <p className="text-sm text-muted-foreground mt-2">Post internship listings and find talented interns</p>
              </motion.button>
            </div>
            <p className="mt-6 text-center text-sm text-muted-foreground">
              Already have an account? <Link to="/signin" className="font-medium text-primary hover:text-primary/80 transition-fast">Sign In</Link>
            </p>
          </motion.div>
        </div>
      </div>
    );
  }

  const isIntern = step === 'intern';

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="p-4 sm:p-6">
        <button onClick={() => { setStep('select'); setError(''); }} className="inline-flex items-center gap-2 text-[13px] font-medium text-muted-foreground hover:text-foreground transition-fast">
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
      </motion.div>
      <div className="flex-1 flex items-center justify-center px-4 pb-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease }}
          className="w-full max-w-sm">
          <div className="text-center mb-6">
            <img src={skillbridgeLogo} alt="SkillBridge" className="h-10 w-auto mx-auto mb-4" />
            <h1 className="font-display text-xl font-bold">{isIntern ? 'Intern Sign Up' : 'Business Sign Up'}</h1>
          </div>
          <form onSubmit={isIntern ? handleInternSubmit : handleBusinessSubmit} className="space-y-3">
            {isIntern ? (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div><label className={labelCls}>First Name</label><input type="text" value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="First" className={inputCls} /></div>
                  <div><label className={labelCls}>Last Name</label><input type="text" value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Last" className={inputCls} /></div>
                </div>
                <div><label className={labelCls}>Email</label><input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" className={inputCls} /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div><label className={labelCls}>Password</label><input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Min. 8 chars" className={inputCls} /></div>
                  <div><label className={labelCls}>Confirm</label><input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Confirm" className={inputCls} /></div>
                </div>
                <div><label className={labelCls}>Date of Birth</label><input type="date" value={dob} onChange={e => setDob(e.target.value)} className={inputCls} /></div>
                <label className="flex items-start gap-2 text-sm text-muted-foreground cursor-pointer">
                  <input type="checkbox" checked={agreeTerms} onChange={e => setAgreeTerms(e.target.checked)} className="mt-0.5 rounded" />
                  <span>I agree to the <a href="/terms" target="_blank" rel="noopener noreferrer" className="text-primary underline">Terms of Service</a></span>
                </label>
              </>
            ) : (
              <>
                <div><label className={labelCls}>Business Name</label><input type="text" value={bizName} onChange={e => setBizName(e.target.value)} placeholder="Your Business" className={inputCls} /></div>
                <div><label className={labelCls}>Contact Person</label><input type="text" value={contactName} onChange={e => setContactName(e.target.value)} placeholder="Full Name" className={inputCls} /></div>
                <div><label className={labelCls}>Business Email</label><input type="email" value={bizEmail} onChange={e => setBizEmail(e.target.value)} placeholder="contact@business.com" className={inputCls} /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div><label className={labelCls}>Password</label><input type="password" value={bizPassword} onChange={e => setBizPassword(e.target.value)} placeholder="Min. 8 chars" className={inputCls} /></div>
                  <div><label className={labelCls}>Confirm</label><input type="password" value={bizConfirmPassword} onChange={e => setBizConfirmPassword(e.target.value)} placeholder="Confirm" className={inputCls} /></div>
                </div>
                <div>
                  <label className={labelCls}>Business Type</label>
                  <select value={bizType} onChange={e => setBizType(e.target.value)} className={inputCls}>
                    <option value="">Select type...</option>
                    {BUSINESS_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <label className="flex items-start gap-2 text-sm text-muted-foreground cursor-pointer">
                  <input type="checkbox" checked={bizAgreeTerms} onChange={e => setBizAgreeTerms(e.target.checked)} className="mt-0.5 rounded" />
                  <span>I agree to the <a href="/terms" target="_blank" rel="noopener noreferrer" className="text-primary underline">Terms of Service</a></span>
                </label>
              </>
            )}
            <AnimatePresence mode="wait">
              {error && <motion.p key="error" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} className="text-sm text-destructive">{error}</motion.p>}
            </AnimatePresence>
            <motion.button type="submit" disabled={loading} whileTap={{ scale: 0.97 }}
              className="w-full h-[44px] rounded-xl bg-primary text-primary-foreground text-[15px] font-semibold hover:opacity-92 disabled:opacity-50 inline-flex items-center justify-center gap-2 btn-press"
              style={{ transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)' }}>
              {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Creating account...</> : "Create Account"}
            </motion.button>
          </form>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            Already have an account? <Link to="/signin" className="font-medium text-primary hover:text-primary/80 transition-fast">Sign In</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default SignUp;
