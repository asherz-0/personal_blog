import Giscus from '@giscus/react';
import type {Language} from '../lib/i18n';
import {StableCopy} from './StableCopy';

const GISCUS_REPOSITORY = 'asherzj/asherzj.github.io';
const GISCUS_REPOSITORY_ID = 'R_kgDOT5YwVw';
const GISCUS_CATEGORY = 'Comments';
const GISCUS_CATEGORY_ID = 'DIC_kwDOT5YwV84DDdIG';

interface PostCommentsProps {
  language: Language;
  slug: string;
}

export function PostComments({language, slug}: PostCommentsProps) {
  const titleId = `comments-title-${slug}`;

  return (
    <section className="mt-16 border-t border-line-dark pt-8 md:mt-24" aria-labelledby={titleId}>
      <header className="mb-10">
        <div className="font-data text-label text-orbit-blue">
          <StableCopy language={language} copyKey="commentsLabel" />
        </div>
        <h2 id={titleId} className="mt-4 font-display text-2xl font-semibold tracking-tight">
          <StableCopy language={language} copyKey="commentsTitle" />
        </h2>
        <p className="mt-3 max-w-[58ch] text-sm leading-relaxed text-ink/60">
          <StableCopy language={language} copyKey="commentsDescription" />
        </p>
      </header>

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
        theme="noborder_light"
        lang={language === 'zh' ? 'zh-CN' : 'en'}
        loading="lazy"
      />
    </section>
  );
}
