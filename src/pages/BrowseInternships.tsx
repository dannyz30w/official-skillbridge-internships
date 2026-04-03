import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Briefcase, MapPin, DollarSign, Clock, Loader2, Send, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import SEOHead from "@/components/SEOHead";
import Navbar from "@/components/Navbar";

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

const ease = [0.16, 1, 0.3, 1] as const;

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
      if (!error && data) setInternships(data as Internship[]);
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
      if (data) setAppliedIds(new Set(data.map((a: any) => a.internship_id)));
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
    if (!user) { toast.error("Sign in to apply for internships."); return; }
    setApplyingTo(internshipId);
    const { error } = await supabase.from("applications").insert({
      internship_id: internshipId,
      applicant_id: user.id,
      note: applyNote,
    });
    setApplyingTo(null);
    if (error) {
      if (error.code === "23505") toast.error("You've already applied to this internship.");
      else toast.error(error.message);
      return;
    }
    setAppliedIds((prev) => new Set([...prev, internshipId]));
    setExpandedId(null);
    setApplyNote("");
    toast.success("Application submitted!");
  };

  return (
    <div className="min-h-screen" style={{ background: 'transparent' }}>
      <SEOHead
        title="Browse Paid Internships, SkillBridge"
        description="Browse hundreds of paid internships for teens and young adults. Filter by location, industry, and pay. Apply instantly on SkillBridge."
        path="/browse"
        jsonLd={internships.map((internship) => ({
          "@context": "https://schema.org",
          "@type": "JobPosting",
          title: internship.title,
          description: internship.description,
          hiringOrganization: { "@type": "Organization", name: internship.company_name, sameAs: "https://skillbridgeintern.org" },
          employmentType: "INTERN",
          datePosted: internship.created_at,
          applicantLocationRequirements: internship.location?.toLowerCase().includes("remote") ? { "@type": "Country", name: "US" } : undefined,
          jobLocation: internship.location?.toLowerCase().includes("remote") ? undefined : { "@type": "Place", address: { "@type": "PostalAddress", addressLocality: internship.location } },
          baseSalary: { "@type": "MonetaryAmount", currency: "USD", value: { "@type": "QuantitativeValue", unitText: "HOUR", value: internship.pay?.replace(/[^\d.]/g, "") || undefined } }
        }))}
      />
      <Navbar />

      <main className="pt-32 pb-24 px-4 sm:px-6">
        <div className="mx-auto max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease }}>
            <h1 className="text-h1 font-bold ocean-title" style={{ fontFamily: "var(--font-display)", fontStyle: "italic" }}>
              Browse Internships
            </h1>
            <p className="mt-2 text-body ocean-copy" style={{ fontFamily: "var(--font-body)" }}>
              Real roles, real pay, from vetted companies.
            </p>

            <div className="mt-8 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300/40 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by role, company, or location..."
                className="ocean-input w-full h-[48px] pl-11 pr-4 rounded-xl text-[16px] focus:border-indigo-400/40 focus:outline-none focus:ring-1 focus:ring-indigo-400/20 transition-all"
              />
            </div>

            <div className="mt-8 space-y-4">
              {loading ? (
                <div className="py-16 flex flex-col items-center justify-center">
                  <Loader2 className="h-6 w-6 animate-spin text-slate-300/60" />
                  <p className="mt-3 text-sm ocean-muted" style={{ fontFamily: "var(--font-body)" }}>Loading internships...</p>
                </div>
              ) : filtered.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="ocean-panel rounded-2xl p-12 flex flex-col items-center justify-center text-center"
                >
                  <div className="flex items-center justify-center h-12 w-12 rounded-xl mb-4" style={{ background: 'rgba(79,70,229,0.15)' }}>
                    <Briefcase className="h-6 w-6 text-indigo-400" />
                  </div>
                  <h3 className="text-body font-bold ocean-title" style={{ fontFamily: "var(--font-body)" }}>
                    {searchQuery ? "No matches found" : "No internships listed yet"}
                  </h3>
                  <p className="mt-2 text-sm ocean-muted max-w-sm" style={{ fontFamily: "var(--font-body)" }}>
                    {searchQuery
                      ? "Try adjusting your search terms."
                      : <>Be the first to post. <Link to="/for-businesses" className="font-medium text-indigo-400">List an internship</Link>.</>
                    }
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
                        transition={{ duration: 0.4, ease, delay: i * 0.03 }}
                        className="ocean-panel rounded-2xl p-6"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-medium ocean-muted tracking-wide uppercase" style={{ fontFamily: "var(--font-body)" }}>
                              {internship.company_name}
                            </p>
                            <h3 className="mt-1 text-lg font-bold ocean-title leading-snug" style={{ fontFamily: "var(--font-body)" }}>
                              {internship.title}
                            </h3>
                            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm ocean-copy">
                              <span className="inline-flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" /> {internship.location}</span>
                              <span className="inline-flex items-center gap-1.5"><DollarSign className="h-3.5 w-3.5 text-emerald-400" /> {internship.pay}</span>
                              <span className="inline-flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> {internship.type}</span>
                            </div>
                          </div>
                        </div>

                        <p className="mt-4 text-sm ocean-copy leading-relaxed line-clamp-3" style={{ fontFamily: "var(--font-body)" }}>
                          {internship.description}
                        </p>

                        <div className="mt-5 flex items-center justify-end gap-3">
                          {isOwner ? (
                            <span className="text-xs font-medium ocean-muted px-3 py-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.05)' }}>
                              Your listing
                            </span>
                          ) : hasApplied ? (
                            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-400 px-3 py-1.5 rounded-full" style={{ background: 'rgba(16,185,129,0.1)' }}>
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
                                    className="ocean-input flex-1 h-9 px-3 rounded-lg text-sm focus:border-indigo-400/40 focus:outline-none focus:ring-1 focus:ring-indigo-400/20 transition-all"
                                  />
                                  <button
                                    onClick={() => handleApply(internship.id)}
                                    disabled={applyingTo === internship.id}
                                    className="btn-glass-primary inline-flex items-center justify-center gap-2 h-9 px-4 text-sm font-semibold rounded-lg disabled:opacity-50"
                                  >
                                    {applyingTo === internship.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Send className="h-3.5 w-3.5" /> Submit</>}
                                  </button>
                                  <button
                                    onClick={() => { setExpandedId(null); setApplyNote(""); }}
                                    className="text-xs ocean-muted hover:text-white transition-colors"
                                  >
                                    Cancel
                                  </button>
                                </motion.div>
                              ) : (
                                <button
                                  onClick={() => setExpandedId(internship.id)}
                                  className="btn-glass-primary inline-flex items-center justify-center gap-2 h-9 px-4 text-sm font-semibold rounded-lg"
                                >
                                  <Send className="h-3.5 w-3.5" /> Apply Now
                                </button>
                              )}
                            </div>
                          ) : (
                            <Link
                              to="/signin"
                              className="liquid-glass inline-flex items-center justify-center gap-2 rounded-lg h-9 px-4 text-sm font-medium text-white/80 hover:text-white transition-colors"
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
      </main>
    </div>
  );
};

export default BrowseInternships;