import { motion } from 'framer-motion';
import { SiteSettings } from '../types';
import { Link } from 'react-router-dom';

export default function Home({ settings }: { settings: SiteSettings }) {
  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="min-h-[80vh] flex flex-col items-center justify-center px-6 pt-48 mb-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h1 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-4xl md:text-6xl font-bold leading-[1.15] tracking-tight mb-8 text-ink"
          >
             공간의 구조를 읽고 설계하는 <br />
             레벨디자이너 남시현입니다.
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="text-gray-500 text-lg md:text-xl leading-snug max-w-2xl mx-auto mb-10"
          >
            플레이어가 공간을 읽는 순간의 재미를 중요하게 생각하며, <br />
            구조와 동선을 통해 인상적인 레벨 경험을 설계합니다.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex justify-center"
          >
            <a 
              href="https://drive.google.com/file/d/1iC4J_ahmHPQ7mjsMgEUawNsjtc9JmQLR/view?usp=sharing" 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-10 py-4 bg-ink text-white text-[15px] font-bold rounded-xl hover:opacity-90 transition-opacity"
            >
              PR문서 보기
            </a>
          </motion.div>
        </div>
      </section>

      {/* Thumbnail Boxes Section */}
      <section className="pb-32 px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 max-w-7xl mx-auto"
        >
          {/* Reverse Planning Section */}
          <div className="flex flex-col gap-1">
            <div className="text-center font-black text-2xl md:text-3xl tracking-tight text-ink uppercase">역기획</div>
            <Link to="/portfolio/yharnam">
              <div className="relative aspect-video bg-soft-gray border border-ink rounded-none overflow-hidden cursor-pointer transition-transform hover:scale-[1.01]">
                <img 
                  src="https://lh3.googleusercontent.com/d/1ySG6MKcAMBFQV1m3AHhY_FlBW9bCpipZ" 
                  alt="Bloodborne Portfolio" 
                  className="w-full h-full object-cover transition-all duration-700"
                />
              </div>
            </Link>
            <div className="mt-4 flex justify-center">
              <Link to="/portfolio/yharnam" className="bg-ink text-white px-8 py-3 text-[16px] font-bold uppercase tracking-wider hover:opacity-90 transition-opacity inline-block">
                자세히 보기
              </Link>
            </div>
          </div>

          {/* Original Planning Section */}
          <div className="flex flex-col gap-1">
            <div className="text-center font-black text-2xl md:text-3xl tracking-tight text-ink uppercase">창작 기획</div>
            <Link to="/portfolio/lamancha">
              <div className="relative aspect-video bg-soft-gray border border-ink rounded-none overflow-hidden cursor-pointer transition-transform hover:scale-[1.01]">
                <img 
                  src="https://lh3.googleusercontent.com/d/1D6kIFq5yggc6AMc_1THnqKVtdfLTrcEQ" 
                  alt="La Mancha Portfolio" 
                  className="w-full h-full object-cover transition-all duration-700"
                />
              </div>
            </Link>
            <div className="mt-4 flex justify-center">
              <Link to="/portfolio/lamancha" className="bg-ink text-white px-8 py-3 text-[16px] font-bold uppercase tracking-wider hover:opacity-90 transition-opacity inline-block">
                자세히 보기
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Contact Section at Bottom */}
      <section className="pb-40 px-6">
        <div className="max-w-7xl mx-auto text-center border-t border-editorial-border pt-32">
          <h3 className="text-ink font-black text-xl mb-4">Contact</h3>
          <div className="flex flex-col gap-2 text-gray-400 font-medium">
            <p className="text-lg">ldnsh351@gmail.com</p>
            <p className="text-lg">010. 4157. 7438</p>
          </div>
        </div>
      </section>
    </div>
  );
}
