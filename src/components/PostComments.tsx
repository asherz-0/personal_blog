import Giscus from '@giscus/react';
import type {Language} from '../lib/i18n';
import {StableCopy} from './StableCopy';

const GISCUS_REPOSITORY = 'asherzj/asherzj.github.io';
const GISCUS_REPOSITORY_ID = 'R_kgDOT5YwVw';
const GISCUS_CATEGORY = 'Comments';
const GISCUS_CATEGORY_ID = 'DIC_kwDOT5YwV84DDdIG';
const GISCUS_THEME_VERSION = '2026-08-16';

interface PostCommentsProps {
  language: Language;
  slug: string;
}

function getGiscusTheme(): string {
  if (window.location.protocol !== 'https:') return 'noborder_light';

  const themeUrl = new URL(
    `${import.meta.env.BASE_URL}giscus-theme.css`,
    window.location.origin,
  );
  themeUrl.searchParams.set('v', GISCUS_THEME_VERSION);
  return themeUrl.toString();
}

export function PostComments({language, slug}: PostCommentsProps) {
  const titleId = `comments-title-${slug}`;

  return (
    <section className="mt-16 border-t border-line-dark md:mt-24" aria-labelledby={titleId}>
      <header className="border-b border-line-dark py-8">
        <div className="font-data text-label text-orbit-blue">
          <StableCopy language={language} copyKey="commentsLabel" />
        </div>
        <h2 id={titleId} className="mt-4 font-display text-2xl font-semibold tracking-tight">
          <StableCopy language={language} copyKey="commentsTitle" />
        </h2>
      </header>

      <div className="bg-dot-grid p-3 sm:p-6">
        <div className="border border-line-dark bg-paper p-4 sm:p-6">
          <Giscus
            key={`${slug}-${language}`}
            id={`comments-${slug}`}
            repo={GISCUS_REPOSITORY}
            repoId={GISCUS_REPOSITORY_ID}
            category={GISCUS_CATEGORY}
            categoryId={GISCUS_CATEGORY_ID}
            mapping="specific"
            term={`post:${slug}`}
            strict="1"
            reactionsEnabled="1"
            emitMetadata="0"
            inputPosition="top"
            theme={getGiscusTheme()}
            lang={language === 'zh' ? 'zh-CN' : 'en'}
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
}
