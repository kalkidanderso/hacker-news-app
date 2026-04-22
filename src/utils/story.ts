import { formatDistanceToNowStrict } from 'date-fns';
import type { NormalizedStory, SortKey, Story } from '../types';

export function parseDomain(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
}

export function faviconUrl(domain: string): string {
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
}

export function relativeTime(unixSeconds: number): string {
  return formatDistanceToNowStrict(new Date(unixSeconds * 1000), {
    addSuffix: true,
  });
}

export function normalizeStory(story: Story): NormalizedStory {
  const domain = parseDomain(story.url);
  return {
    ...story,
    domain,
    faviconUrl: faviconUrl(domain),
  };
}

export function sortStories(
  stories: NormalizedStory[],
  key: SortKey,
): NormalizedStory[] {
  return [...stories].sort((a, b) =>
    key === 'score' ? b.score - a.score : b.time - a.time,
  );
}

export function filterStories(
  stories: NormalizedStory[],
  query: string,
): NormalizedStory[] {
  const q = query.toLowerCase().trim();
  if (!q) return stories;
  return stories.filter(
    s =>
      s.title.toLowerCase().includes(q) || s.domain.toLowerCase().includes(q),
  );
}
