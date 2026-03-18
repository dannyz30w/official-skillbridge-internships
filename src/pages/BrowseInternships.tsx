import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Briefcase, MapPin, DollarSign, Clock, Loader2, Send, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import skillbridgeLogo from "@/assets/skillbridge-logo.png";
import SEOHead from "@/components/SEOHead";

interface Internship {
  id: string;
  company_name: string;
  title: string;
  location: string;
  type: string;
  pay: string;
  description: string;
  created_at: string;
  posted_by: string;
}

const BrowseInternships = () => {
  const { user } = useAuth();
  const [internships, setInternships] = useState<Internship[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [applyingTo, setApplyingTo] = useState<string | null>(null);
  const [appliedIds, setAppliedIds] = useState<Set<string>>(new Set());
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [applyNote, setApplyNote] = useState("");

  useEffect(() => {
    const fetchInternships = async () => {
      const { data, error } = await supabase
        .from("internships")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data) {
        setInternships(data as Internship[]);
      }
      setLoading(false);
    };

    fetchInternships();
  }, []);

  useEffect(() => {
    if (!user) return;
    const fetchApplications = async () => {
      const { data } = await supabase
        .from("applications")
        .select("internship_id")
        .eq("applicant_id", user.id);
      if (data) {
        setAppliedIds(new Set(data.map((a: any) => a.internship_id)));
      }
    };
    fetchApplications();
  }, [user]);

  const filtered = useMemo(() => {
    if (!searchQuery.trim()) return internships;
    const q = searchQuery.toLowerCase();
    return internships.filter(
      (i) =>
        i.title.toLowerCase().includes(q) ||
        i.company_name.toLowerCase().includes(q) ||
        i.location.toLowerCase().includes(q)
    );
  }, [internships, searchQuery]);

  const handleApply = async (internshipId: string) => {
    if (!user) {
      toast.error("Sign in to apply for internships.");
      return;
    }
    setApplyingTo(internshipId);

    const { error } = await supabase.from("applications").insert({
      internship_id: internshipId,
      applicant_id: user.id,
      note: applyNote,
    });

    setApplyingTo(null);

    if (error) {
      if (error.code === "23505") {
        toast.error("You've already applied to this internship.");
      } else {
        toast.error(error.message);
      }
      return;
    }

    setAppliedIds((prev) => new Set([...prev, internshipId]));
    setExpandedId(null);
    setApplyNote("");
    toast.success("Application submitted!");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEOHead
        title="Browse Paid Internships, SkillBridge"
        description="Browse hundreds of paid internships for teens and young adults. Filter by location, industry, and pay. Apply instantly on SkillBridge."
        path="/browse"
        jsonLd={internships.map((internship) => ({
          "@context": "https://schema.org",
          "@type": "JobPosting",
          title: internship.title,
          description: internship.description,
          hiringOrganization: {
            "@type": "Organization",
            name: internship.company_name,
            sameAs: "https://skillbridgeintern.org",
          },
          employmentType: "INTERN",
          datePosted: internship.created_at,
          applicantLocationRequirements: internship.location?.toLowerCase().includes("remote") ? { "@type": "Country", name: "US" } : undefined,
          jobLocation: internship.location?.toLowerCase().includes("remote") ? undefined : {
            "@type": "Place",
            address: { "@type": "PostalAddress", addressLocality: internship.location }
          },
          baseSalary: {
            "@type": "MonetaryAmount",
            currency: "USD",
            value: { "@type": "QuantitativeValue", unitText: "HOUR", value: internship.pay?.replace(/[^\d.]/g, "") || undefined }
          }
        }))}
      />
      <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
          <Link to="/" className="flex items-center gap-2">
            <img src={skillbridgeLogo} alt="SkillBridge" className="h-9 w-auto" />
          </Link>
          <div className="flex items-center gap-3">
            {user ? (
              <Link to="/post-internship" className="inline-flex items-center justify-center rounded-lg bg-primary text-primary-foreground h-9 px-4 text-sm font-medium hover:bg-primary/90 transition-smooth">
                Post Internship
              </Link>
            ) : (
              <>
                <Link to="/signin" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-smooth">
                  Sign In
                </Link>
                <Link to="/signup" className="inline-flex items-center justify-center rounded-lg bg-primary text-primary-foreground h-9 px-4 text-sm font-medium hover:bg-primary/90 transition-smooth">
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      <div className="flex-1 py-12 px-4 sm:px-6">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <h1 className="font-display text-3xl font-bold text-foreground tracking-tight">
              Browse Internships
            </h1>
            <p className="mt-2 text-muted-foreground">
              Real roles, real pay, from vetted companies.
            </p>

            <div className="mt-8 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by role, company, or location..."
                className="w-full h-11 pl-10 pr-4 rounded-lg border border-input bg-background text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-smooth"
              />
            </div>

            <div className="mt-8 space-y-4">
              {loading ? (
                <div className="py-16 flex flex-col items-center justify-center">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  <p className="mt-3 text-sm text-muted-foreground">Loading internships...</p>
                </div>
              ) : filtered.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="rounded-xl border-2 border-dashed border-border p-12 flex flex-col items-center justify-center text-center"
                >
                  <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-muted mb-4">
                    <Briefcase className="h-6 w-6 text-muted-foreground/60" />
                  </div>
                  <h3 className="text-base font-bold text-foreground">
                    {searchQuery ? "No matches found" : "No internships listed yet"}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground max-w-sm">
                    {searchQuery
                      ? "Try adjusting your search terms."
                      : (
                        <>
                          Be the first to post.{" "}
                          <Link to="/post-internship" className="font-medium text-primary hover:text-primary/80 transition-smooth">
                            list an internship
                          </Link>.
                        </>
                      )}
                  </p>
                </motion.div>
              ) : (
                <AnimatePresence mode="popLayout">
                  {filtered.map((internship, i) => {
                    const isOwner = user?.id === internship.posted_by;
                    const hasApplied = appliedIds.has(internship.id);
                    const isExpanded = expandedId === internship.id;

                    return (
                      <motion.div
                        key={internship.id}
                        layout
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1], delay: i * 0.03 }}
                        className="bg-card rounded-xl border border-border shadow-card hover:shadow-card-hover hover:border-ring/40 transition-card p-5 sm:p-6"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-medium text-muted-foreground tracking-wide uppercase">
                              {internship.company_name}
                            </p>
                            <h3 className="mt-1 text-lg font-bold text-foreground leading-snug">
                              {internship.title}
                            </h3>
                            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
                              <span className="inline-flex items-center gap-1.5">
                                <MapPin className="h-3.5 w-3.5" /> {internship.location}
                              </span>
                              <span className="inline-flex items-center gap-1.5">
                                <DollarSign className="h-3.5 w-3.5 text-success" /> {internship.pay}
                              </span>
                              <span className="inline-flex items-center gap-1.5">
                                <Clock className="h-3.5 w-3.5" /> {internship.type}
                              </span>
                            </div>
                          </div>
                        </div>

                        <p className="mt-4 text-sm text-muted-foreground leading-relaxed line-clamp-3">
                          {internship.description}
                        </p>

                        <div className="mt-5 flex items-center justify-end gap-3">
                          {isOwner ? (
                            <span className="text-xs font-medium text-muted-foreground bg-muted px-3 py-1.5 rounded-full">
                              Your listing
                            </span>
                          ) : hasApplied ? (
                            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-success bg-success/10 px-3 py-1.5 rounded-full">
                              <CheckCircle2 className="h-3.5 w-3.5" /> Applied
                            </span>
                          ) : user ? (
                            <div className="flex flex-col items-end gap-2 w-full sm:w-auto">
                              {isExpanded ? (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: "auto" }}
                                  exit={{ opacity: 0, height: 0 }}
                                  className="w-full flex flex-col sm:flex-row items-stretch sm:items-center gap-2"
                                >
                                  <input
                                    type="text"
                                    value={applyNote}
                                    onChange={(e) => setApplyNote(e.target.value)}
                                    placeholder="Add a short note (optional)"
                                    className="flex-1 h-9 px-3 rounded-lg border border-input bg-background text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-smooth"
                                  />
                                  <motion.button
                                    onClick={() => handleApply(internship.id)}
                                    disabled={applyingTo === internship.id}
                                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary text-primary-foreground h-9 px-4 text-sm font-semibold hover:bg-primary/90 transition-smooth disabled:opacity-50"
                                    whileTap={{ scale: 0.97 }}
                                  >
                                    {applyingTo === internship.id ? (
                                      <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                      <>
                                        <Send className="h-3.5 w-3.5" /> Submit
                                      </>
                                    )}
                                  </motion.button>
                                  <button
                                    onClick={() => { setExpandedId(null); setApplyNote(""); }}
                                    className="text-xs text-muted-foreground hover:text-foreground transition-smooth"
                                  >
                                    Cancel
                                  </button>
                                </motion.div>
                              ) : (
                                <motion.button
                                  onClick={() => setExpandedId(internship.id)}
                                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary text-primary-foreground h-9 px-4 text-sm font-semibold hover:bg-primary/90 transition-smooth"
                                  whileTap={{ scale: 0.97 }}
                                >
                                  <Send className="h-3.5 w-3.5" /> Apply Now
                                </motion.button>
                              )}
                            </div>
                          ) : (
                            <Link
                              to="/signin"
                              className="inline-flex items-center justify-center gap-2 rounded-lg border border-primary/20 bg-background text-accent-foreground h-9 px-4 text-sm font-medium hover:bg-accent transition-smooth"
                            >
                              Sign in to apply
                            </Link>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default BrowseInternships;
