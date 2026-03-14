import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Home, Search, Briefcase, FileText, Bell, Settings, LogOut, Loader2, CheckCircle2, MapPin, DollarSign, Clock, Send, Globe } from "lucide-react";
import skillbridgeLogo from "@/assets/skillbridge-logo.png";

const db = supabase as any;
const inputCls = "w-full h-[44px] px-4 rounded-xl text-[15px] text-foreground placeholder:text-muted-foreground/50 glass-input";
const labelCls = "block text-[13px] font-medium tracking-[0.01em] text-muted-foreground mb-1.5";
const SKILLS_LIST = ['Communication', 'Teamwork', 'Problem Solving', 'Microsoft Office', 'Social Media', 'Customer Service', 'Data Entry', 'Writing', 'Research', 'Organization', 'Time Management', 'Leadership', 'Creativity', 'Public Speaking', 'Coding', 'Design', 'Marketing', 'Sales', 'Photography', 'Video Editing'];
const LANG_OPTIONS = ['English', 'Spanish', 'French', 'Mandarin', 'Cantonese', 'Arabic', 'Portuguese', 'Other'];
const PROFICIENCY = ['Native', 'Fluent', 'Intermediate', 'Basic'];

interface Listing { id: string; business_id: string; title: string; description: string; work_setting: string; location: string; pay_rate: string; hours_per_week: string; duration: string; preferred_languages: string[]; skills_learned: string[]; created_at: string; }
interface Application { id: string; listing_id: string; status: string; applied_at: string; }
interface Profile { first_name: string; last_name: string; date_of_birth: string | null; city: string; school: string; gpa: number | null; test_scores: string; phone: string; languages: any[]; skills: string[]; bio: string; }

const TABS = [
  { id: 'home', label: 'Dashboard', icon: Home },
  { id: 'browse', label: 'Browse', icon: Search },
  { id: 'applications', label: 'Applications', icon: Briefcase },
  { id: 'portfolio', label: 'Portfolio', icon: FileText },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'settings', label: 'Settings', icon: Settings },
];

const ease = [0.16, 1, 0.3, 1] as const;

const InternDashboard = () => {
  const { user, signOut } = useAuth();
  const [tab, setTab] = useState('home');
  const [listings, setListings] = useState<Listing[]>([]);
  const [myApps, setMyApps] = useState<Application[]>([]);
  const [appliedIds, setAppliedIds] = useState<Set<string>>(new Set());
  const [weeklyCount, setWeeklyCount] = useState(0);
  const [messages, setMessages] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [profile, setProfile] = useState<Profile>({ first_name: '', last_name: '', date_of_birth: null, city: '', school: '', gpa: null, test_scores: '', phone: '', languages: [], skills: [], bio: '' });
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
    if (data) { setListings(data); const ids: string[] = [...new Set(data.map((l: any) => l.business_id))] as string[]; await loadBizNames(ids); }
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
      const lIds: string[] = [...new Set(data.map((a: any) => a.listing_id))] as string[];
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
    if (weeklyCount >= 5) { toast.error("You've reached your weekly application limit (5/5). Try again next week."); return; }
    setApplyingTo(listingId);
    const { error } = await db.from('listing_applications').insert({ intern_id: user?.id, listing_id: listingId });
    setApplyingTo(null);
    if (error) { if (error.message?.includes('Weekly application limit')) toast.error("Weekly application limit reached."); else if (error.code === '23505') toast.error("Already applied."); else toast.error(error.message); return; }
    setAppliedIds(p => new Set([...p, listingId]));
    setWeeklyCount(p => p + 1);
    toast.success("Application submitted!");
  };

  const saveProfile = async () => {
    setSavingProfile(true);
    const { error } = await db.from('intern_profiles').update({
      first_name: profile.first_name, last_name: profile.last_name, city: profile.city, school: profile.school,
      gpa: profile.gpa, test_scores: profile.test_scores, phone: profile.phone, languages: profile.languages,
      skills: profile.skills, bio: profile.bio,
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
    <div className="min-h-screen flex bg-background">
      <aside className="hidden md:flex flex-col w-60 h-screen fixed left-0 top-0 glass-sidebar p-4 z-40">
        <div className="flex items-center gap-2 px-3 py-4"><img src={skillbridgeLogo} alt="" className="h-8 w-auto" /><span className="font-display font-bold text-sm">Intern</span></div>
        <nav className="flex-1 mt-4 space-y-1">{TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-fast ${tab === t.id ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
            style={tab === t.id ? { background: 'rgba(79, 70, 229, 0.1)' } : { background: 'transparent' }}>
            <t.icon className="h-4 w-4" />{t.label}
            {t.id === 'notifications' && unreadCount > 0 && <span className="ml-auto bg-primary text-primary-foreground text-xs rounded-full px-2 py-0.5">{unreadCount}</span>}
          </button>
        ))}</nav>
        <button onClick={signOut} className="flex items-center gap-3 px-3 py-2.5 text-[13px] text-muted-foreground hover:text-foreground transition-fast"><LogOut className="h-4 w-4" />Sign Out</button>
      </aside>
      <div className="md:hidden fixed top-0 left-0 right-0 liquid-glass z-50 px-4 py-3" style={{ height: 56 }}>
        <div className="flex items-center justify-between"><div className="flex items-center gap-2"><img src={skillbridgeLogo} alt="" className="h-7 w-auto" /><span className="font-display font-bold text-xs">Intern</span></div><button onClick={signOut}><LogOut className="h-4 w-4 text-muted-foreground" /></button></div>
        <div className="flex gap-1 mt-3 overflow-x-auto pb-1">{TABS.map(t => (<button key={t.id} onClick={() => setTab(t.id)} className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-fast ${tab === t.id ? 'text-primary' : 'text-muted-foreground'}`} style={tab === t.id ? { background: 'rgba(79, 70, 229, 0.1)' } : {}}>{t.label}{t.id === 'notifications' && unreadCount > 0 && <span className="ml-1 bg-primary text-primary-foreground rounded-full px-1.5 text-xs">{unreadCount}</span>}</button>))}</div>
      </div>

      <main className="flex-1 md:ml-60 p-4 md:p-8 pt-28 md:pt-8">
        <motion.div key={tab} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease }}>

          {tab === 'home' && <div className="stagger-children">
            <h1 className="font-display text-2xl font-bold mb-6">Dashboard</h1>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="glass-card rounded-2xl p-5 text-center card-hover"><p className="text-3xl font-bold text-primary">{weeklyCount}</p><p className="text-sm text-muted-foreground mt-1">Applications this week</p><p className="text-[13px] text-muted-foreground">{weeklyCount}/5 limit</p></div>
              <div className="glass-card rounded-2xl p-5 text-center card-hover"><p className="text-3xl font-bold text-foreground">{myApps.length}</p><p className="text-sm text-muted-foreground mt-1">Total Applications</p></div>
              <div className="glass-card rounded-2xl p-5 text-center card-hover"><p className="text-3xl font-bold" style={{ color: '#34C759' }}>{myApps.filter(a => a.status === 'accepted').length}</p><p className="text-sm text-muted-foreground mt-1">Accepted</p></div>
            </div>
          </div>}

          {tab === 'browse' && <div>
            <h1 className="font-display text-2xl font-bold mb-2">Browse Internships</h1>
            <p className="text-muted-foreground text-[15px] mb-6">Real roles, real pay, from vetted companies.</p>
            <div className="relative mb-6"><Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search by role, company, or location..." className="w-full h-[44px] pl-11 pr-4 rounded-xl text-[15px] placeholder:text-muted-foreground/50 glass-input" /></div>
            {loading ? <div className="skeleton-shimmer h-48 w-full" /> : filtered.length === 0 ? (
              <div className="glass-card rounded-2xl p-12 text-center"><Briefcase className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" /><p className="text-muted-foreground">{searchQuery ? 'No matches found.' : 'No internships available yet.'}</p></div>
            ) : <div className="space-y-4"><AnimatePresence mode="popLayout">{filtered.map((l, i) => (
              <motion.div key={l.id} layout initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ delay: i * 0.03, duration: 0.4, ease }}
                className="glass-card rounded-2xl p-5 card-hover">
                <p className="text-[13px] font-medium text-muted-foreground uppercase tracking-wider">{bizNames[l.business_id] || '...'}</p>
                <h3 className="font-bold text-lg mt-1">{l.title}</h3>
                <div className="flex flex-wrap gap-3 mt-2 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{l.work_setting === 'Remote' ? 'Remote' : l.location}</span>
                  <span className="flex items-center gap-1" style={{ color: '#34C759' }}><DollarSign className="h-3.5 w-3.5" />{l.pay_rate}</span>
                  {l.hours_per_week && <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{l.hours_per_week} hrs/week</span>}
                  {l.duration && <span>{l.duration}</span>}
                </div>
                {l.preferred_languages?.length > 0 && <div className="flex gap-1 mt-2">{l.preferred_languages.map(lang => <span key={lang} className="badge-remote text-[11px] flex items-center gap-1"><Globe className="h-3 w-3" />{lang}</span>)}</div>}
                <p className="text-sm text-muted-foreground mt-3 line-clamp-2">{l.description}</p>
                <div className="mt-4 flex justify-end">
                  {appliedIds.has(l.id) ? (
                    <span className="badge-live flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5" />Applied</span>
                  ) : (
                    <motion.button onClick={() => handleApply(l.id)} disabled={applyingTo === l.id} whileTap={{ scale: 0.97 }}
                      className="h-9 px-4 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-92 disabled:opacity-50 inline-flex items-center gap-2 btn-press"
                      style={{ transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)' }}>
                      {applyingTo === l.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Send className="h-3.5 w-3.5" />Apply</>}
                    </motion.button>
                  )}
                </div>
              </motion.div>
            ))}</AnimatePresence></div>}
          </div>}

          {tab === 'applications' && <div>
            <h1 className="font-display text-2xl font-bold mb-6">My Applications</h1>
            {loading ? <div className="skeleton-shimmer h-32 w-full" /> : myApps.length === 0 ? <p className="text-muted-foreground">No applications yet.</p> :
            <div className="space-y-3">{myApps.map(a => (
              <div key={a.id} className="glass-card rounded-2xl p-4 flex items-center justify-between card-hover">
                <div><h3 className="font-semibold">{listingTitles[a.listing_id] || '...'}</h3><p className="text-[13px] text-muted-foreground">{new Date(a.applied_at).toLocaleDateString()}</p></div>
                {appStatusBadge(a.status)}
              </div>
            ))}</div>}
          </div>}

          {tab === 'portfolio' && <div>
            <h1 className="font-display text-2xl font-bold mb-6">My Portfolio</h1>
            <div className="glass-card rounded-2xl p-6 max-w-2xl space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><label className={labelCls}>First Name</label><input value={profile.first_name} onChange={e => setProfile(p => ({ ...p, first_name: e.target.value }))} className={inputCls} /></div>
                <div><label className={labelCls}>Last Name</label><input value={profile.last_name} onChange={e => setProfile(p => ({ ...p, last_name: e.target.value }))} className={inputCls} /></div>
              </div>
              {profile.date_of_birth && <div><label className={labelCls}>Age</label><p className="text-[15px] font-medium">{calcAge(profile.date_of_birth)} years old</p></div>}
              <div><label className={labelCls}>City</label><input value={profile.city} onChange={e => setProfile(p => ({ ...p, city: e.target.value }))} placeholder="City, State" className={inputCls} /></div>
              <div><label className={labelCls}>School</label><input value={profile.school} onChange={e => setProfile(p => ({ ...p, school: e.target.value }))} placeholder="School name" className={inputCls} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className={labelCls}>GPA (Optional)</label><input type="number" step="0.1" min="0" max="4" value={profile.gpa ?? ''} onChange={e => setProfile(p => ({ ...p, gpa: e.target.value ? parseFloat(e.target.value) : null }))} placeholder="3.7" className={inputCls} /></div>
                <div><label className={labelCls}>Test Scores (Optional)</label><input value={profile.test_scores} onChange={e => setProfile(p => ({ ...p, test_scores: e.target.value }))} placeholder="SAT: 1320" className={inputCls} /></div>
              </div>
              <div><label className={labelCls}>Phone Number</label><input value={profile.phone} onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))} placeholder="(555) 123-4567" className={inputCls} /></div>
              <div><label className={labelCls}>Languages & Proficiency</label>
                {(profile.languages || []).map((lang: any, i: number) => (
                  <div key={i} className="flex gap-2 mb-2">
                    <select value={lang.language || ''} onChange={e => { const n = [...(profile.languages || [])]; n[i] = { ...n[i], language: e.target.value }; setProfile(p => ({ ...p, languages: n })); }} className={inputCls + " flex-1"}>
                      <option value="">Language...</option>{LANG_OPTIONS.map(l => <option key={l}>{l}</option>)}
                    </select>
                    <select value={lang.proficiency || ''} onChange={e => { const n = [...(profile.languages || [])]; n[i] = { ...n[i], proficiency: e.target.value }; setProfile(p => ({ ...p, languages: n })); }} className={inputCls + " flex-1"}>
                      <option value="">Level...</option>{PROFICIENCY.map(p => <option key={p}>{p}</option>)}
                    </select>
                    <button onClick={() => setProfile(p => ({ ...p, languages: (p.languages || []).filter((_: any, j: number) => j !== i) }))} className="text-[13px] font-medium" style={{ color: '#FF3B30' }}>✕</button>
                  </div>
                ))}
                <button onClick={() => setProfile(p => ({ ...p, languages: [...(p.languages || []), { language: '', proficiency: '' }] }))} className="text-[13px] text-primary font-medium">+ Add language</button>
              </div>
              <div><label className={labelCls}>Skills</label>
                <div className="flex flex-wrap gap-2">{SKILLS_LIST.map(s => (
                  <label key={s} className={`text-[13px] px-3 py-1.5 rounded-full cursor-pointer transition-fast ${(profile.skills || []).includes(s) ? 'text-primary' : 'text-muted-foreground'}`}
                    style={(profile.skills || []).includes(s) ? { background: 'rgba(79, 70, 229, 0.1)', border: '1px solid rgba(79, 70, 229, 0.3)' } : { background: 'rgba(0,0,0,0.04)' }}>
                    <input type="checkbox" className="sr-only" checked={(profile.skills || []).includes(s)} onChange={e => setProfile(p => ({ ...p, skills: e.target.checked ? [...(p.skills || []), s] : (p.skills || []).filter(x => x !== s) }))} />{s}
                  </label>
                ))}</div>
              </div>
              <div><label className={labelCls}>Short Bio ({(profile.bio || '').length}/200)</label>
                <textarea value={profile.bio} onChange={e => { if (e.target.value.length <= 200) setProfile(p => ({ ...p, bio: e.target.value })); }} rows={3} placeholder="Tell us about yourself..." className={inputCls + " !h-auto py-3"} /></div>
              <motion.button onClick={saveProfile} disabled={savingProfile} whileTap={{ scale: 0.97 }}
                className="w-full h-[44px] rounded-xl bg-primary text-primary-foreground text-[15px] font-semibold hover:opacity-92 disabled:opacity-50 inline-flex items-center justify-center gap-2 btn-press"
                style={{ transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)' }}>
                {savingProfile ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving...</> : "Save Portfolio"}
              </motion.button>
            </div>
          </div>}

          {tab === 'notifications' && <div>
            <h1 className="font-display text-2xl font-bold mb-6">Notifications</h1>
            {messages.length === 0 ? <p className="text-muted-foreground">No notifications yet.</p> :
            <div className="space-y-3">{messages.map(m => (
              <div key={m.id} className={`glass-card rounded-2xl p-4 card-hover cursor-pointer ${!m.read ? '' : ''}`} onClick={() => !m.read && markRead(m.id)}
                style={!m.read ? { borderColor: 'rgba(79, 70, 229, 0.2)' } : {}}>
                <div className="flex items-start justify-between">
                  <div>
                    {!m.read && <span className="inline-block w-2 h-2 rounded-full bg-primary mr-2" />}
                    <span className="text-[13px] text-muted-foreground">{new Date(m.sent_at).toLocaleString()}</span>
                  </div>
                </div>
                <p className="text-sm mt-2">{m.content}</p>
                <p className="text-[13px] text-muted-foreground mt-2 italic">A business has reached out to you. Contact them at the email or phone number provided in your notification.</p>
              </div>
            ))}</div>}
          </div>}

          {tab === 'settings' && <div>
            <h1 className="font-display text-2xl font-bold mb-6">Settings</h1>
            <div className="glass-card rounded-2xl p-6"><p className="text-sm text-muted-foreground mb-4">Signed in as: {user?.email}</p>
            <button onClick={signOut} className="h-[44px] px-6 rounded-xl text-[15px] font-semibold text-white btn-press" style={{ background: '#FF3B30' }}>Sign Out</button></div>
          </div>}

        </motion.div>
      </main>
    </div>
  );
};

export default InternDashboard;
