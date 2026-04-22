import { API_BASE, STORY_FETCH_LIMIT } from '../constants';
import type { Story } from '../types';

async function get<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${path}`);
  }
  return response.json() as Promise<T>;
}

export async function fetchTopStoryIds(): Promise<number[]> {
  const ids = await get<number[]>('/topstories.json');
  return ids.slice(0, STORY_FETCH_LIMIT * 3);
}

export async function fetchItem(id: number): Promise<Story | null> {
  const item = await get<Story | null>(`/item/${id}.json`);
  return item;
}

export async function fetchTopStories(): Promise<Story[]> {
  const ids = await fetchTopStoryIds();

  const settled = await Promise.allSettled(ids.map(fetchItem));

  const stories: Story[] = [];
  for (const result of settled) {
    if (result.status === 'fulfilled' && result.value) {
      const item = result.value;
      if (item.type === 'story' && item.url) {
        stories.push(item);
        if (stories.length === STORY_FETCH_LIMIT) break;
      }
    }
  }

  return stories;
}
