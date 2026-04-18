import { User } from 'firebase/auth';
import { Navigate } from 'react-router-dom';
import { signInWithGoogle } from '../firebase';
import { motion } from 'framer-motion';
import { LogIn, ShieldAlert } from 'lucide-react';
import { toast } from 'sonner';

export default function Login({ user }: { user: User | null }) {
  if (user) {
    return <Navigate to="/admin" replace />;
  }

  const handleLogin = async () => {
    try {
      await signInWithGoogle();
      toast.success('관리자 페이지로 접속합니다.');
    } catch (error) {
      toast.error('로그인에 실패했습니다.');
    }
  };

  return (
    <div className="h-[80vh] flex items-center justify-center px-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-gray-50 p-12 rounded-[40px] text-center"
      >
        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-10 shadow-sm border border-gray-100">
          <ShieldAlert className="text-[#001F3F]" size={32} />
        </div>
        <h1 className="text-3xl font-black tracking-tighter mb-4 text-slate-900 uppercase">Staff Login</h1>
        <p className="text-gray-400 text-sm mb-12 leading-relaxed">
          이 구역은 허가된 관리자만 접근 가능합니다. <br />
          콘텐츠 관리를 위해 Google 계정으로 로그인하세요.
        </p>
        
        <button 
          onClick={handleLogin}
          className="w-full py-5 bg-[#001F3F] text-white rounded-full font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:scale-105 active:scale-95 transition-transform"
        >
          <LogIn size={18} /> Login with Admin Account
        </button>
      </motion.div>
    </div>
  );
}
