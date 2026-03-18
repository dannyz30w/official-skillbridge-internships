import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ClipboardList, List, Users, Building2, Settings, Trash2, Eye, LogOut, Loader2 } from "lucide-react";
import skillbridgeLogo from "@/assets/skillbridge-logo.png";
import SEOHead from "@/components/SEOHead";

const db = supabase as any;
interface Listing { id: string; business_id: string; title: string; description: string; category: string; work_setting: string; location: string; preferred_hours: string; pay_rate: string; hours_per_week: string; duration: string; status: string; created_at: string; skills_learned: string[]; requirements: string[]; preferred_languages: string[]; start_date: string | null; }
interface InternProfile { id: string; user_id: string; first_name: string; last_name: string; city: string; school: string; gpa: number | null; test_scores: string; phone: string; languages: any; skills: string[]; bio: string; date_of_birth: string | null; }
interface BizProfile { id: string; user_id: string; business_name: string; contact_name: string; business_email: string; business_type: string; }

const TABS = [
  { id: 'queue', label: 'Queue', icon: ClipboardList },
  { id: 'listings', label: 'All Listings', icon: List },
  { id: 'interns', label: 'Intern Portfolios', icon: Users },
  { id: 'businesses', label: 'Business Accounts', icon: Building2 },
  { id: 'settings', label: 'Settings', icon: Settings },
];

const ease = [0.16, 1, 0.3, 1] as const;

const AdminDashboard = () => {
  const { user, signOut } = useAuth();
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
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => { fetchData(); }, [tab]);

  const fetchData = async () => {
    setLoading(true);
    const { count } = await db.from('listings').select('*', { count: 'exact', head: true }).in('status', ['pending','pending_edited']);
    setPendingCount(count || 0);
    if (tab === 'queue') {
      const { data } = await db.from('listings').select('*').in('status', ['pending','pending_edited']).order('created_at', { ascending: true });
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
    const ids = [...new Set(listings.map(l => l.business_id))] as string[];
    if (!ids.length) return;
    const { data } = await db.from('business_profiles').select('user_id, business_name').in('user_id', ids);
    if (data) { const m: Record<string, string> = {}; data.forEach((b: any) => m[b.user_id] = b.business_name); setBizNames(p => ({ ...p, ...m })); }
  };

  const approve = async (id: string) => { setActionLoading(id); await db.from('listings').update({ status: 'live' }).eq('id', id); toast.success("Listing approved!"); setActionLoading(null); fetchData(); };
  const reject = async (id: string) => { setActionLoading(id); await db.from('listings').update({ status: 'rejected' }).eq('id', id); toast.success("Listing rejected."); setActionLoading(null); fetchData(); };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    setActionLoading('delete');
    const t = confirmDelete.type === 'intern' ? 'intern_profiles' : 'business_profiles';
    await db.from(t).delete().eq('user_id', confirmDelete.userId);
    await db.from('profiles').delete().eq('user_id', confirmDelete.userId);
    toast.success(`${confirmDelete.type === 'intern' ? 'Intern' : 'Business'} deleted.`);
    setActionLoading(null);
    setConfirmDelete(null);
    fetchData();
  };

  const statusBadge = (s: string) => {
    if (s === 'pending_edited') return <span className='badge-pending' style={{ background: 'rgba(255,159,10,0.16)', color: '#B45309' }}>Pending Review <span className='ml-1'>Edited</span></span>;
    const cls = s === 'live' ? 'badge-live' : s === 'rejected' ? 'badge-rejected' : s === 'pending' ? 'badge-pending' : 'badge-closed';
    return <span className={cls}>{s.charAt(0).toUpperCase() + s.slice(1)}</span>;
  };

  return (
    <div className="min-h-screen flex" style={{ background: 'transparent' }}>
      <SEOHead title="Admin Dashboard" description="SkillBridge admin dashboard" path="/admin" noIndex />
      <aside className="hidden md:flex flex-col w-60 h-screen fixed left-0 top-0 glass-sidebar p-4 z-40">
        <div className="flex items-center gap-2 px-3 py-4"><img src={skillbridgeLogo} alt="SkillBridge" className="h-8 w-auto" width={128} height={32} /><span className="font-display font-bold text-small" style={{ color: '#4F46E5' }}>Admin</span></div>
        <nav className="flex-1 mt-4 space-y-1" aria-label="Admin navigation">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-small font-medium transition-fast ${tab === t.id ? '' : ''}`}
              style={tab === t.id ? { background: 'rgba(79, 70, 229, 0.1)', color: '#4F46E5', borderLeft: '3px solid #4F46E5' } : { color: 'rgba(60,60,67,0.6)' }}>
              <t.icon className="h-4 w-4" />{t.label}
              {t.id === 'queue' && pendingCount > 0 && <span className="ml-auto text-caption font-semibold text-white rounded-full px-2 py-0.5" style={{ background: '#FF3B30' }}>{pendingCount}</span>}
            </button>
          ))}
        </nav>
        <button onClick={signOut} className="flex items-center gap-3 px-3 py-2.5 text-small transition-fast" style={{ color: 'rgba(60,60,67,0.6)' }}><LogOut className="h-4 w-4" />Sign Out</button>
      </aside>

      <div className="md:hidden fixed top-0 left-0 right-0 liquid-glass z-50 px-4 py-3" style={{ height: 96 }}>
        <div className="flex items-center justify-between"><div className="flex items-center gap-2"><img src={skillbridgeLogo} alt="SkillBridge" className="h-7 w-auto" width={112} height={28} /><span className="font-display font-bold text-caption" style={{ color: '#4F46E5' }}>Admin</span></div><button onClick={signOut}><LogOut className="h-4 w-4" style={{ color: 'rgba(60,60,67,0.6)' }} /></button></div>
        <div className="flex gap-1 mt-3 overflow-x-auto pb-1">{TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} className="flex-shrink-0 px-3 py-1.5 rounded-lg text-caption font-medium transition-fast"
            style={tab === t.id ? { background: 'rgba(79, 70, 229, 0.1)', color: '#4F46E5' } : { color: 'rgba(60,60,67,0.6)' }}>
            {t.label}{t.id === 'queue' && pendingCount > 0 && <span className="ml-1 text-caption font-semibold text-white rounded-full px-1.5" style={{ background: '#FF3B30' }}>{pendingCount}</span>}
          </button>
        ))}</div>
      </div>

      <main className="flex-1 md:ml-60 p-4 md:p-8 pt-28 md:pt-8">
        <motion.div key={tab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.38, ease }}>
          {tab === 'queue' && <div>
            <h1 className="font-display text-h2 font-bold mb-8">Listing Queue</h1>
            {loading ? <div className="skeleton-shimmer h-32 w-full" /> : pending.length === 0 ? (
              <div className="glass-card p-16 text-center"><ClipboardList className="h-10 w-10 mx-auto mb-4" style={{ color: 'rgba(60,60,67,0.3)' }} /><p style={{ color: 'rgba(60,60,67,0.6)' }}>No listings pending review.</p></div>
            ) : <div className="space-y-4">{pending.map(l => (
              <div key={l.id} className="glass-card p-6 card-hover">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div><p className="text-caption font-semibold uppercase tracking-wider" style={{ color: 'rgba(60,60,67,0.6)' }}>{bizNames[l.business_id] || '...'}</p><h3 className="font-display font-bold text-h4 mt-1">{l.title}</h3>
                    <div className="flex flex-wrap gap-4 mt-2 text-small" style={{ color: 'rgba(60,60,67,0.6)' }}><span>{l.pay_rate}</span><span>{l.work_setting === 'Remote' ? 'Remote' : l.location}</span><span>{new Date(l.created_at).toLocaleDateString()}</span></div></div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button onClick={() => setViewListing(l)} className="btn-glass-secondary h-9 px-3 text-small"><Eye className="h-4 w-4" /></button>
                    <button onClick={() => approve(l.id)} disabled={actionLoading === l.id} className="h-9 px-4 rounded-xl text-small font-semibold text-white btn-press" style={{ background: '#10B981' }}>{actionLoading === l.id ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Approve'}</button>
                    <button onClick={() => reject(l.id)} disabled={actionLoading === l.id} className="h-9 px-4 rounded-xl text-small font-semibold text-white btn-press btn-glass-destructive">{actionLoading === l.id ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Reject'}</button>
                  </div>
                </div>
              </div>
            ))}</div>}
          </div>}

          {tab === 'listings' && <div>
            <h1 className="font-display text-h2 font-bold mb-8">All Listings</h1>
            {loading ? <div className="skeleton-shimmer h-32 w-full" /> : <div className="space-y-3">{allListings.map(l => (
              <div key={l.id} className="glass-card p-4 flex items-center justify-between card-hover">
                <div><p className="text-caption" style={{ color: 'rgba(60,60,67,0.6)' }}>{bizNames[l.business_id] || '...'}</p><h3 className="font-display font-bold">{l.title}</h3></div>
                {statusBadge(l.status)}
              </div>
            ))}</div>}
          </div>}

          {tab === 'interns' && <div>
            <h1 className="font-display text-h2 font-bold mb-8">Intern Portfolios</h1>
            {loading ? <div className="skeleton-shimmer h-32 w-full" /> : <div className="grid gap-4 sm:grid-cols-2">{interns.map(i => (
              <div key={i.id} className="glass-card p-6 card-hover">
                <h3 className="font-display font-bold">{i.first_name} {i.last_name}</h3>
                <p className="text-small mt-1" style={{ color: 'rgba(60,60,67,0.6)' }}>{i.city}{i.city && i.school && ', '}{i.school}</p>
                {i.gpa && <p className="text-small" style={{ color: 'rgba(60,60,67,0.6)' }}>GPA: {i.gpa}</p>}
                {i.test_scores && <p className="text-small" style={{ color: 'rgba(60,60,67,0.6)' }}>{i.test_scores}</p>}
                {i.phone && <p className="text-small" style={{ color: 'rgba(60,60,67,0.6)' }}>{i.phone}</p>}
                {i.bio && <p className="text-small mt-2 line-clamp-2" style={{ color: 'rgba(60,60,67,0.6)' }}>{i.bio}</p>}
                {i.skills?.length > 0 && <div className="flex flex-wrap gap-1 mt-2">{i.skills.map((s, idx) => <span key={idx} className="badge-remote text-caption">{s}</span>)}</div>}
                <button onClick={() => setConfirmDelete({ type: 'intern', userId: i.user_id })} className="mt-4 text-small font-semibold flex items-center gap-1 transition-fast btn-press" style={{ color: '#FF3B30' }}><Trash2 className="h-3 w-3" />Delete Profile</button>
              </div>
            ))}</div>}
          </div>}

          {tab === 'businesses' && <div>
            <h1 className="font-display text-h2 font-bold mb-8">Business Accounts</h1>
            {loading ? <div className="skeleton-shimmer h-32 w-full" /> : <div className="grid gap-4 sm:grid-cols-2">{businesses.map(b => (
              <div key={b.id} className="glass-card p-6 card-hover">
                <h3 className="font-display font-bold">{b.business_name}</h3>
                <p className="text-small" style={{ color: 'rgba(60,60,67,0.6)' }}>{b.contact_name}, {b.business_type}</p>
                <p className="text-small" style={{ color: 'rgba(60,60,67,0.6)' }}>{b.business_email}</p>
                <button onClick={() => setConfirmDelete({ type: 'business', userId: b.user_id })} className="mt-4 text-small font-semibold flex items-center gap-1 transition-fast btn-press" style={{ color: '#FF3B30' }}><Trash2 className="h-3 w-3" />Delete Account</button>
              </div>
            ))}</div>}
          </div>}

          {tab === 'settings' && <div>
            <h1 className="font-display text-h2 font-bold mb-8">Settings</h1>
            <div className="glass-card p-8"><p className="text-small mb-4" style={{ color: 'rgba(60,60,67,0.6)' }}>Signed in as: {user?.email}</p>
            <button onClick={signOut} className="btn-glass-destructive h-12 px-6 text-body font-semibold">Sign Out</button></div>
          </div>}
        </motion.div>

        {viewListing && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.2)', backdropFilter: 'blur(12px)' }} onClick={() => setViewListing(null)}>
            <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.28, ease }}
              className="glass-card p-8 max-w-lg w-full max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
              <h2 className="font-display text-h3 font-bold">{viewListing.title}</h2>
              <p className="text-small mt-1" style={{ color: 'rgba(60,60,67,0.6)' }}>{bizNames[viewListing.business_id]}</p>
              <div className="mt-4 space-y-2 text-small">
                <p><strong>Pay:</strong> {viewListing.pay_rate}</p>
                <p><strong>Setting:</strong> {viewListing.work_setting}{viewListing.location && `, ${viewListing.location}`}</p>
                {viewListing.hours_per_week && <p><strong>Hours:</strong> {viewListing.hours_per_week} hrs/week</p>}
                {viewListing.duration && <p><strong>Duration:</strong> {viewListing.duration}</p>}
                <p className="whitespace-pre-wrap mt-2" style={{ color: 'rgba(60,60,67,0.6)' }}>{viewListing.description}</p>
                {viewListing.skills_learned?.length > 0 && <div><strong>Skills learned:</strong><ul className="list-disc pl-5" style={{ color: 'rgba(60,60,67,0.6)' }}>{viewListing.skills_learned.map((s,i) => <li key={i}>{s}</li>)}</ul></div>}
              </div>
              <div className="mt-8 flex gap-2 justify-end">
                <button onClick={() => { approve(viewListing.id); setViewListing(null); }} className="h-9 px-4 rounded-xl text-small font-semibold text-white btn-press" style={{ background: '#10B981' }}>Approve</button>
                <button onClick={() => { reject(viewListing.id); setViewListing(null); }} className="btn-glass-destructive h-9 px-4 text-small font-semibold">Reject</button>
                <button onClick={() => setViewListing(null)} className="btn-glass-secondary h-9 px-4 text-small">Close</button>
              </div>
            </motion.div>
          </div>
        )}

        {confirmDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.2)', backdropFilter: 'blur(12px)' }} onClick={() => setConfirmDelete(null)}>
            <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.28, ease }}
              className="glass-card p-8 max-w-sm w-full" onClick={e => e.stopPropagation()}>
              <h2 className="font-display text-h4 font-bold">Confirm Deletion</h2>
              <p className="text-small mt-3" style={{ color: 'rgba(60,60,67,0.6)' }}>Are you sure you want to delete this {confirmDelete.type}'s profile? This cannot be undone.</p>
              <div className="mt-8 flex gap-2 justify-end">
                <button onClick={() => setConfirmDelete(null)} className="btn-glass-secondary h-9 px-4 text-small">Cancel</button>
                <button onClick={handleDelete} disabled={actionLoading === 'delete'} className="btn-glass-destructive h-9 px-4 text-small font-semibold inline-flex items-center gap-1">
                  {actionLoading === 'delete' ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Delete'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
