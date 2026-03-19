import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Briefcase, MapPin, DollarSign, Clock, Loader2, Send, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import SEOHead from "@/components/SEOHead";
import Navbar from "@/components/Navbar";
import { GlowingEffect } from "@/components/ui/glowing-effect";

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
    <div className="min-h-screen flex flex-col" style={{ background: 'transparent' }}>
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
      <Navbar />

      <div className="flex-1 py-24 px-4 sm:px-6 relative z-10">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <h1 className="font-display text-h1 font-bold ocean-title" style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic' }}>
              Browse Internships
            </h1>
            <p className="mt-2 text-body ocean-copy" style={{ fontFamily: 'var(--font-body)' }}>
              Real roles, real pay, from vetted companies.
            </p>

            <div className="mt-8 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none" style={{ color: 'rgba(203,213,225,0.5)' }} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by role, company, or location..."
                className="w-full h-12 pl-11 pr-4 rounded-xl text-[15px] ocean-input"
                style={{ fontFamily: 'var(--font-body)' }}
                aria-label="Search internships"
              />
            </div>

            <div className="mt-8 space-y-4">
              {loading ? (
                <div className="py-16 flex flex-col items-center justify-center">
                  <Loader2 className="h-6 w-6 animate-spin" style={{ color: 'rgba(203,213,225,0.5)' }} />
                  <p className="mt-3 text-small ocean-copy" style={{ fontFamily: 'var(--font-body)' }}>Loading internships...</p>
                </div>
              ) : filtered.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="ocean-panel rounded-2xl p-12 flex flex-col items-center justify-center text-center"
                >
                  <div className="flex items-center justify-center h-12 w-12 rounded-xl mb-4" style={{ background: 'rgba(79,70,229,0.12)' }}>
                    <Briefcase className="h-6 w-6" style={{ color: 'rgba(165,180,252,0.6)' }} />
                  </div>
                  <h3 className="text-h4 font-bold ocean-title" style={{ fontFamily: 'var(--font-body)' }}>
                    {searchQuery ? "No results found" : "No internships yet"}
                  </h3>
                  <p className="mt-2 text-small ocean-copy max-w-sm" style={{ fontFamily: 'var(--font-body)' }}>
                    {searchQuery
                      ? "Try a different search term or browse all listings."
                      : "Check back soon — new internships are added regularly."}
                  </p>
                  {user && (
                    <p className="mt-4 text-small ocean-copy">
                      Are you a business?{" "}
                      <Link to="/post-internship" className="font-medium" style={{ color: '#818CF8' }}>
                        Post an internship
                      </Link>
                    </p>
                  )}
                </motion.div>
              ) : (
                <AnimatePresence>
                  {filtered.map((internship, i) => {
                    const isOwner = user?.id === internship.posted_by;
                    const hasApplied = appliedIds.has(internship.id);
                    const isExpanded = expandedId === internship.id;

                    return (
                      <motion.div
                        key={internship.id}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1], delay: i * 0.03 }}
                        className="relative rounded-2xl"
                      >
                        <GlowingEffect spread={40} glow={true} disabled={false} proximity={64} inactiveZone={0.01} borderWidth={2} />
                        <div className="ocean-panel rounded-2xl p-5 sm:p-6 card-hover">
                        <div className="flex items-start justify-between gap-4">
                          <div className="min-w-0 flex-1">
                            <p className="text-caption font-semibold uppercase tracking-wider" style={{ color: 'rgba(165,180,252,0.8)', fontFamily: 'var(--font-body)' }}>
                              {internship.company_name}
                            </p>
                            <h3 className="mt-1 text-h4 font-bold ocean-title leading-snug" style={{ fontFamily: 'var(--font-body)' }}>
                              {internship.title}
                            </h3>
                            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-small" style={{ color: 'rgba(203,213,225,0.72)', fontFamily: 'var(--font-body)' }}>
                              <span className="inline-flex items-center gap-1.5">
                                <MapPin className="h-3.5 w-3.5" /> {internship.location}
                              </span>
                              <span className="inline-flex items-center gap-1.5" style={{ color: 'rgba(134,239,172,0.85)' }}>
                                <DollarSign className="h-3.5 w-3.5" /> {internship.pay}
                              </span>
                              <span className="inline-flex items-center gap-1.5">
                                <Clock className="h-3.5 w-3.5" /> {internship.type}
                              </span>
                            </div>
                          </div>
                        </div>

                        <p className="mt-4 text-small leading-relaxed line-clamp-3" style={{ color: 'rgba(226,232,240,0.72)', fontFamily: 'var(--font-body)' }}>
                          {internship.description}
                        </p>

                        <div className="mt-5 flex items-center justify-end gap-3">
                          {isOwner ? (
                            <span className="text-caption font-medium px-3 py-1.5 rounded-full" style={{ background: 'rgba(79,70,229,0.12)', color: 'rgba(165,180,252,0.8)' }}>
                              Your listing
                            </span>
                          ) : hasApplied ? (
                            <span className="inline-flex items-center gap-1.5 text-caption font-medium px-3 py-1.5 rounded-full" style={{ background: 'rgba(16,185,129,0.12)', color: 'rgba(134,239,172,0.9)' }}>
                              <CheckCircle2 className="h-3.5 w-3.5" /> Applied
                            </span>
                          ) : user ? (
                            <div className="flex flex-col items-end gap-2 w-full sm:w-auto">
                              {isExpanded ? (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: 'auto' }}
                                  exit={{ opacity: 0, height: 0 }}
                                  className="w-full flex flex-col sm:flex-row items-stretch sm:items-center gap-2"
                                >
                                  <input
                                    type="text"
                                    value={applyNote}
                                    onChange={(e) => setApplyNote(e.target.value)}
                                    placeholder="Add a short note (optional)"
                                    className="flex-1 h-9 px-3 rounded-lg text-small ocean-input"
                                    style={{ fontFamily: 'var(--font-body)' }}
                                  />
                                  <motion.button
                                    onClick={() => handleApply(internship.id)}
                                    disabled={applyingTo === internship.id}
                                    className="btn-glass-primary h-9 px-4 text-small font-semibold inline-flex items-center justify-center gap-2 disabled:opacity-50"
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
                                    onClick={() => { setExpandedId(null); setApplyNote(''); }}
                                    className="text-small transition-colors"
                                    style={{ color: 'rgba(203,213,225,0.6)' }}
                                  >
                                    Cancel
                                  </button>
                                </motion.div>
                              ) : (
                                <motion.button
                                  onClick={() => setExpandedId(internship.id)}
                                  className="btn-glass-primary h-9 px-4 text-small font-semibold inline-flex items-center justify-center gap-2"
                                  whileTap={{ scale: 0.97 }}
                                >
                                  <Send className="h-3.5 w-3.5" /> Apply Now
                                </motion.button>
                              )}
                            </div>
                          ) : (
                            <Link
                              to="/signin"
                              className="liquid-glass-strong rounded-full px-4 py-2 text-small text-white font-medium hover:scale-[1.02] transition-transform"
                              style={{ fontFamily: 'var(--font-body)' }}
                            >
                              Sign in to apply
                            </Link>
                          )}
                        </div>
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
