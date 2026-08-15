import assert from 'node:assert/strict';
import test from 'node:test';
import {filterByTag, getTagSummaries} from '../src/lib/tags.ts';

const items = [
  {id: 'newest', tags: ['AI', '系统']},
  {id: 'middle', tags: ['ai', '产品']},
  {id: 'oldest', tags: ['系统']},
];

test('builds case-insensitive tag summaries in first-seen order', () => {
  assert.deepEqual(getTagSummaries(items), [
    {label: 'AI', count: 2},
    {label: '系统', count: 2},
    {label: '产品', count: 1},
  ]);
});

test('filters one collection by tag without mutating its order', () => {
  assert.deepEqual(
    filterByTag(items, 'AI').map((item) => item.id),
    ['newest', 'middle'],
  );
  assert.equal(filterByTag(items, null), items);
});
