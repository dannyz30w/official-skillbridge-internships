import { motion, useAnimation } from "framer-motion";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { trackEvent } from "@/lib/analytics";

const ease = [0.16, 1, 0.3, 1] as const;

const MOCK_CARDS = [
  { title: "Marketing Intern", company: "Bloom Studio", pay: "$17/hr", location: "Remote", color: 'rgba(79,70,229,0.08)' },
  { title: "Design Assistant", company: "Craft & Co.", pay: "$16/hr", location: "Brooklyn, NY", color: 'rgba(16,185,129,0.08)' },
  { title: "Social Media Intern", company: "Hive Digital", pay: "$15/hr", location: "Austin, TX", color: 'rgba(245,158,11,0.08)' },
];

const HeroSection = () => {
  const [topIndex, setTopIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTopIndex(p => (p + 1) % 3);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="pt-32 pb-16 sm:pb-24 px-4 sm:px-6" style={{ paddingTop: 'max(128px, calc(64px + env(safe-area-inset-top) + 64px))' }}>
      <div className="container mx-auto max-w-5xl">
        <div className="flex flex-col lg:flex-row items-start gap-16">
          {/* Left side - 60% */}
          <div className="w-full lg:w-[60%]">
            <motion.h1
              className="font-display"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease }}
            >
              <span style={{ fontWeight: 200, fontSize: 'clamp(2rem, 4.5vw, 3.2rem)', lineHeight: 1.1, opacity: 0.6, display: 'block', letterSpacing: '-0.02em' }}>
                Your first real job.
              </span>
              <span style={{ fontWeight: 800, fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', lineHeight: 1.08, display: 'block', letterSpacing: '-0.02em', marginTop: 8 }}>
                Paid. No experience needed.
              </span>
            </motion.h1>

            <motion.p
              className="mt-6"
              style={{ color: 'rgba(60,60,67,0.6)', fontSize: 17, lineHeight: 1.65, maxWidth: 400 }}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease, delay: 0.05 }}
            >
              Real internships from verified businesses. Apply in minutes.
            </motion.p>

            {/* Split Pill CTA */}
            <motion.div
              className="mt-8"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease, delay: 0.1 }}
            >
              <div className="inline-flex w-full sm:w-[380px] rounded-[14px] overflow-hidden" style={{
                background: 'rgba(255,255,255,0.55)',
                backdropFilter: 'blur(16px) saturate(180%)',
                WebkitBackdropFilter: 'blur(16px) saturate(180%)',
                border: '1px solid rgba(255,255,255,0.5)',
                boxShadow: '0 4px 16px rgba(0,0,0,0.07), inset 0 1px 0 rgba(255,255,255,0.9)',
              }}>
                <Link
                  to="/signup"
                  onClick={() => trackEvent('signup_cta_clicked')}
                  className="flex-1 text-center py-3.5 text-small font-semibold transition-all duration-200"
                  style={{ color: '#4F46E5', borderRight: '1px solid rgba(255,255,255,0.5)' }}
                  onMouseEnter={e => { (e.target as HTMLElement).style.background = 'rgba(79,70,229,0.08)'; }}
                  onMouseLeave={e => { (e.target as HTMLElement).style.background = 'transparent'; }}
                >
                  Find an Internship
                </Link>
                <Link
                  to="/for-businesses"
                  className="flex-1 text-center py-3.5 text-small font-semibold transition-all duration-200"
                  style={{ color: '#1C1C1E' }}
                  onMouseEnter={e => { (e.target as HTMLElement).style.background = 'rgba(0,0,0,0.03)'; }}
                  onMouseLeave={e => { (e.target as HTMLElement).style.background = 'transparent'; }}
                >
                  Post an Internship
                </Link>
              </div>
            </motion.div>

            <motion.p
              className="mt-4 text-caption"
              style={{ color: 'rgba(60,60,67,0.4)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              WSI Impact League Finalist &middot; Top 80 of 2,800+ participants
            </motion.p>
          </div>

          {/* Right side - card stack */}
          <div className="hidden lg:block w-[40%] relative" style={{ height: 320 }}>
            {MOCK_CARDS.map((card, i) => {
              const order = (i - topIndex + 3) % 3;
              const rotation = order === 0 ? 0 : order === 1 ? -3 : -6;
              const yOffset = order * 12;
              const scale = 1 - order * 0.03;
              const zIndex = 3 - order;
              return (
                <motion.div
                  key={card.title}
                  className="absolute top-0 left-0 right-0 glass-card-sm p-6"
                  style={{ zIndex, pointerEvents: 'none' }}
                  animate={{ rotate: rotation, y: yOffset, scale, opacity: order < 3 ? 1 : 0 }}
                  transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
                >
                  <p className="text-caption font-semibold uppercase tracking-wider" style={{ color: 'rgba(60,60,67,0.5)' }}>{card.company}</p>
                  <h3 className="font-display font-bold text-h4 mt-1">{card.title}</h3>
                  <div className="flex gap-4 mt-3 text-small" style={{ color: 'rgba(60,60,67,0.6)' }}>
                    <span style={{ color: '#10B981' }}>{card.pay}</span>
                    <span>{card.location}</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
