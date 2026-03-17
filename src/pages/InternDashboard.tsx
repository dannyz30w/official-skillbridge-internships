import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Home, Search, Briefcase, FileText, Bell, Settings, LogOut, Loader2, CheckCircle2, MapPin, DollarSign, Clock, Send, Globe } from "lucide-react";
import skillbridgeLogo from "@/assets/skillbridge-logo.png";
import SEOHead from "@/components/SEOHead";

const db = supabase as any;
const inputCls = "w-full h-[48px] px-4 rounded-xl text-[15px] glass-input";
const labelCls = "block text-small font-medium mb-2";
const TRAITS = ['Hardworking','Creative','Detail-oriented','Fast learner','Team player','Independent','Communicator','Problem solver','Reliable','Ambitious','Adaptable','Curious','Leadership','Organized','Punctual','Empathetic','Tech-savvy','Initiative-taker'];
const LANG_OPTIONS = ['English', 'Spanish', 'French', 'Mandarin', 'Cantonese', 'Arabic', 'Portuguese', 'Other'];
const PROFICIENCY = ['Native', 'Fluent', 'Intermediate', 'Basic'];

interface Listing { id: string; business_id: string; title: string; description: string; work_setting: string; location: string; pay_rate: string; hours_per_week: string; duration: string; preferred_languages: string[]; skills_learned: string[]; created_at: string; }
interface Application { id: string; listing_id: string; status: string; applied_at: string; }
interface Profile { first_name: string; last_name: string; date_of_birth: string | null; city: string; school: string; gpa: number | null; gpa_scale: string; phone: string; languages: any[]; traits: string[]; }

const TABS = [
  { id: 'home', label: 'Dashboard', icon: Home },
  { id: 'browse', label: 'Browse', icon: Search },
  { id: 'applications', label: 'Applications', icon: Briefcase },
  { id: 'portfolio', label: 'Portfolio', icon: FileText },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'settings', label: 'Settings', icon: Settings },
];

const ease = [0.16, 1, 0.3, 1] as const;
const mobileTabs = [{ id:'home',label:'Home',icon:Home},{id:'browse',label:'Browse',icon:Search},{id:'applications',label:'Applications',icon:Briefcase},{id:'notifications',label:'Messages',icon:Bell},{id:'portfolio',label:'Profile',icon:FileText}];

const InternDashboard = () => {
  const { user, signOut } = useAuth();
  const [tab, setTab] = useState('home');
  const [listings, setListings] = useState<Listing[]>([]);
  const [myApps, setMyApps] = useState<Application[]>([]);
  const [appliedIds, setAppliedIds] = useState<Set<string>>(new Set());
  const [weeklyCount, setWeeklyCount] = useState(0);
  const [messages, setMessages] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [profile, setProfile] = useState<Profile>({ first_name: '', last_name: '', date_of_birth: null, city: '', school: '', gpa: null, gpa_scale: '', phone: '', languages: [], traits: [] });
  const [bizNames, setBizNames] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [applyingTo, setApplyingTo] = useState<string | null>(null);
  const [savingProfile, setSavingProfile] = useState(false);
  const [listingTitles, setListingTitles] = useState<Record<string, string>>({});

  useEffect(() => { fetchProfile(); fetchWeeklyCount(); fetchNotifications(); }, []);
  useEffect(() => { if (tab === 'browse') fetchListings(); if (tab === 'applications') fetchApps(); if (tab === 'notifications') fetchNotifications(); }, [tab]);

  const fetchProfile = async () => { const { data } = await db.from('intern_profiles').select('*').eq('user_id', user?.id).maybeSingle(); if (data) setProfile(data); };
  const fetchListings = async () => {
    setLoading(true);
    const { data } = await db.from('listings').select('*').eq('status', 'live').order('created_at', { ascending: false });
    if (data) { setListings(data); const ids = [...new Set(data.map((l: any) => l.business_id))] as string[]; await loadBizNames(ids); }
    const { data: apps } = await db.from('listing_applications').select('listing_id').eq('intern_id', user?.id);
    if (apps) setAppliedIds(new Set(apps.map((a: any) => a.listing_id)));
    setLoading(false);
  };
  const loadBizNames = async (ids: string[]) => {
    if (!ids.length) return;
    const { data } = await db.from('business_profiles').select('user_id, business_name').in('user_id', ids);
    if (data) { const m: Record<string, string> = {}; data.forEach((b: any) => m[b.user_id] = b.business_name); setBizNames(p => ({ ...p, ...m })); }
  };
  const fetchApps = async () => {
    setLoading(true);
    const { data } = await db.from('listing_applications').select('*').eq('intern_id', user?.id).order('applied_at', { ascending: false });
    if (data) {
      setMyApps(data);
      const lIds = [...new Set(data.map((a: any) => a.listing_id))] as string[];
      if (lIds.length) { const { data: ls } = await db.from('listings').select('id, title, business_id').in('id', lIds); if (ls) { const t: Record<string, string> = {}; ls.forEach((l: any) => t[l.id] = l.title); setListingTitles(t); await loadBizNames(ls.map((l: any) => l.business_id)); } }
    }
    setLoading(false);
  };
  const fetchWeeklyCount = async () => {
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const { count } = await db.from('listing_applications').select('*', { count: 'exact', head: true }).eq('intern_id', user?.id).gte('applied_at', weekAgo);
    setWeeklyCount(count || 0);
  };
  const fetchNotifications = async () => {
    const { data } = await db.from('messages').select('*').eq('intern_id', user?.id).order('sent_at', { ascending: false });
    if (data) { setMessages(data); setUnreadCount(data.filter((m: any) => !m.read).length); }
  };

  const handleApply = async (listingId: string) => {
    if (weeklyCount >= 5) { toast.error("You have reached your weekly application limit (5/5). Try again next week."); return; }
    setApplyingTo(listingId);
    const { error } = await db.from('listing_applications').insert({ intern_id: user?.id, listing_id: listingId });
    setApplyingTo(null);
    if (error) { if (error.message?.includes('Weekly application limit')) toast.error("Weekly application limit reached."); else if (error.code === '23505') toast.error("Already applied."); else toast.error(error.message); return; }
    setAppliedIds(p => new Set([...p, listingId]));
    setWeeklyCount(p => p + 1);
    toast.success("Application submitted!");
  };

  const saveProfile = async () => {
    if (profile.gpa && !profile.gpa_scale.trim()) { toast.error('Scale is required when GPA is filled.'); return; }
    if ((profile.traits || []).length !== 3) { toast.error('Please select exactly 3 traits.'); return; }
    setSavingProfile(true);
    const { error } = await db.from('intern_profiles').update({
      first_name: profile.first_name, last_name: profile.last_name, city: profile.city, school: profile.school,
      gpa: profile.gpa, gpa_scale: profile.gpa_scale || null, phone: profile.phone, languages: profile.languages,
      traits: profile.traits,
    }).eq('user_id', user?.id);
    setSavingProfile(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Portfolio saved!");
  };

  const markRead = async (id: string) => { await db.from('messages').update({ read: true }).eq('id', id); fetchNotifications(); };

  const filtered = useMemo(() => {
    if (!searchQuery.trim()) return listings;
    const q = searchQuery.toLowerCase();
    return listings.filter(l => l.title.toLowerCase().includes(q) || (bizNames[l.business_id] || '').toLowerCase().includes(q) || l.location.toLowerCase().includes(q));
  }, [listings, searchQuery, bizNames]);

  const calcAge = (dob: string | null) => { if (!dob) return null; const b = new Date(dob); const t = new Date(); let a = t.getFullYear() - b.getFullYear(); if (t.getMonth() < b.getMonth() || (t.getMonth() === b.getMonth() && t.getDate() < b.getDate())) a--; return a; };

  const appStatusBadge = (s: string) => {
    const cls = s === 'accepted' ? 'badge-live' : s === 'rejected' ? 'badge-rejected' : 'badge-pending';
    return <span className={cls}>{s.charAt(0).toUpperCase() + s.slice(1)}</span>;
  };

  return (
    <div className="min-h-screen flex" style={{ background: '#F2F2F7' }}>
      <SEOHead title="Intern Dashboard" description="Manage your SkillBridge applications" path="/intern" noIndex />
      <aside className="hidden md:flex flex-col w-60 h-screen fixed left-0 top-0 glass-sidebar p-4 z-40">
        <div className="flex items-center gap-2 px-3 py-4"><img src={skillbridgeLogo} alt="SkillBridge" className="h-8 w-auto" width={128} height={32} /><span className="font-display font-bold text-small">Intern</span></div>
        <nav className="flex-1 mt-4 space-y-1" aria-label="Intern navigation">{TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-small font-medium transition-fast"
            style={tab === t.id ? { background: 'rgba(79, 70, 229, 0.1)', color: '#4F46E5' } : { color: 'rgba(60,60,67,0.6)' }}>
            <t.icon className="h-4 w-4" />{t.label}
            {t.id === 'notifications' && unreadCount > 0 && <span className="ml-auto text-caption font-semibold text-white rounded-full px-2 py-0.5" style={{ background: '#4F46E5' }}>{unreadCount}</span>}
          </button>
        ))}</nav>
        <button onClick={signOut} className="flex items-center gap-3 px-3 py-2.5 text-small transition-fast" style={{ color: 'rgba(60,60,67,0.6)' }}><LogOut className="h-4 w-4" />Sign Out</button>
      </aside>
      <div className="md:hidden fixed top-0 left-0 right-0 liquid-glass z-50 px-4 py-3" style={{ height: 96 }}>
        <div className="flex items-center justify-between"><div className="flex items-center gap-2"><img src={skillbridgeLogo} alt="SkillBridge" className="h-7 w-auto" width={112} height={28} /><span className="font-display font-bold text-caption">Intern</span></div><button onClick={signOut}><LogOut className="h-4 w-4" style={{ color: 'rgba(60,60,67,0.6)' }} /></button></div>
        <div className="flex gap-1 mt-3 overflow-x-auto pb-1">{TABS.map(t => (<button key={t.id} onClick={() => setTab(t.id)} className="flex-shrink-0 px-3 py-1.5 rounded-lg text-caption font-medium transition-fast" style={tab === t.id ? { background: 'rgba(79, 70, 229, 0.1)', color: '#4F46E5' } : { color: 'rgba(60,60,67,0.6)' }}>{t.label}{t.id === 'notifications' && unreadCount > 0 && <span className="ml-1 text-caption font-semibold text-white rounded-full px-1.5" style={{ background: '#4F46E5' }}>{unreadCount}</span>}</button>))}</div>
      </div>

      <main className="flex-1 md:ml-60 p-4 md:p-8 pt-28 md:pt-8">
        <motion.div key={tab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.38, ease }}>

          {tab === 'home' && <div className="stagger-children">
            <h1 className="font-display text-h2 font-bold mb-8">Dashboard</h1>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="glass-card p-6 text-center card-hover"><p className="text-h1 font-bold" style={{ color: '#4F46E5' }}>{weeklyCount}</p><p className="text-small mt-1" style={{ color: 'rgba(60,60,67,0.6)' }}>Applications this week</p><p className="text-caption" style={{ color: 'rgba(60,60,67,0.4)' }}>{weeklyCount}/5 limit</p></div>
              <div className="glass-card p-6 text-center card-hover"><p className="text-h1 font-bold">{myApps.length}</p><p className="text-small mt-1" style={{ color: 'rgba(60,60,67,0.6)' }}>Total Applications</p></div>
              <div className="glass-card p-6 text-center card-hover"><p className="text-h1 font-bold" style={{ color: '#10B981' }}>{myApps.filter(a => a.status === 'accepted').length}</p><p className="text-small mt-1" style={{ color: 'rgba(60,60,67,0.6)' }}>Accepted</p></div>
            </div>
          </div>}

          {tab === 'browse' && <div>
            <h1 className="font-display text-h2 font-bold mb-2">Browse Internships</h1>
            <p className="text-body mb-8" style={{ color: 'rgba(60,60,67,0.6)' }}>Real roles, real pay, from vetted companies.</p>
            <div className="relative mb-8"><Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: 'rgba(60,60,67,0.4)' }} />
              <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search by role, company, or location..." className="w-full h-[48px] pl-12 pr-4 rounded-xl text-[15px] glass-input" aria-label="Search internships" /></div>
            {loading ? <div className="skeleton-shimmer h-48 w-full" /> : filtered.length === 0 ? (
              <div className="glass-card p-16 text-center"><Briefcase className="h-10 w-10 mx-auto mb-4" style={{ color: 'rgba(60,60,67,0.3)' }} /><p style={{ color: 'rgba(60,60,67,0.6)' }}>{searchQuery ? 'No matches found.' : 'No internships available yet.'}</p></div>
            ) : <div className="space-y-4"><AnimatePresence mode="popLayout">{filtered.map((l, i) => (
              <motion.div key={l.id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ delay: i * 0.03, duration: 0.38, ease }}
                className="glass-card p-6 card-hover">
                <p className="text-caption font-semibold uppercase tracking-wider" style={{ color: 'rgba(60,60,67,0.6)' }}>{bizNames[l.business_id] || '...'}</p>
                <h3 className="font-display font-bold text-h4 mt-1">{l.title}</h3>
                <div className="flex flex-wrap gap-4 mt-2 text-small" style={{ color: 'rgba(60,60,67,0.6)' }}>
                  <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{l.work_setting === 'Remote' ? 'Remote' : l.location}</span>
                  <span className="flex items-center gap-1" style={{ color: '#10B981' }}><DollarSign className="h-3.5 w-3.5" />{l.pay_rate}</span>
                  {l.hours_per_week && <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{l.hours_per_week} hrs/week</span>}
                  {l.duration && <span>{l.duration}</span>}
                </div>
                {l.preferred_languages?.length > 0 && <div className="flex gap-1 mt-2">{l.preferred_languages.map(lang => <span key={lang} className="badge-remote text-caption flex items-center gap-1"><Globe className="h-3 w-3" />{lang}</span>)}</div>}
                <p className="text-small mt-3 line-clamp-2" style={{ color: 'rgba(60,60,67,0.6)' }}>{l.description}</p>
                <div className="mt-4 flex justify-end">
                  {appliedIds.has(l.id) ? (
                    <span className="badge-live flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5" />Applied</span>
                  ) : (
                    <button onClick={() => handleApply(l.id)} disabled={applyingTo === l.id}
                      className="btn-glass-primary h-9 px-4 text-small font-semibold inline-flex items-center gap-2 disabled:opacity-50" style={{ padding: '8px 16px' }}>
                      {applyingTo === l.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Send className="h-3.5 w-3.5" />Apply</>}
                    </button>
                  )}
                </div>
              </motion.div>
            ))}</AnimatePresence></div>}
          </div>}

          {tab === 'applications' && <div>
            <h1 className="font-display text-h2 font-bold mb-8">My Applications</h1>
            {loading ? <div className="skeleton-shimmer h-32 w-full" /> : myApps.length === 0 ? <p style={{ color: 'rgba(60,60,67,0.6)' }}>No applications yet.</p> :
            <div className="space-y-3">{myApps.map(a => (
              <div key={a.id} className="glass-card p-4 flex items-center justify-between card-hover">
                <div><h3 className="font-display font-bold">{listingTitles[a.listing_id] || '...'}</h3><p className="text-small" style={{ color: 'rgba(60,60,67,0.6)' }}>{new Date(a.applied_at).toLocaleDateString()}</p></div>
                {appStatusBadge(a.status)}
              </div>
            ))}</div>}
          </div>}

          {tab === 'portfolio' && <div>
            <h1 className="font-display text-h2 font-bold mb-8">My Portfolio</h1>
            <div className="glass-card p-8 max-w-2xl space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div><label htmlFor="pf-fn" className={labelCls} style={{ color: 'rgba(60,60,67,0.6)' }}>First Name</label><input id="pf-fn" value={profile.first_name} onChange={e => setProfile(p => ({ ...p, first_name: e.target.value }))} className={inputCls} /></div>
                <div><label htmlFor="pf-ln" className={labelCls} style={{ color: 'rgba(60,60,67,0.6)' }}>Last Name</label><input id="pf-ln" value={profile.last_name} onChange={e => setProfile(p => ({ ...p, last_name: e.target.value }))} className={inputCls} /></div>
              </div>
              {profile.date_of_birth && <div><label className={labelCls} style={{ color: 'rgba(60,60,67,0.6)' }}>Age</label><p className="text-body font-medium">{calcAge(profile.date_of_birth)} years old</p></div>}
              <div><label htmlFor="pf-city" className={labelCls} style={{ color: 'rgba(60,60,67,0.6)' }}>City</label><input id="pf-city" value={profile.city} onChange={e => setProfile(p => ({ ...p, city: e.target.value }))} placeholder="City, State" className={inputCls} /></div>
              <div><label htmlFor="pf-school" className={labelCls} style={{ color: 'rgba(60,60,67,0.6)' }}>School</label><input id="pf-school" value={profile.school} onChange={e => setProfile(p => ({ ...p, school: e.target.value }))} placeholder="School name" className={inputCls} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label htmlFor="pf-gpa" className={labelCls} style={{ color: 'rgba(60,60,67,0.6)' }}>GPA (Optional)</label><input id="pf-gpa" type="number" step="0.1" min="0" value={profile.gpa ?? ''} onChange={e => setProfile(p => ({ ...p, gpa: e.target.value ? parseFloat(e.target.value) : null }))} placeholder="3.7" className={inputCls} /></div>
                <div><label htmlFor="pf-scale" className={labelCls} style={{ color: 'rgba(60,60,67,0.6)' }}>Scale (e.g. 4.0)</label><input id="pf-scale" value={profile.gpa_scale || ''} onChange={e => setProfile(p => ({ ...p, gpa_scale: e.target.value }))} placeholder="4.0" className={inputCls} /></div>
              </div>
              <p className="text-small -mt-2" style={{ color: 'rgba(60,60,67,0.6)' }}>Please enter your unweighted GPA only.</p>
              <div><label htmlFor="pf-phone" className={labelCls} style={{ color: 'rgba(60,60,67,0.6)' }}>Phone Number (Optional)</label><input id="pf-phone" value={profile.phone} onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))} placeholder="(555) 123-4567" className={inputCls} /><p className="text-small mt-2" style={{ color: 'rgba(60,60,67,0.6)' }}>Only shared with businesses who accept your application.</p></div>
              <div><label className={labelCls} style={{ color: 'rgba(60,60,67,0.6)' }}>Languages and Proficiency</label>
                {(profile.languages || []).map((lang: any, i: number) => (
                  <div key={i} className="flex gap-2 mb-2">
                    <select value={lang.language || ''} onChange={e => { const n = [...(profile.languages || [])]; n[i] = { ...n[i], language: e.target.value }; setProfile(p => ({ ...p, languages: n })); }} className={inputCls + " flex-1"} aria-label={`Language ${i + 1}`}>
                      <option value="">Language...</option>{LANG_OPTIONS.map(l => <option key={l}>{l}</option>)}
                    </select>
                    <select value={lang.proficiency || ''} onChange={e => { const n = [...(profile.languages || [])]; n[i] = { ...n[i], proficiency: e.target.value }; setProfile(p => ({ ...p, languages: n })); }} className={inputCls + " flex-1"} aria-label={`Proficiency ${i + 1}`}>
                      <option value="">Level...</option>{PROFICIENCY.map(p => <option key={p}>{p}</option>)}
                    </select>
                    <button onClick={() => setProfile(p => ({ ...p, languages: (p.languages || []).filter((_: any, j: number) => j !== i) }))} className="text-small font-medium" style={{ color: '#FF3B30' }} aria-label="Remove language">X</button>
                  </div>
                ))}
                <button onClick={() => setProfile(p => ({ ...p, languages: [...(p.languages || []), { language: '', proficiency: '' }] }))} className="text-small font-semibold" style={{ color: '#4F46E5' }}>+ Add language</button>
              </div>
              <div><label className={labelCls} style={{ color: 'rgba(60,60,67,0.6)' }}>Pick 3 traits that best describe you as a worker</label>
                <div className="flex flex-wrap gap-2">{TRAITS.map(t => { const selected = (profile.traits || []).includes(t); return (
                  <button key={t} type="button" onClick={() => setProfile(p => { const current = p.traits || []; if (current.includes(t)) return { ...p, traits: current.filter(x => x !== t) }; const next = [...current, t]; return { ...p, traits: next.length > 3 ? next.slice(1) : next }; })} className="text-small px-3 py-1.5 rounded-full transition-fast"
                    style={selected ? { background: 'rgba(79, 70, 229, 0.28)', border: '1px solid rgba(79, 70, 229, 0.5)', color: '#312E81', transform: 'scale(1.02)' } : { background: 'transparent', border: '1px solid rgba(255,255,255,0.4)', color: 'rgba(60,60,67,0.75)' }}>
                    {t}
                  </button>
                ); })}</div>
                {(profile.traits || []).length !== 3 && <p className="text-small mt-2" style={{ color: '#FF3B30' }}>Please select exactly 3 traits.</p>}
              </div>
              <button onClick={saveProfile} disabled={savingProfile}
                className="w-full h-[48px] btn-glass-primary inline-flex items-center justify-center gap-2 disabled:opacity-50">
                {savingProfile ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving...</> : "Save Portfolio"}
              </button>
            </div>
          </div>}

          {tab === 'notifications' && <div>
            <h1 className="font-display text-h2 font-bold mb-8">Notifications</h1>
            {messages.length === 0 ? <p style={{ color: 'rgba(60,60,67,0.6)' }}>No notifications yet.</p> :
            <div className="space-y-3">{messages.map(m => (
              <div key={m.id} className={`glass-card p-4 card-hover cursor-pointer`} onClick={() => !m.read && markRead(m.id)}
                style={!m.read ? { borderColor: 'rgba(79, 70, 229, 0.3)' } : {}}>
                <div className="flex items-start justify-between">
                  <div>
                    {!m.read && <span className="inline-block w-2 h-2 rounded-full mr-2" style={{ background: '#4F46E5' }} />}
                    <span className="text-small" style={{ color: 'rgba(60,60,67,0.6)' }}>{new Date(m.sent_at).toLocaleString()}</span>
                  </div>
                </div>
                <p className="text-body mt-2">{m.content}</p>
                <p className="text-small mt-2 italic" style={{ color: 'rgba(60,60,67,0.6)' }}>A business has reached out to you. Contact them at the email or phone number provided in your notification.</p>
              </div>
            ))}</div>}
          </div>}

          {tab === 'settings' && <div>
            <h1 className="font-display text-h2 font-bold mb-8">Settings</h1>
            <div className="glass-card p-8"><p className="text-small mb-4" style={{ color: 'rgba(60,60,67,0.6)' }}>Signed in as: {user?.email}</p>
            <button onClick={signOut} className="btn-glass-destructive h-12 px-6 text-body font-semibold">Sign Out</button></div>
          </div>}

        </motion.div>
      </main>
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex items-start justify-around pt-1" style={{ background: "rgba(245,245,250,0.85)", backdropFilter: "blur(24px) saturate(200%)", borderTop: "1px solid rgba(255,255,255,0.5)", paddingBottom: "env(safe-area-inset-bottom)", height: "calc(56px + env(safe-area-inset-bottom))" }}>
        {mobileTabs.map((t: any) => { const Icon=t.icon; const active=tab===t.id; return <button key={t.id} onClick={() => setTab(t.id)} className="flex flex-col items-center justify-center gap-0.5 min-w-0 flex-1" style={{ color: active ? "#4F46E5" : "rgba(28,28,30,0.4)", fontFamily: "var(--font-body)" }}><Icon className="h-4 w-4" /><span className="text-[11px]">{t.label}</span><span className="h-1 w-1.5 rounded-full" style={{ background: active ? "#4F46E5" : "transparent" }} /></button>; })}
      </div>
    </div>
  );
};

export default InternDashboard;
