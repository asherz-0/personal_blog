import {parsePost, type Post} from './post-parser';

const markdownModules = import.meta.glob('/posts/*.md', {
  eager: true,
  import: 'default',
  query: '?raw',
}) as Record<string, string>;

const parsedPosts = Object.entries(markdownModules).map(([sourcePath, raw]) =>
  parsePost(sourcePath, raw),
);

const duplicateSlug = parsedPosts.find(
  (post, index) => parsedPosts.findIndex((candidate) => candidate.slug === post.slug) !== index,
);
if (duplicateSlug) {
  throw new Error(`Duplicate post slug: ${duplicateSlug.slug}`);
}

export const posts: readonly Post[] = parsedPosts
  .filter((post) => !post.draft)
  .sort((left, right) => right.date.localeCompare(left.date));

export function getPostBySlug(slug: string): Post | undefined {
  return posts.find((post) => post.slug === slug);
}

export type {Post};
