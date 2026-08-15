import {parse as parseYaml} from 'yaml';

export type Post = {
  slug: string;
  title: string;
  date: string;
  category: string;
  excerpt: string;
  content: string;
  draft: boolean;
  readingMinutes: number;
};

type Frontmatter = Record<string, unknown>;

const FRONTMATTER_PATTERN = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/;
const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function requiredString(
  frontmatter: Frontmatter,
  field: string,
  sourcePath: string,
): string {
  const value = frontmatter[field];

  if (typeof value !== 'string' || value.trim() === '') {
    throw new Error(`${sourcePath}: frontmatter field "${field}" must be a non-empty string.`);
  }

  return value.trim();
}

function assertValidDate(date: string, sourcePath: string): void {
  if (!ISO_DATE_PATTERN.test(date)) {
    throw new Error(`${sourcePath}: "date" must use YYYY-MM-DD.`);
  }

  const parsed = new Date(`${date}T00:00:00Z`);
  if (Number.isNaN(parsed.valueOf()) || parsed.toISOString().slice(0, 10) !== date) {
    throw new Error(`${sourcePath}: "${date}" is not a valid calendar date.`);
  }
}

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
  const match = raw.match(FRONTMATTER_PATTERN);
  if (!match) {
    throw new Error(`${sourcePath}: expected YAML frontmatter wrapped in --- lines.`);
  }

  const fileName = sourcePath.split('/').at(-1) ?? '';
  const slug = fileName.replace(/\.md$/, '');
  if (!SLUG_PATTERN.test(slug)) {
    throw new Error(
      `${sourcePath}: filename must be a lowercase kebab-case slug such as "my-first-post.md".`,
    );
  }

  let frontmatter: Frontmatter;
  try {
    const parsed = parseYaml(match[1]);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      throw new Error('frontmatter must be a mapping');
    }
    frontmatter = parsed as Frontmatter;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`${sourcePath}: invalid YAML frontmatter (${message}).`);
  }

  const date = requiredString(frontmatter, 'date', sourcePath);
  assertValidDate(date, sourcePath);

  if (frontmatter.draft !== undefined && typeof frontmatter.draft !== 'boolean') {
    throw new Error(`${sourcePath}: optional field "draft" must be true or false.`);
  }

  const content = match[2].trim();
  if (!content) {
    throw new Error(`${sourcePath}: post body cannot be empty.`);
  }

  return {
    slug,
    title: requiredString(frontmatter, 'title', sourcePath),
    date,
    category: requiredString(frontmatter, 'category', sourcePath).toUpperCase(),
    excerpt: requiredString(frontmatter, 'excerpt', sourcePath),
    content,
    draft: frontmatter.draft ?? false,
    readingMinutes: readingMinutes(content),
  };
}
