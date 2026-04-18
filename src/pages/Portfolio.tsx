import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { PortfolioItem } from '../types';
import { ExternalLink, Tag } from 'lucide-react';

export default function Portfolio() {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [filter, setFilter] = useState<string>("All");
  const categories = ["All", "Logo", "Website", "Branding", "UI/UX"];

  useEffect(() => {
    const q = query(collection(db, 'portfolio'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as PortfolioItem[];
      setItems(data);
    });
    return unsubscribe;
  }, []);

  const filteredItems = filter === "All" ? items : items.filter(item => item.category === filter);

  return (
    <div className="bg-white min-h-screen py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-24">
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#001F3F]">Our Works</span>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mt-6 mb-12">PORTFOLIO</h1>
          
          <div className="flex flex-wrap gap-4 border-b border-gray-100 pb-8">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${
                  filter === cat ? 'bg-[#001F3F] text-white' : 'text-gray-400 hover:text-navy'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </header>

        {items.length === 0 ? (
          <div className="py-48 text-center text-gray-300 uppercase tracking-widest font-bold">
            Project Showcase Coming Soon
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            <AnimatePresence mode="popLayout">
              {filteredItems.map((item) => (
                <motion.div
                  layout
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                  className="group"
                >
                  <div className="aspect-[4/5] bg-soft-gray border border-editorial-border rounded-[2px] overflow-hidden mb-6 relative">
                    <div className="absolute top-0 left-0 w-full h-[5px] bg-navy/20" />
                    <img 
                      src={item.imageUrl} 
                      alt={item.title} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-navy/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="text-[10px] font-bold text-white uppercase tracking-widest border border-white/40 px-4 py-2">
                        View Details
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Tag size={12} className="text-[#001F3F]" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-[#001F3F]">{item.category}</span>
                      </div>
                      <h3 className="text-xl font-bold tracking-tight text-slate-900">{item.title}</h3>
                    </div>
                    <p className="text-[11px] font-bold text-gray-300">
                      {new Date(item.createdAt).getFullYear()}
                    </p>
                  </div>
                  <p className="mt-4 text-sm text-gray-400 leading-relaxed line-clamp-2">{item.description}</p>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
