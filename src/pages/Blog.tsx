import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { BlogPost } from '../types';
import { Calendar, User, ArrowRight } from 'lucide-react';

export default function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as BlogPost[];
      setPosts(data);
    });
    return unsubscribe;
  }, []);

  return (
    <div className="bg-white min-h-screen py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-24 text-center">
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#001F3F]">Design Insights</span>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mt-6 mb-8 uppercase">Blog & News</h1>
          <p className="text-gray-400 max-w-lg mx-auto text-sm leading-relaxed">
            디자인 트렌드, 워크플로우, 그리고 레벨디자이너 남시현의 작업을 통한 인사이트를 공유합니다.
          </p>
        </header>

        {posts.length === 0 ? (
          <div className="py-48 text-center text-gray-200 font-black uppercase tracking-[0.5em]">
            No insights available yet
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24">
            {posts.map((post, i) => (
              <motion.article 
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="group cursor-pointer"
              >
                <div className="aspect-[16/9] bg-soft-gray border border-editorial-border rounded-[2px] overflow-hidden mb-8 relative">
                  <img 
                    src={post.imageUrl || `https://picsum.photos/seed/${post.id}/1200/800`} 
                    alt={post.title} 
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-opacity duration-700 opacity-60 group-hover:opacity-100"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-6 left-6 px-4 py-2 bg-navy text-white text-[10px] font-bold uppercase tracking-widest rounded-[2px]">
                    INSIGHT
                  </div>
                </div>
                
                <div className="flex items-center gap-6 text-[10px] font-bold uppercase tracking-widest text-[#001F3F] mb-6">
                  <div className="flex items-center gap-2">
                    <Calendar size={14} />
                    {new Date(post.createdAt).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-2">
                    <User size={14} />
                    {post.author || "Nam Si-hyeon"}
                  </div>
                </div>

                <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-6 group-hover:text-navy transition-colors">
                  {post.title}
                </h2>
                
                <p className="text-gray-500 line-clamp-3 text-sm leading-relaxed mb-8">
                  {post.content}
                </p>

                <div className="flex items-center gap-3 text-[11px] font-black uppercase tracking-widest text-[#001F3F]">
                  Read Full Article <ArrowRight size={16} />
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
