import { motion } from 'motion/react';

const articles = [
  {
    title: 'The Architecture of Optimism',
    excerpt: '探讨技术如何重塑我们对未来的期望，以及工程师在其中承担的设计责任。',
    date: '2024.03.15',
    category: 'ESSAY',
    metrics: '2,450 WORDS'
  },
  {
    title: 'Precision in the Browser',
    excerpt: '在前端开发中引入工程级精度的尝试：从排版比例到亚像素级渲染优化。',
    date: '2024.02.28',
    category: 'ENGINEERING',
    metrics: 'CODE + DEMO'
  },
  {
    title: 'Designing for Human Scale',
    excerpt: '当系统变得庞大，我们如何保留界面的“呼吸感”与人的尺度。',
    date: '2024.01.10',
    category: 'DESIGN',
    metrics: 'CASE STUDY'
  }
];

export function Articles() {
  return (
    <section id="build" className="w-full relative">
      <div className="grid-layout">
        <div className="col-span-4 md:col-span-12 mb-16 flex flex-col md:flex-row md:items-end justify-between border-b border-line-dark pb-8">
          <div>
            <h2 className="text-label text-ink/50 mb-4">03 / BUILD</h2>
            <h3 className="text-h2">让想法运行起来</h3>
          </div>
          <div className="text-label font-data text-ink/50 mt-4 md:mt-0">
            TOTAL ARCHIVES: {articles.length.toString().padStart(3, '0')}
          </div>
        </div>

        {/* Article Grid - not traditional cards, but strict editorial lines */}
        <div className="col-span-4 md:col-span-12 grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-16">
          {articles.map((article, idx) => (
            <motion.article 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: idx * 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col group cursor-pointer"
            >
              <div className="h-48 bg-mist/30 mb-6 relative overflow-hidden group-hover:bg-mist/50 transition-colors">
                {/* Abstract placeholder for article image/visual */}
                <div className="absolute bottom-4 left-4 text-label text-ink/30 font-data">IMG_{idx.toString().padStart(3, '0')}</div>
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMTEsIDEzLCAxNiwgMC4wNSkiLz48L3N2Zz4=')] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
              
              <div className="flex justify-between items-start mb-4">
                <span className="text-label text-biosphere-green">{article.category}</span>
                <span className="text-label text-ink/40">{article.date}</span>
              </div>
              
              <h4 className="text-h3 mb-4 group-hover:text-orbit-blue transition-colors">
                {article.title}
              </h4>
              
              <p className="text-body text-ink/70 flex-grow mb-6">
                {article.excerpt}
              </p>

              <div className="flex items-center gap-2 mt-auto pt-4 border-t border-line-dark text-label text-ink/50 group-hover:border-orbit-blue/30 transition-colors">
                <span>[ READ ]</span>
                <span className="ml-auto">{article.metrics}</span>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
