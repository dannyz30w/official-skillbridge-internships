import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Loader2, Send } from "lucide-react";
import { toast } from "sonner";
import { trackEvent } from "@/lib/analytics";
import Navbar from "@/components/Navbar";
import SEOHead from "@/components/SEOHead";

const ease = [0.16, 1, 0.3, 1] as const;

const ContactPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) { toast.error("Please fill in all fields."); return; }
    setLoading(true);
    trackEvent('contact_form_submitted');
    setLoading(false);
    toast.success("Message sent! We will get back to you soon.");
    setName(""); setEmail(""); setMessage("");
  };

  const inputCls = "w-full h-[48px] px-4 rounded-xl text-[16px] bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:border-indigo-400/50 focus:outline-none focus:ring-1 focus:ring-indigo-400/20 transition-all";

  return (
    <div className="min-h-screen" style={{ background: '#F2F2F7' }}>
      <SEOHead title="Contact SkillBridge" description="Reach out to the SkillBridge team. Questions, partnerships, or feedback — we respond to every message." path="/contact" jsonLd={{"@context":"https://schema.org","@type":"ContactPage","name":"Contact SkillBridge"}} />
      <Navbar />
      <main className="pt-32 pb-24 px-4 sm:px-6">
        <div className="mx-auto max-w-lg">
          <motion.h1 className="text-h1 font-bold text-white" style={{ fontFamily: "var(--font-display)", fontStyle: "italic" }} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease }}>
            Contact Us
          </motion.h1>
          <motion.p className="mt-4 text-body mb-12 text-white/50" style={{ fontFamily: "var(--font-body)" }} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05, duration: 0.5, ease }}>
            Questions, partnerships, or feedback. We would love to hear from you.
          </motion.p>

          <motion.form onSubmit={handleSubmit} className="liquid-glass-strong rounded-2xl p-8 space-y-6" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.5, ease }}>
            <div>
              <label htmlFor="contact-name" className="block text-small font-medium mb-2 text-white/50">Name</label>
              <input id="contact-name" type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Your name" className={inputCls} />
            </div>
            <div>
              <label htmlFor="contact-email" className="block text-small font-medium mb-2 text-white/50">Email</label>
              <input id="contact-email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" className={inputCls} />
            </div>
            <div>
              <label htmlFor="contact-msg" className="block text-small font-medium mb-2 text-white/50">Message</label>
              <textarea id="contact-msg" value={message} onChange={e => setMessage(e.target.value)} rows={5} placeholder="Your message..." className={inputCls + " !h-auto py-3"} />
            </div>
            <button type="submit" disabled={loading} className="w-full h-[48px] liquid-glass-strong rounded-xl text-white font-semibold inline-flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform disabled:opacity-50">
              {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Sending...</> : <><Send className="h-4 w-4" /> Send Message</>}
            </button>
          </motion.form>

          <motion.p className="mt-8 text-small text-center text-white/40" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
            You can also reach us at <a href="mailto:skillbridgeintern@gmail.com" style={{ color: '#818CF8' }} className="font-semibold">skillbridgeintern@gmail.com</a>
          </motion.p>
        </div>
      </main>
    </div>
  );
};

export default ContactPage;
