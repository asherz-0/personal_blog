const POST_QUERY_KEY = 'post';
const GISCUS_QUERY_KEY = 'giscus';
const PENDING_POST_STORAGE_KEY = 'personal-archive-pending-post';

function getHashSlug(url: URL): string | null {
  const match = url.hash.match(/^#\/posts\/([^/?#]+)$/);
  if (!match) return null;

  try {
    return decodeURIComponent(match[1]);
  } catch {
    return null;
  }
}

export function getPostSlug(url: URL, pendingSlug: string | null = null): string | null {
  const hashSlug = getHashSlug(url);
  if (hashSlug) return hashSlug;

  const querySlug = url.searchParams.get(POST_QUERY_KEY)?.trim();
  if (querySlug) return querySlug;

  return url.searchParams.has(GISCUS_QUERY_KEY) && pendingSlug ? pendingSlug : null;
}

export function createPostUrl(url: URL, slug: string): URL {
  const nextUrl = new URL(url);
  nextUrl.searchParams.set(POST_QUERY_KEY, slug);
  nextUrl.hash = `/posts/${encodeURIComponent(slug)}`;
  return nextUrl;
}

export function createHomeUrl(url: URL): URL {
  const nextUrl = new URL(url);
  nextUrl.searchParams.delete(POST_QUERY_KEY);
  nextUrl.searchParams.delete(GISCUS_QUERY_KEY);
  nextUrl.hash = '';
  return nextUrl;
}

export function getPendingPostSlug(): string | null {
  try {
    return window.sessionStorage.getItem(PENDING_POST_STORAGE_KEY);
  } catch {
    return null;
  }
}

export function persistPendingPostSlug(slug: string | null): void {
  try {
    if (slug) {
      window.sessionStorage.setItem(PENDING_POST_STORAGE_KEY, slug);
    } else {
      window.sessionStorage.removeItem(PENDING_POST_STORAGE_KEY);
    }
  } catch {
    // OAuth recovery still works through the query-based route when storage is unavailable.
  }
}
