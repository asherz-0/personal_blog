type Tagged = {
  tags: readonly string[];
};

export type TagSummary = {
  label: string;
  count: number;
};

function tagKey(tag: string): string {
  return tag.toLocaleLowerCase('en-US');
}

export function getTagSummaries(items: readonly Tagged[]): readonly TagSummary[] {
  const summaries = new Map<string, TagSummary>();

  for (const item of items) {
    for (const tag of item.tags) {
      const key = tagKey(tag);
      const current = summaries.get(key);
      if (current) {
        current.count += 1;
      } else {
        summaries.set(key, {label: tag, count: 1});
      }
    }
  }

  return [...summaries.values()];
}

export function filterByTag<T extends Tagged>(
  items: readonly T[],
  selectedTag: string | null,
): readonly T[] {
  if (!selectedTag) return items;

  const selectedKey = tagKey(selectedTag);
  return items.filter((item) => item.tags.some((tag) => tagKey(tag) === selectedKey));
}
