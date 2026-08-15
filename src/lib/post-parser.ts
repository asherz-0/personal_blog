import {parseTaggedMarkdown} from './content-parser';

export type Post = {
  slug: string;
  title: string;
  date: string;
  category: string;
  excerpt: string;
  tags: readonly string[];
  content: string;
  draft: boolean;
  readingMinutes: number;
};

function readingMinutes(markdown: string): number {
  const prose = markdown
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]*`/g, ' ')
    .replace(/!\[[^\]]*]\([^)]*\)/g, ' ')
    .replace(/\[[^\]]*]\([^)]*\)/g, ' ')
    .replace(/[#>*_~|-]/g, ' ');
  const hanCharacters = prose.match(/[\u3400-\u9fff]/g)?.length ?? 0;
  const wordLikeTokens = prose.match(/[A-Za-z0-9]+(?:['’-][A-Za-z0-9]+)*/g)?.length ?? 0;

  return Math.max(1, Math.ceil((hanCharacters + wordLikeTokens) / 300));
}

export function parsePost(sourcePath: string, raw: string): Post {
  const parsed = parseTaggedMarkdown(sourcePath, raw, (fields) => ({
    category: fields.requiredString('category').toUpperCase(),
  }));

  return {
    ...parsed,
    readingMinutes: readingMinutes(parsed.content),
  };
}
