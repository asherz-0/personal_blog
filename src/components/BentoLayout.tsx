import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Diamond, ArrowLeft } from 'lucide-react';

// --- MOCK DATA ---
const POSTS = [
  {
    id: '1',
    title: 'The Architecture of Optimism',
    date: '2024.05.21',
    category: 'ESSAY',
    excerpt: '探讨技术如何重塑我们对未来的期望，以及工程师在其中承担的设计责任。',
    content: '我们生活在一个被技术重塑的时代。每一次代码的提交，每一次像素的对齐，都在微小地改变着人们与世界的交互方式。\n\n在构建系统时，我们不仅是在搭建逻辑的脚手架，更是在设计未来的可能性。乐观主义不仅是一种情绪，更是一种工程要求。没有对未知的期待，我们就无法在复杂的系统崩溃中找到修复的路径。\n\n从架构的视角来看，这意味着我们需要在设计初期就考虑系统的容错性与可延展性。就像我们在UI中留出的「呼吸感」，系统的底层也需要留白，为未来的功能生长提供空间。'
  },
  {
    id: '2',
    title: 'Precision in the Browser',
    date: '2024.04.12',
    category: 'ENGINEERING',
    excerpt: '在前端开发中引入工程级精度的尝试：从排版比例到亚像素级渲染优化。',
    content: '前端开发经常被视为一门「近似」的艺术，但实际上，浏览器提供了一个极其精确的渲染引擎。\n\n这篇文章探讨了如何利用 CSS clamp() 函数建立动态而精确的排版比例（Typographic Scale），并结合真实的视口数据进行亚像素级的对齐。\n\n真正的精度不在于使用了多小的小数点，而在于系统地管理页面中所有元素的相对关系。当我们说一个界面具有「秩序感」时，往往是因为背后的数学网格在起作用。'
  },
  {
    id: '3',
    title: 'Designing for Human Scale',
    date: '2024.02.28',
    category: 'DESIGN',
    excerpt: '当系统变得庞大，我们如何保留界面的“呼吸感”与人的尺度。',
    content: '随着AI技术的发展，我们正在面对越来越复杂的数据维度和功能集。界面的密度不可避免地在增加。\n\n然而，人的认知带宽并没有随之增加。我们需要回归「人类尺度」（Human Scale）的设计理念。\n\n这意味着不盲目追求一屏展示所有信息，而是通过视觉层级（Hierarchy）和渐进式披露（Progressive Disclosure），让用户在需要的时候看到正确的信息。设计不应该引起焦虑，它应当像一个可靠的向导。'
  }
];

export function BentoLayout() {
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const selectedPost = POSTS.find(p => p.id === selectedPostId);

  return (
    <div className="min-h-screen w-full bg-white flex items-center justify-center p-4 sm:p-8 md:p-12 transition-all duration-500">
      {/* Main Bento Container */}
      <div 
        className="w-full max-w-[1400px] bg-paper border border-line-dark rounded-[1.5rem] overflow-hidden flex flex-col shadow-2xl transition-all duration-500"
        style={{ minHeight: 'max(800px, 85vh)' }}
      >
        
        {/* Header Row */}
        <header className="flex items-center justify-between px-8 py-5 border-b border-line-dark shrink-0 bg-paper relative z-20">
          <div className="flex items-center gap-4 cursor-pointer" onClick={() => setSelectedPostId(null)}>
            <div className="w-8 h-8 bg-ink rounded flex items-center justify-center text-paper">
              <Diamond size={18} fill="currentColor" />
            </div>
            <div className="font-data text-xs tracking-[0.2em] font-medium hidden sm:block">
              FRONTIER // OPTIMISM
            </div>
          </div>
          <nav className="flex items-center gap-6 sm:gap-8 font-data text-[0.65rem] sm:text-xs tracking-[0.1em]">
            <button 
              onClick={() => setSelectedPostId(null)} 
              className={`${!selectedPostId ? 'border-b border-ink font-semibold' : 'hover:opacity-60'} pb-1 transition-opacity uppercase`}
            >
              Journal
            </button>
            <button className="hover:opacity-60 transition-opacity uppercase pb-1">Archive</button>
            <button className="hover:opacity-60 transition-opacity uppercase pb-1 hidden md:block">Prototypes</button>
            <button className="hover:opacity-60 transition-opacity uppercase pb-1">About</button>
          </nav>
        </header>

        {/* Content Area with Animation */}
        <div className="flex flex-col flex-grow relative overflow-hidden bg-paper">
          <AnimatePresence mode="wait">
            {!selectedPostId ? (
              <motion.div 
                key="home"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="flex flex-col w-full h-full"
              >
                {/* Hero Section (Bento Grid) */}
                <div className="flex flex-col lg:flex-row w-full border-b border-line-dark shrink-0">
                  {/* Left Panel (00 CONCEPT) */}
                  <div className="w-full lg:w-[55%] xl:w-[60%] border-b lg:border-b-0 lg:border-r border-line-dark bg-dot-grid flex flex-col relative p-8 lg:p-12 xl:p-16">
                    <div className="text-label text-ink/50 mb-auto">00 // CONCEPT</div>
                    
                    <div className="mt-12 lg:mt-24 mb-16">
                      <h1 className="font-display font-bold text-ink leading-[0.9] tracking-tighter mb-8 break-keep text-[3.5rem] sm:text-[4.5rem] xl:text-[6rem]">
                        看见结构<br/>
                        建立连接
                      </h1>
                      <p className="text-body text-ink/80 max-w-[42ch]">
                        从一处具体的草图，到可以运行的世界。这里记录着关于技术精度的追求与人类情感的共鸣。
                      </p>
                    </div>

                    <div className="mt-auto pt-8 flex items-center gap-6">
                      <button 
                        onClick={() => {
                          // Scroll to journal section
                          document.getElementById('journal-feed')?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="bg-ink text-paper px-8 py-3 rounded-full font-display text-sm font-medium hover:bg-orbit-blue transition-colors duration-300"
                      >
                        阅读日志
                      </button>
                      <div className="text-label text-ink/40 font-data hidden sm:block">
                        SYSTEM STATUS: READY // 2024.05.21
                      </div>
                    </div>
                  </div>

                  {/* Right Panel */}
                  <div className="w-full lg:w-[45%] xl:w-[40%] flex flex-col">
                    {/* Right Top (01 OBSERVE) */}
                    <div className="flex-grow min-h-[300px] bg-mist border-b border-line-dark p-8 relative flex flex-col">
                      <div className="text-label text-ink/60 z-10">01 // OBSERVE</div>
                      <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none">
                        <svg viewBox="0 0 100 100" className="w-[80%] h-[80%] stroke-line-dark fill-none stroke-[0.3]">
                          <line x1="50" y1="0" x2="50" y2="100" />
                          <line x1="0" y1="50" x2="100" y2="50" />
                          <circle cx="50" cy="50" r="40" />
                          <circle cx="50" cy="50" r="39.5" className="stroke-[0.1] opacity-50" />
                          <circle cx="50" cy="50" r="8" className="stroke-[0.5]" />
                          <path d="M48 50 L52 50 M50 48 L50 52" className="stroke-[0.5]" />
                        </svg>
                      </div>
                      <div className="mt-auto text-right text-[0.55rem] font-data tracking-widest text-ink/50 z-10 leading-relaxed">
                        COORD: 39.9042° N<br/>
                        SCALE: 1:1.000
                      </div>
                    </div>

                    {/* Right Bottom Split (02 CONNECT & 03 BUILD) */}
                    <div className="flex flex-col sm:flex-row min-h-[200px]">
                      <div className="w-full sm:w-1/2 border-b sm:border-b-0 sm:border-r border-line-dark p-6 xl:p-8 flex flex-col bg-dot-grid relative">
                        <div className="text-label text-ink/50 mb-6">02 // CONNECT</div>
                        <h3 className="font-display font-semibold text-lg mb-2 leading-snug">
                          思维的颗粒与叙事。
                        </h3>
                        <p className="text-sm text-ink/70 leading-relaxed">
                          在破碎中寻找秩序。
                        </p>
                      </div>
                      <div className="w-full sm:w-1/2 p-6 xl:p-8 flex flex-col bg-dot-grid relative">
                        <div className="text-label text-ink/50 mb-6">03 // BUILD</div>
                        <h3 className="font-display font-semibold text-lg mb-2 leading-snug">
                          运行逻辑代码。
                        </h3>
                        <p className="text-sm text-ink/70 leading-relaxed">
                          创造不应受制于工具。
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Blog Feed Section */}
                <div id="journal-feed" className="flex flex-col bg-paper">
                  <div className="p-8 border-b border-line-dark flex items-center justify-between sticky top-0 bg-paper/95 backdrop-blur z-10">
                    <div className="text-label text-ink/50">04 // JOURNAL ARCHIVE</div>
                    <div className="text-label font-data text-ink/40 hidden sm:block">TOTAL: {POSTS.length.toString().padStart(3, '0')}</div>
                  </div>
                  
                  <div className="flex flex-col">
                    {POSTS.map((post, idx) => (
                      <article 
                        key={post.id} 
                        onClick={() => setSelectedPostId(post.id)}
                        className="cursor-pointer group flex flex-col md:flex-row p-8 border-b border-line-dark last:border-b-0 hover:bg-mist/30 transition-colors duration-300"
                      >
                        <div className="w-full md:w-1/4 mb-4 md:mb-0 shrink-0">
                          <div className="font-data text-label text-ink/50">{post.date}</div>
                          <div className="font-data text-label text-orbit-blue mt-1">{post.category}</div>
                        </div>
                        <div className="w-full md:w-2/4 pr-8">
                          <h3 className="text-h2 text-[1.5rem] font-display mb-3 group-hover:text-orbit-blue transition-colors duration-300">
                            {post.title}
                          </h3>
                          <p className="text-body text-ink/70 leading-relaxed line-clamp-2">
                            {post.excerpt}
                          </p>
                        </div>
                        <div className="w-full md:w-1/4 flex items-end justify-end mt-6 md:mt-0 opacity-0 md:opacity-100 group-hover:opacity-100 transition-opacity duration-300 font-data text-label text-ink/40 group-hover:text-orbit-blue">
                          [ READ ENTRY ]
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="post"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="flex flex-col w-full min-h-[60vh] bg-dot-grid"
              >
                {/* Reading View Header */}
                <div className="p-6 sm:p-8 border-b border-line-dark flex items-center justify-between sticky top-0 bg-paper/95 backdrop-blur z-10">
                  <button 
                    onClick={() => setSelectedPostId(null)}
                    className="font-data text-label text-ink hover:text-orbit-blue flex items-center gap-2 transition-colors group"
                  >
                    <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> 
                    <span>RETURN TO ARCHIVE</span>
                  </button>
                  <div className="text-label text-ink/40 font-data hidden sm:block">READING MODE // ACTIVE</div>
                </div>

                {/* Article Content */}
                <div className="p-8 sm:p-12 md:p-24 flex justify-center flex-grow">
                  <article className="w-full max-w-[65ch]">
                    <header className="mb-16 md:mb-24">
                      <div className="flex items-center gap-4 mb-8 border-l-2 border-orbit-blue pl-4">
                        <span className="font-data text-label text-ink/50">{selectedPost?.date}</span>
                        <span className="font-data text-label text-orbit-blue">{selectedPost?.category}</span>
                      </div>
                      <h1 className="text-h1 font-display leading-[1.1] tracking-tight">
                        {selectedPost?.title}
                      </h1>
                    </header>
                    <div className="text-body text-ink/80 whitespace-pre-wrap leading-[1.8] font-body text-[1.05rem]">
                      {selectedPost?.content}
                    </div>
                    
                    <div className="mt-24 pt-8 border-t border-line-dark flex justify-between items-center text-label font-data text-ink/40">
                      <div>END OF ENTRY</div>
                      <button onClick={() => setSelectedPostId(null)} className="hover:text-orbit-blue transition-colors">
                        [ CLOSE ]
                      </button>
                    </div>
                  </article>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer Bar */}
        <footer className="px-8 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shrink-0 bg-paper border-t border-line-dark relative z-20">
          <div className="flex gap-12">
            <div>
              <div className="text-[0.55rem] font-data text-ink/50 tracking-widest mb-1">LATENT SPACE</div>
              <div className="font-display text-sm font-semibold tracking-tight">32.8 GB / Processed</div>
            </div>
            
            <div className="hidden sm:block">
              <div className="text-[0.55rem] font-data text-ink/50 tracking-widest mb-2">SIGNAL STRENGTH</div>
              <div className="flex gap-1 items-end h-3">
                <div className="w-4 h-[40%] bg-orbit-blue rounded-sm"></div>
                <div className="w-4 h-[70%] bg-orbit-blue rounded-sm"></div>
                <div className="w-4 h-full bg-orbit-blue rounded-sm"></div>
                <div className="w-4 h-[30%] bg-line-dark rounded-sm"></div>
              </div>
            </div>
          </div>

          <div className="flex gap-2 items-center justify-center">
            <div className="w-4 h-4 rounded-full bg-ink"></div>
            <div className="w-4 h-4 rounded-full bg-mist border border-line-dark"></div>
            <div className="w-4 h-4 rounded-full bg-orbit-blue"></div>
          </div>

          <div className="flex items-center gap-4">
            <div className="font-data text-[0.65rem] tracking-widest font-medium hidden sm:block">BUILT BY CURIOSITIES</div>
            <div className="w-8 sm:w-12 h-[1px] bg-ink"></div>
          </div>
        </footer>

      </div>
    </div>
  );
}

