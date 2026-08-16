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
} from '../lib/i18n';
import {
  createHomeUrl,
  createPostUrl,
  getPendingPostSlug,
  getPostSlug,
  persistPendingPostSlug,
} from '../lib/post-route';
import {consumptions} from '../lib/consumptions';
import {getPostBySlug, posts, type Post} from '../lib/posts';
import {filterByTag, getTagSummaries} from '../lib/tags';
import {PostComments} from './PostComments';
import {StableCopy, StableLocalizedText} from './StableCopy';
import {TagChipList, TagFilter} from './TagFilter';

type Tab = 'INDEX' | 'OBSERVE' | 'THINK' | 'BUILD';

const TABS: readonly Tab[] = ['INDEX', 'OBSERVE', 'THINK', 'BUILD'];
const PROJECT_URL = 'https://github.com/asherzj/asherzj.github.io';

function displayDate(date: string): string {
  return date.replaceAll('-', '.');
}

function displayActivityDate(date: string | undefined): string {
  return date ? date.slice(5).replace('-', '.') : '--.--';
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

function syncPostLocation(): string | null {
  const currentUrl = new URL(window.location.href);
  const slug = getPostSlug(currentUrl, getPendingPostSlug());

  if (!slug || !getPostBySlug(slug)) {
    if (!currentUrl.searchParams.has('giscus')) persistPendingPostSlug(null);
    return null;
  }

  const nextUrl = createPostUrl(currentUrl, slug);
  if (nextUrl.href !== currentUrl.href) {
    history.replaceState(null, '', nextUrl);
  }
  persistPendingPostSlug(slug);
  return slug;
}

function ReadingView({
  post,
  onClose,
  language,
}: {
  post: Post;
  onClose: () => void;
  language: Language;
}) {
  return (
    <motion.div
      key={post.slug}
      initial={{opacity: 0, y: 10}}
      animate={{opacity: 1, y: 0}}
      exit={{opacity: 0, y: -10}}
      transition={{duration: 0.35, ease: [0.22, 1, 0.36, 1]}}
      className="flex min-h-[60vh] w-full flex-col bg-dot-grid"
    >
      <div className="sticky top-[73px] z-10 flex items-center justify-between border-b border-line-dark bg-paper/95 p-6 backdrop-blur sm:p-8">
        <button
          type="button"
          onClick={onClose}
          className="group flex items-center gap-2 font-data text-label text-ink transition-colors hover:text-orbit-blue focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orbit-blue"
        >
          <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-1" />
          <StableCopy language={language} copyKey="returnToArchive" />
        </button>
        <div className="hidden font-data text-label text-ink/40 sm:block">
          <StableCopy language={language} copyKey="readingMode" inline /> //{' '}
          {post.readingMinutes.toString().padStart(2, '0')}{' '}
          <StableCopy language={language} copyKey="minuteUnit" inline />
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
            <StableCopy language={language} copyKey="endOfPost" />
            <button
              type="button"
              onClick={onClose}
              className="transition-colors hover:text-orbit-blue focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orbit-blue"
            >
              [ <StableCopy language={language} copyKey="close" inline /> ]
            </button>
          </div>

          <PostComments language={language} slug={post.slug} />
        </article>
      </div>
    </motion.div>
  );
}

export function BentoLayout() {
  const [activeTab, setActiveTab] = useState<Tab>('INDEX');
  const [activeSlug, setActiveSlug] = useState<string | null>(() => syncPostLocation());
  const [language, setLanguage] = useState<Language>(() => getInitialLanguage());
  const [consumeTag, setConsumeTag] = useState<string | null>(null);
  const [writeTag, setWriteTag] = useState<string | null>(null);
  const copy = UI_COPY[language];
  const selectedPost = useMemo(
    () => (activeSlug ? getPostBySlug(activeSlug) : undefined),
    [activeSlug],
  );
  const consumptionTags = useMemo(() => getTagSummaries(consumptions), []);
  const postTags = useMemo(() => getTagSummaries(posts), []);
  const filteredConsumptions = useMemo(
    () => filterByTag(consumptions, consumeTag),
    [consumeTag],
  );
  const filteredPosts = useMemo(() => filterByTag(posts, writeTag), [writeTag]);
  const latestPost = posts[0];
  const latestConsumption = consumptions[0];
  const latestDate = latestPost?.date ?? latestConsumption?.date;

  useEffect(() => {
    const syncRoute = () => {
      const slug = syncPostLocation();
      setActiveSlug(slug);
      if (slug) setActiveTab('THINK');
    };
    window.addEventListener('hashchange', syncRoute);
    window.addEventListener('popstate', syncRoute);
    return () => {
      window.removeEventListener('hashchange', syncRoute);
      window.removeEventListener('popstate', syncRoute);
    };
  }, []);

  useEffect(() => {
    document.title = selectedPost ? `${selectedPost.title} — ${copy.siteTitle}` : copy.siteTitle;
    setDescription(selectedPost?.excerpt ?? copy.siteDescription);
    window.scrollTo({top: 0, behavior: 'instant'});
  }, [activeTab, copy.siteDescription, copy.siteTitle, selectedPost]);

  useEffect(() => {
    document.documentElement.lang = copy.htmlLang;
    persistLanguage(language);
  }, [copy.htmlLang, language]);

  function clearPostRoute(): void {
    const currentUrl = new URL(window.location.href);
    const nextUrl = createHomeUrl(currentUrl);
    if (nextUrl.href !== currentUrl.href) {
      history.pushState(null, '', nextUrl);
    }
    persistPendingPostSlug(null);
    setActiveSlug(null);
  }

  function selectTab(tab: Tab): void {
    clearPostRoute();
    setActiveTab(tab);
  }

  function openPost(slug: string): void {
    const nextUrl = createPostUrl(new URL(window.location.href), slug);
    history.pushState(null, '', nextUrl);
    persistPendingPostSlug(slug);
    setActiveTab('THINK');
    setActiveSlug(slug);
  }

  function closePost(): void {
    clearPostRoute();
    setActiveTab('THINK');
  }

  function toggleLanguage(): void {
    setLanguage((currentLanguage) => (currentLanguage === 'zh' ? 'en' : 'zh'));
  }

  return (
    <div className="min-h-[100dvh] w-full bg-paper transition-all duration-500">
      <div className="flex min-h-[100dvh] w-full flex-col overflow-hidden bg-paper transition-all duration-500">
        <header className="sticky top-0 z-30 flex shrink-0 items-center justify-between border-b border-line-dark bg-paper/95 px-4 py-5 backdrop-blur sm:px-8">
          <button
            type="button"
            className="flex shrink-0 items-center gap-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orbit-blue"
            onClick={() => selectTab('INDEX')}
            aria-label={copy.returnHome}
          >
            <span className="flex h-8 w-8 items-center justify-center rounded bg-ink text-paper">
              <Diamond size={18} fill="currentColor" />
            </span>
            <span className="hidden font-data text-xs font-medium tracking-[0.2em] lg:block">
              <StableCopy language={language} copyKey="brandTitle" />
            </span>
          </button>

          <nav
            className="ml-3 flex items-center gap-2 whitespace-nowrap font-data text-[0.6rem] tracking-[0.08em] sm:gap-5 sm:text-xs md:gap-8"
            aria-label={copy.primaryNavigation}
          >
            {TABS.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => selectTab(tab)}
                className={`${activeTab === tab && !selectedPost ? 'border-b border-ink font-semibold' : 'hover:opacity-60'} pb-1 uppercase transition-opacity focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orbit-blue`}
                aria-current={activeTab === tab && !selectedPost ? 'page' : undefined}
              >
                {tab}
              </button>
            ))}
            <button
              type="button"
              onClick={toggleLanguage}
              className="rounded-full border border-line-dark px-2.5 py-1 uppercase transition-colors hover:border-orbit-blue hover:text-orbit-blue focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orbit-blue"
              aria-label={copy.switchLanguage}
              title={copy.switchLanguage}
            >
              <StableCopy language={language} copyKey="languageButton" />
            </button>
          </nav>
        </header>

        <main className="relative flex flex-grow flex-col bg-paper">
          <AnimatePresence mode="wait">
            {selectedPost ? (
              <ReadingView post={selectedPost} onClose={closePost} language={language} />
            ) : activeTab === 'INDEX' ? (
              <motion.div
                key="index"
                initial={{opacity: 0, y: 10}}
                animate={{opacity: 1, y: 0}}
                exit={{opacity: 0, y: -10}}
                transition={{duration: 0.35, ease: [0.22, 1, 0.36, 1]}}
                className="flex w-full flex-grow flex-col"
              >
                <div className="flex w-full flex-grow shrink-0 flex-col lg:flex-row">
                  <section className="relative flex min-h-[560px] w-full flex-col border-b border-line-dark bg-dot-grid p-8 lg:w-[60%] lg:border-b-0 lg:border-r lg:p-12 xl:min-h-[650px] xl:p-16">
                    <div className="mb-auto text-label text-ink/50">
                      <StableCopy language={language} copyKey="conceptLabel" />
                    </div>

                    <div className="mb-14 mt-12 flex flex-grow flex-col lg:mt-20">
                      <h1 className="break-keep font-display text-[clamp(3.25rem,13vw,5rem)] font-bold leading-[0.9] tracking-tighter text-ink lg:text-[clamp(4rem,6.4vw,6rem)]">
                        <StableLocalizedText
                          language={language}
                          zh={<>{UI_COPY.zh.heroLineOne}<br />{UI_COPY.zh.heroLineTwo}</>}
                          en={<>{UI_COPY.en.heroLineOne}<br />{UI_COPY.en.heroLineTwo}</>}
                        />
                      </h1>
                      <p className="mt-8 max-w-[42ch] text-body text-ink/80">
                        <StableCopy language={language} copyKey="heroDescription" />
                      </p>

                      <div className="mt-14 w-full max-w-[48ch] border-t border-line-dark pt-7">
                        <div className="mb-5 flex items-center justify-between font-data text-[0.65rem] uppercase tracking-widest text-ink/50">
                          <StableCopy language={language} copyKey="recentActivity" />
                          <span className="flex items-center gap-1.5 text-orbit-blue">
                            <span className="h-1.5 w-1.5 rounded-full bg-orbit-blue motion-safe:animate-pulse" />
                            <StableCopy language={language} copyKey="live" />
                          </span>
                        </div>
                        <div className="flex flex-col gap-3 font-data text-[0.7rem] text-ink/80">
                          {latestPost ? (
                            <button
                              type="button"
                              onClick={() => openPost(latestPost.slug)}
                              className="group flex gap-4 text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orbit-blue"
                            >
                              <span className="shrink-0 text-ink/40">{displayActivityDate(latestPost.date)}</span>
                              <span className="truncate transition-colors group-hover:text-orbit-blue">
                                <StableCopy language={language} copyKey="activityPublished" inline /> // {latestPost.title}
                              </span>
                            </button>
                          ) : null}
                          {latestConsumption ? (
                            <button
                              type="button"
                              onClick={() => selectTab('OBSERVE')}
                              className="group flex gap-4 text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orbit-blue"
                            >
                              <span className="shrink-0 text-ink/40">{displayActivityDate(latestConsumption.date)}</span>
                              <span className="truncate transition-colors group-hover:text-orbit-blue">
                                <StableCopy language={language} copyKey="activityObserved" inline /> // {latestConsumption.title}
                              </span>
                            </button>
                          ) : null}
                          <button
                            type="button"
                            onClick={() => selectTab('BUILD')}
                            className="group flex gap-4 text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orbit-blue"
                          >
                            <span className="shrink-0 text-ink/40">{displayActivityDate(latestDate)}</span>
                            <span className="truncate transition-colors group-hover:text-orbit-blue">
                              <StableCopy language={language} copyKey="activitySystem" inline /> //{' '}
                              <StableCopy language={language} copyKey="activitySystemTitle" inline />
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="mt-auto flex items-center gap-6 pt-6">
                      <button
                        type="button"
                        onClick={() => selectTab('THINK')}
                        className="rounded-full bg-ink px-8 py-3 font-display text-sm font-medium text-paper transition-colors duration-300 hover:bg-orbit-blue focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orbit-blue"
                      >
                        <StableCopy language={language} copyKey="readArchive" />
                      </button>
                      <div className="hidden font-data text-label text-ink/40 sm:block">
                        <StableCopy language={language} copyKey="systemStatus" inline />
                        {latestDate ? ` // ${displayDate(latestDate)}` : ''}
                      </div>
                    </div>
                  </section>

                  <div className="flex w-full flex-col lg:w-[40%]">
                    <button
                      type="button"
                      onClick={() => selectTab('OBSERVE')}
                      className="group relative flex min-h-[320px] flex-grow flex-col border-b border-line-dark bg-mist p-8 text-left transition-colors hover:bg-mist/60 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-orbit-blue"
                    >
                      <div className="z-10 text-label text-ink/60 transition-colors group-hover:text-orbit-blue">
                        <StableCopy language={language} copyKey="observeLabel" />
                      </div>
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
                      <div className="z-10 mt-auto flex items-end justify-between">
                        <div className="font-data text-[0.65rem] tracking-widest text-orbit-blue opacity-0 transition-opacity group-hover:opacity-100">
                          [ <StableCopy language={language} copyKey="viewObserve" inline /> ]
                        </div>
                        <div className="text-right font-data text-[0.55rem] leading-relaxed tracking-widest text-ink/50">
                          <StableCopy language={language} copyKey="focusTopics" />
                          <StableCopy language={language} copyKey="writingMode" />
                        </div>
                      </div>
                    </button>

                    <div className="flex min-h-[260px] flex-col sm:flex-row">
                      <button
                        type="button"
                        onClick={() => selectTab('THINK')}
                        className="group relative flex w-full flex-col border-b border-line-dark bg-dot-grid p-6 text-left transition-colors hover:bg-mist/30 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-orbit-blue sm:w-1/2 sm:border-b-0 sm:border-r xl:p-8"
                      >
                        <div className="mb-6 text-label text-ink/50 transition-colors group-hover:text-orbit-blue">
                          <StableCopy language={language} copyKey="thinkLabel" />
                        </div>
                        <h2 className="mb-2 font-display text-lg font-semibold leading-snug">
                          <StableCopy language={language} copyKey="thinkTitle" />
                        </h2>
                        <p className="text-sm leading-relaxed text-ink/70">
                          <StableCopy language={language} copyKey="thinkDescription" />
                        </p>
                        <div className="mt-auto text-right font-data text-[0.65rem] tracking-widest text-orbit-blue opacity-0 transition-opacity group-hover:opacity-100">
                          [ <StableCopy language={language} copyKey="viewThink" inline /> ]
                        </div>
                      </button>
                      <button
                        type="button"
                        onClick={() => selectTab('BUILD')}
                        className="group relative flex w-full flex-col bg-dot-grid p-6 text-left transition-colors hover:bg-mist/30 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-orbit-blue sm:w-1/2 xl:p-8"
                      >
                        <div className="mb-6 text-label text-ink/50 transition-colors group-hover:text-orbit-blue">
                          <StableCopy language={language} copyKey="buildLabel" />
                        </div>
                        <h2 className="mb-2 font-display text-lg font-semibold leading-snug">
                          <StableCopy language={language} copyKey="buildTitle" />
                        </h2>
                        <p className="text-sm leading-relaxed text-ink/70">
                          <StableCopy language={language} copyKey="buildDescription" />
                        </p>
                        <div className="mt-auto text-right font-data text-[0.65rem] tracking-widest text-orbit-blue opacity-0 transition-opacity group-hover:opacity-100">
                          [ <StableCopy language={language} copyKey="viewBuild" inline /> ]
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : activeTab === 'OBSERVE' ? (
              <motion.div
                key="observe"
                initial={{opacity: 0, y: 10}}
                animate={{opacity: 1, y: 0}}
                exit={{opacity: 0, y: -10}}
                transition={{duration: 0.35, ease: [0.22, 1, 0.36, 1]}}
                className="flex w-full flex-grow flex-col"
              >
                <div className="sticky top-[73px] z-10 flex items-center justify-between border-b border-line-dark bg-paper/95 p-8 backdrop-blur">
                  <h1 className="text-label text-ink/50">
                    <StableCopy language={language} copyKey="observeLabel" />
                  </h1>
                  <div className="hidden font-data text-label text-ink/40 sm:block">
                    <StableCopy language={language} copyKey="total" inline />:{' '}
                    {filteredConsumptions.length.toString().padStart(3, '0')}
                    {consumeTag ? ` / ${consumptions.length.toString().padStart(3, '0')}` : ''}
                  </div>
                </div>

                <div className="flex shrink-0 flex-col border-b border-line-dark bg-dot-grid p-8 md:flex-row lg:p-12 xl:p-16">
                  <div className="mb-6 w-full font-data text-label text-orbit-blue md:mb-0 md:w-1/4">
                    <StableCopy language={language} copyKey="readingPrinciple" />
                  </div>
                  <div className="w-full max-w-[65ch] md:w-3/4">
                    <h2 className="mb-6 font-display text-2xl font-semibold leading-snug md:text-3xl">
                      <StableCopy language={language} copyKey="readingTitle" />
                    </h2>
                    <p className="text-body leading-relaxed text-ink/70">
                      <StableCopy language={language} copyKey="readingDescription" />
                    </p>
                  </div>
                </div>

                <TagFilter
                  allLabel={copy.allTags}
                  ariaLabel={`${copy.filterByTag}: ${copy.thingsConsumeLabel}`}
                  label={copy.filterByTag}
                  onSelect={setConsumeTag}
                  selectedTag={consumeTag}
                  tags={consumptionTags}
                />

                <div className="flex flex-grow flex-col bg-paper pb-8">
                  <div className="hidden border-b border-line-dark/60 bg-mist/20 px-8 py-3 font-data text-[0.65rem] tracking-widest text-ink/40 md:flex lg:px-12">
                    <div className="w-28 shrink-0"><StableCopy language={language} copyKey="dateColumn" /></div>
                    <div className="w-48 shrink-0"><StableCopy language={language} copyKey="sourceColumn" /></div>
                    <div className="flex-grow"><StableCopy language={language} copyKey="titleColumn" /></div>
                    <div className="w-32 shrink-0 text-right"><StableCopy language={language} copyKey="actionColumn" /></div>
                  </div>
                  {filteredConsumptions.length > 0 ? (
                    filteredConsumptions.map((consumption) => (
                      <article key={consumption.slug} className="group border-b border-line-dark">
                        <div className="relative flex flex-col px-8 py-6 transition-colors hover:bg-mist/40 md:flex-row md:items-start lg:px-12">
                          <div className="absolute inset-y-0 left-0 w-1 origin-top scale-y-0 bg-orbit-blue transition-transform group-hover:scale-y-100" />
                          <time dateTime={consumption.date} className="mb-2 w-full shrink-0 font-data text-[0.65rem] text-ink/50 md:mb-0 md:w-28">
                            {displayDate(consumption.date)}
                          </time>
                          <div className="mb-3 w-full shrink-0 pr-6 font-data text-[0.65rem] text-orbit-blue md:mb-0 md:w-48">
                            {consumption.source}
                          </div>
                          <div className="min-w-0 flex-grow pr-6">
                            <h2 className="font-display text-[1.1rem] font-semibold transition-colors group-hover:text-orbit-blue">
                              {consumption.title}
                            </h2>
                            <p className="mt-2 text-sm leading-relaxed text-ink/65">{consumption.excerpt}</p>
                            <TagChipList
                              ariaLabel={`${copy.filterByTag}: ${consumption.title}`}
                              onSelect={setConsumeTag}
                              selectedTag={consumeTag}
                              tags={consumption.tags}
                            />
                          </div>
                          <div className="mt-5 flex w-full shrink-0 justify-start font-data text-label text-ink/40 md:mt-0 md:w-32 md:justify-end">
                            {consumption.url ? (
                              <a
                                href={consumption.url}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center transition-colors hover:text-orbit-blue focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orbit-blue"
                              >
                                [ <StableCopy language={language} copyKey="viewSource" inline /> ]
                                <ArrowUpRight className="ml-2" size={14} aria-hidden="true" />
                              </a>
                            ) : (
                              <StableCopy language={language} copyKey="archiveOnly" />
                            )}
                          </div>
                        </div>
                      </article>
                    ))
                  ) : (
                    <p className="p-8 text-ink/60 lg:p-12">
                      <StableCopy language={language} copyKey={consumeTag ? 'noConsumptionsForTag' : 'noConsumptions'} />
                    </p>
                  )}
                </div>
              </motion.div>
            ) : activeTab === 'THINK' ? (
              <motion.div
                key="think"
                initial={{opacity: 0, y: 10}}
                animate={{opacity: 1, y: 0}}
                exit={{opacity: 0, y: -10}}
                transition={{duration: 0.35, ease: [0.22, 1, 0.36, 1]}}
                className="flex w-full flex-grow flex-col"
              >
                <div className="sticky top-[73px] z-10 flex items-center justify-between border-b border-line-dark bg-paper/95 p-8 backdrop-blur">
                  <h1 className="text-label text-ink/50">
                    <StableCopy language={language} copyKey="thinkLabel" />
                  </h1>
                  <div className="hidden font-data text-label text-ink/40 sm:block">
                    <StableCopy language={language} copyKey="total" inline />:{' '}
                    {filteredPosts.length.toString().padStart(3, '0')}
                    {writeTag ? ` / ${posts.length.toString().padStart(3, '0')}` : ''}
                  </div>
                </div>

                <TagFilter
                  allLabel={copy.allTags}
                  ariaLabel={`${copy.filterByTag}: ${copy.thingsWriteLabel}`}
                  label={copy.filterByTag}
                  onSelect={setWriteTag}
                  selectedTag={writeTag}
                  tags={postTags}
                />

                <div className="flex flex-grow flex-col bg-paper">
                  {filteredPosts.length > 0 ? (
                    filteredPosts.map((post) => (
                      <article key={post.slug} className="border-b border-line-dark">
                        <div className="group flex w-full flex-col p-8 text-left transition-colors duration-300 hover:bg-mist/30 md:flex-row lg:p-12">
                          <div className="mb-8 flex w-full shrink-0 flex-col md:mb-0 md:w-1/4 md:pr-8">
                            <time dateTime={post.date} className="font-data text-[0.65rem] text-ink/50">
                              {displayDate(post.date)}
                            </time>
                            <div className="mt-2 font-data text-[0.75rem] text-orbit-blue">{post.category}</div>
                            <TagChipList
                              ariaLabel={`${copy.filterByTag}: ${post.title}`}
                              onSelect={setWriteTag}
                              selectedTag={writeTag}
                              tags={post.tags}
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => openPost(post.slug)}
                            className="flex w-full cursor-pointer flex-col justify-between text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orbit-blue md:w-3/4"
                            aria-label={`${copy.readPostAria}: ${post.title}`}
                          >
                            <div>
                              <h2 className="mb-4 font-display text-[1.5rem] font-semibold transition-colors duration-300 group-hover:text-orbit-blue md:text-[1.75rem]">
                                {post.title}
                              </h2>
                              <p className="max-w-[65ch] text-body leading-relaxed text-ink/70">{post.excerpt}</p>
                            </div>
                            <div className="mt-8 flex items-end justify-between font-data text-label text-ink/30 transition-colors duration-300 group-hover:text-orbit-blue">
                              <span>
                                {post.readingMinutes}{' '}
                                <StableCopy language={language} copyKey="minuteRead" inline />
                              </span>
                              <span>[ <StableCopy language={language} copyKey="readPost" inline /> ]</span>
                            </div>
                          </button>
                        </div>
                      </article>
                    ))
                  ) : (
                    <p className="p-8 text-ink/60 lg:p-12">
                      <StableCopy language={language} copyKey={writeTag ? 'noPostsForTag' : 'noPosts'} />
                    </p>
                  )}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="build"
                initial={{opacity: 0, y: 10}}
                animate={{opacity: 1, y: 0}}
                exit={{opacity: 0, y: -10}}
                transition={{duration: 0.35, ease: [0.22, 1, 0.36, 1]}}
                className="flex w-full flex-grow flex-col"
              >
                <div className="sticky top-[73px] z-10 flex items-center justify-between border-b border-line-dark bg-paper/95 p-8 backdrop-blur">
                  <h1 className="text-label text-ink/50">
                    <StableCopy language={language} copyKey="buildLabel" />
                  </h1>
                  <div className="hidden font-data text-label text-ink/40 sm:block">
                    <StableCopy language={language} copyKey="total" inline />: 001
                  </div>
                </div>

                <div className="grid flex-grow grid-cols-1 border-b border-line-dark bg-paper xl:grid-cols-2">
                  <a
                    href={PROJECT_URL}
                    target="_blank"
                    rel="noreferrer"
                    className="group relative flex min-h-[420px] flex-col overflow-hidden border-line-dark bg-paper p-8 transition-colors hover:bg-mist/30 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-orbit-blue lg:p-12 xl:border-r"
                  >
                    <div className="pointer-events-none absolute inset-0 bg-dot-grid opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                    <div className="relative z-10 flex h-full flex-col">
                      <div className="mb-12 flex items-start justify-between">
                        <div className="rounded-full border border-line-dark px-3 py-1 font-data text-[0.65rem] uppercase tracking-widest text-ink/60 transition-colors group-hover:border-orbit-blue/30 group-hover:text-orbit-blue">
                          <StableCopy language={language} copyKey="projectCategory" />
                        </div>
                        <div className="flex h-8 w-8 items-center justify-center rounded-full border border-line-dark transition-all duration-300 group-hover:border-orbit-blue group-hover:bg-orbit-blue group-hover:text-white">
                          <ArrowUpRight size={14} aria-hidden="true" />
                        </div>
                      </div>

                      <h2 className="mb-4 max-w-[15ch] font-display text-[2rem] font-bold leading-tight tracking-tight transition-colors group-hover:text-orbit-blue">
                        <StableCopy language={language} copyKey="projectTitle" />
                      </h2>
                      <p className="mb-12 max-w-[42ch] flex-grow text-body leading-relaxed text-ink/70">
                        <StableCopy language={language} copyKey="projectDescription" />
                      </p>

                      <div className="mt-auto flex items-center justify-between border-t border-line-dark/50 pt-6 font-data text-[0.65rem] uppercase tracking-widest text-ink/40">
                        <span className="flex items-center gap-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-orbit-blue opacity-60 transition-opacity group-hover:opacity-100 motion-safe:group-hover:animate-pulse" />
                          <StableCopy language={language} copyKey="projectStatus" inline />: LIVE
                        </span>
                        <span>PUBLIC</span>
                      </div>
                    </div>
                  </a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        <footer className="relative z-20 flex shrink-0 flex-col items-start justify-between gap-6 border-t border-line-dark bg-paper px-8 py-6 lg:flex-row lg:items-center">
          <div className="flex gap-12 sm:gap-20">
            <div>
              <div className="mb-1 font-data text-[0.55rem] uppercase tracking-widest text-ink/50">
                <StableCopy language={language} copyKey="archiveState" />
              </div>
              <div className="font-display text-sm font-semibold tracking-tight">
                {posts.length.toString().padStart(3, '0')}{' '}
                <StableCopy language={language} copyKey="postsIndexed" inline />
              </div>
            </div>
            <div className="hidden sm:block">
              <div className="mb-2 font-data text-[0.55rem] uppercase tracking-widest text-ink/50">
                <StableCopy language={language} copyKey="signalStrength" />
              </div>
              <div className="flex h-3 items-end gap-1" aria-hidden="true">
                <div className="h-[40%] w-4 rounded-sm bg-orbit-blue" />
                <div className="h-[70%] w-4 rounded-sm bg-orbit-blue" />
                <div className="h-full w-4 rounded-sm bg-orbit-blue" />
                <div className="h-[30%] w-4 rounded-sm bg-line-dark" />
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 font-data text-[0.65rem] font-medium tracking-widest">
            <a
              href="https://x.com/AsherZhao12"
              target="_blank"
              rel="noreferrer"
              aria-label={copy.xProfileLabel}
              className="border-b border-ink pb-1 transition-colors hover:border-orbit-blue hover:text-orbit-blue focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orbit-blue"
            >
              X / @ASHERZHAO12
            </a>
            <a
              href="https://github.com/asherzj"
              target="_blank"
              rel="noreferrer"
              aria-label={copy.githubProfileLabel}
              className="border-b border-ink pb-1 transition-colors hover:border-orbit-blue hover:text-orbit-blue focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orbit-blue"
            >
              GITHUB / ASHERZJ
            </a>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden font-data text-[0.65rem] font-medium tracking-widest sm:block">
              <StableCopy language={language} copyKey="builtFromMarkdown" />
            </div>
            <div className="h-px w-8 bg-ink sm:w-12" />
          </div>
        </footer>
      </div>
    </div>
  );
}
