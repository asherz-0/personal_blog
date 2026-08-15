import assert from 'node:assert/strict';
import test from 'node:test';
import {parsePost} from '../src/lib/post-parser.ts';

const validPost = `---
title: "测试博文"
date: "2026-08-16"
category: "engineering"
excerpt: "用于验证内容模型。"
tags:
  - 系统
  - AI
draft: false
---

# 正文

这是正文。
`;

test('parses and normalizes a valid post', () => {
  const post = parsePost('/posts/test-post.md', validPost);

  assert.equal(post.slug, 'test-post');
  assert.equal(post.category, 'ENGINEERING');
  assert.deepEqual(post.tags, ['系统', 'AI']);
  assert.equal(post.draft, false);
  assert.equal(post.readingMinutes, 1);
});

test('normalizes duplicate tags without changing their display labels', () => {
  const post = parsePost(
    '/posts/test-post.md',
    validPost.replace('  - AI', '  - AI\n  - 系统\n  - ai'),
  );

  assert.deepEqual(post.tags, ['系统', 'AI']);
});

test('rejects filenames that cannot become stable slugs', () => {
  assert.throws(
    () => parsePost('/posts/Test Post.md', validPost),
    /lowercase kebab-case slug/,
  );
});

test('rejects impossible publication dates', () => {
  assert.throws(
    () => parsePost('/posts/test-post.md', validPost.replace('2026-08-16', '2026-02-30')),
    /not a valid calendar date/,
  );
});

test('requires draft to be a boolean', () => {
  assert.throws(
    () => parsePost('/posts/test-post.md', validPost.replace('draft: false', 'draft: "false"')),
    /must be true or false/,
  );
});

test('requires at least one non-empty tag', () => {
  assert.throws(
    () => parsePost('/posts/test-post.md', validPost.replace('tags:\n  - 系统\n  - AI', 'tags: []')),
    /"tags" must contain at least one tag/,
  );
});
