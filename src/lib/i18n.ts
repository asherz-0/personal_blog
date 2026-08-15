export type Language = 'zh' | 'en';

const LANGUAGE_STORAGE_KEY = 'personal-archive-language';

export const UI_COPY = {
  zh: {
    htmlLang: 'zh-CN',
    siteTitle: '赵健的博客',
    brandTitle: '赵健的博客',
    siteDescription: '赵健关于技术、产品、系统思考与个人成长的长期写作。',
    returnHome: '返回首页',
    primaryNavigation: '主要导航',
    journal: '首页',
    archive: '文章',
    connect: 'GitHub',
    languageButton: 'EN',
    switchLanguage: '切换为英文',
    returnToArchive: '返回文章列表',
    readingMode: '阅读模式',
    minuteUnit: '分钟',
    endOfPost: '文章结束',
    close: '关闭',
    conceptLabel: '00 // 关于这里',
    heroLineOne: '记录实践',
    heroLineTwo: '沉淀判断',
    heroDescription: '我是赵健。这里整理我在技术实践、产品观察和个人成长中的思考，也记录那些尚未有标准答案的问题。',
    readArchive: '浏览文章',
    systemStatus: '最近更新',
    observeLabel: '01 // 观察',
    focusTopics: '主题：技术与产品',
    writingMode: '方式：长期写作',
    connectLabel: '02 // 写作',
    connectTitle: '把经验写成可复用的判断。',
    connectDescription: '从具体问题出发，写清背景、取舍与结论。',
    buildLabel: '03 // 实践',
    buildTitle: '让想法回到真实世界。',
    buildDescription: '用项目验证观点，再把结果写回来。',
    postArchiveLabel: '04 // 最新文章',
    total: '共',
    readPostAria: '阅读',
    minuteRead: '分钟阅读',
    readPost: '阅读博文',
    noPosts: '文章正在路上。',
    archiveState: '已发布',
    postsIndexed: '篇文章',
    signalStrength: '持续更新',
    builtFromMarkdown: '独立写作 · 持续更新',
  },
  en: {
    htmlLang: 'en',
    siteTitle: "Asher's Blog",
    brandTitle: "ASHER'S BLOG",
    siteDescription: "Asher's long-form writing on technology, products, systems thinking, and personal growth.",
    returnHome: 'Return home',
    primaryNavigation: 'Primary navigation',
    journal: 'Home',
    archive: 'Writing',
    connect: 'GitHub',
    languageButton: '中文',
    switchLanguage: 'Switch to Chinese',
    returnToArchive: 'Back to writing',
    readingMode: 'Reading mode',
    minuteUnit: 'min',
    endOfPost: 'End of post',
    close: 'Close',
    conceptLabel: '00 // ABOUT',
    heroLineOne: 'Document the work',
    heroLineTwo: 'Refine the thinking',
    heroDescription: "I'm Asher. I write about lessons from building technology, observing products, and growing with intention—including questions that still resist easy answers.",
    readArchive: 'Browse writing',
    systemStatus: 'Latest update',
    observeLabel: '01 // OBSERVE',
    focusTopics: 'TOPICS: TECH & PRODUCT',
    writingMode: 'MODE: LONG-FORM NOTES',
    connectLabel: '02 // WRITE',
    connectTitle: 'Turn experience into reusable judgment.',
    connectDescription: 'Start with real problems. Make the context, trade-offs, and conclusions clear.',
    buildLabel: '03 // PRACTICE',
    buildTitle: 'Bring ideas back into the real world.',
    buildDescription: 'Test a point of view through projects, then write back what changed.',
    postArchiveLabel: '04 // LATEST WRITING',
    total: 'Total',
    readPostAria: 'Read',
    minuteRead: 'min read',
    readPost: 'Read post',
    noPosts: 'New writing is on the way.',
    archiveState: 'Published',
    postsIndexed: 'posts',
    signalStrength: 'Updated over time',
    builtFromMarkdown: 'Independent writing · updated over time',
  },
} as const;

export type UiCopy = (typeof UI_COPY)[Language];

export function getInitialLanguage(): Language {
  try {
    const storedLanguage = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
    return storedLanguage === 'en' || storedLanguage === 'zh' ? storedLanguage : 'zh';
  } catch {
    return 'zh';
  }
}

export function persistLanguage(language: Language): void {
  try {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  } catch {
    // The language switch remains usable when storage is unavailable.
  }
}
