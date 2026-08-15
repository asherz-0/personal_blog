import assert from 'node:assert/strict';
import test from 'node:test';
import {createHomeUrl, createPostUrl, getPostSlug} from '../src/lib/post-route.ts';

const postSlug = 'welcome-to-the-archive';

test('keeps a query-based post route when giscus clears the hash after login', () => {
  const articleUrl = createPostUrl(new URL('https://asherzj.github.io/'), postSlug);
  assert.equal(articleUrl.searchParams.get('post'), postSlug);

  articleUrl.searchParams.set('giscus', 'test-session');
  articleUrl.hash = '';

  assert.equal(getPostSlug(articleUrl), postSlug);
});

test('keeps existing hash links compatible and gives the hash route precedence', () => {
  const url = new URL(
    'https://asherzj.github.io/?post=older-post#/posts/welcome-to-the-archive',
  );

  assert.equal(getPostSlug(url), postSlug);
});

test('recovers the pending post from a legacy hash-only giscus callback', () => {
  const callbackUrl = new URL('https://asherzj.github.io/?giscus=test-session');

  assert.equal(getPostSlug(callbackUrl, postSlug), postSlug);
});

test('clears post routing and the one-time giscus callback from the home URL', () => {
  const articleUrl = new URL(
    'https://asherzj.github.io/?post=welcome-to-the-archive&giscus=test-session#/posts/welcome-to-the-archive',
  );
  const homeUrl = createHomeUrl(articleUrl);

  assert.equal(homeUrl.searchParams.has('post'), false);
  assert.equal(homeUrl.searchParams.has('giscus'), false);
  assert.equal(homeUrl.hash, '');
});
