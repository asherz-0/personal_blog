import { motion } from 'motion/react';

const notes = [
  { id: '001', date: '2023.10.12', text: 'Ideas rarely arrive fully formed. They are fragments of observation that require a scaffold to grow.' },
  { id: '002', date: '2023.11.05', text: 'The interface is not just a tool; it is a lens through which we comprehend complex systems.' },
  { id: '003', date: '2024.01.22', text: 'Optimism is an engineering requirement. Without it, we wouldn\'t start.' }
];

export function Observe() {
  return (
    <section id="observe" className="w-full relative">
      <div className="grid-layout items-start">
        <div className="col-span-4 md:col-span-3 mb-12 md:mb-0">
          <div className="sticky top-32">
            <h2 className="text-label mb-4 text-ink/50">01 / OBSERVE</h2>
            <h3 className="text-h3 mb-6">捕捉日常的<br/>微小结构</h3>
            <p className="text-body text-ink/70 max-w-[30ch]">
              我们被海量信息包围，但真正的洞察往往藏在未被整理的碎片中。观察是建立理解的第一步。
            </p>
          </div>
        </div>

        <div className="col-span-4 md:col-span-8 md:col-start-5 relative">
          {/* Engineering grid background for the list */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMTEsIDEzLCAxNiwgMC4xKSIvPjwvc3ZnPg==')] opacity-50 z-0 mask-image:linear-gradient(to_bottom,transparent,black,transparent)]" />
          
          <div className="relative z-10 flex flex-col gap-16 py-12">
            {notes.map((note, idx) => (
              <motion.div 
                key={note.id}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay: idx * 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="flex flex-col md:flex-row gap-4 md:gap-8 border-l border-orbit-blue/30 pl-6 relative group"
              >
                {/* Data annotation line and dot */}
                <div className="absolute left-[-4px] top-1 w-2 h-2 rounded-full bg-orbit-blue scale-0 group-hover:scale-100 transition-transform duration-300" />
                
                <div className="flex-shrink-0 w-24">
                  <div className="font-data text-label text-orbit-blue">{note.id}</div>
                  <div className="font-data text-[0.65rem] text-ink/40">{note.date}</div>
                </div>
                <p className="text-body md:text-lg font-display leading-relaxed">
                  "{note.text}"
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
