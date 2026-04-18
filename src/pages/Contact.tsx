import { useState } from 'react';
import { motion } from 'framer-motion';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { SiteSettings } from '../types';
import { Mail, Send, CheckCircle, Info } from 'lucide-react';
import { toast } from 'sonner';

export default function Contact({ settings }: { settings: SiteSettings }) {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      message: formData.get('message') as string,
      status: 'New',
      createdAt: new Date().toISOString(),
      timestamp: serverTimestamp()
    };

    try {
      await addDoc(collection(db, 'inquiries'), data);
      setSubmitted(true);
      toast.success('문의가 전송되었습니다. 곧 연락드리겠습니다.');
    } catch (error) {
      console.error(error);
      toast.error('전송 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white min-h-screen py-24 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24 items-start">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#001F3F]">Get in Touch</span>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mt-6 mb-12">CONTACT</h1>
          <p className="text-gray-500 text-lg leading-relaxed mb-12">
            새로운 프로젝트를 계획하고 계신가요? <br className="hidden md:block" />
            작은 문의부터 심도 깊은 상담까지 무엇이든 물어보세요.
          </p>

          <div className="space-y-12">
            <div className="flex gap-6 items-start">
              <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-[#001F3F]">
                <Mail size={24} />
              </div>
              <div>
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Email Address</h4>
                <p className="text-xl font-bold">{settings.contactEmail}</p>
              </div>
            </div>
            
            <div className="flex gap-6 items-start">
              <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-[#001F3F]">
                <Info size={24} />
              </div>
              <div>
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Social Networks</h4>
                <div className="flex gap-6 mt-4">
                  <a href={settings.instagramUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-bold underline underline-offset-8 decoration-2 decoration-[#001F3F]/20 hover:decoration-[#001F3F] transition-all">Instagram</a>
                  <a href={settings.kakaoUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-bold underline underline-offset-8 decoration-2 decoration-[#001F3F]/20 hover:decoration-[#001F3F] transition-all">KakaoTalk</a>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-50 p-8 md:p-12 rounded-3xl"
        >
          {submitted ? (
            <div className="py-24 text-center">
              <CheckCircle size={64} className="text-green-500 mx-auto mb-8" />
              <h3 className="text-2xl font-bold mb-4">전송 완료</h3>
              <p className="text-gray-500 text-sm">성공적으로 접수되었습니다. <br /> 남시현 작가가 직접 확인 후 연락드립니다.</p>
              <button 
                onClick={() => setSubmitted(false)}
                className="mt-8 text-[11px] font-bold uppercase tracking-widest text-[#001F3F]"
              >
                새로운 문의 작성
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Your Name</label>
                <input 
                  required
                  name="name"
                  type="text" 
                  placeholder="성함 혹은 업체명"
                  className="w-full bg-white border border-transparent focus:border-[#001F3F]/20 px-6 py-4 rounded-xl text-sm outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Email Address</label>
                <input 
                  required
                  name="email"
                  type="email" 
                  placeholder="연락받으실 이메일"
                  className="w-full bg-white border border-transparent focus:border-[#001F3F]/20 px-6 py-4 rounded-xl text-sm outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Message Detail</label>
                <textarea 
                  required
                  name="message"
                  rows={6}
                  placeholder="프로젝트의 목적, 시기, 예산 등 상세한 내용을 적어주시면 더 정확한 상담이 가능합니다."
                  className="w-full bg-white border border-transparent focus:border-[#001F3F]/20 px-6 py-4 rounded-xl text-sm outline-none transition-all resize-none"
                />
              </div>
              <button 
                disabled={loading}
                type="submit"
                className="w-full py-5 bg-[#001F3F] text-white rounded-full font-bold text-sm flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
              >
                {loading ? "전송 중..." : <><Send size={18} /> 상담 신청하기</>}
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
}
