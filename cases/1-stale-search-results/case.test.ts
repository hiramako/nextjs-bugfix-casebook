import { describe, it, expect } from 'vitest';
import * as buggy from './buggy';
import * as fixed from './fixed';

// Fake backend: the FIRST query is slow, the SECOND resolves fast.
// A user typing "react" then "react hooks" sees exactly this ordering.
function makeFetch(delaysMs: Record<string, number>) {
  return async (url: string) => {
    const q = new URL(url, 'http://test').searchParams.get('q')!;
    await new Promise((r) => setTimeout(r, delaysMs[q] ?? 0));
    return { json: async () => [{ id: 1, title: `result for "${q}"` }] };
  };
}

describe('stale search results', () => {
  it.fails('buggy version: the late answer for the OLD query overwrites the new one', async () => {
    const fetchImpl = makeFetch({ react: 40, 'react hooks': 5 });
    await Promise.all([buggy.search('react', fetchImpl), buggy.search('react hooks', fetchImpl)]);
    expect(buggy.getRendered()[0].title).toBe('result for "react hooks"');
  });

  it('fixed version: the late answer for the old query is dropped', async () => {
    const fetchImpl = makeFetch({ react: 40, 'react hooks': 5 });
    await Promise.all([fixed.search('react', fetchImpl), fixed.search('react hooks', fetchImpl)]);
    expect(fixed.getRendered()[0].title).toBe('result for "react hooks"');
  });
});
