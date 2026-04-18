import { useState, useEffect } from 'react';
import { User as FirebaseUser } from 'firebase/auth';
import { Navigate, Routes, Route, Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  FolderKanban, 
  FileText, 
  Settings as SettingsIcon, 
  LogOut, 
  Plus, 
  Mail, 
  LayoutDashboard,
  Save,
  Trash2,
  Image as ImageIcon
} from 'lucide-react';
import { auth, db, logout } from '../../firebase';
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot, 
  doc, 
  setDoc, 
  addDoc, 
  deleteDoc, 
  updateDoc 
} from 'firebase/firestore';
import { PortfolioItem, BlogPost, Inquiry, SiteSettings } from '../../types';
import { toast } from 'sonner';

export default function AdminDashboard({ user }: { user: FirebaseUser | null }) {
  const location = useLocation();
  if (!user) return <Navigate to="/login" replace />;

  const isActive = (path: string) => location.pathname === `/admin${path}` || (path === "" && location.pathname === "/admin");

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#001F3F] text-white fixed h-full p-8 flex flex-col pt-24">
        <div className="mb-12">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 mb-2">Management</p>
          <h2 className="text-xl font-bold tracking-tighter">Admin Panel</h2>
        </div>

        <nav className="space-y-2 flex-grow">
          {[
            { label: 'Dashboard', path: '', icon: <LayoutDashboard size={18} /> },
            { label: 'Portfolio', path: '/portfolio', icon: <FolderKanban size={18} /> },
            { label: 'Blog Posts', path: '/blog', icon: <FileText size={18} /> },
            { label: 'Inquiries', path: '/inquiries', icon: <Mail size={18} /> },
            { label: 'Settings', path: '/settings', icon: <SettingsIcon size={18} /> },
          ].map((item) => (
            <Link
              key={item.path}
              to={`/admin${item.path}`}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                isActive(item.path) ? 'bg-white text-[#001F3F] shadow-lg' : 'text-white/60 hover:text-white hover:bg-white/10'
              }`}
            >
              {item.icon} {item.label}
            </Link>
          ))}
        </nav>

        <button 
          onClick={() => logout()}
          className="mt-auto flex items-center gap-3 px-4 py-3 text-white/60 hover:text-red-400 transition-colors text-xs font-bold"
        >
          <LogOut size={18} /> Sign Out
        </button>
      </aside>

      {/* Main Content */}
      <main className="ml-64 flex-grow p-12">
        <Routes>
          <Route path="/" element={<Overview />} />
          <Route path="/portfolio" element={<PortfolioManager />} />
          <Route path="/blog" element={<BlogManager />} />
          <Route path="/inquiries" element={<InquiryManager />} />
          <Route path="/settings" element={<SettingsManager />} />
        </Routes>
      </main>
    </div>
  );
}

// --- Overview Sub-page ---
function Overview() {
  const [stats, setStats] = useState({ portfolio: 0, posts: 0, inquiries: 0 });

  useEffect(() => {
    const unsubP = onSnapshot(collection(db, 'portfolio'), (s) => setStats(prev => ({ ...prev, portfolio: s.size })));
    const unsubB = onSnapshot(collection(db, 'posts'), (s) => setStats(prev => ({ ...prev, posts: s.size })));
    const unsubI = onSnapshot(collection(db, 'inquiries'), (s) => setStats(prev => ({ ...prev, inquiries: s.size })));
    return () => { unsubP(); unsubB(); unsubI(); };
  }, []);

  return (
    <div className="space-y-12">
      <header>
        <h1 className="text-3xl font-black tracking-tighter uppercase text-slate-900">Dashboard Overview</h1>
        <p className="text-gray-400 text-sm mt-2">웹사이트 현황을 한눈에 확인하세요.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { label: 'Published Projects', value: stats.portfolio, icon: <FolderKanban className="text-blue-500" /> },
          { label: 'Drafted Insights', value: stats.posts, icon: <FileText className="text-purple-500" /> },
          { label: 'Client Inquiries', value: stats.inquiries, icon: <Mail className="text-orange-500" /> },
        ].map((item, i) => (
          <div key={i} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
            <div className="flex justify-between items-start mb-6">
              <div className="p-3 bg-gray-50 rounded-xl">{item.icon}</div>
              <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">Total</span>
            </div>
            <p className="text-4xl font-black text-slate-900 mb-2">{item.value}</p>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{item.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- Settings Manager Sub-page ---
function SettingsManager() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    return onSnapshot(doc(db, 'settings', 'global'), (s) => {
      if (s.exists()) setSettings(s.data() as SiteSettings);
    });
  }, []);

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const newSettings = Object.fromEntries(formData.entries());
    
    try {
      await setDoc(doc(db, 'settings', 'global'), newSettings);
      toast.success('설정이 저장되었습니다.');
    } catch (e) {
      toast.error('저장 실패');
    } finally {
      setLoading(false);
    }
  };

  if (!settings) return null;

  return (
    <div className="max-w-4xl space-y-12">
      <header>
        <h1 className="text-3xl font-black tracking-tighter uppercase text-slate-900">Site Settings</h1>
        <p className="text-gray-400 text-sm mt-2">웹사이트의 기본 정보와 브랜드 스타일을 관리합니다.</p>
      </header>

      <form onSubmit={handleSave} className="bg-white p-12 rounded-[40px] border border-gray-100 shadow-sm space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-[#001F3F]">Site Identity Name</label>
            <input name="siteName" defaultValue={settings.siteName} type="text" className="w-full bg-gray-50 border-none rounded-xl px-5 py-3 text-sm focus:ring-2 ring-[#001F3F]/10 outline-none" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-[#001F3F]">Primary Theme Color</label>
            <input name="primaryColor" defaultValue={settings.primaryColor} type="color" className="w-full h-11 p-1 bg-gray-50 border-none rounded-xl cursor-pointer" />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-widest text-[#001F3F]">Main Slogan</label>
          <input name="slogan" defaultValue={settings.slogan} type="text" className="w-full bg-gray-50 border-none rounded-xl px-5 py-3 text-sm focus:ring-2 ring-[#001F3F]/10 outline-none" />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-widest text-[#001F3F]">Hero Description</label>
          <textarea name="heroDescription" defaultValue={settings.heroDescription} rows={4} className="w-full bg-gray-50 border-none rounded-xl px-5 py-3 text-sm focus:ring-2 ring-[#001F3F]/10 outline-none resize-none" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-[#001F3F]">Contact Email</label>
            <input name="contactEmail" defaultValue={settings.contactEmail} type="email" className="w-full bg-gray-50 border-none rounded-xl px-5 py-3 text-sm" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-[#001F3F]">Instagram URL</label>
            <input name="instagramUrl" defaultValue={settings.instagramUrl} type="url" className="w-full bg-gray-50 border-none rounded-xl px-5 py-3 text-sm" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-[#001F3F]">Kakao Channel URL</label>
            <input name="kakaoUrl" defaultValue={settings.kakaoUrl} type="url" className="w-full bg-gray-50 border-none rounded-xl px-5 py-3 text-sm" />
          </div>
        </div>

        <button 
          disabled={loading}
          type="submit" 
          className="px-8 py-4 bg-[#001F3F] text-white rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-3 hover:scale-105 transition-all shadow-xl shadow-navy/20"
        >
          <Save size={16} /> {loading ? "Saving..." : "Save Configuration"}
        </button>
      </form>
    </div>
  );
}

// --- Portfolio Manager Sub-page ---
function PortfolioManager() {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [showAdd, setShowAdd] = useState(false);

  useEffect(() => {
    const q = query(collection(db, 'portfolio'), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (s) => setItems(s.docs.map(d => ({ id: d.id, ...d.data() })) as PortfolioItem[]));
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;
    await deleteDoc(doc(db, 'portfolio', id));
    toast.success('삭제되었습니다.');
  };

  const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      ...Object.fromEntries(formData.entries()),
      createdAt: new Date().toISOString()
    };
    await addDoc(collection(db, 'portfolio'), data);
    setShowAdd(false);
    toast.success('추가되었습니다.');
  };

  return (
    <div className="space-y-12">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black tracking-tighter uppercase text-slate-900">Portfolio Library</h1>
          <p className="text-gray-400 text-sm mt-2">새로운 작품을 추가하고 기존 작품을 관리합니다.</p>
        </div>
        <button 
          onClick={() => setShowAdd(true)}
          className="px-6 py-3 bg-[#001F3F] text-white rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-2 hover:scale-105 transition-all"
        >
          <Plus size={16} /> Add project
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {items.map(item => (
          <div key={item.id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex gap-6 items-center">
            <div className="w-24 h-24 bg-gray-50 rounded-2xl overflow-hidden flex-shrink-0">
              <img src={item.imageUrl} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </div>
            <div className="flex-grow">
              <span className="text-[9px] font-black tracking-widest text-[#001F3F] bg-[#001F3F]/5 px-2 py-1 rounded-md uppercase">{item.category}</span>
              <h3 className="text-lg font-bold mt-2 text-slate-900">{item.title}</h3>
              <p className="text-[10px] text-gray-400 mt-1">{new Date(item.createdAt).toLocaleDateString()}</p>
            </div>
            <button onClick={() => handleDelete(item.id)} className="p-3 text-gray-300 hover:text-red-500 transition-colors">
              <Trash2 size={20} />
            </button>
          </div>
        ))}
      </div>

      {showAdd && (
        <div className="fixed inset-0 bg-navy/80 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white w-full max-w-xl rounded-[40px] p-12 relative overflow-hidden">
            <h2 className="text-2xl font-black tracking-tighter mb-8">ADD NEW PROJECT</h2>
            <form onSubmit={handleAdd} className="space-y-6">
              <input name="title" placeholder="Project Title" className="w-full border-b border-gray-100 py-3 text-lg font-bold outline-none focus:border-navy" required />
              <div className="grid grid-cols-2 gap-4">
                <select name="category" className="bg-gray-50 rounded-xl px-4 py-3 text-sm outline-none">
                  {["Logo", "Website", "Branding", "UI/UX"].map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <input name="imageUrl" placeholder="Image URL" className="bg-gray-50 rounded-xl px-4 py-3 text-sm outline-none" required />
              </div>
              <textarea name="description" placeholder="Project Description" rows={4} className="w-full bg-gray-50 rounded-xl px-4 py-3 text-sm outline-none resize-none" />
              
              <div className="flex gap-4 pt-4">
                <button type="submit" className="flex-grow bg-[#001F3F] text-white py-4 rounded-full text-xs font-bold uppercase tracking-widest shadow-xl shadow-navy/20">Add Project</button>
                <button type="button" onClick={() => setShowAdd(false)} className="px-8 py-4 bg-gray-100 text-gray-500 rounded-full text-xs font-bold uppercase tracking-widest">Cancel</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}

// --- Inquiry Manager ---
function InquiryManager() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);

  useEffect(() => {
    const q = query(collection(db, 'inquiries'), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (s) => setInquiries(s.docs.map(d => ({ id: d.id, ...d.data() })) as Inquiry[]));
  }, []);

  const handleStatus = async (id: string, status: string) => {
    await updateDoc(doc(db, 'inquiries', id), { status });
    toast.success('Status updated');
  };

  return (
    <div className="space-y-12">
      <header>
        <h1 className="text-3xl font-black tracking-tighter uppercase text-slate-900">Client Inquiries</h1>
        <p className="text-gray-400 text-sm mt-2">고객들로부터 수신된 프로젝트 문의 목록입니다.</p>
      </header>

      <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="text-[10px] font-bold uppercase tracking-widest text-[#001F3F] p-6 text-left">Sender</th>
              <th className="text-[10px] font-bold uppercase tracking-widest text-[#001F3F] p-6 text-left">Message</th>
              <th className="text-[10px] font-bold uppercase tracking-widest text-[#001F3F] p-6 text-left">Date</th>
              <th className="text-[10px] font-bold uppercase tracking-widest text-[#001F3F] p-6 text-left">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {inquiries.map(item => (
              <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="p-6">
                  <p className="font-bold text-slate-900">{item.name}</p>
                  <p className="text-[10px] text-gray-400 mt-1">{item.email}</p>
                </td>
                <td className="p-6 text-sm text-gray-500 max-w-xs">{item.message}</td>
                <td className="p-6 text-xs text-gray-400">{new Date(item.createdAt).toLocaleDateString()}</td>
                <td className="p-6">
                  <select 
                    value={item.status} 
                    onChange={(e) => handleStatus(item.id, e.target.value)}
                    className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border-none outline-none ${
                      item.status === 'New' ? 'bg-orange-100 text-orange-600' : 
                      item.status === 'Read' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'
                    }`}
                  >
                    <option value="New">New</option>
                    <option value="Read">Read</option>
                    <option value="Replied">Replied</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// --- Blog Manager (Simpler version for now) ---
function BlogManager() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [showAdd, setShowAdd] = useState(false);

  useEffect(() => {
    const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (s) => setPosts(s.docs.map(d => ({ id: d.id, ...d.data() })) as BlogPost[]));
  }, []);

  const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      ...Object.fromEntries(formData.entries()),
      createdAt: new Date().toISOString()
    };
    await addDoc(collection(db, 'posts'), data);
    setShowAdd(false);
    toast.success('게시물이 추가되었습니다.');
  };

  const handleDelete = async (id: string) => {
    if (!confirm('삭제하시겠습니까?')) return;
    await deleteDoc(doc(db, 'posts', id));
  };

  return (
    <div className="space-y-12">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black tracking-tighter uppercase text-slate-900">Blog Management</h1>
          <p className="text-gray-400 text-sm mt-2">작가의 인사이트와 소식을 관리합니다.</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="px-6 py-3 bg-[#001F3F] text-white rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-2">
          <Plus size={16} /> Write article
        </button>
      </div>

      <div className="space-y-6">
        {posts.map(post => (
          <div key={post.id} className="bg-white p-8 rounded-3xl border border-gray-100 flex justify-between items-center group">
            <div className="max-w-2xl px-4">
              <h3 className="text-xl font-bold text-slate-900 group-hover:text-navy transition-colors">{post.title}</h3>
              <p className="text-gray-400 text-[10px] mt-2 font-bold uppercase tracking-widest leading-relaxed">
                {new Date(post.createdAt).toLocaleDateString()} — Written by {post.author || "Nam"}
              </p>
            </div>
            <button onClick={() => handleDelete(post.id)} className="p-4 text-gray-200 hover:text-red-500 transition-colors">
              <Trash2 size={24} />
            </button>
          </div>
        ))}
      </div>

      {showAdd && (
        <div className="fixed inset-0 bg-navy/80 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white w-full max-w-3xl rounded-[40px] p-12 relative overflow-hidden">
            <h2 className="text-2xl font-black tracking-tighter mb-8">WRITE NEW INSIGHT</h2>
            <form onSubmit={handleAdd} className="space-y-8">
              <input name="title" placeholder="Post Title" className="w-full border-b border-gray-100 py-3 text-2xl font-bold outline-none" required />
              <input name="imageUrl" placeholder="Core Hero Image URL" className="w-full bg-gray-50 rounded-xl px-5 py-3 text-sm" />
              <textarea name="content" rows={10} placeholder="Share your insights..." className="w-full bg-gray-50 rounded-xl px-5 py-3 text-sm outline-none resize-none" required />
              <div className="flex gap-4">
                <button type="submit" className="flex-grow bg-[#001F3F] text-white py-5 rounded-full text-xs font-bold uppercase tracking-widest">Publish Insight</button>
                <button type="button" onClick={() => setShowAdd(false)} className="px-10 py-5 bg-gray-100 text-gray-400 rounded-full text-xs font-bold uppercase tracking-widest">Discard</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
