import { motion } from 'motion/react';

export function Header() {
  return (
    <motion.header 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-page-gutter py-6 mix-blend-difference text-paper"
    >
      <div className="text-label font-data">00 / INDEX</div>
      <nav className="flex gap-8 text-label font-data">
        <a href="#observe" className="hover:opacity-60 transition-opacity">OBSERVE</a>
        <a href="#build" className="hover:opacity-60 transition-opacity">BUILD</a>
        <a href="#invite" className="hover:opacity-60 transition-opacity">CONNECT</a>
      </nav>
    </motion.header>
  );
}
