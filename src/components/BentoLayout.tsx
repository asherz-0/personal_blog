import {useEffect, useMemo, useState} from 'react';
import {AnimatePresence, motion} from 'motion/react';
import {ArrowLeft, ArrowUpRight, Diamond} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  getInitialLanguage,
  persistLanguage,
  UI_COPY,
  type Language,
  type UiCopy,
} from '../lib/i18n';
import {getPostBySlug, posts, type Post} from '../lib/posts';

function slugFromHash(): string | null {
  const match = window.location.hash.match(/^#\/posts\/([^/?#]+)$/);
  if (!match) return null;

  try {
    return decodeURIComponent(match[1]);
  } catch {
    return null;
  }
}

function displayDate(date: string): string {
  return date.replaceAll('-', '.');
}

function setDescription(content: string): void {
  document
    .querySelector<HTMLMetaElement>('meta[name="description"]')
    ?.setAttribute('content', content);
}

function resolveMarkdownAsset(source: string | undefined): string | undefined {
  if (!source?.startsWith('/')) return source;
  return `${import.meta.env.BASE_URL}${source.slice(1)}`;
}

function ReadingView({post, onClose, copy}: {post: Post; onClose: () => void; copy: UiCopy}) {
  return (
    <motion.div
      key={post.slug}
      initial={{opacity: 0, y: 10}}
      animate={{opacity: 1, y: 0}}
      exit={{opacity: 0, y: -10}}
      transition={{duration: 0.35, ease: [0.22, 1, 0.36, 1]}}
      className="flex min-h-[60vh] w-full flex-col bg-dot-grid"
    >
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-line-dark bg-paper/95 p-6 backdrop-blur sm:p-8">
        <button
          type="button"
          onClick={onClose}
          className="group flex items-center gap-2 font-data text-label text-ink transition-colors hover:text-orbit-blue focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orbit-blue"
        >
          <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-1" />
          <span>{copy.returnToArchive}</span>
        </button>
        <div className="hidden font-data text-label text-ink/40 sm:block">
          {copy.readingMode} // {post.readingMinutes.toString().padStart(2, '0')} {copy.minuteUnit}
        </div>
      </div>

      <div className="flex flex-grow justify-center p-8 sm:p-12 md:p-24">
        <article className="w-full max-w-[65ch]">
          <header className="mb-16 md:mb-24">
            <div className="mb-8 flex items-center gap-4 border-l-2 border-orbit-blue pl-4">
              <time dateTime={post.date} className="font-data text-label text-ink/50">
                {displayDate(post.date)}
              </time>
              <span className="font-data text-label text-orbit-blue">{post.category}</span>
            </div>
            <h1 className="font-display text-h1 leading-[1.1] tracking-tight">{post.title}</h1>
            <p className="mt-8 text-lg text-ink/65">{post.excerpt}</p>
          </header>

          <div className="article-content text-ink/85">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                a: ({href, children, ...props}) => {
                  const external = Boolean(href && /^https?:\/\//.test(href));
                  return (
                    <a
                      {...props}
                      href={href}
                      target={external ? '_blank' : undefined}
                      rel={external ? 'noreferrer' : undefined}
                    >
                      {children}
                    </a>
                  );
                },
                img: ({src, alt, ...props}) => (
                  <img {...props} src={resolveMarkdownAsset(src)} alt={alt ?? ''} loading="lazy" />
                ),
              }}
            >
              {post.content}
            </ReactMarkdown>
          </div>

          <div className="mt-24 flex items-center justify-between border-t border-line-dark pt-8 font-data text-label text-ink/40">
            <div>{copy.endOfPost}</div>
            <button
              type="button"
              onClick={onClose}
              className="transition-colors hover:text-orbit-blue focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orbit-blue"
            >
              [ {copy.close} ]
            </button>
          </div>
        </article>
      </div>
    </motion.div>
  );
}

export function BentoLayout() {
  const [activeSlug, setActiveSlug] = useState<string | null>(() => slugFromHash());
  const [language, setLanguage] = useState<Language>(() => getInitialLanguage());
  const copy = UI_COPY[language];
  const selectedPost = useMemo(
    () => (activeSlug ? getPostBySlug(activeSlug) : undefined),
    [activeSlug],
  );
  const latestDate = posts[0]?.date;

  useEffect(() => {
    const syncHash = () => setActiveSlug(slugFromHash());
    window.addEventListener('hashchange', syncHash);
    return () => window.removeEventListener('hashchange', syncHash);
  }, []);

  useEffect(() => {
    document.title = selectedPost ? `${selectedPost.title} — ${copy.siteTitle}` : copy.siteTitle;
    setDescription(selectedPost?.excerpt ?? copy.siteDescription);
    window.scrollTo({top: 0, behavior: 'instant'});
  }, [copy.siteDescription, copy.siteTitle, selectedPost]);

  useEffect(() => {
    document.documentElement.lang = copy.htmlLang;
    persistLanguage(language);
  }, [copy.htmlLang, language]);

  function openPost(slug: string): void {
    window.location.hash = `/posts/${encodeURIComponent(slug)}`;
    setActiveSlug(slug);
  }

  function closePost(): void {
    history.pushState(null, '', `${window.location.pathname}${window.location.search}`);
    setActiveSlug(null);
  }

  function showArchive(): void {
    closePost();
    requestAnimationFrame(() => {
      document.getElementById('archive')?.scrollIntoView({behavior: 'smooth'});
    });
  }

  function toggleLanguage(): void {
    setLanguage((currentLanguage) => (currentLanguage === 'zh' ? 'en' : 'zh'));
  }

  return (
    <div className="min-h-[100dvh] w-full bg-paper transition-all duration-500">
      <div className="flex min-h-[100dvh] w-full flex-col overflow-hidden bg-paper transition-all duration-500">
        <header className="relative z-20 flex shrink-0 items-center justify-between border-b border-line-dark bg-paper px-5 py-5 sm:px-8">
          <button
            type="button"
            className="flex items-center gap-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orbit-blue"
            onClick={closePost}
            aria-label={copy.returnHome}
          >
            <span className="flex h-8 w-8 items-center justify-center rounded bg-ink text-paper">
              <Diamond size={18} fill="currentColor" />
            </span>
            <span className="hidden font-data text-xs font-medium tracking-[0.2em] sm:block">
              {copy.brandTitle}
            </span>
          </button>
          <nav className="flex items-center gap-3 whitespace-nowrap font-data text-[0.65rem] tracking-[0.1em] sm:gap-8 sm:text-xs" aria-label={copy.primaryNavigation}>
            <button
              type="button"
              onClick={closePost}
              className={`${!selectedPost ? 'border-b border-ink font-semibold' : 'hover:opacity-60'} pb-1 uppercase transition-opacity focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orbit-blue`}
            >
              {copy.journal}
            </button>
            <button
              type="button"
              onClick={showArchive}
              className="pb-1 uppercase transition-opacity hover:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orbit-blue"
            >
              {copy.archive}
            </button>
            <a
              href="https://github.com/asherzj"
              target="_blank"
              rel="noreferrer"
              className="pb-1 uppercase transition-opacity hover:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orbit-blue"
            >
              {copy.connect}
            </a>
            <button
              type="button"
              onClick={toggleLanguage}
              className="rounded-full border border-line-dark px-2.5 py-1 uppercase transition-colors hover:border-orbit-blue hover:text-orbit-blue focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orbit-blue"
              aria-label={copy.switchLanguage}
              title={copy.switchLanguage}
            >
              {copy.languageButton}
            </button>
          </nav>
        </header>

        <main className="relative flex flex-grow flex-col overflow-hidden bg-paper">
          <AnimatePresence mode="wait">
            {selectedPost ? (
              <ReadingView post={selectedPost} onClose={closePost} copy={copy} />
            ) : (
              <motion.div
                key="home"
                initial={{opacity: 0, y: 10}}
                animate={{opacity: 1, y: 0}}
                exit={{opacity: 0, y: -10}}
                transition={{duration: 0.35, ease: [0.22, 1, 0.36, 1]}}
                className="flex h-full w-full flex-col"
              >
                <div className="flex w-full shrink-0 flex-col border-b border-line-dark lg:flex-row">
                  <div className="relative flex w-full flex-col border-b border-line-dark bg-dot-grid p-8 lg:w-[60%] lg:border-b-0 lg:border-r lg:p-12 xl:p-16">
                    <div className="mb-auto text-label text-ink/50">{copy.conceptLabel}</div>

                    <div className="mb-16 mt-12 lg:mt-24">
                      <h1 className="break-keep font-display text-[3.5rem] font-bold leading-[0.9] tracking-tighter text-ink sm:text-[4.5rem] xl:text-[6rem]">
                        {copy.heroLineOne}<br />
                        {copy.heroLineTwo}
                      </h1>
                      <p className="mt-8 max-w-[42ch] text-body text-ink/80">
                        {copy.heroDescription}
                      </p>
                    </div>

                    <div className="mt-auto flex items-center gap-6 pt-8">
                      <button
                        type="button"
                        onClick={showArchive}
                        className="rounded-full bg-ink px-8 py-3 font-display text-sm font-medium text-paper transition-colors duration-300 hover:bg-orbit-blue focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orbit-blue"
                      >
                        {copy.readArchive}
                      </button>
                      <div className="hidden font-data text-label text-ink/40 sm:block">
                        {copy.systemStatus}{latestDate ? ` // ${displayDate(latestDate)}` : ''}
                      </div>
                    </div>
                  </div>

                  <div className="flex w-full flex-col lg:w-[40%]">
                    <div className="relative flex min-h-[300px] flex-grow flex-col border-b border-line-dark bg-mist p-8">
                      <div className="z-10 text-label text-ink/60">{copy.observeLabel}</div>
                      <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
                        <svg viewBox="0 0 100 100" className="h-[80%] w-[80%] fill-none stroke-line-dark stroke-[0.3]" aria-hidden="true">
                          <line x1="50" y1="0" x2="50" y2="100" />
                          <line x1="0" y1="50" x2="100" y2="50" />
                          <circle cx="50" cy="50" r="40" />
                          <circle cx="50" cy="50" r="39.5" className="stroke-[0.1] opacity-50" />
                          <circle cx="50" cy="50" r="8" className="stroke-[0.5]" />
                          <path d="M48 50 L52 50 M50 48 L50 52" className="stroke-[0.5]" />
                        </svg>
                      </div>
                      <div className="z-10 mt-auto text-right font-data text-[0.55rem] leading-relaxed tracking-widest text-ink/50">
                        {copy.focusTopics}<br />
                        {copy.writingMode}
                      </div>
                    </div>

                    <div className="flex min-h-[200px] flex-col sm:flex-row">
                      <div className="relative flex w-full flex-col border-b border-line-dark bg-dot-grid p-6 sm:w-1/2 sm:border-b-0 sm:border-r xl:p-8">
                        <div className="mb-6 text-label text-ink/50">{copy.connectLabel}</div>
                        <h2 className="mb-2 font-display text-lg font-semibold leading-snug">{copy.connectTitle}</h2>
                        <p className="text-sm leading-relaxed text-ink/70">{copy.connectDescription}</p>
                      </div>
                      <div className="relative flex w-full flex-col bg-dot-grid p-6 sm:w-1/2 xl:p-8">
                        <div className="mb-6 text-label text-ink/50">{copy.buildLabel}</div>
                        <h2 className="mb-2 font-display text-lg font-semibold leading-snug">{copy.buildTitle}</h2>
                        <p className="text-sm leading-relaxed text-ink/70">{copy.buildDescription}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <section className="flex flex-col border-b border-line-dark bg-paper" aria-labelledby="reading-title">
                  <div className="border-b border-line-dark bg-paper p-8">
                    <h2 id="reading-title" className="text-label text-ink/50">{copy.thingsConsumeLabel}</h2>
                  </div>
                  <div className="flex flex-col bg-dot-grid p-8 md:flex-row md:items-start">
                    <div className="mb-6 w-full shrink-0 font-data text-label text-orbit-blue md:mb-0 md:w-1/4">
                      {copy.readingPrinciple}
                    </div>
                    <div className="w-full md:w-2/4 md:pr-8">
                      <h3 className="mb-3 font-display text-[1.5rem] font-semibold leading-snug">{copy.readingTitle}</h3>
                      <p className="max-w-[58ch] text-body leading-relaxed text-ink/70">{copy.readingDescription}</p>
                    </div>
                  </div>
                </section>

                <section id="archive" className="flex scroll-mt-4 flex-col bg-paper" aria-labelledby="archive-title">
                  <div className="sticky top-0 z-10 flex items-center justify-between border-b border-line-dark bg-paper/95 p-8 backdrop-blur">
                    <h2 id="archive-title" className="text-label text-ink/50">{copy.thingsWriteLabel}</h2>
                    <div className="hidden font-data text-label text-ink/40 sm:block">
                      {copy.total}: {posts.length.toString().padStart(3, '0')}
                    </div>
                  </div>

                  <div className="flex flex-col">
                    {posts.length > 0 ? (
                      posts.map((post) => (
                        <article key={post.slug} className="border-b border-line-dark last:border-b-0">
                          <button
                            type="button"
                            onClick={() => openPost(post.slug)}
                            className="group flex w-full cursor-pointer flex-col p-8 text-left transition-colors duration-300 hover:bg-mist/30 focus-visible:bg-mist/30 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-orbit-blue md:flex-row"
                            aria-label={`${copy.readPostAria}: ${post.title}`}
                          >
                            <div className="mb-4 w-full shrink-0 md:mb-0 md:w-1/4">
                              <time dateTime={post.date} className="font-data text-label text-ink/50">
                                {displayDate(post.date)}
                              </time>
                              <div className="mt-1 font-data text-label text-orbit-blue">{post.category}</div>
                            </div>
                            <div className="w-full pr-0 md:w-2/4 md:pr-8">
                              <h3 className="mb-3 font-display text-[1.5rem] transition-colors duration-300 group-hover:text-orbit-blue">
                                {post.title}
                              </h3>
                              <p className="line-clamp-2 text-body leading-relaxed text-ink/70">{post.excerpt}</p>
                            </div>
                            <div className="mt-6 flex w-full items-end justify-between font-data text-label text-ink/40 transition-colors duration-300 group-hover:text-orbit-blue md:mt-0 md:w-1/4 md:justify-end">
                              <span className="md:hidden">{post.readingMinutes} {copy.minuteRead}</span>
                              <span>[ {copy.readPost} ]</span>
                            </div>
                          </button>
                        </article>
                      ))
                    ) : (
                      <p className="p-8 text-ink/60">{copy.noPosts}</p>
                    )}
                  </div>
                </section>

                <section className="flex flex-col border-t border-line-dark bg-paper" aria-labelledby="builds-title">
                  <div className="border-b border-line-dark bg-paper p-8">
                    <h2 id="builds-title" className="text-label text-ink/50">{copy.thingsBuildLabel}</h2>
                  </div>
                  <a
                    href="https://github.com/asherzj/asherzj.github.io"
                    target="_blank"
                    rel="noreferrer"
                    className="group flex flex-col bg-dot-grid p-8 transition-colors duration-300 hover:bg-mist/30 focus-visible:bg-mist/30 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-orbit-blue md:flex-row"
                  >
                    <div className="mb-6 w-full shrink-0 font-data text-label text-orbit-blue md:mb-0 md:w-1/4">
                      {copy.projectCategory}
                    </div>
                    <div className="w-full md:w-2/4 md:pr-8">
                      <h3 className="mb-3 font-display text-[1.5rem] transition-colors duration-300 group-hover:text-orbit-blue">
                        {copy.projectTitle}
                      </h3>
                      <p className="max-w-[58ch] text-body leading-relaxed text-ink/70">{copy.projectDescription}</p>
                    </div>
                    <div className="mt-6 flex w-full items-center font-data text-label text-ink/40 transition-colors duration-300 group-hover:text-orbit-blue md:mt-0 md:w-1/4 md:justify-end">
                      <span>[ {copy.viewProject} ]</span>
                      <ArrowUpRight className="ml-2" size={14} aria-hidden="true" />
                    </div>
                  </a>
                </section>
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        <footer id="about" className="relative z-20 flex shrink-0 flex-col items-start justify-between gap-6 border-t border-line-dark bg-paper px-8 py-5 sm:flex-row sm:items-center">
          <div className="flex gap-12">
            <div>
              <div className="mb-1 font-data text-[0.55rem] tracking-widest text-ink/50">{copy.archiveState}</div>
              <div className="font-display text-sm font-semibold tracking-tight">
                {posts.length.toString().padStart(3, '0')} {copy.postsIndexed}
              </div>
            </div>
            <div className="hidden sm:block">
              <div className="mb-2 font-data text-[0.55rem] tracking-widest text-ink/50">{copy.signalStrength}</div>
              <div className="flex h-3 items-end gap-1" aria-hidden="true">
                <div className="h-[40%] w-4 rounded-sm bg-orbit-blue" />
                <div className="h-[70%] w-4 rounded-sm bg-orbit-blue" />
                <div className="h-full w-4 rounded-sm bg-orbit-blue" />
                <div className="h-[30%] w-4 rounded-sm bg-line-dark" />
              </div>
            </div>
          </div>

          <a
            href="https://x.com/AsherZhao12"
            target="_blank"
            rel="noreferrer"
            aria-label={copy.xProfileLabel}
            className="border-b border-ink pb-1 font-data text-[0.65rem] font-medium tracking-widest transition-colors hover:border-orbit-blue hover:text-orbit-blue focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orbit-blue"
          >
            X / @ASHERZHAO12
          </a>

          <div className="flex items-center gap-4">
            <div className="hidden font-data text-[0.65rem] font-medium tracking-widest sm:block">{copy.builtFromMarkdown}</div>
            <div className="h-px w-8 bg-ink sm:w-12" />
          </div>
        </footer>
      </div>
    </div>
  );
}
