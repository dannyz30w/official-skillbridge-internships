import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Home, PlusCircle, List, Users, MessageSquare, Settings, LogOut, Loader2, Check, X, Send, Eye, Edit, XCircle } from "lucide-react";
import skillbridgeLogo from "@/assets/skillbridge-logo.png";

const db = supabase as any;
const CATEGORIES = ['Technology', 'Marketing', 'Design', 'Finance', 'Healthcare', 'Education', 'Retail', 'Food & Beverage', 'Creative & Media', 'Other'];
const LANGUAGES = ['English', 'Spanish', 'French', 'Mandarin', 'Cantonese', 'Arabic', 'Portuguese', 'Other'];
const inputCls = "w-full h-10 px-3 rounded-xl glass-input text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-ring/50 transition-smooth";
const labelCls = "block text-xs font-medium text-muted-foreground tracking-wide uppercase mb-1.5";

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

const BusinessDashboard = () => {
  const { user, signOut } = useAuth();
  const [tab, setTab] = useState('home');
  const [myListings, setMyListings] = useState<Listing[]>([]);
  const [apps, setApps] = useState<Application[]>([]);
  const [internInfos, setInternInfos] = useState<Record<string, InternInfo>>({});
  const [sentMsgs, setSentMsgs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Post form state
  const [form, setForm] = useState({ title: '', description: '', category: '', work_setting: 'In-Person', location: '', preferred_hours: '', pay_rate: '', hours_per_week: '', duration: '', age_requirement: '', start_date: '' });
  const [skills, setSkills] = useState(['', '', '']);
  const [reqs, setReqs] = useState(['']);
  const [prefLangs, setPrefLangs] = useState<string[]>([]);
  const [posting, setPosting] = useState(false);
  const [postSuccess, setPostSuccess] = useState(false);

  // Message state
  const [msgIntern, setMsgIntern] = useState<string | null>(null);
  const [msgContent, setMsgContent] = useState('');
  const [msgListingId, setMsgListingId] = useState<string | null>(null);

  // Confirm close
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

  const sc = (s: string) => s === 'live' ? 'bg-success/10 text-success' : s === 'rejected' ? 'bg-destructive/10 text-destructive' : s === 'pending' ? 'bg-warning/10 text-warning' : 'bg-muted text-muted-foreground';

  return (
    <div className="min-h-screen flex">
      <aside className="hidden md:flex flex-col w-60 h-screen fixed left-0 top-0 liquid-glass border-r border-border/20 p-4 z-40">
        <div className="flex items-center gap-2 px-3 py-4"><img src={skillbridgeLogo} alt="" className="h-8 w-auto" /><span className="font-display font-bold text-sm">Business</span></div>
        <nav className="flex-1 mt-4 space-y-1">{TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-smooth ${tab === t.id ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground hover:bg-muted/30'}`}><t.icon className="h-4 w-4" />{t.label}</button>
        ))}</nav>
        <button onClick={signOut} className="flex items-center gap-3 px-3 py-2.5 text-sm text-muted-foreground hover:text-foreground transition-smooth"><LogOut className="h-4 w-4" />Sign Out</button>
      </aside>
      <div className="md:hidden fixed top-0 left-0 right-0 liquid-glass z-50 px-4 py-3 border-b border-border/20">
        <div className="flex items-center justify-between"><div className="flex items-center gap-2"><img src={skillbridgeLogo} alt="" className="h-7 w-auto" /><span className="font-display font-bold text-xs">Business</span></div><button onClick={signOut}><LogOut className="h-4 w-4 text-muted-foreground" /></button></div>
        <div className="flex gap-1 mt-3 overflow-x-auto pb-1">{TABS.map(t => (<button key={t.id} onClick={() => setTab(t.id)} className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium ${tab === t.id ? 'bg-primary/10 text-primary' : 'text-muted-foreground'}`}>{t.label}</button>))}</div>
      </div>

      <main className="flex-1 md:ml-60 p-4 md:p-8 pt-28 md:pt-8">
        <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          {tab === 'home' && <div>
            <h1 className="font-display text-2xl font-bold mb-6">Dashboard</h1>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="glass-card rounded-2xl p-5 text-center"><p className="text-3xl font-bold text-primary">{myListings.filter(l => l.status === 'live').length}</p><p className="text-sm text-muted-foreground mt-1">Live Listings</p></div>
              <div className="glass-card rounded-2xl p-5 text-center"><p className="text-3xl font-bold text-warning">{myListings.filter(l => l.status === 'pending').length}</p><p className="text-sm text-muted-foreground mt-1">Pending Review</p></div>
              <div className="glass-card rounded-2xl p-5 text-center"><p className="text-3xl font-bold text-foreground">{myListings.length}</p><p className="text-sm text-muted-foreground mt-1">Total Listings</p></div>
            </div>
          </div>}

          {tab === 'post' && <div>
            <h1 className="font-display text-2xl font-bold mb-6">Post New Listing</h1>
            {postSuccess ? <div className="glass-card rounded-2xl p-8 text-center"><Check className="h-10 w-10 text-success mx-auto mb-3" /><p className="font-semibold">Listing submitted for review!</p><p className="text-sm text-muted-foreground mt-1">You'll be notified once it's approved.</p></div> :
            <form onSubmit={handlePost} className="glass-card rounded-2xl p-6 space-y-4 max-w-2xl">
              <div><label className={labelCls}>Internship Title *</label><input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="e.g. Marketing Intern" className={inputCls} /></div>
              <div><label className={labelCls}>Description *</label><textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={4} placeholder="Describe the role..." className={inputCls + " h-auto py-2"} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className={labelCls}>Category</label><select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} className={inputCls}><option value="">Select...</option>{CATEGORIES.map(c => <option key={c}>{c}</option>)}</select></div>
                <div><label className={labelCls}>Work Setting *</label><div className="flex gap-2">{['In-Person', 'Remote'].map(w => <button key={w} type="button" onClick={() => setForm(p => ({ ...p, work_setting: w }))} className={`flex-1 h-10 rounded-xl text-sm font-medium transition-smooth ${form.work_setting === w ? 'bg-primary/10 text-primary border border-primary/30' : 'glass-input'}`}>{w}</button>)}</div></div>
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
              <div><label className={labelCls}>Preferred Hours</label><input value={form.preferred_hours} onChange={e => setForm(p => ({ ...p, preferred_hours: e.target.value }))} placeholder="Weekdays 9am–1pm" className={inputCls} /></div>
              <div><label className={labelCls}>Age Requirement</label><input value={form.age_requirement} onChange={e => setForm(p => ({ ...p, age_requirement: e.target.value }))} placeholder="16-22" className={inputCls} /></div>
              <div><label className={labelCls}>Skills They'll Learn (Min 3) *</label>{skills.map((s, i) => <input key={i} value={s} onChange={e => { const n = [...skills]; n[i] = e.target.value; setSkills(n); }} placeholder={`Skill ${i + 1}`} className={inputCls + " mb-2"} />)}
                <button type="button" onClick={() => setSkills(p => [...p, ''])} className="text-xs text-primary hover:text-primary/80">+ Add skill</button></div>
              <div><label className={labelCls}>Requirements (Max 3)</label>{reqs.map((r, i) => <input key={i} value={r} onChange={e => { const n = [...reqs]; n[i] = e.target.value; setReqs(n); }} placeholder={`Requirement ${i + 1}`} className={inputCls + " mb-2"} />)}
                {reqs.length < 3 && <button type="button" onClick={() => setReqs(p => [...p, ''])} className="text-xs text-primary hover:text-primary/80">+ Add requirement</button>}</div>
              <div><label className={labelCls}>Preferred Languages</label><div className="flex flex-wrap gap-2">{LANGUAGES.map(l => <label key={l} className="flex items-center gap-1.5 text-sm cursor-pointer"><input type="checkbox" checked={prefLangs.includes(l)} onChange={e => setPrefLangs(e.target.checked ? [...prefLangs, l] : prefLangs.filter(x => x !== l))} className="rounded" />{l}</label>)}</div></div>
              <button type="submit" disabled={posting} className="w-full h-10 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-smooth disabled:opacity-50 inline-flex items-center justify-center gap-2">
                {posting ? <><Loader2 className="h-4 w-4 animate-spin" /> Submitting...</> : "Submit for Review"}
              </button>
            </form>}
          </div>}

          {tab === 'listings' && <div>
            <h1 className="font-display text-2xl font-bold mb-6">My Listings</h1>
            {loading ? <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /> : myListings.length === 0 ? <p className="text-muted-foreground">No listings yet.</p> :
            <div className="space-y-3">{myListings.map(l => (
              <div key={l.id} className="glass-card rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div><h3 className="font-semibold">{l.title}</h3><p className="text-xs text-muted-foreground">{l.pay_rate} · {l.work_setting === 'Remote' ? 'Remote' : l.location}</p></div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-medium px-3 py-1 rounded-full ${sc(l.status)}`}>{l.status.charAt(0).toUpperCase() + l.status.slice(1)}</span>
                  {l.status === 'live' && <button onClick={() => setConfirmClose(l.id)} className="h-8 px-3 rounded-lg border border-border/50 text-xs font-medium text-muted-foreground hover:text-foreground transition-smooth">Close</button>}
                  {l.status === 'live' && <button onClick={() => { db.from('listings').update({ status: 'pending' }).eq('id', l.id).then(() => { toast.success("Listing sent back for review."); fetchListings(); }); }} className="h-8 px-3 rounded-lg border border-border/50 text-xs font-medium text-muted-foreground hover:text-foreground transition-smooth flex items-center gap-1"><Edit className="h-3 w-3" />Edit</button>}
                </div>
              </div>
            ))}</div>}
          </div>}

          {tab === 'applicants' && <div>
            <h1 className="font-display text-2xl font-bold mb-6">Applicants</h1>
            {loading ? <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /> : apps.length === 0 ? <p className="text-muted-foreground">No applications yet.</p> :
            <div className="space-y-4">
              {myListings.filter(l => apps.some(a => a.listing_id === l.id)).map(listing => {
                const listingApps = apps.filter(a => a.listing_id === listing.id);
                return (
                  <div key={listing.id} className="glass-card rounded-2xl p-5">
                    <div className="flex items-center justify-between mb-4"><h3 className="font-bold">{listing.title}</h3><span className="text-xs text-muted-foreground">{listingApps.length} intern{listingApps.length !== 1 ? 's' : ''} applied</span></div>
                    <div className="space-y-3">{listingApps.map(app => {
                      const intern = internInfos[app.intern_id];
                      return (
                        <div key={app.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl bg-background/30">
                          <div>
                            <p className="font-medium">{intern ? `${intern.first_name} ${intern.last_name}` : '...'}</p>
                            {intern && <p className="text-xs text-muted-foreground">{intern.city}{intern.school && ` · ${intern.school}`}</p>}
                          </div>
                          <div className="flex items-center gap-2">
                            {app.status === 'pending' && <>
                              <button onClick={() => updateAppStatus(app.id, 'accepted')} className="h-8 px-3 rounded-lg bg-success text-success-foreground text-xs font-semibold">Accept</button>
                              <button onClick={() => updateAppStatus(app.id, 'rejected')} className="h-8 px-3 rounded-lg bg-destructive text-destructive-foreground text-xs font-semibold">Reject</button>
                            </>}
                            {app.status === 'accepted' && <>
                              <span className="text-xs text-success font-medium">Accepted ✓</span>
                              <button onClick={() => { setMsgIntern(app.intern_id); setMsgListingId(listing.id); }} className="h-8 px-3 rounded-lg bg-primary text-primary-foreground text-xs font-semibold flex items-center gap-1"><MessageSquare className="h-3 w-3" />Message</button>
                            </>}
                            {app.status === 'rejected' && <span className="text-xs text-destructive font-medium">Rejected</span>}
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
              <div key={m.id} className="glass-card rounded-2xl p-4">
                <p className="text-xs text-muted-foreground">To: {internInfos[m.intern_id] ? `${internInfos[m.intern_id].first_name} ${internInfos[m.intern_id].last_name}` : m.intern_id} · {new Date(m.sent_at).toLocaleString()}</p>
                <p className="text-sm mt-1">{m.content}</p>
              </div>
            ))}</div>}
          </div>}

          {tab === 'settings' && <div>
            <h1 className="font-display text-2xl font-bold mb-6">Settings</h1>
            <div className="glass-card rounded-2xl p-6"><p className="text-sm text-muted-foreground mb-4">Signed in as: {user?.email}</p>
            <button onClick={signOut} className="h-10 px-4 rounded-xl bg-destructive text-destructive-foreground text-sm font-semibold">Sign Out</button></div>
          </div>}
        </motion.div>

        {msgIntern && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/20 backdrop-blur-sm p-4" onClick={() => setMsgIntern(null)}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="liquid-glass rounded-2xl p-6 max-w-md w-full" onClick={e => e.stopPropagation()}>
              <h2 className="font-display text-lg font-bold mb-4">Send Message</h2>
              <p className="text-sm text-muted-foreground mb-3">To: {internInfos[msgIntern] ? `${internInfos[msgIntern].first_name} ${internInfos[msgIntern].last_name}` : '...'}</p>
              <textarea value={msgContent} onChange={e => setMsgContent(e.target.value)} rows={4} placeholder="Type your message..." className={inputCls + " h-auto py-2 mb-4"} />
              <div className="flex gap-2 justify-end">
                <button onClick={() => setMsgIntern(null)} className="h-9 px-4 rounded-xl border border-border/50 text-sm font-medium">Cancel</button>
                <button onClick={sendMessage} disabled={!msgContent.trim()} className="h-9 px-4 rounded-xl bg-primary text-primary-foreground text-sm font-semibold disabled:opacity-50 flex items-center gap-1"><Send className="h-3.5 w-3.5" />Send</button>
              </div>
            </motion.div>
          </div>
        )}

        {confirmClose && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/20 backdrop-blur-sm p-4" onClick={() => setConfirmClose(null)}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="liquid-glass rounded-2xl p-6 max-w-sm w-full" onClick={e => e.stopPropagation()}>
              <h2 className="font-display text-lg font-bold">Close Listing?</h2>
              <p className="text-sm text-muted-foreground mt-2">Are you sure you want to close this listing? It will no longer be visible to interns.</p>
              <div className="mt-6 flex gap-2 justify-end">
                <button onClick={() => setConfirmClose(null)} className="h-9 px-4 rounded-xl border border-border/50 text-sm font-medium">Cancel</button>
                <button onClick={() => closeListing(confirmClose)} className="h-9 px-4 rounded-xl bg-destructive text-destructive-foreground text-sm font-semibold">Close Listing</button>
              </div>
            </motion.div>
          </div>
        )}
      </main>
    </div>
  );
};

export default BusinessDashboard;
