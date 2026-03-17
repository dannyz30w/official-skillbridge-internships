import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { trackEvent } from "@/lib/analytics";
import SEOHead from "@/components/SEOHead";
import LandingNav from "@/components/LandingNav";
import LandingFooter from "@/components/LandingFooter";
import LoadingScreen from "@/components/LoadingScreen";
import skillbridgeLogo from "@/assets/skillbridge-logo.png";

const VIDEO_URL = "https://ussszdsedbqjgktsxxpx.supabase.co/storage/v1/object/public/vidd/5606315-uhd_3840_2160_30fps.mp4";

const CATEGORIES = ["Tech and Software", "Creative and Design", "Healthcare and Wellness", "Food and Hospitality", "Trades and Construction", "Marketing and Social Media", "Education and Tutoring", "Finance", "Retail", "Nonprofit"];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "SkillBridge",
  "url": "https://skillbridgeintern.org",
  "description": "SkillBridge connects young adults aged 16 to 22 with businesses offering paid internships.",
  "foundingDate": "2025",
  "sameAs": []
};

/* --- Counter Hook --- */
const useCountUp = (target: number, duration = 1200) => {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-64px" });
  useEffect(() => {
    if (!inView) return;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setVal(Math.floor(ease * target));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, target, duration]);
  return { val, ref };
};

/* --- Section Reveal --- */
const Reveal = ({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-64px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const Index = () => {
  const [loading, setLoading] = useState(true);
  const [howView, setHowView] = useState<"intern" | "business">("intern");

  const internSteps = [
    { num: "01", title: "Create your profile in five minutes", desc: "Fill out your portfolio with your interests and background. No resume needed." },
    { num: "02", title: "Browse paid internships near you or remote", desc: "Search real opportunities from verified businesses. Filter by category, location, and pay." },
    { num: "03", title: "Apply with one click, no resume required", desc: "Your profile does the heavy lifting. Hit apply and you are done." },
    { num: "04", title: "Earn a verified skill certificate", desc: "Build real experience, earn real pay, and grow your professional portfolio." },
  ];
  const businessSteps = [
    { num: "01", title: "Post your listing in ten minutes", desc: "Simple form with role details, pay rate, and skills learned." },
    { num: "02", title: "Browse matched applicants through admin-verified queue", desc: "Every listing goes through review before going live." },
    { num: "03", title: "Hire through the platform", desc: "Review portfolios, accept candidates, and message them directly." },
    { num: "04", title: "Build your talent pipeline", desc: "Develop relationships with motivated young professionals." },
  ];
  const steps = howView === "intern" ? internSteps : businessSteps;

  const stat1 = useCountUp(2800);
  const stat2 = useCountUp(80);
  const stat3 = useCountUp(100);

  if (loading) {
    return (
      <AnimatePresence mode="wait">
        <LoadingScreen onComplete={() => setLoading(false)} />
      </AnimatePresence>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }} style={{ background: "#0a0a0f" }} className="min-h-screen">
      <SEOHead
        title="SkillBridge, Paid Internships for Young Adults Aged 16 to 22"
        description="SkillBridge connects motivated young adults aged 16 to 22 with local and remote businesses offering real paid internships. No experience required. Apply in minutes."
        path="/"
        keywords="paid internships for teens, internships for high school students, paid internships no experience, internships for 16 year olds, entry level internships, local internships for students"
        jsonLd={jsonLd}
      />

      {/* === HERO === */}
      <section className="relative min-h-screen overflow-hidden">
        {/* Video BG */}
        <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover z-0" aria-hidden="true">
          <source src={VIDEO_URL} type="video/mp4" />
        </video>
        {/* Bottom gradient blend */}
        <div className="absolute bottom-0 left-0 right-0 h-[300px] z-[1]" style={{ background: "linear-gradient(to bottom, transparent, #0a0a0f)" }} />

        <LandingNav />

        {/* Hero content */}
        <div className="relative z-10 flex flex-col items-start px-6 md:px-16 lg:px-24 pt-24 md:pt-32 pb-32 md:pb-40 max-w-[700px]">
          {/* Badge */}
          <div className="liquid-glass rounded-full px-4 py-1.5 text-xs font-medium text-white/80 uppercase tracking-widest animate-fade-rise" style={{ fontFamily: "var(--font-body)" }}>
            WSI Impact League Finalist · Top 80 of 2,800+
          </div>

          {/* Headline */}
          <h1 className="mt-8 animate-fade-rise-delay" style={{ fontFamily: "var(--font-display)" }}>
            <span className="block text-4xl sm:text-5xl md:text-7xl italic" style={{ fontWeight: 200, color: "rgba(245,245,245,0.7)" }}>
              Your first real job.
            </span>
            <span className="block text-5xl sm:text-6xl md:text-8xl italic mt-2" style={{ fontWeight: 400, color: "white" }}>
              Paid. No experience needed.
            </span>
          </h1>

          {/* Subtext */}
          <p className="mt-6 text-base md:text-lg font-light text-white/60 max-w-lg leading-relaxed animate-fade-rise-delay-2" style={{ fontFamily: "var(--font-body)" }}>
            SkillBridge connects motivated young adults aged 16 to 22 with local businesses offering real paid internships. No resume required. No connections needed.
          </p>

          {/* Split Pill CTA */}
          <div className="mt-8 animate-fade-rise-delay-3">
            <div className="liquid-glass-strong rounded-full flex w-fit sm:w-[380px]">
              <Link
                to="/signup"
                onClick={() => trackEvent("signup_cta_clicked")}
                className="flex-1 text-center text-sm text-white px-6 sm:px-8 py-4 hover:bg-white/5 transition-colors rounded-l-full"
                style={{ fontFamily: "var(--font-body)" }}
              >
                Find an Internship
              </Link>
              <div className="w-px" style={{ background: "rgba(255,255,255,0.15)" }} />
              <Link
                to="/for-businesses"
                className="flex-1 text-center text-sm text-white px-6 sm:px-8 py-4 hover:bg-white/5 transition-colors rounded-r-full"
                style={{ fontFamily: "var(--font-body)" }}
              >
                Post an Internship
              </Link>
            </div>
          </div>

          {/* Trust line */}
          <p className="mt-4 text-xs text-white/40 animate-fade-rise-delay-3" style={{ fontFamily: "var(--font-body)" }}>
            Free to sign up · Every internship is paid · Verified businesses only
          </p>
        </div>
      </section>

      {/* === STATS BAR === */}
      <section className="py-16 px-6" style={{ background: "#0a0a0f" }}>
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { val: stat1.val.toLocaleString() + "+", label: "Global participants recognized", ref: stat1.ref },
            { val: "16\u201322", label: "Age group we serve", ref: null },
            { val: stat3.val + "%", label: "Paid internships only", ref: stat3.ref },
            { val: "Top " + stat2.val, label: "WSI Impact League ranking", ref: stat2.ref },
          ].map((s, i) => (
            <div key={i} ref={s.ref} className="liquid-glass rounded-2xl px-6 py-6 text-center">
              <p className="text-3xl md:text-4xl italic text-white" style={{ fontFamily: "var(--font-display)" }}>{s.val}</p>
              <p className="text-xs text-white/50 uppercase tracking-widest mt-2" style={{ fontFamily: "var(--font-body)" }}>{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* === HOW IT WORKS === */}
      <section className="py-24 md:py-32 px-6 md:px-16" style={{ background: "#0a0a0f" }}>
        <div className="max-w-4xl mx-auto">
          <Reveal>
            <div className="liquid-glass rounded-full px-4 py-1.5 text-xs uppercase tracking-widest text-white/70 w-fit mb-6" style={{ fontFamily: "var(--font-body)" }}>How It Works</div>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="text-4xl md:text-5xl italic text-white" style={{ fontFamily: "var(--font-display)" }}>You dream it. We bridge it.</h2>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="mt-6 font-light text-white/60 text-lg max-w-xl" style={{ fontFamily: "var(--font-body)" }}>
              Share your goals. Browse real paid opportunities. Apply in minutes. Build the career you deserve.
            </p>
          </Reveal>

          {/* Toggle */}
          <Reveal delay={0.2}>
            <div className="mt-10 liquid-glass rounded-full inline-flex p-1">
              {(["intern", "business"] as const).map(v => (
                <button
                  key={v}
                  onClick={() => setHowView(v)}
                  className="px-6 py-2 rounded-full text-sm font-medium transition-all"
                  style={howView === v
                    ? { background: "rgba(79,70,229,0.9)", color: "white", fontFamily: "var(--font-body)" }
                    : { color: "rgba(255,255,255,0.5)", fontFamily: "var(--font-body)" }
                  }
                >
                  {v === "intern" ? "For Interns" : "For Businesses"}
                </button>
              ))}
            </div>
          </Reveal>

          {/* Steps */}
          <div className="mt-16 space-y-16">
            {steps.map((step, i) => {
              const isEven = i % 2 === 0;
              return (
                <Reveal key={`${howView}-${step.num}`} delay={i * 0.08}>
                  <div className={`flex items-start gap-8 md:gap-16 ${isEven ? "" : "flex-row-reverse text-right"}`}>
                    <span className="flex-shrink-0 text-[120px] md:text-[180px] leading-none italic text-white/[0.04]" style={{ fontFamily: "var(--font-display)" }}>{step.num}</span>
                    <div className="pt-8">
                      <h3 className="text-xl md:text-2xl font-bold text-white" style={{ fontFamily: "var(--font-heading)" }}>{step.title}</h3>
                      <p className="mt-3 font-light text-white/50 text-base" style={{ fontFamily: "var(--font-body)" }}>{step.desc}</p>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* === OPPORTUNITY GAP === */}
      <section className="py-24 px-6" style={{ background: "#0a0a0f" }}>
        <div className="max-w-3xl mx-auto">
          <Reveal>
            <h2 className="text-3xl md:text-4xl italic text-white text-center mb-16" style={{ fontFamily: "var(--font-display)" }}>The opportunity gap is real.</h2>
          </Reveal>
          <div className="grid md:grid-cols-2 gap-8">
            <Reveal delay={0.1}>
              <div className="text-center">
                <p className="text-sm text-white/50 mb-4 uppercase tracking-widest" style={{ fontFamily: "var(--font-body)" }}>Without SkillBridge</p>
                <div className="h-3 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                  <motion.div className="h-full rounded-full" style={{ background: "rgba(255,59,48,0.4)" }} initial={{ width: 0 }} whileInView={{ width: "15%" }} viewport={{ once: true }} transition={{ duration: 1.2, ease: "easeOut" }} />
                </div>
                <p className="mt-3 text-sm text-white/40" style={{ fontFamily: "var(--font-body)" }}>15% of young adults without networks land meaningful first work.</p>
              </div>
            </Reveal>
            <Reveal delay={0.3}>
              <div className="text-center">
                <p className="text-sm text-white/50 mb-4 uppercase tracking-widest" style={{ fontFamily: "var(--font-body)" }}>With SkillBridge</p>
                <div className="h-3 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                  <motion.div className="h-full rounded-full" style={{ background: "rgba(79,70,229,0.7)" }} initial={{ width: 0 }} whileInView={{ width: "100%" }} viewport={{ once: true }} transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }} />
                </div>
                <p className="mt-3 text-sm text-white/40" style={{ fontFamily: "var(--font-body)" }}>Verified paid opportunities. Open to all.</p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* === CATEGORY MARQUEE === */}
      <section className="py-16 overflow-hidden" style={{ background: "#0a0a0f" }}>
        <div className="space-y-4">
          {[0, 1].map(row => (
            <div key={row} className="flex overflow-hidden">
              <div className={row === 0 ? "flex gap-4 animate-marquee-left" : "flex gap-4 animate-marquee-right"}>
                {[...CATEGORIES, ...CATEGORIES].map((c, i) => (
                  <span key={`${row}-${i}`} className="liquid-glass rounded-full px-5 py-2 text-sm text-white/70 whitespace-nowrap flex-shrink-0" style={{ fontFamily: "var(--font-body)" }}>{c}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* === WSI CREDENTIAL === */}
      <section className="py-24 px-6 text-center" style={{ background: "#0a0a0f" }}>
        <Reveal>
          <div className="liquid-glass-strong rounded-3xl max-w-2xl mx-auto p-10 md:p-12">
            <div className="liquid-glass rounded-full px-4 py-1.5 text-xs text-white/70 uppercase tracking-widest w-fit mx-auto mb-6" style={{ fontFamily: "var(--font-body)" }}>Recognition</div>
            <h2 className="text-3xl md:text-5xl italic text-white" style={{ fontFamily: "var(--font-display)" }}>Built to close the opportunity gap.</h2>
            <p className="mt-6 font-light text-white/60 text-base leading-relaxed max-w-lg mx-auto" style={{ fontFamily: "var(--font-body)" }}>
              SkillBridge was recognized as a Global Finalist in the NFTE World Series of Innovation, placing in the top 2.8% of 2,800 participants worldwide. Built as a solo innovator. Built for every young person who deserves a fair shot.
            </p>
            <p className="mt-6 text-sm text-white/50" style={{ fontFamily: "var(--font-body)" }}>WSI Impact League Finalist · Top 80 / 2,800+</p>
          </div>
        </Reveal>
      </section>

      {/* === MISSION PARALLAX === */}
      <section className="py-24 md:py-32 px-6" style={{ background: "#0a0a0f" }}>
        <div className="max-w-3xl mx-auto text-center">
          <Reveal>
            <blockquote className="text-3xl md:text-5xl italic text-white leading-[1.15]" style={{ fontFamily: "var(--font-display)" }}>
              "Millions of young people graduate ready to work, but locked out by a system that demands experience before giving them a chance."
            </blockquote>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="mt-8 font-light text-white/50 text-lg" style={{ fontFamily: "var(--font-body)" }}>SkillBridge exists to break that cycle.</p>
          </Reveal>
          <Reveal delay={0.25}>
            <Link to="/mission" className="liquid-glass rounded-full px-6 py-3 text-sm text-white hover:scale-[1.03] transition-transform inline-block mt-8" style={{ fontFamily: "var(--font-body)" }}>
              Read our full mission
            </Link>
          </Reveal>
        </div>
      </section>

      {/* === CTA FOOTER === */}
      <section className="py-24 md:py-32 px-8 text-center" style={{ background: "#0a0a0f" }}>
        <Reveal>
          <h2 className="text-5xl md:text-7xl italic text-white" style={{ fontFamily: "var(--font-display)" }}>Your next career starts here.</h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mt-6 font-light text-white/60 text-lg" style={{ fontFamily: "var(--font-body)" }}>Paid internships. No experience required. Apply in minutes.</p>
        </Reveal>
        <Reveal delay={0.2}>
          <div className="mt-10 flex flex-col items-center gap-4">
            <Link to="/signup" onClick={() => trackEvent("signup_cta_clicked")} className="liquid-glass-strong rounded-full px-14 py-5 text-base text-white font-medium hover:scale-[1.03] transition-transform" style={{ fontFamily: "var(--font-body)" }}>
              Find an Internship
            </Link>
            <Link to="/for-businesses" className="liquid-glass rounded-full px-8 py-3 text-sm text-white/60 hover:text-white transition-colors" style={{ fontFamily: "var(--font-body)" }}>
              I am a business looking to hire &rarr;
            </Link>
          </div>
        </Reveal>

        <LandingFooter />
      </section>
    </motion.div>
  );
};

export default Index;
