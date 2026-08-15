import { motion } from 'motion/react';

export function Invite() {
  return (
    <section id="invite" className="w-full relative py-32 border-t border-line-dark overflow-hidden">
      <div className="grid-layout">
        <div className="col-span-4 md:col-span-8 md:col-start-3 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="text-label text-signal-red mb-8">04 / INVITE</div>
            <h2 className="text-h1 mb-12">
              把想法变成原型。
            </h2>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button className="px-8 py-4 bg-ink text-paper font-data text-label hover:bg-orbit-blue transition-colors duration-300 w-full sm:w-auto flex items-center justify-center gap-2">
                <span>[ SUBSCRIBE ]</span>
              </button>
              <button className="px-8 py-4 border border-ink text-ink font-data text-label hover:bg-mist/50 transition-colors duration-300 w-full sm:w-auto">
                VIEW ARCHIVE
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Repeating background motif from hero for closure */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-[0.03] z-[-1]">
        <div className="w-[120vw] h-[120vw] rounded-full border-[1px] border-ink" />
      </div>
    </section>
  );
}
