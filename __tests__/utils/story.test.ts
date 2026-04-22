import { parseDomain, faviconUrl, relativeTime, normalizeStory, sortStories, filterStories } from '../../src/utils/story';
import type { Story, NormalizedStory } from '../../src/types';

const makeStory = (overrides: Partial<Story> = {}): Story => ({
  id: 1,
  title: 'Test Story',
  url: 'https://example.com/article',
  score: 100,
  by: 'user1',
  time: Math.floor(Date.now() / 1000) - 3600,
  type: 'story',
  ...overrides,
});

describe('parseDomain', () => {
  it('extracts hostname from a full URL', () => {
    expect(parseDomain('https://www.github.com/foo/bar')).toBe('github.com');
  });

  it('strips the www prefix', () => {
    expect(parseDomain('https://www.example.com')).toBe('example.com');
  });

  it('returns the raw string when the URL is invalid', () => {
    expect(parseDomain('not-a-url')).toBe('not-a-url');
  });
});

describe('faviconUrl', () => {
  it('builds a Google favicon URL', () => {
    const result = faviconUrl('github.com');
    expect(result).toBe('https://www.google.com/s2/favicons?domain=github.com&sz=64');
  });
});

describe('relativeTime', () => {
  it('returns a human-readable relative string', () => {
    const oneHourAgo = Math.floor(Date.now() / 1000) - 3600;
    expect(relativeTime(oneHourAgo)).toContain('hour');
  });
});

describe('normalizeStory', () => {
  it('attaches domain and faviconUrl to a story', () => {
    const story = makeStory();
    const normalized = normalizeStory(story);
    expect(normalized.domain).toBe('example.com');
    expect(normalized.faviconUrl).toContain('example.com');
    expect(normalized.id).toBe(story.id);
  });
});

const makeNormalized = (id: number, score: number, time: number): NormalizedStory => ({
  ...makeStory({ id, score, time: Math.floor(Date.now() / 1000) - time }),
  domain: 'example.com',
  faviconUrl: 'https://placeholder',
});

describe('sortStories', () => {
  const a = makeNormalized(1, 200, 100);
  const b = makeNormalized(2, 50, 50);
  const c = makeNormalized(3, 500, 200);

  it('sorts by score descending', () => {
    const sorted = sortStories([a, b, c], 'score');
    expect(sorted.map(s => s.id)).toEqual([3, 1, 2]);
  });

  it('sorts by time descending (newest first)', () => {
    const sorted = sortStories([a, b, c], 'time');
    expect(sorted.map(s => s.id)).toEqual([2, 1, 3]);
  });

  it('does not mutate the original array', () => {
    const original = [a, b, c];
    sortStories(original, 'score');
    expect(original.map(s => s.id)).toEqual([1, 2, 3]);
  });
});

describe('filterStories', () => {
  const stories: NormalizedStory[] = [
    { ...makeNormalized(1, 100, 100), title: 'React Native Tips', domain: 'dev.to' },
    { ...makeNormalized(2, 80, 200), title: 'TypeScript Generics', domain: 'medium.com' },
    { ...makeNormalized(3, 60, 300), title: 'Redux Best Practices', domain: 'redux.js.org' },
  ];

  it('returns all stories when query is empty', () => {
    expect(filterStories(stories, '')).toHaveLength(3);
  });

  it('filters by title case-insensitively', () => {
    const result = filterStories(stories, 'react');
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe(1);
  });

  it('filters by domain', () => {
    const result = filterStories(stories, 'medium');
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe(2);
  });

  it('returns empty array when no match', () => {
    expect(filterStories(stories, 'zzznomatch')).toHaveLength(0);
  });
});
