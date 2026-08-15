import {parse as parseYaml} from 'yaml';

export type TaggedMarkdown = {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  tags: readonly string[];
  content: string;
  draft: boolean;
};

type Frontmatter = Record<string, unknown>;

type FieldReader = {
  requiredString(field: string): string;
  optionalString(field: string): string | undefined;
};

type ParseOptions = {
  body?: 'required' | 'optional';
};

const FRONTMATTER_PATTERN = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/;
const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function createFieldReader(frontmatter: Frontmatter, sourcePath: string): FieldReader {
  function readString(field: string, optional: boolean): string | undefined {
    const value = frontmatter[field];
    if (optional && value === undefined) return undefined;

    if (typeof value !== 'string' || value.trim() === '') {
      const qualifier = optional ? 'optional' : 'frontmatter';
      throw new Error(
        `${sourcePath}: ${qualifier} field "${field}" must be a non-empty string.`,
      );
    }

    return value.trim();
  }

  return {
    requiredString(field) {
      return readString(field, false) as string;
    },
    optionalString(field) {
      return readString(field, true);
    },
  };
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

function parseTags(value: unknown, sourcePath: string): readonly string[] {
  if (!Array.isArray(value) || value.length === 0) {
    throw new Error(`${sourcePath}: "tags" must contain at least one tag.`);
  }

  const tags = new Map<string, string>();
  for (const rawTag of value) {
    if (typeof rawTag !== 'string' || rawTag.trim() === '') {
      throw new Error(`${sourcePath}: every item in "tags" must be a non-empty string.`);
    }

    const tag = rawTag.trim().replace(/\s+/g, ' ');
    const key = tag.toLocaleLowerCase('en-US');
    if (!tags.has(key)) tags.set(key, tag);
  }

  return [...tags.values()];
}

export function parseTaggedMarkdown<Extra extends object>(
  sourcePath: string,
  raw: string,
  parseExtra: (fields: FieldReader) => Extra,
  options: ParseOptions = {},
): TaggedMarkdown & Extra {
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

  const fields = createFieldReader(frontmatter, sourcePath);
  const date = fields.requiredString('date');
  assertValidDate(date, sourcePath);

  if (frontmatter.draft !== undefined && typeof frontmatter.draft !== 'boolean') {
    throw new Error(`${sourcePath}: optional field "draft" must be true or false.`);
  }

  const content = match[2].trim();
  if (options.body !== 'optional' && !content) {
    throw new Error(`${sourcePath}: content body cannot be empty.`);
  }

  return {
    slug,
    title: fields.requiredString('title'),
    date,
    excerpt: fields.requiredString('excerpt'),
    tags: parseTags(frontmatter.tags, sourcePath),
    content,
    draft: frontmatter.draft ?? false,
    ...parseExtra(fields),
  };
}
