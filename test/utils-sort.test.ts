import { describe, expect, it } from 'vitest';
import { compareItemsNewestFirst } from '../src/utils';

describe('compareItemsNewestFirst', () => {
  it('sorts newest first and puts undated entries last regardless of input order', () => {
    const old = { title: 'old', published: '2024-01-01T00:00:00Z' };
    const recent = { title: 'recent', published: '2025-01-01T00:00:00Z' };
    const none1 = { title: 'none1' };
    const none2 = { title: 'none2' };

    for (const input of [
      [none1, old, none2, recent],
      [old, none1, recent, none2],
      [none1, none2, old, recent],
    ]) {
      const titles = [...input].sort(compareItemsNewestFirst).map((i) => i.title);
      expect(titles.slice(0, 2)).toEqual(['recent', 'old']);
      expect(titles.slice(2).sort()).toEqual(['none1', 'none2']);
    }
  });
});
