import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Loader2, Building2, MapPin, DollarSign, Briefcase, FileText, CheckCircle2, LogIn } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import skillbridgeLogo from "@/assets/skillbridge-logo.png";

const PostInternship = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    companyName: "",
    title: "",
    location: "",
    type: "Part-time",
    pay: "",
    description: "",
  });

  const update = (field: string, value: string) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setError("You must be signed in to post an internship.");
      return;
    }
    const { companyName, title, location, pay, description } = formData;
    if (!companyName || !title || !location || !pay || !description) {
      setError("Please fill in all fields.");
      return;
    }
    setError("");
    setLoading(true);

    const { error: insertError } = await supabase.from("internships").insert({
      posted_by: user.id,
      company_name: companyName,
      title,
      location,
      type: formData.type,
      pay,
      description,
    });

    setLoading(false);

    if (insertError) {
      setError(insertError.message);
      return;
    }

    setSuccess(true);
    toast.success("Internship posted successfully!");
    setTimeout(() => navigate("/browse"), 1500);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <nav className="border-b border-border bg-background/80 backdrop-blur-md">
          <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
            <Link to="/" className="flex items-center gap-2">
              <img src={skillbridgeLogo} alt="SkillBridge" className="h-9 w-auto" />
            </Link>
            <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-smooth">
              <ArrowLeft className="h-4 w-4" /> Back to home
            </Link>
          </div>
        </nav>
        <div className="flex-1 flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="text-center max-w-sm"
          >
            <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-muted mx-auto mb-4">
              <LogIn className="h-6 w-6 text-muted-foreground" />
            </div>
            <h2 className="font-display text-xl font-bold text-foreground">Sign in to post</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              You need an account to post internship listings.
            </p>
            <div className="mt-6 flex items-center justify-center gap-3">
              <Link to="/signin" className="inline-flex items-center justify-center rounded-lg bg-primary text-primary-foreground h-10 px-5 text-sm font-semibold hover:bg-primary/90 transition-smooth">
                Sign In
              </Link>
              <Link to="/signup" className="inline-flex items-center justify-center rounded-lg border border-primary/20 bg-background text-accent-foreground h-10 px-5 text-sm font-medium hover:bg-accent transition-smooth">
                Create Account
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="border-b border-border bg-background/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
          <Link to="/" className="flex items-center gap-2">
            <img src={skillbridgeLogo} alt="SkillBridge" className="h-9 w-auto" />
          </Link>
          <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-smooth">
            <ArrowLeft className="h-4 w-4" /> Back to home
          </Link>
        </div>
      </nav>

      <div className="flex-1 py-12 px-4 sm:px-6">
        <div className="container mx-auto max-w-xl">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <h1 className="font-display text-3xl font-bold text-foreground tracking-tight">
              Post an Internship
            </h1>
            <p className="mt-2 text-muted-foreground">
              Reach motivated young adults aged 16–22. No recruitment fees.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div>
                <label className="block text-xs font-medium text-muted-foreground tracking-wide uppercase mb-1.5">
                  Company Name
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input type="text" value={formData.companyName} onChange={(e) => update("companyName", e.target.value)} placeholder="Your company name" className="w-full h-10 pl-10 pr-4 rounded-lg border border-input bg-background text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-smooth" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-muted-foreground tracking-wide uppercase mb-1.5">
                  Role Title
                </label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input type="text" value={formData.title} onChange={(e) => update("title", e.target.value)} placeholder="e.g. Marketing Intern" className="w-full h-10 pl-10 pr-4 rounded-lg border border-input bg-background text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-smooth" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground tracking-wide uppercase mb-1.5">
                    Location
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input type="text" value={formData.location} onChange={(e) => update("location", e.target.value)} placeholder="City or Remote" className="w-full h-10 pl-10 pr-4 rounded-lg border border-input bg-background text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-smooth" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground tracking-wide uppercase mb-1.5">
                    Hourly Pay
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input type="text" value={formData.pay} onChange={(e) => update("pay", e.target.value)} placeholder="e.g. $20/hr" className="w-full h-10 pl-10 pr-4 rounded-lg border border-input bg-background text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-smooth" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-muted-foreground tracking-wide uppercase mb-1.5">
                  Type
                </label>
                <div className="flex gap-3">
                  {["Part-time", "Full-time"].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => update("type", t)}
                      className={`h-10 px-4 rounded-lg border text-sm font-medium transition-smooth ${
                        formData.type === t
                          ? "border-primary bg-accent text-accent-foreground"
                          : "border-input bg-background text-muted-foreground hover:border-ring"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-muted-foreground tracking-wide uppercase mb-1.5">
                  Description
                </label>
                <div className="relative">
                  <FileText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <textarea
                    value={formData.description}
                    onChange={(e) => update("description", e.target.value)}
                    placeholder="Describe the role, responsibilities, and what the intern will learn..."
                    rows={5}
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-input bg-background text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-smooth resize-none"
                  />
                </div>
              </div>

              <AnimatePresence mode="wait">
                {error && (
                  <motion.p
                    key="error"
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    className="text-sm text-destructive"
                  >
                    {error}
                  </motion.p>
                )}
              </AnimatePresence>

              <motion.button
                type="submit"
                disabled={loading || success}
                className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-primary text-primary-foreground h-11 text-sm font-semibold hover:bg-primary/90 transition-smooth disabled:opacity-50 disabled:cursor-not-allowed"
                whileTap={{ scale: 0.98 }}
              >
                {success ? (
                  <>
                    <CheckCircle2 className="h-4 w-4" /> Posted!
                  </>
                ) : loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Submitting...
                  </>
                ) : (
                  "Post Internship"
                )}
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default PostInternship;
