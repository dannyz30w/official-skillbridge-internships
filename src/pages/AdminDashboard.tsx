import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ClipboardList, List, Users, Building2, Settings, Trash2, Eye, LogOut, Loader2 } from "lucide-react";
import skillbridgeLogo from "@/assets/skillbridge-logo.png";

const db = supabase as any;
interface Listing { id: string; business_id: string; title: string; description: string; category: string; work_setting: string; location: string; preferred_hours: string; pay_rate: string; hours_per_week: string; duration: string; status: string; created_at: string; skills_learned: string[]; requirements: string[]; preferred_languages: string[]; start_date: string | null; age_requirement: string; }
interface InternProfile { id: string; user_id: string; first_name: string; last_name: string; city: string; school: string; gpa: number | null; test_scores: string; phone: string; languages: any; skills: string[]; bio: string; date_of_birth: string | null; }
interface BizProfile { id: string; user_id: string; business_name: string; contact_name: string; business_email: string; business_type: string; }

const TABS = [
  { id: 'queue', label: 'Queue', icon: ClipboardList },
  { id: 'listings', label: 'All Listings', icon: List },
  { id: 'interns', label: 'Intern Portfolios', icon: Users },
  { id: 'businesses', label: 'Business Accounts', icon: Building2 },
  { id: 'settings', label: 'Settings', icon: Settings },
];

const AdminDashboard = () => {
  const { signOut } = useAuth();
  const [tab, setTab] = useState('queue');
  const [pending, setPending] = useState<Listing[]>([]);
  const [allListings, setAllListings] = useState<Listing[]>([]);
  const [interns, setInterns] = useState<InternProfile[]>([]);
  const [businesses, setBusinesses] = useState<BizProfile[]>([]);
  const [bizNames, setBizNames] = useState<Record<string, string>>({});
  const [pendingCount, setPendingCount] = useState(0);
  const [viewListing, setViewListing] = useState<Listing | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<{ type: string; userId: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchData(); }, [tab]);

  const fetchData = async () => {
    setLoading(true);
    const { count } = await db.from('listings').select('*', { count: 'exact', head: true }).eq('status', 'pending');
    setPendingCount(count || 0);
    if (tab === 'queue') {
      const { data } = await db.from('listings').select('*').eq('status', 'pending').order('created_at', { ascending: true });
      if (data) { setPending(data); await loadBizNames(data); }
    } else if (tab === 'listings') {
      const { data } = await db.from('listings').select('*').order('created_at', { ascending: false });
      if (data) { setAllListings(data); await loadBizNames(data); }
    } else if (tab === 'interns') {
      const { data } = await db.from('intern_profiles').select('*');
      if (data) setInterns(data);
    } else if (tab === 'businesses') {
      const { data } = await db.from('business_profiles').select('*');
      if (data) setBusinesses(data);
    }
    setLoading(false);
  };

  const loadBizNames = async (listings: Listing[]) => {
    const ids = [...new Set(listings.map(l => l.business_id))];
    if (!ids.length) return;
    const { data } = await db.from('business_profiles').select('user_id, business_name').in('user_id', ids);
    if (data) { const m: Record<string, string> = {}; data.forEach((b: any) => m[b.user_id] = b.business_name); setBizNames(p => ({ ...p, ...m })); }
  };

  const approve = async (id: string) => { await db.from('listings').update({ status: 'live' }).eq('id', id); toast.success("Listing approved!"); fetchData(); };
  const reject = async (id: string) => { await db.from('listings').update({ status: 'rejected' }).eq('id', id); toast.success("Listing rejected."); fetchData(); };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    const t = confirmDelete.type === 'intern' ? 'intern_profiles' : 'business_profiles';
    await db.from(t).delete().eq('user_id', confirmDelete.userId);
    await db.from('profiles').delete().eq('user_id', confirmDelete.userId);
    toast.success(`${confirmDelete.type === 'intern' ? 'Intern' : 'Business'} deleted.`);
    setConfirmDelete(null);
    fetchData();
  };

  const sc = (s: string) => s === 'live' ? 'bg-success/10 text-success' : s === 'rejected' ? 'bg-destructive/10 text-destructive' : s === 'pending' ? 'bg-warning/10 text-warning' : 'bg-muted text-muted-foreground';

  return (
    <div className="min-h-screen flex">
      <aside className="hidden md:flex flex-col w-60 h-screen fixed left-0 top-0 liquid-glass border-r border-border/20 p-4 z-40">
        <div className="flex items-center gap-2 px-3 py-4"><img src={skillbridgeLogo} alt="" className="h-8 w-auto" /><span className="font-display font-bold text-sm text-primary">Admin</span></div>
        <nav className="flex-1 mt-4 space-y-1">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-smooth ${tab === t.id ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground hover:bg-muted/30'}`}>
              <t.icon className="h-4 w-4" />{t.label}
              {t.id === 'queue' && pendingCount > 0 && <span className="ml-auto bg-destructive text-destructive-foreground text-xs rounded-full px-2 py-0.5">{pendingCount}</span>}
            </button>
          ))}
        </nav>
        <button onClick={signOut} className="flex items-center gap-3 px-3 py-2.5 text-sm text-muted-foreground hover:text-foreground transition-smooth"><LogOut className="h-4 w-4" />Sign Out</button>
      </aside>

      <div className="md:hidden fixed top-0 left-0 right-0 liquid-glass z-50 px-4 py-3 border-b border-border/20">
        <div className="flex items-center justify-between"><div className="flex items-center gap-2"><img src={skillbridgeLogo} alt="" className="h-7 w-auto" /><span className="font-display font-bold text-xs text-primary">Admin</span></div><button onClick={signOut}><LogOut className="h-4 w-4 text-muted-foreground" /></button></div>
        <div className="flex gap-1 mt-3 overflow-x-auto pb-1">{TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-smooth ${tab === t.id ? 'bg-primary/10 text-primary' : 'text-muted-foreground'}`}>
            {t.label}{t.id === 'queue' && pendingCount > 0 && <span className="ml-1 bg-destructive text-destructive-foreground rounded-full px-1.5 text-xs">{pendingCount}</span>}
          </button>
        ))}</div>
      </div>

      <main className="flex-1 md:ml-60 p-4 md:p-8 pt-28 md:pt-8">
        <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          {tab === 'queue' && <div>
            <h1 className="font-display text-2xl font-bold mb-6">Listing Queue</h1>
            {loading ? <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /> : pending.length === 0 ? (
              <div className="glass-card rounded-2xl p-12 text-center"><ClipboardList className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" /><p className="text-muted-foreground">No listings pending review.</p></div>
            ) : <div className="space-y-4">{pending.map(l => (
              <div key={l.id} className="glass-card rounded-2xl p-5">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div><p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{bizNames[l.business_id] || '...'}</p><h3 className="font-bold text-lg mt-1">{l.title}</h3>
                    <div className="flex flex-wrap gap-3 mt-2 text-sm text-muted-foreground"><span>{l.pay_rate}</span><span>{l.work_setting === 'Remote' ? 'Remote' : l.location}</span><span>{new Date(l.created_at).toLocaleDateString()}</span></div></div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button onClick={() => setViewListing(l)} className="h-9 px-3 rounded-xl border border-border/50 text-sm text-muted-foreground hover:text-foreground transition-smooth"><Eye className="h-4 w-4" /></button>
                    <button onClick={() => approve(l.id)} className="h-9 px-4 rounded-xl bg-success text-success-foreground text-sm font-semibold hover:bg-success/90 transition-smooth">Approve</button>
                    <button onClick={() => reject(l.id)} className="h-9 px-4 rounded-xl bg-destructive text-destructive-foreground text-sm font-semibold hover:bg-destructive/90 transition-smooth">Reject</button>
                  </div>
                </div>
              </div>
            ))}</div>}
          </div>}

          {tab === 'listings' && <div>
            <h1 className="font-display text-2xl font-bold mb-6">All Listings</h1>
            {loading ? <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /> : <div className="space-y-3">{allListings.map(l => (
              <div key={l.id} className="glass-card rounded-2xl p-4 flex items-center justify-between">
                <div><p className="text-xs text-muted-foreground">{bizNames[l.business_id] || '—'}</p><h3 className="font-semibold">{l.title}</h3></div>
                <span className={`text-xs font-medium px-3 py-1 rounded-full ${sc(l.status)}`}>{l.status.charAt(0).toUpperCase() + l.status.slice(1)}</span>
              </div>
            ))}</div>}
          </div>}

          {tab === 'interns' && <div>
            <h1 className="font-display text-2xl font-bold mb-6">Intern Portfolios</h1>
            {loading ? <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /> : <div className="grid gap-4 sm:grid-cols-2">{interns.map(i => (
              <div key={i.id} className="glass-card rounded-2xl p-5">
                <h3 className="font-bold">{i.first_name} {i.last_name}</h3>
                <p className="text-sm text-muted-foreground mt-1">{i.city}{i.city && i.school && ' · '}{i.school}</p>
                {i.gpa && <p className="text-sm text-muted-foreground">GPA: {i.gpa}</p>}
                {i.test_scores && <p className="text-sm text-muted-foreground">{i.test_scores}</p>}
                {i.phone && <p className="text-sm text-muted-foreground">📞 {i.phone}</p>}
                {i.bio && <p className="text-sm mt-2 text-muted-foreground line-clamp-2">{i.bio}</p>}
                {i.skills?.length > 0 && <div className="flex flex-wrap gap-1 mt-2">{i.skills.map((s, idx) => <span key={idx} className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">{s}</span>)}</div>}
                <button onClick={() => setConfirmDelete({ type: 'intern', userId: i.user_id })} className="mt-3 text-xs text-destructive hover:text-destructive/80 flex items-center gap-1 transition-smooth"><Trash2 className="h-3 w-3" />Delete Profile</button>
              </div>
            ))}</div>}
          </div>}

          {tab === 'businesses' && <div>
            <h1 className="font-display text-2xl font-bold mb-6">Business Accounts</h1>
            {loading ? <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /> : <div className="grid gap-4 sm:grid-cols-2">{businesses.map(b => (
              <div key={b.id} className="glass-card rounded-2xl p-5">
                <h3 className="font-bold">{b.business_name}</h3>
                <p className="text-sm text-muted-foreground">{b.contact_name} · {b.business_type}</p>
                <p className="text-sm text-muted-foreground">{b.business_email}</p>
                <button onClick={() => setConfirmDelete({ type: 'business', userId: b.user_id })} className="mt-3 text-xs text-destructive hover:text-destructive/80 flex items-center gap-1 transition-smooth"><Trash2 className="h-3 w-3" />Delete Account</button>
              </div>
            ))}</div>}
          </div>}

          {tab === 'settings' && <div>
            <h1 className="font-display text-2xl font-bold mb-6">Settings</h1>
            <div className="glass-card rounded-2xl p-6"><p className="text-sm text-muted-foreground mb-4">Signed in as: admin@skillbridge.app</p>
            <button onClick={signOut} className="h-10 px-4 rounded-xl bg-destructive text-destructive-foreground text-sm font-semibold hover:bg-destructive/90 transition-smooth">Sign Out</button></div>
          </div>}
        </motion.div>

        {viewListing && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/20 backdrop-blur-sm p-4" onClick={() => setViewListing(null)}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="liquid-glass rounded-2xl p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
              <h2 className="font-display text-xl font-bold">{viewListing.title}</h2>
              <p className="text-sm text-muted-foreground mt-1">{bizNames[viewListing.business_id]}</p>
              <div className="mt-4 space-y-2 text-sm">
                <p><strong>Pay:</strong> {viewListing.pay_rate}</p>
                <p><strong>Setting:</strong> {viewListing.work_setting}{viewListing.location && ` — ${viewListing.location}`}</p>
                {viewListing.hours_per_week && <p><strong>Hours:</strong> {viewListing.hours_per_week} hrs/week</p>}
                {viewListing.duration && <p><strong>Duration:</strong> {viewListing.duration}</p>}
                <p className="text-muted-foreground whitespace-pre-wrap mt-2">{viewListing.description}</p>
                {viewListing.skills_learned?.length > 0 && <div><strong>Skills learned:</strong><ul className="list-disc pl-5 text-muted-foreground">{viewListing.skills_learned.map((s,i) => <li key={i}>{s}</li>)}</ul></div>}
              </div>
              <div className="mt-6 flex gap-2 justify-end">
                <button onClick={() => { approve(viewListing.id); setViewListing(null); }} className="h-9 px-4 rounded-xl bg-success text-success-foreground text-sm font-semibold">Approve</button>
                <button onClick={() => { reject(viewListing.id); setViewListing(null); }} className="h-9 px-4 rounded-xl bg-destructive text-destructive-foreground text-sm font-semibold">Reject</button>
                <button onClick={() => setViewListing(null)} className="h-9 px-4 rounded-xl border border-border/50 text-sm font-medium">Close</button>
              </div>
            </motion.div>
          </div>
        )}

        {confirmDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/20 backdrop-blur-sm p-4" onClick={() => setConfirmDelete(null)}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="liquid-glass rounded-2xl p-6 max-w-sm w-full" onClick={e => e.stopPropagation()}>
              <h2 className="font-display text-lg font-bold">Confirm Deletion</h2>
              <p className="text-sm text-muted-foreground mt-2">Are you sure you want to delete this {confirmDelete.type}'s profile? This cannot be undone.</p>
              <div className="mt-6 flex gap-2 justify-end">
                <button onClick={() => setConfirmDelete(null)} className="h-9 px-4 rounded-xl border border-border/50 text-sm font-medium">Cancel</button>
                <button onClick={handleDelete} className="h-9 px-4 rounded-xl bg-destructive text-destructive-foreground text-sm font-semibold">Delete</button>
              </div>
            </motion.div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
