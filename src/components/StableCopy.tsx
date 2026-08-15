import type {ReactNode} from 'react';
import {UI_COPY, type Language, type UiCopy} from '../lib/i18n';

interface StableLocalizedTextProps {
  en: ReactNode;
  inline?: boolean;
  language: Language;
  zh: ReactNode;
}

export function StableLocalizedText({
  en,
  inline = false,
  language,
  zh,
}: StableLocalizedTextProps) {
  return (
    <span className={inline ? 'inline-grid' : 'grid'}>
      <span
        className={`col-start-1 row-start-1 ${language === 'zh' ? '' : 'invisible'}`}
        aria-hidden={language !== 'zh'}
        lang={UI_COPY.zh.htmlLang}
      >
        {zh}
      </span>
      <span
        className={`col-start-1 row-start-1 ${language === 'en' ? '' : 'invisible'}`}
        aria-hidden={language !== 'en'}
        lang={UI_COPY.en.htmlLang}
      >
        {en}
      </span>
    </span>
  );
}

interface StableCopyProps {
  copyKey: keyof UiCopy;
  inline?: boolean;
  language: Language;
}

export function StableCopy({copyKey, inline = false, language}: StableCopyProps) {
  return (
    <StableLocalizedText
      en={UI_COPY.en[copyKey]}
      inline={inline}
      language={language}
      zh={UI_COPY.zh[copyKey]}
    />
  );
}
