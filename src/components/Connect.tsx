import { motion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';

export function Connect() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 1.1]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);

  return (
    <section ref={containerRef} className="w-full relative h-[120vh] flex items-center justify-center bg-ink text-paper overflow-hidden">
      {/* Dark scene for contrast, creating a "Scale Leap" */}
      <motion.div 
        style={{ scale, opacity }}
        className="grid-layout w-full z-10"
      >
        <div className="col-span-4 md:col-span-12 text-center flex flex-col items-center">
          <div className="text-label text-solar-yellow mb-8">02 / CONNECT</div>
          <h2 className="text-h1 max-w-[15ch] mx-auto mb-8">
            看见结构。<br />建立连接。
          </h2>
          <p className="text-body max-w-[40ch] mx-auto text-paper/70">
            当孤立的想法被归类、连接，它们就不再是碎片，而是一个可以延展的认知网络。
          </p>
        </div>
      </motion.div>
      
      {/* Abstract geometric visualization of connections */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-30">
        <svg viewBox="0 0 100 100" className="w-[80vw] md:w-[50vw] h-auto stroke-line-light fill-none stroke-[0.2]">
          <circle cx="50" cy="50" r="40" />
          <circle cx="50" cy="50" r="20" />
          <path d="M10 50 L90 50 M50 10 L50 90 M20 20 L80 80 M20 80 L80 20" />
        </svg>
      </div>
    </section>
  );
}
