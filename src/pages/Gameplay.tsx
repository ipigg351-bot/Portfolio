import { motion } from 'framer-motion';

export default function GameplayPage() {
  return (
    <div className="bg-white min-h-screen pt-32 px-8">
      <div className="max-w-6xl mx-auto">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-black tracking-tight text-ink mb-12 text-center"
        >
          게임 플레이 데이터
        </motion.h1>
        
        <div className="w-full h-[800px] border border-editorial-border rounded-xl overflow-hidden shadow-sm bg-soft-gray mb-24">
          <iframe
            src="https://docs.google.com/spreadsheets/d/1PVB07gC2R3iB38Iv3tDsIc8uNYMoULnK/preview"
            className="w-full h-full"
            title="게임 플레이 데이터"
          ></iframe>
        </div>

        {/* Contact Section at Bottom */}
        <section className="pb-40">
          <div className="max-w-7xl mx-auto text-center border-t border-editorial-border pt-32">
            <h3 className="text-ink font-black text-xl mb-4">Contact</h3>
            <div className="flex flex-col gap-2 text-gray-400 font-medium">
              <p className="text-lg">ldnsh351@gmail.com</p>
              <p className="text-lg">010. 4157. 7438</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
