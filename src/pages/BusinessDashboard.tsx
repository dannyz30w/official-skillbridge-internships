import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Home, PlusCircle, List, Users, MessageSquare, Settings, LogOut, Loader2, Check, X, Send, Eye, Edit } from "lucide-react";
import skillbridgeLogo from "@/assets/skillbridge-logo.png";

const db = supabase as any;
const CATEGORIES = ['Technology', 'Marketing', 'Design', 'Finance', 'Healthcare', 'Education', 'Retail', 'Food & Beverage', 'Creative & Media', 'Other'];
const LANGUAGES = ['English', 'Spanish', 'French', 'Mandarin', 'Cantonese', 'Arabic', 'Portuguese', 'Other'];
const inputCls = "w-full h-[44px] px-4 rounded-xl text-[15px] text-foreground placeholder:text-muted-foreground/50 glass-input";
const labelCls = "block text-[13px] font-medium tracking-[0.01em] text-muted-foreground mb-1.5";

interface Listing { id: string; title: string; status: string; created_at: string; description: string; category: string; work_setting: string; location: string; preferred_hours: string; pay_rate: string; hours_per_week: string; duration: string; age_requirement: string; preferred_languages: string[]; skills_learned: string[]; requirements: string[]; start_date: string | null; business_id: string; }
interface Application { id: string; intern_id: string; listing_id: string; status: string; applied_at: string; }
interface InternInfo { user_id: string; first_name: string; last_name: string; city: string; school: string; gpa: number | null; bio: string; skills: string[]; phone: string; }

const TABS = [
  { id: 'home', label: 'Dashboard', icon: Home },
  { id: 'post', label: 'Post Listing', icon: PlusCircle },
  { id: 'listings', label: 'My Listings', icon: List },
  { id: 'applicants', label: 'Applicants', icon: Users },
  { id: 'messages', label: 'Messages', icon: MessageSquare },
  { id: 'settings', label: 'Settings', icon: Settings },
];

const ease = [0.16, 1, 0.3, 1] as const;

const BusinessDashboard = () => {
  const { user, signOut } = useAuth();
  const [tab, setTab] = useState('home');
  const [myListings, setMyListings] = useState<Listing[]>([]);
  const [apps, setApps] = useState<Application[]>([]);
  const [internInfos, setInternInfos] = useState<Record<string, InternInfo>>({});
  const [sentMsgs, setSentMsgs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({ title: '', description: '', category: '', work_setting: 'In-Person', location: '', preferred_hours: '', pay_rate: '', hours_per_week: '', duration: '', age_requirement: '', start_date: '' });
  const [skills, setSkills] = useState(['', '', '']);
  const [reqs, setReqs] = useState(['']);
  const [prefLangs, setPrefLangs] = useState<string[]>([]);
  const [posting, setPosting] = useState(false);
  const [postSuccess, setPostSuccess] = useState(false);

  const [msgIntern, setMsgIntern] = useState<string | null>(null);
  const [msgContent, setMsgContent] = useState('');
  const [msgListingId, setMsgListingId] = useState<string | null>(null);
  const [confirmClose, setConfirmClose] = useState<string | null>(null);

  useEffect(() => { if (tab === 'home' || tab === 'listings') fetchListings(); if (tab === 'applicants') fetchApps(); if (tab === 'messages') fetchMessages(); }, [tab]);

  const fetchListings = async () => { setLoading(true); const { data } = await db.from('listings').select('*').eq('business_id', user?.id).order('created_at', { ascending: false }); if (data) setMyListings(data); setLoading(false); };
  const fetchApps = async () => {
    setLoading(true);
    const { data: listings } = await db.from('listings').select('id').eq('business_id', user?.id);
    if (!listings?.length) { setApps([]); setLoading(false); return; }
    const ids: string[] = listings.map((l: any) => l.id);
    const { data } = await db.from('listing_applications').select('*').in('listing_id', ids).order('applied_at', { ascending: false });
    if (data) { setApps(data); const internIds: string[] = [...new Set(data.map((a: any) => a.intern_id))] as string[]; await loadInterns(internIds); }
    setLoading(false);
  };
  const loadInterns = async (ids: string[]) => {
    if (!ids.length) return;
    const { data } = await db.from('intern_profiles').select('*').in('user_id', ids);
    if (data) { const m: Record<string, InternInfo> = {}; data.forEach((i: any) => m[i.user_id] = i); setInternInfos(p => ({ ...p, ...m })); }
  };
  const fetchMessages = async () => { const { data } = await db.from('messages').select('*').eq('business_id', user?.id).order('sent_at', { ascending: false }); if (data) setSentMsgs(data); };

  const handlePost = async (e: React.FormEvent) => {
    e.preventDefault();
    const filledSkills = skills.filter(s => s.trim());
    if (filledSkills.length < 3) { toast.error("Please add at least 3 skills they'll learn."); return; }
    if (reqs.filter(r => r.trim()).length > 3) { toast.error("Maximum 3 requirements allowed."); return; }
    if (!form.title || !form.description || !form.pay_rate) { toast.error("Please fill required fields."); return; }
    if (form.work_setting === 'In-Person' && !form.location) { toast.error("Location is required for in-person roles."); return; }
    setPosting(true);
    const { error } = await db.from('listings').insert({
      business_id: user?.id, title: form.title, description: form.description, category: form.category,
      work_setting: form.work_setting, location: form.work_setting === 'Remote' ? 'Remote' : form.location,
      preferred_hours: form.preferred_hours, pay_rate: form.pay_rate, hours_per_week: form.hours_per_week,
      duration: form.duration, age_requirement: form.age_requirement, start_date: form.start_date || null,
      preferred_languages: prefLangs, skills_learned: filledSkills, requirements: reqs.filter(r => r.trim()),
    });
    setPosting(false);
    if (error) { toast.error(error.message); return; }
    setPostSuccess(true);
    toast.success("Listing submitted for review!");
    setForm({ title: '', description: '', category: '', work_setting: 'In-Person', location: '', preferred_hours: '', pay_rate: '', hours_per_week: '', duration: '', age_requirement: '', start_date: '' });
    setSkills(['', '', '']); setReqs(['']); setPrefLangs([]);
    setTimeout(() => setPostSuccess(false), 3000);
  };

  const updateAppStatus = async (appId: string, status: string) => { await db.from('listing_applications').update({ status }).eq('id', appId); toast.success(`Application ${status}.`); fetchApps(); };
  const closeListing = async (id: string) => { await db.from('listings').update({ status: 'closed' }).eq('id', id); toast.success("Listing closed."); setConfirmClose(null); fetchListings(); };
  const sendMessage = async () => {
    if (!msgContent.trim() || !msgIntern) return;
    await db.from('messages').insert({ business_id: user?.id, intern_id: msgIntern, listing_id: msgListingId, content: msgContent });
    toast.success("Message sent!");
    setMsgContent(''); setMsgIntern(null); setMsgListingId(null);
  };

  const statusBadge = (s: string) => {
    const cls = s === 'live' ? 'badge-live' : s === 'rejected' ? 'badge-rejected' : s === 'pending' ? 'badge-pending' : 'badge-closed';
    return <span className={cls}>{s.charAt(0).toUpperCase() + s.slice(1)}</span>;
  };

  return (
    <div className="min-h-screen flex bg-background">
      <aside className="hidden md:flex flex-col w-60 h-screen fixed left-0 top-0 glass-sidebar p-4 z-40">
        <div className="flex items-center gap-2 px-3 py-4"><img src={skillbridgeLogo} alt="" className="h-8 w-auto" /><span className="font-display font-bold text-sm">Business</span></div>
        <nav className="flex-1 mt-4 space-y-1">{TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-fast ${tab === t.id ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
            style={tab === t.id ? { background: 'rgba(79, 70, 229, 0.1)' } : { background: 'transparent' }}>
            <t.icon className="h-4 w-4" />{t.label}
          </button>
        ))}</nav>
        <button onClick={signOut} className="flex items-center gap-3 px-3 py-2.5 text-[13px] text-muted-foreground hover:text-foreground transition-fast"><LogOut className="h-4 w-4" />Sign Out</button>
      </aside>
      <div className="md:hidden fixed top-0 left-0 right-0 liquid-glass z-50 px-4 py-3" style={{ height: 56 }}>
        <div className="flex items-center justify-between"><div className="flex items-center gap-2"><img src={skillbridgeLogo} alt="" className="h-7 w-auto" /><span className="font-display font-bold text-xs">Business</span></div><button onClick={signOut}><LogOut className="h-4 w-4 text-muted-foreground" /></button></div>
        <div className="flex gap-1 mt-3 overflow-x-auto pb-1">{TABS.map(t => (<button key={t.id} onClick={() => setTab(t.id)} className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-fast ${tab === t.id ? 'text-primary' : 'text-muted-foreground'}`} style={tab === t.id ? { background: 'rgba(79, 70, 229, 0.1)' } : {}}>{t.label}</button>))}</div>
      </div>

      <main className="flex-1 md:ml-60 p-4 md:p-8 pt-28 md:pt-8">
        <motion.div key={tab} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease }}>
          {tab === 'home' && <div className="stagger-children">
            <h1 className="font-display text-2xl font-bold mb-6">Dashboard</h1>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="glass-card rounded-2xl p-5 text-center card-hover"><p className="text-3xl font-bold" style={{ color: '#34C759' }}>{myListings.filter(l => l.status === 'live').length}</p><p className="text-sm text-muted-foreground mt-1">Live Listings</p></div>
              <div className="glass-card rounded-2xl p-5 text-center card-hover"><p className="text-3xl font-bold" style={{ color: '#FF9F0A' }}>{myListings.filter(l => l.status === 'pending').length}</p><p className="text-sm text-muted-foreground mt-1">Pending Review</p></div>
              <div className="glass-card rounded-2xl p-5 text-center card-hover"><p className="text-3xl font-bold text-foreground">{myListings.length}</p><p className="text-sm text-muted-foreground mt-1">Total Listings</p></div>
            </div>
          </div>}

          {tab === 'post' && <div>
            <h1 className="font-display text-2xl font-bold mb-6">Post New Listing</h1>
            {postSuccess ? <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-card rounded-2xl p-8 text-center"><Check className="h-10 w-10 mx-auto mb-3" style={{ color: '#34C759' }} /><p className="font-semibold">Listing submitted for review!</p><p className="text-sm text-muted-foreground mt-1">You'll be notified once it's approved.</p></motion.div> :
            <form onSubmit={handlePost} className="glass-card rounded-2xl p-6 space-y-4 max-w-2xl">
              <div><label className={labelCls}>Internship Title *</label><input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="e.g. Marketing Intern" className={inputCls} /></div>
              <div><label className={labelCls}>Description *</label><textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={4} placeholder="Describe the role..." className={inputCls + " !h-auto py-3"} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className={labelCls}>Category</label><select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} className={inputCls}><option value="">Select...</option>{CATEGORIES.map(c => <option key={c}>{c}</option>)}</select></div>
                <div><label className={labelCls}>Work Setting *</label><div className="flex gap-2">{['In-Person', 'Remote'].map(w => <button key={w} type="button" onClick={() => setForm(p => ({ ...p, work_setting: w }))} className={`flex-1 h-[44px] rounded-xl text-sm font-medium transition-fast btn-press ${form.work_setting === w ? 'text-primary' : ''}`} style={form.work_setting === w ? { background: 'rgba(79, 70, 229, 0.1)', border: '1px solid rgba(79, 70, 229, 0.3)' } : { background: 'rgba(255,255,255,0.6)', border: '1px solid rgba(0,0,0,0.08)' }}>{w}</button>)}</div></div>
              </div>
              {form.work_setting === 'In-Person' && <div><label className={labelCls}>Location *</label><input value={form.location} onChange={e => setForm(p => ({ ...p, location: e.target.value }))} placeholder="City, State" className={inputCls} /></div>}
              <div className="grid grid-cols-2 gap-4">
                <div><label className={labelCls}>Pay Rate (Hourly) *</label><input value={form.pay_rate} onChange={e => setForm(p => ({ ...p, pay_rate: e.target.value }))} placeholder="$15/hr" className={inputCls} /></div>
                <div><label className={labelCls}>Hours Per Week</label><input value={form.hours_per_week} onChange={e => setForm(p => ({ ...p, hours_per_week: e.target.value }))} placeholder="20" className={inputCls} /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className={labelCls}>Duration</label><input value={form.duration} onChange={e => setForm(p => ({ ...p, duration: e.target.value }))} placeholder="3 months" className={inputCls} /></div>
                <div><label className={labelCls}>Start Date</label><input type="date" value={form.start_date} onChange={e => setForm(p => ({ ...p, start_date: e.target.value }))} className={inputCls} /></div>
              </div>
              <div><label className={labelCls}>Preferred Hours</label><input value={form.preferred_hours} onChange={e => setForm(p => ({ ...p, preferred_hours: e.target.value }))} placeholder="Weekdays 9am-1pm" className={inputCls} /></div>
              <div><label className={labelCls}>Age Requirement</label><input value={form.age_requirement} onChange={e => setForm(p => ({ ...p, age_requirement: e.target.value }))} placeholder="16-22" className={inputCls} /></div>
              <div><label className={labelCls}>Skills They'll Learn (Min 3) *</label>{skills.map((s, i) => <input key={i} value={s} onChange={e => { const n = [...skills]; n[i] = e.target.value; setSkills(n); }} placeholder={`Skill ${i + 1}`} className={inputCls + " mb-2"} />)}
                <button type="button" onClick={() => setSkills(p => [...p, ''])} className="text-[13px] text-primary hover:text-primary/80 font-medium">+ Add skill</button></div>
              <div><label className={labelCls}>Requirements (Max 3)</label>{reqs.map((r, i) => <input key={i} value={r} onChange={e => { const n = [...reqs]; n[i] = e.target.value; setReqs(n); }} placeholder={`Requirement ${i + 1}`} className={inputCls + " mb-2"} />)}
                {reqs.length < 3 && <button type="button" onClick={() => setReqs(p => [...p, ''])} className="text-[13px] text-primary hover:text-primary/80 font-medium">+ Add requirement</button>}</div>
              <div><label className={labelCls}>Preferred Languages</label><div className="flex flex-wrap gap-2">{LANGUAGES.map(l => <label key={l} className={`text-[13px] px-3 py-1.5 rounded-full cursor-pointer transition-fast ${prefLangs.includes(l) ? 'text-primary' : 'text-muted-foreground'}`} style={prefLangs.includes(l) ? { background: 'rgba(79, 70, 229, 0.1)', border: '1px solid rgba(79, 70, 229, 0.3)' } : { background: 'rgba(0,0,0,0.04)' }}>
                    <input type="checkbox" className="sr-only" checked={prefLangs.includes(l)} onChange={e => setPrefLangs(e.target.checked ? [...prefLangs, l] : prefLangs.filter(x => x !== l))} />{l}</label>)}</div></div>
              <motion.button type="submit" disabled={posting} whileTap={{ scale: 0.97 }}
                className="w-full h-[44px] rounded-xl bg-primary text-primary-foreground text-[15px] font-semibold hover:opacity-92 disabled:opacity-50 inline-flex items-center justify-center gap-2 btn-press"
                style={{ transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)' }}>
                {posting ? <><Loader2 className="h-4 w-4 animate-spin" /> Submitting...</> : "Submit for Review"}
              </motion.button>
            </form>}
          </div>}

          {tab === 'listings' && <div>
            <h1 className="font-display text-2xl font-bold mb-6">My Listings</h1>
            {loading ? <div className="skeleton-shimmer h-32 w-full" /> : myListings.length === 0 ? <p className="text-muted-foreground">No listings yet.</p> :
            <div className="space-y-3">{myListings.map(l => (
              <div key={l.id} className="glass-card rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 card-hover">
                <div><h3 className="font-semibold">{l.title}</h3><p className="text-[13px] text-muted-foreground">{l.pay_rate}, {l.work_setting === 'Remote' ? 'Remote' : l.location}</p></div>
                <div className="flex items-center gap-2">
                  {statusBadge(l.status)}
                  {l.status === 'live' && <button onClick={() => setConfirmClose(l.id)} className="h-8 px-3 rounded-xl text-[13px] font-medium text-muted-foreground hover:text-foreground transition-fast btn-press" style={{ background: 'rgba(255,255,255,0.6)', border: '1px solid rgba(0,0,0,0.08)' }}>Close</button>}
                  {l.status === 'live' && <button onClick={() => { db.from('listings').update({ status: 'pending' }).eq('id', l.id).then(() => { toast.success("Listing sent back for review."); fetchListings(); }); }} className="h-8 px-3 rounded-xl text-[13px] font-medium text-muted-foreground hover:text-foreground transition-fast btn-press flex items-center gap-1" style={{ background: 'rgba(255,255,255,0.6)', border: '1px solid rgba(0,0,0,0.08)' }}><Edit className="h-3 w-3" />Edit</button>}
                </div>
              </div>
            ))}</div>}
          </div>}

          {tab === 'applicants' && <div>
            <h1 className="font-display text-2xl font-bold mb-6">Applicants</h1>
            {loading ? <div className="skeleton-shimmer h-32 w-full" /> : apps.length === 0 ? <p className="text-muted-foreground">No applications yet.</p> :
            <div className="space-y-4">
              {myListings.filter(l => apps.some(a => a.listing_id === l.id)).map(listing => {
                const listingApps = apps.filter(a => a.listing_id === listing.id);
                return (
                  <div key={listing.id} className="glass-card rounded-2xl p-5">
                    <div className="flex items-center justify-between mb-4"><h3 className="font-bold">{listing.title}</h3><span className="text-[13px] text-muted-foreground">{listingApps.length} intern{listingApps.length !== 1 ? 's' : ''} applied</span></div>
                    <div className="space-y-3">{listingApps.map(app => {
                      const intern = internInfos[app.intern_id];
                      return (
                        <div key={app.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl" style={{ background: 'rgba(0,0,0,0.02)' }}>
                          <div>
                            <p className="font-medium">{intern ? `${intern.first_name} ${intern.last_name}` : '...'}</p>
                            {intern && <p className="text-[13px] text-muted-foreground">{intern.city}{intern.school && `, ${intern.school}`}</p>}
                          </div>
                          <div className="flex items-center gap-2">
                            {app.status === 'pending' && <>
                              <button onClick={() => updateAppStatus(app.id, 'accepted')} className="h-8 px-3 rounded-xl text-[13px] font-semibold text-white btn-press" style={{ background: '#34C759' }}>Accept</button>
                              <button onClick={() => updateAppStatus(app.id, 'rejected')} className="h-8 px-3 rounded-xl text-[13px] font-semibold text-white btn-press" style={{ background: '#FF3B30' }}>Reject</button>
                            </>}
                            {app.status === 'accepted' && <>
                              <span className="badge-live">Accepted</span>
                              <button onClick={() => { setMsgIntern(app.intern_id); setMsgListingId(listing.id); }} className="h-8 px-3 rounded-xl bg-primary text-primary-foreground text-[13px] font-semibold flex items-center gap-1 btn-press"><MessageSquare className="h-3 w-3" />Message</button>
                            </>}
                            {app.status === 'rejected' && <span className="badge-rejected">Rejected</span>}
                          </div>
                        </div>
                      );
                    })}</div>
                  </div>
                );
              })}
            </div>}
          </div>}

          {tab === 'messages' && <div>
            <h1 className="font-display text-2xl font-bold mb-6">Messages</h1>
            {sentMsgs.length === 0 ? <p className="text-muted-foreground">No messages sent yet. Accept an applicant to start messaging.</p> :
            <div className="space-y-3">{sentMsgs.map(m => (
              <div key={m.id} className="glass-card rounded-2xl p-4 card-hover">
                <p className="text-[13px] text-muted-foreground">To: {internInfos[m.intern_id] ? `${internInfos[m.intern_id].first_name} ${internInfos[m.intern_id].last_name}` : m.intern_id}, {new Date(m.sent_at).toLocaleString()}</p>
                <p className="text-sm mt-1">{m.content}</p>
              </div>
            ))}</div>}
          </div>}

          {tab === 'settings' && <div>
            <h1 className="font-display text-2xl font-bold mb-6">Settings</h1>
            <div className="glass-card rounded-2xl p-6"><p className="text-sm text-muted-foreground mb-4">Signed in as: {user?.email}</p>
            <button onClick={signOut} className="h-[44px] px-6 rounded-xl text-[15px] font-semibold text-white btn-press" style={{ background: '#FF3B30' }}>Sign Out</button></div>
          </div>}
        </motion.div>

        {msgIntern && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.2)', backdropFilter: 'blur(8px)' }} onClick={() => setMsgIntern(null)}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3, ease }}
              className="glass-card rounded-2xl p-6 max-w-md w-full" onClick={e => e.stopPropagation()}>
              <h2 className="font-display text-lg font-bold mb-4">Send Message</h2>
              <p className="text-sm text-muted-foreground mb-3">To: {internInfos[msgIntern] ? `${internInfos[msgIntern].first_name} ${internInfos[msgIntern].last_name}` : '...'}</p>
              <textarea value={msgContent} onChange={e => setMsgContent(e.target.value)} rows={4} placeholder="Type your message..." className={inputCls + " !h-auto py-3 mb-4"} />
              <div className="flex gap-2 justify-end">
                <button onClick={() => setMsgIntern(null)} className="h-9 px-4 rounded-xl text-sm font-medium btn-press" style={{ background: 'rgba(255,255,255,0.6)', border: '1px solid rgba(0,0,0,0.08)' }}>Cancel</button>
                <button onClick={sendMessage} disabled={!msgContent.trim()} className="h-9 px-4 rounded-xl bg-primary text-primary-foreground text-sm font-semibold disabled:opacity-50 flex items-center gap-1 btn-press"><Send className="h-3.5 w-3.5" />Send</button>
              </div>
            </motion.div>
          </div>
        )}

        {confirmClose && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.2)', backdropFilter: 'blur(8px)' }} onClick={() => setConfirmClose(null)}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3, ease }}
              className="glass-card rounded-2xl p-6 max-w-sm w-full" onClick={e => e.stopPropagation()}>
              <h2 className="font-display text-lg font-bold">Close Listing?</h2>
              <p className="text-sm text-muted-foreground mt-2">Are you sure you want to close this listing? It will no longer be visible to interns.</p>
              <div className="mt-6 flex gap-2 justify-end">
                <button onClick={() => setConfirmClose(null)} className="h-9 px-4 rounded-xl text-sm font-medium btn-press" style={{ background: 'rgba(255,255,255,0.6)', border: '1px solid rgba(0,0,0,0.08)' }}>Cancel</button>
                <button onClick={() => closeListing(confirmClose)} className="h-9 px-4 rounded-xl text-sm font-semibold text-white btn-press" style={{ background: '#FF3B30' }}>Close Listing</button>
              </div>
            </motion.div>
          </div>
        )}
      </main>
    </div>
  );
};

export default BusinessDashboard;
