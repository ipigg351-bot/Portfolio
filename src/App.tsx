/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { auth, db } from './firebase';
import { SiteSettings } from './types';
import { Toaster } from '@/components/ui/sonner';
import ScrollToTop from './components/ScrollToTop';

// Pages
import Home from './pages/Home';
import Portfolio from './pages/Portfolio';
import Yharnam from './pages/portfolio/Yharnam';
import LaMancha from './pages/portfolio/LaMancha';
import Blog from './pages/Blog';
import Contact from './pages/Contact';
import AdminDashboard from './pages/admin/AdminDashboard';
import Login from './pages/Login';

const DEFAULT_SETTINGS: SiteSettings = {
  siteName: "레벨디자이너 남시현",
  slogan: "브랜드의 가치를 완성하는 남다른 디자인",
  heroDescription: "로고 디자인부터 고성능 홈페이지 제작까지, 전문가의 감각으로 비즈니스의 첫인상을 완벽하게 구축합니다.",
  primaryColor: "#001F3F",
  contactEmail: "sh.nam@level.design",
  instagramUrl: "https://instagram.com",
  kakaoUrl: "https://kakao.com"
};

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setIsAuthReady(true);
    }, (error) => {
      console.error("Firebase auth subscription error:", error);
      setIsAuthReady(true); // Proceed anyway to avoid blank screen
    });

    const unsubscribeSettings = onSnapshot(doc(db, 'settings', 'global'), (snapshot) => {
      if (snapshot.exists()) {
        setSettings(snapshot.data() as SiteSettings);
      }
    }, (error) => {
      console.error("Firebase settings subscription error:", error);
    });

    // Fallback timer to ensure app loads if Firebase is silent
    const timer = setTimeout(() => {
      setIsAuthReady(true);
    }, 5000);

    return () => {
      unsubscribeAuth();
      unsubscribeSettings();
      clearTimeout(timer);
    };
  }, []);

  if (!isAuthReady) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-white">
        <div className="animate-pulse text-navy font-medium">Loading Experience...</div>
      </div>
    );
  }

  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen bg-white selection:bg-navy selection:text-white" style={{ '--primary-navy': settings.primaryColor } as any}>
        <Navbar settings={settings} user={user} />
        <main>
          <Routes>
            <Route path="/" element={<Home settings={settings} />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/portfolio/yharnam" element={<Yharnam />} />
            <Route path="/portfolio/lamancha" element={<LaMancha />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/contact" element={<Contact settings={settings} />} />
            <Route path="/login" element={<Login user={user} />} />
            <Route path="/admin/*" element={<AdminDashboard user={user} />} />
          </Routes>
        </main>
        <Toaster position="top-center" />
      </div>
    </Router>
  );
}

function Navbar({ settings, user }: { settings: SiteSettings; user: User | null }) {
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin');

  if (isAdminPath) return null;

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-editorial-border px-8 py-4 flex justify-between items-center transition-all">
      <Link to="/" className="text-xl font-light tracking-tight text-ink">
        남시현
      </Link>
      
      <div className="flex items-center gap-8">
        <div className="hidden lg:flex items-center gap-8 text-[14px] font-bold text-gray-500">
          {/* Portfolio Dropdown */}
          <div className="relative group cursor-pointer py-1">
            <div className="flex items-center gap-1 hover:text-ink transition-colors">
              포트폴리오
              <ChevronDown className="w-3 h-3 transition-transform group-hover:rotate-180" />
            </div>
            
            {/* Dropdown Menu */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
              <div className="bg-white border border-editorial-border shadow-xl py-2 w-40 rounded-lg overflow-hidden">
                <Link to="/portfolio/yharnam" className="block px-5 py-2 hover:bg-soft-gray text-gray-500 hover:text-ink transition-colors text-center">
                  야남 시가지
                </Link>
                <div className="h-[1px] bg-editorial-border mx-4" />
                <Link to="/portfolio/lamancha" className="block px-5 py-2 hover:bg-soft-gray text-gray-500 hover:text-ink transition-colors text-center">
                  라 만차의 풍차
                </Link>
              </div>
            </div>
          </div>
        </div>
        
        {user && (
          <Link to="/admin" className="p-2.5 bg-soft-gray text-navy rounded-full hover:bg-white border border-editorial-border transition-colors">
            <div className="w-1.5 h-1.5 bg-navy rounded-full" />
          </Link>
        )}
      </div>
    </nav>
  );
}

