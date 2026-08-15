import { motion } from 'motion/react';

export function Hero() {
  return (
    <section className="relative min-h-[90svh] w-full flex flex-col justify-end grid-layout pt-32 pb-16">
      {/* Background Graphic Motif - The "Lens" or "Coordinate" */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none flex items-center justify-center opacity-10">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="w-[80vw] h-[80vw] md:w-[40vw] md:h-[40vw] rounded-full border-[1px] border-ink flex items-center justify-center relative"
        >
          <div className="w-[60%] h-[60%] rounded-full border-[1px] border-ink absolute" />
          <div className="w-[20%] h-[20%] rounded-full border-[1px] border-ink absolute bg-orbit-blue/10" />
          {/* Crosshairs */}
          <div className="absolute w-full h-[1px] bg-ink/30" />
          <div className="absolute h-full w-[1px] bg-ink/30" />
        </motion.div>
      </div>

      <div className="col-span-4 md:col-span-10 md:col-start-2 z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="text-label text-orbit-blue mb-6 block">SYSTEM.INITIALIZE</span>
          <h1 className="text-hero tracking-tight leading-[0.95] mb-8">
            观察。<br />
            记录。<br />
            继续生长。
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col md:flex-row gap-8 md:items-end justify-between border-t border-line-dark pt-8"
        >
          <p className="text-body max-w-[40ch] text-ink/80">
            从一个模糊的想法，到可以被索引的结构。这里是记录个人成长坐标、工程实践与对未来乐观主义的档案库。
          </p>
          <div className="text-label shrink-0 text-right">
            <div>STATUS: ONLINE</div>
            <div className="text-ink/50">COORDINATES: ACTIVE</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
