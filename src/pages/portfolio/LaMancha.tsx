import { motion } from 'framer-motion';

export default function LaManchaPage() {
  return (
    <div className="bg-white min-h-screen pt-32 px-8">
      <div className="max-w-4xl mx-auto">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-black tracking-tight text-ink mb-8 text-center"
        >
          라 만차의 풍차
        </motion.h1>
        <div className="aspect-video w-full bg-soft-gray border border-editorial-border mb-12 overflow-hidden rounded-xl shadow-sm">
          <iframe 
            className="w-full h-full"
            src="https://www.youtube.com/embed/Y39DSk7xvMc" 
            title="라 만차의 풍차 영상"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
            allowFullScreen
          ></iframe>
        </div>

        <div className="flex justify-center mb-24">
          <a 
            href="https://drive.google.com/file/d/1z_QIvrnzh9E017a4W84e97ql4ZaMcLXo/view?usp=drive_link" 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-ink text-white px-10 py-4 text-[18px] font-bold uppercase tracking-wider hover:opacity-90 transition-opacity"
          >
            기획서 보기
          </a>
        </div>
      </div>

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
