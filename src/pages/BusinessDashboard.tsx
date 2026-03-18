import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Home, PlusCircle, List, Users, MessageSquare, Settings, LogOut, Loader2, Check, X, Send, Eye, Edit } from "lucide-react";
import skillbridgeLogo from "@/assets/skillbridge-logo.png";
import SEOHead from "@/components/SEOHead";

const db = supabase as any;
const CATEGORIES = ['Technology', 'Marketing', 'Design', 'Finance', 'Healthcare', 'Education', 'Retail', 'Food & Beverage', 'Creative & Media', 'Other'];
const LANGUAGES = ['English', 'Spanish', 'French', 'Mandarin', 'Cantonese', 'Arabic', 'Portuguese', 'Other'];
const inputCls = "w-full h-[48px] px-4 rounded-xl text-[15px] glass-input";
const labelCls = "block text-small font-medium mb-2";

interface Listing { id: string; title: string; status: string; created_at: string; description: string; category: string; work_setting: string; location: string; preferred_hours: string; pay_rate: string; hours_per_week: string; duration: string; preferred_languages: string[]; skills_learned: string[]; requirements: string[]; start_date: string | null; business_id: string; }
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
const mobileTabs = [{id:'home',label:'Home',icon:Home},{id:'listings',label:'Listings',icon:List},{id:'applicants',label:'Applicants',icon:Users},{id:'messages',label:'Messages',icon:MessageSquare},{id:'settings',label:'Settings',icon:Settings}];

const BusinessDashboard = () => {
  const { user, signOut } = useAuth();
  const [tab, setTab] = useState('home');
  const [myListings, setMyListings] = useState<Listing[]>([]);
  const [apps, setApps] = useState<Application[]>([]);
  const [internInfos, setInternInfos] = useState<Record<string, InternInfo>>({});
  const [sentMsgs, setSentMsgs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({ title: '', description: '', category: '', work_setting: 'In-Person', location: '', preferred_hours: '', pay_rate: '', hours_per_week: '', duration: '', start_date: '' });
  const [skills, setSkills] = useState(['', '', '']);
  const [reqs, setReqs] = useState(['']);
  const [prefLangs, setPrefLangs] = useState<string[]>([]);
  const [posting, setPosting] = useState(false);
  const [postSuccess, setPostSuccess] = useState(false);

  const [msgIntern, setMsgIntern] = useState<string | null>(null);
  const [msgContent, setMsgContent] = useState('');
  const [msgListingId, setMsgListingId] = useState<string | null>(null);
  const [confirmClose, setConfirmClose] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [viewIntern, setViewIntern] = useState<InternInfo | null>(null);
  const [editingListing, setEditingListing] = useState<Listing | null>(null);
  const [editForm, setEditForm] = useState<any>(null);

  useEffect(() => { if (tab === 'home' || tab === 'listings') fetchListings(); if (tab === 'applicants') fetchApps(); if (tab === 'messages') fetchMessages(); }, [tab]);

  const fetchListings = async () => { setLoading(true); const { data } = await db.from('listings').select('*').eq('business_id', user?.id).order('created_at', { ascending: false }); if (data) setMyListings(data); setLoading(false); };
  const fetchApps = async () => {
    setLoading(true);
    const { data: listings } = await db.from('listings').select('id').eq('business_id', user?.id);
    if (!listings?.length) { setApps([]); setLoading(false); return; }
    const ids: string[] = listings.map((l: any) => l.id);
    const { data } = await db.from('listing_applications').select('*').in('listing_id', ids).order('applied_at', { ascending: false });
    if (data) { setApps(data); const internIds = [...new Set(data.map((a: any) => a.intern_id))] as string[]; await loadInterns(internIds); }
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
    if (filledSkills.length < 3) { toast.error("Please add at least 3 skills they will learn."); return; }
    if (reqs.filter(r => r.trim()).length > 3) { toast.error("Maximum 3 requirements allowed."); return; }
    if (!form.title || !form.description || !form.pay_rate) { toast.error("Please fill required fields."); return; }
    if (form.work_setting === 'In-Person' && !form.location) { toast.error("Location is required for in-person roles."); return; }
    setPosting(true);
    const { error } = await db.from('listings').insert({
      business_id: user?.id, title: form.title, description: form.description, category: form.category,
      work_setting: form.work_setting, location: form.work_setting === 'Remote' ? 'Remote' : form.location,
      preferred_hours: form.preferred_hours, pay_rate: form.pay_rate, hours_per_week: form.hours_per_week,
      duration: form.duration, start_date: form.start_date || null,
      preferred_languages: prefLangs, skills_learned: filledSkills, requirements: reqs.filter(r => r.trim()),
    });
    setPosting(false);
    if (error) { toast.error(error.message); return; }
    setPostSuccess(true);
    toast.success("Listing submitted for review!");
    setForm({ title: '', description: '', category: '', work_setting: 'In-Person', location: '', preferred_hours: '', pay_rate: '', hours_per_week: '', duration: '', start_date: '' });
    setSkills(['', '', '']); setReqs(['']); setPrefLangs([]);
    setTimeout(() => setPostSuccess(false), 3000);
  };

  const updateAppStatus = async (appId: string, status: string) => { setActionLoading(appId); await db.from('listing_applications').update({ status }).eq('id', appId); toast.success(`Application ${status}.`); setActionLoading(null); fetchApps(); };
  const closeListing = async (id: string) => { setActionLoading(id); await db.from('listings').update({ status: 'closed' }).eq('id', id); toast.success("Listing closed."); setActionLoading(null); setConfirmClose(null); fetchListings(); };
  const sendMessage = async () => {
    if (!msgContent.trim() || !msgIntern) return;
    setActionLoading('msg');
    await db.from('messages').insert({ business_id: user?.id, intern_id: msgIntern, listing_id: msgListingId, content: msgContent });
    toast.success("Message sent!");
    setActionLoading(null);
    setMsgContent(''); setMsgIntern(null); setMsgListingId(null);
  };

  const openEditForm = (l: Listing) => {
    setEditingListing(l);
    setEditForm({ ...l });
  };

  const saveListingChanges = async () => {
    if (!editingListing || !editForm) return;
    await db.from('listings').update({
      title: editForm.title,
      description: editForm.description,
      pay_rate: editForm.pay_rate,
      location: editForm.location,
      hours_per_week: editForm.hours_per_week,
      status: 'pending_edited',
    }).eq('id', editingListing.id);
    toast.success('Changes saved and sent for review.');
    setEditingListing(null);
    setEditForm(null);
    fetchListings();
  };

  const statusBadge = (s: string) => {
    if (s === 'pending_edited') return <span className="badge-pending" style={{ background: 'rgba(255,159,10,0.16)', color: '#B45309' }}>Pending Review (Edited)</span>;
    const cls = s === 'live' ? 'badge-live' : s === 'rejected' ? 'badge-rejected' : s === 'pending' ? 'badge-pending' : 'badge-closed';
    return <span className={cls}>{s.charAt(0).toUpperCase() + s.slice(1)}</span>;
  };

  return (
    <div className="min-h-screen flex" style={{ background: 'transparent' }}>
      <SEOHead title="Business Dashboard" description="Manage your SkillBridge listings" path="/business" noIndex />
      <aside className="hidden md:flex flex-col w-60 h-screen fixed left-0 top-0 glass-sidebar p-4 z-40">
        <div className="flex items-center gap-2 px-3 py-4"><img src={skillbridgeLogo} alt="SkillBridge" className="h-8 w-auto" width={128} height={32} /><span className="font-display font-bold text-small">Business</span></div>
        <nav className="flex-1 mt-4 space-y-1" aria-label="Business navigation">{TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-small font-medium transition-fast"
            style={tab === t.id ? { background: 'rgba(79, 70, 229, 0.1)', color: '#4F46E5' } : { color: 'rgba(60,60,67,0.6)' }}>
            <t.icon className="h-4 w-4" />{t.label}
          </button>
        ))}</nav>
        <button onClick={signOut} className="flex items-center gap-3 px-3 py-2.5 text-small transition-fast" style={{ color: 'rgba(60,60,67,0.6)' }}><LogOut className="h-4 w-4" />Sign Out</button>
      </aside>
      <div className="md:hidden fixed top-0 left-0 right-0 liquid-glass z-50 px-4 py-3" style={{ height: 96 }}>
        <div className="flex items-center justify-between"><div className="flex items-center gap-2"><img src={skillbridgeLogo} alt="SkillBridge" className="h-7 w-auto" width={112} height={28} /><span className="font-display font-bold text-caption">Business</span></div><button onClick={signOut}><LogOut className="h-4 w-4" style={{ color: 'rgba(60,60,67,0.6)' }} /></button></div>
        <div className="flex gap-1 mt-3 overflow-x-auto pb-1">{TABS.map(t => (<button key={t.id} onClick={() => setTab(t.id)} className="flex-shrink-0 px-3 py-1.5 rounded-lg text-caption font-medium transition-fast" style={tab === t.id ? { background: 'rgba(79, 70, 229, 0.1)', color: '#4F46E5' } : { color: 'rgba(60,60,67,0.6)' }}>{t.label}</button>))}</div>
      </div>

      <main className="flex-1 md:ml-60 p-4 md:p-8 pt-28 md:pt-8 pb-24 md:pb-8">
        <motion.div key={tab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.38, ease }}>
          {tab === 'home' && <div className="stagger-children">
            <h1 className="font-display text-h2 font-bold mb-8">Dashboard</h1>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="glass-card p-6 text-center card-hover"><p className="text-h1 font-bold" style={{ color: '#10B981' }}>{myListings.filter(l => l.status === 'live').length}</p><p className="text-small mt-1" style={{ color: 'rgba(60,60,67,0.6)' }}>Live Listings</p></div>
              <div className="glass-card p-6 text-center card-hover"><p className="text-h1 font-bold" style={{ color: '#FF9F0A' }}>{myListings.filter(l => l.status === 'pending').length}</p><p className="text-small mt-1" style={{ color: 'rgba(60,60,67,0.6)' }}>Pending Review</p></div>
              <div className="glass-card p-6 text-center card-hover"><p className="text-h1 font-bold">{myListings.length}</p><p className="text-small mt-1" style={{ color: 'rgba(60,60,67,0.6)' }}>Total Listings</p></div>
            </div>
          </div>}

          {tab === 'post' && <div>
            <h1 className="font-display text-h2 font-bold mb-8">Post New Listing</h1>
            {postSuccess ? <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="glass-card p-12 text-center"><Check className="h-10 w-10 mx-auto mb-4" style={{ color: '#10B981' }} /><p className="font-display font-bold text-h4">Listing submitted for review!</p><p className="text-small mt-1" style={{ color: 'rgba(60,60,67,0.6)' }}>You will be notified once it is approved.</p></motion.div> :
            <form onSubmit={handlePost} className="glass-card p-8 space-y-6 max-w-2xl">
              <div><label htmlFor="post-title" className={labelCls} style={{ color: 'rgba(60,60,67,0.6)' }}>Internship Title *</label><input id="post-title" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="e.g. Marketing Intern" className={inputCls} /></div>
              <div><label htmlFor="post-desc" className={labelCls} style={{ color: 'rgba(60,60,67,0.6)' }}>Description *</label><textarea id="post-desc" value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={4} placeholder="Describe the role..." className={inputCls + " !h-auto py-3"} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label htmlFor="post-cat" className={labelCls} style={{ color: 'rgba(60,60,67,0.6)' }}>Category</label><select id="post-cat" value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} className={inputCls}><option value="">Select...</option>{CATEGORIES.map(c => <option key={c}>{c}</option>)}</select></div>
                <div><label className={labelCls} style={{ color: 'rgba(60,60,67,0.6)' }}>Work Setting *</label><div className="flex gap-2">{['In-Person', 'Remote'].map(w => <button key={w} type="button" onClick={() => setForm(p => ({ ...p, work_setting: w }))} className={`flex-1 h-[48px] rounded-xl text-small font-medium transition-fast btn-press ${form.work_setting === w ? '' : ''}`} style={form.work_setting === w ? { background: 'rgba(79, 70, 229, 0.1)', border: '1px solid rgba(79, 70, 229, 0.3)', color: '#4F46E5' } : { background: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.4)' }}>{w}</button>)}</div></div>
              </div>
              {form.work_setting === 'In-Person' && <div><label htmlFor="post-loc" className={labelCls} style={{ color: 'rgba(60,60,67,0.6)' }}>Location *</label><input id="post-loc" value={form.location} onChange={e => setForm(p => ({ ...p, location: e.target.value }))} placeholder="City, State" className={inputCls} /></div>}
              <div className="grid grid-cols-2 gap-4">
                <div><label htmlFor="post-pay" className={labelCls} style={{ color: 'rgba(60,60,67,0.6)' }}>Pay Rate (Hourly) *</label><input id="post-pay" value={form.pay_rate} onChange={e => setForm(p => ({ ...p, pay_rate: e.target.value }))} placeholder="$15/hr" className={inputCls} /></div>
                <div><label htmlFor="post-hrs" className={labelCls} style={{ color: 'rgba(60,60,67,0.6)' }}>Hours Per Week</label><input id="post-hrs" value={form.hours_per_week} onChange={e => setForm(p => ({ ...p, hours_per_week: e.target.value }))} placeholder="20" className={inputCls} /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label htmlFor="post-dur" className={labelCls} style={{ color: 'rgba(60,60,67,0.6)' }}>Duration</label><input id="post-dur" value={form.duration} onChange={e => setForm(p => ({ ...p, duration: e.target.value }))} placeholder="3 months" className={inputCls} /></div>
                <div><label htmlFor="post-start" className={labelCls} style={{ color: 'rgba(60,60,67,0.6)' }}>Start Date</label><input id="post-start" type="date" value={form.start_date} onChange={e => setForm(p => ({ ...p, start_date: e.target.value }))} className={inputCls} /></div>
              </div>
              <div><label htmlFor="post-phrs" className={labelCls} style={{ color: 'rgba(60,60,67,0.6)' }}>Preferred Hours</label><input id="post-phrs" value={form.preferred_hours} onChange={e => setForm(p => ({ ...p, preferred_hours: e.target.value }))} placeholder="Weekdays 9am to 1pm" className={inputCls} /></div>
              <div><label className={labelCls} style={{ color: 'rgba(60,60,67,0.6)' }}>Skills They Will Learn (Min 3) *</label>{skills.map((s, i) => <input key={i} value={s} onChange={e => { const n = [...skills]; n[i] = e.target.value; setSkills(n); }} placeholder={`Skill ${i + 1}`} className={inputCls + " mb-2"} aria-label={`Skill ${i + 1}`} />)}
                <button type="button" onClick={() => setSkills(p => [...p, ''])} className="text-small font-semibold transition-fast" style={{ color: '#4F46E5' }}>+ Add skill</button></div>
              <div><label className={labelCls} style={{ color: 'rgba(60,60,67,0.6)' }}>Requirements (Max 3)</label>{reqs.map((r, i) => <input key={i} value={r} onChange={e => { const n = [...reqs]; n[i] = e.target.value; setReqs(n); }} placeholder={`Requirement ${i + 1}`} className={inputCls + " mb-2"} aria-label={`Requirement ${i + 1}`} />)}
                {reqs.length < 3 && <button type="button" onClick={() => setReqs(p => [...p, ''])} className="text-small font-semibold transition-fast" style={{ color: '#4F46E5' }}>+ Add requirement</button>}</div>
              <div><label className={labelCls} style={{ color: 'rgba(60,60,67,0.6)' }}>Preferred Languages</label><div className="flex flex-wrap gap-2">{LANGUAGES.map(l => <label key={l} className="text-small px-3 py-1.5 rounded-full cursor-pointer transition-fast" style={prefLangs.includes(l) ? { background: 'rgba(79, 70, 229, 0.1)', border: '1px solid rgba(79, 70, 229, 0.3)', color: '#4F46E5' } : { background: 'rgba(0,0,0,0.03)', color: 'rgba(60,60,67,0.6)' }}>
                    <input type="checkbox" className="sr-only" checked={prefLangs.includes(l)} onChange={e => setPrefLangs(e.target.checked ? [...prefLangs, l] : prefLangs.filter(x => x !== l))} />{l}</label>)}</div></div>
              <button type="submit" disabled={posting} className="w-full h-[48px] btn-glass-primary inline-flex items-center justify-center gap-2 disabled:opacity-50">
                {posting ? <><Loader2 className="h-4 w-4 animate-spin" /> Submitting...</> : "Submit for Review"}
              </button>
            </form>}
          </div>}

          {tab === 'listings' && <div>
            <h1 className="font-display text-h2 font-bold mb-8">My Listings</h1>
            {loading ? <div className="skeleton-shimmer h-32 w-full" /> : myListings.length === 0 ? <p style={{ color: 'rgba(60,60,67,0.6)' }}>No listings yet.</p> :
            <div className="space-y-3">{myListings.map(l => (
              <div key={l.id} className="glass-card p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 card-hover">
                <div><h3 className="font-display font-bold">{l.title}</h3><p className="text-small" style={{ color: 'rgba(60,60,67,0.6)' }}>{l.pay_rate}, {l.work_setting === 'Remote' ? 'Remote' : l.location}</p></div>
                <div className="flex items-center gap-2">
                  {statusBadge(l.status)}
                  {l.status === 'live' && <button onClick={() => setConfirmClose(l.id)} className="btn-glass-secondary h-8 px-3 text-small" style={{ padding: '4px 12px' }}>Close</button>}
                  {['live','pending_edited'].includes(l.status) && <button onClick={() => openEditForm(l)} className="btn-glass-secondary h-8 px-3 text-small flex items-center gap-1" style={{ padding: '4px 12px' }}><Edit className="h-3 w-3" />Edit</button>}
                </div>
              </div>
            ))}</div>}
          </div>}

          {tab === 'applicants' && <div>
            <h1 className="font-display text-h2 font-bold mb-8">Applicants</h1>
            {loading ? <div className="skeleton-shimmer h-32 w-full" /> : apps.length === 0 ? <p style={{ color: 'rgba(60,60,67,0.6)' }}>No applications yet.</p> :
            <div className="space-y-4">
              {myListings.filter(l => apps.some(a => a.listing_id === l.id)).map(listing => {
                const listingApps = apps.filter(a => a.listing_id === listing.id);
                return (
                  <div key={listing.id} className="glass-card p-6">
                    <div className="flex items-center justify-between mb-4"><h3 className="font-display font-bold">{listing.title}</h3><span className="text-small" style={{ color: 'rgba(60,60,67,0.6)' }}>{listingApps.length} intern{listingApps.length !== 1 ? 's' : ''} applied</span></div>
                    <div className="space-y-3">{listingApps.map(app => {
                      const intern = internInfos[app.intern_id];
                      return (
                        <div key={app.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl" style={{ background: 'rgba(0,0,0,0.02)' }}>
                          <div>
                            <p className="font-medium">{intern ? `${intern.first_name} ${intern.last_name}` : '...'}</p>
                            {intern && <p className="text-small" style={{ color: 'rgba(60,60,67,0.6)' }}>{intern.city}{intern.school && `, ${intern.school}`}</p>}
                          </div>
                          <div className="flex items-center gap-2">
                            {intern && <button onClick={() => setViewIntern(intern)} className="btn-glass-secondary h-8 px-3 text-small flex items-center gap-1" style={{ padding: '4px 12px' }}><Eye className="h-3 w-3" />Portfolio</button>}
                            {app.status === 'pending' && <>
                              <button onClick={() => updateAppStatus(app.id, 'accepted')} disabled={actionLoading === app.id} className="h-8 px-3 rounded-xl text-small font-semibold text-white btn-press" style={{ background: '#10B981' }}>{actionLoading === app.id ? <Loader2 className="h-3 w-3 animate-spin" /> : 'Accept'}</button>
                              <button onClick={() => updateAppStatus(app.id, 'rejected')} disabled={actionLoading === app.id} className="btn-glass-destructive h-8 px-3 text-small font-semibold" style={{ padding: '4px 12px' }}>Reject</button>
                            </>}
                            {app.status === 'accepted' && <>
                              <span className="badge-live">Accepted</span>
                              <button onClick={() => { setMsgIntern(app.intern_id); setMsgListingId(listing.id); }} className="btn-glass-primary h-8 px-3 text-small font-semibold flex items-center gap-1" style={{ padding: '4px 12px' }}><MessageSquare className="h-3 w-3" />Message</button>
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
            <h1 className="font-display text-h2 font-bold mb-8">Messages</h1>
            {sentMsgs.length === 0 ? <p style={{ color: 'rgba(60,60,67,0.6)' }}>No messages sent yet. Accept an applicant to start messaging.</p> :
            <div className="space-y-3">{sentMsgs.map(m => (
              <div key={m.id} className="glass-card p-4 card-hover">
                <p className="text-small" style={{ color: 'rgba(60,60,67,0.6)' }}>To: {internInfos[m.intern_id] ? `${internInfos[m.intern_id].first_name} ${internInfos[m.intern_id].last_name}` : m.intern_id}, {new Date(m.sent_at).toLocaleString()}</p>
                <p className="text-body mt-1">{m.content}</p>
              </div>
            ))}</div>}
          </div>}

          {tab === 'settings' && <div>
            <h1 className="font-display text-h2 font-bold mb-8">Settings</h1>
            <div className="glass-card p-8"><p className="text-small mb-4" style={{ color: 'rgba(60,60,67,0.6)' }}>Signed in as: {user?.email}</p>
            <button onClick={signOut} className="btn-glass-destructive h-12 px-6 text-body font-semibold">Sign Out</button></div>
          </div>}
        </motion.div>

        {/* View Intern Portfolio Modal */}
        {viewIntern && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.2)', backdropFilter: 'blur(12px)' }} onClick={() => setViewIntern(null)}>
            <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.28, ease }}
              className="glass-card p-8 max-w-md w-full max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
              <h2 className="font-display text-h3 font-bold">{viewIntern.first_name} {viewIntern.last_name}</h2>
              <div className="mt-4 space-y-2 text-small" style={{ color: 'rgba(60,60,67,0.6)' }}>
                {viewIntern.city && <p>City: {viewIntern.city}</p>}
                {viewIntern.school && <p>School: {viewIntern.school}</p>}
                {viewIntern.gpa && <p>GPA: {viewIntern.gpa}</p>}
                {viewIntern.phone && <p>Phone: {viewIntern.phone}</p>}
                {viewIntern.bio && <p className="mt-2">{viewIntern.bio}</p>}
                {viewIntern.skills?.length > 0 && <div className="flex flex-wrap gap-1 mt-2">{viewIntern.skills.map((s, i) => <span key={i} className="badge-remote text-caption">{s}</span>)}</div>}
              </div>
              <div className="mt-8 flex justify-end">
                <button onClick={() => setViewIntern(null)} className="btn-glass-secondary h-9 px-4 text-small">Close</button>
              </div>
            </motion.div>
          </div>
        )}

        {msgIntern && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.2)', backdropFilter: 'blur(12px)' }} onClick={() => setMsgIntern(null)}>
            <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.28, ease }}
              className="glass-card p-8 max-w-md w-full" onClick={e => e.stopPropagation()}>
              <h2 className="font-display text-h4 font-bold mb-4">Send Message</h2>
              <p className="text-small mb-4" style={{ color: 'rgba(60,60,67,0.6)' }}>To: {internInfos[msgIntern] ? `${internInfos[msgIntern].first_name} ${internInfos[msgIntern].last_name}` : '...'}</p>
              <textarea value={msgContent} onChange={e => setMsgContent(e.target.value)} rows={4} placeholder="Type your message..." className={inputCls + " !h-auto py-3 mb-4"} aria-label="Message content" />
              <div className="flex gap-2 justify-end">
                <button onClick={() => setMsgIntern(null)} className="btn-glass-secondary h-9 px-4 text-small">Cancel</button>
                <button onClick={sendMessage} disabled={!msgContent.trim() || actionLoading === 'msg'} className="btn-glass-primary h-9 px-4 text-small font-semibold inline-flex items-center gap-1 disabled:opacity-50" style={{ padding: '8px 16px' }}>
                  {actionLoading === 'msg' ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <><Send className="h-3.5 w-3.5" />Send</>}
                </button>
              </div>
            </motion.div>
          </div>
        )}


        {editingListing && editForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.2)', backdropFilter: 'blur(12px)' }} onClick={() => { setEditingListing(null); setEditForm(null); }}>
            <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.28, ease }} className="glass-card p-6 max-w-2xl w-full" onClick={e => e.stopPropagation()}>
              <h2 className="font-display text-h4 font-bold mb-4">Edit Listing</h2>
              <div className="grid md:grid-cols-2 gap-3">
                <input value={editForm.title || ''} onChange={e => setEditForm((p:any) => ({...p,title:e.target.value}))} className={inputCls} placeholder="Title" />
                <input value={editForm.pay_rate || ''} onChange={e => setEditForm((p:any) => ({...p,pay_rate:e.target.value}))} className={inputCls} placeholder="Pay" />
                <input value={editForm.location || ''} onChange={e => setEditForm((p:any) => ({...p,location:e.target.value}))} className={inputCls} placeholder="Location" />
                <input value={editForm.hours_per_week || ''} onChange={e => setEditForm((p:any) => ({...p,hours_per_week:e.target.value}))} className={inputCls} placeholder="Hours" />
              </div>
              <textarea value={editForm.description || ''} onChange={e => setEditForm((p:any) => ({...p,description:e.target.value}))} className={inputCls + ' !h-auto py-3 mt-3'} rows={4} placeholder="Description" />
              <div className="mt-4 flex justify-end gap-2">
                <button onClick={() => { setEditingListing(null); setEditForm(null); }} className="btn-glass-ghost h-10 px-4 text-small">Discard Changes</button>
                <button onClick={saveListingChanges} className="btn-glass-primary h-10 px-4 text-small font-semibold">Save Changes</button>
              </div>
            </motion.div>
          </div>
        )}

        {confirmClose && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.2)', backdropFilter: 'blur(12px)' }} onClick={() => setConfirmClose(null)}>
            <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.28, ease }}
              className="glass-card p-8 max-w-sm w-full" onClick={e => e.stopPropagation()}>
              <h2 className="font-display text-h4 font-bold">Close Listing?</h2>
              <p className="text-small mt-3" style={{ color: 'rgba(60,60,67,0.6)' }}>Are you sure you want to close this listing? It will no longer be visible to interns.</p>
              <div className="mt-8 flex gap-2 justify-end">
                <button onClick={() => setConfirmClose(null)} className="btn-glass-secondary h-9 px-4 text-small">Cancel</button>
                <button onClick={() => closeListing(confirmClose)} disabled={actionLoading === confirmClose} className="btn-glass-destructive h-9 px-4 text-small font-semibold inline-flex items-center gap-1">
                  {actionLoading === confirmClose ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Close Listing'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </main>
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex items-start justify-around pt-1" style={{ background: "rgba(245,245,250,0.85)", backdropFilter: "blur(24px) saturate(200%)", borderTop: "1px solid rgba(255,255,255,0.5)", paddingBottom: "env(safe-area-inset-bottom)", height: "calc(56px + env(safe-area-inset-bottom))" }}>
        {mobileTabs.map((t: any) => { const Icon=t.icon; const active=tab===t.id; return <button key={t.id} onClick={() => setTab(t.id)} className="flex flex-col items-center justify-center gap-0.5 min-w-0 flex-1" style={{ color: active ? "#4F46E5" : "rgba(28,28,30,0.4)", fontFamily: "var(--font-body)" }}><Icon className="h-4 w-4" /><span className="text-[11px]">{t.label}</span><span className="h-1 w-1.5 rounded-full" style={{ background: active ? "#4F46E5" : "transparent" }} /></button>; })}
      </div>
    </div>
  );
};

export default BusinessDashboard;
