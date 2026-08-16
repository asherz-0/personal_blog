import type {TagSummary} from '../lib/tags';

interface TagFilterProps {
  allLabel: string;
  ariaLabel: string;
  label: string;
  onSelect: (tag: string | null) => void;
  selectedTag: string | null;
  tags: readonly TagSummary[];
}

interface TagChipListProps {
  ariaLabel: string;
  onSelect: (tag: string) => void;
  selectedTag: string | null;
  tags: readonly string[];
}

function filterButtonClass(active: boolean): string {
  return [
    'rounded-full border px-3 py-1 font-data text-[0.62rem] tracking-[0.06em]',
    'transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orbit-blue',
    active
      ? 'border-orbit-blue bg-orbit-blue text-white'
      : 'border-line-dark bg-paper text-ink/65 hover:border-orbit-blue hover:text-orbit-blue',
  ].join(' ');
}

function isSameTag(left: string | null, right: string): boolean {
  return left?.toLocaleLowerCase('en-US') === right.toLocaleLowerCase('en-US');
}

export function TagFilter({
  allLabel,
  ariaLabel,
  label,
  onSelect,
  selectedTag,
  tags,
}: TagFilterProps) {
  if (tags.length === 0) return null;

  return (
    <div className="flex flex-col gap-4 border-b border-line-dark bg-mist/30 px-8 py-5 sm:flex-row sm:items-center">
      <div className="shrink-0 font-data text-label text-ink/45">{label}</div>
      <div className="flex flex-wrap gap-2" role="group" aria-label={ariaLabel}>
        <button
          type="button"
          className={filterButtonClass(selectedTag === null)}
          aria-pressed={selectedTag === null}
          onClick={() => onSelect(null)}
        >
          {allLabel}
        </button>
        {tags.map((tag) => (
          <button
            key={tag.label}
            type="button"
            className={filterButtonClass(isSameTag(selectedTag, tag.label))}
            aria-pressed={isSameTag(selectedTag, tag.label)}
            onClick={() => onSelect(tag.label)}
          >
            {tag.label} <span className="opacity-55">{tag.count.toString().padStart(2, '0')}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export function TagChipList({
  ariaLabel,
  onSelect,
  selectedTag,
  tags,
}: TagChipListProps) {
  return (
    <div className="mt-4 flex flex-wrap gap-1.5" role="group" aria-label={ariaLabel}>
      {tags.map((tag) => (
        <button
          key={tag}
          type="button"
          className={filterButtonClass(isSameTag(selectedTag, tag))}
          aria-pressed={isSameTag(selectedTag, tag)}
          onClick={() => onSelect(tag)}
        >
          #{tag}
        </button>
      ))}
    </div>
  );
}
