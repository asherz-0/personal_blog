import assert from 'node:assert/strict';
import test from 'node:test';
import {parseConsumption} from '../src/lib/consumption-parser.ts';

const validConsumption = `---
title: "一份值得反复阅读的资料"
date: "2026-08-16"
source: "ESSAY / EXAMPLE.COM"
url: "https://example.com/essay"
excerpt: "它改变了我理解反馈系统的方式。"
tags:
  - 系统
  - 反馈
draft: false
---
`;

test('parses a tagged consumption with an optional public URL', () => {
  const consumption = parseConsumption('/consumes/feedback-systems.md', validConsumption);

  assert.equal(consumption.slug, 'feedback-systems');
  assert.equal(consumption.source, 'ESSAY / EXAMPLE.COM');
  assert.equal(consumption.url, 'https://example.com/essay');
  assert.deepEqual(consumption.tags, ['系统', '反馈']);
});

test('allows a consumption without an external URL', () => {
  const consumption = parseConsumption(
    '/consumes/offline-book.md',
    validConsumption.replace('url: "https://example.com/essay"\n', ''),
  );

  assert.equal(consumption.url, undefined);
});

test('rejects non-http consumption URLs', () => {
  assert.throws(
    () => parseConsumption(
      '/consumes/feedback-systems.md',
      validConsumption.replace('https://example.com/essay', 'javascript:alert(1)'),
    ),
    /"url" must use http or https/,
  );
});
