import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from './useAppStore';
import {
  toggleBookmark,
  removeBookmark,
} from '../features/bookmarks/bookmarksSlice';
import type { NormalizedStory } from '../types';

export function useBookmarks() {
  const dispatch = useAppDispatch();
  const items = useAppSelector(s => s.bookmarks.items);

  const isBookmarked = useCallback(
    (id: number) => items.some(s => s.id === id),
    [items],
  );

  const toggle = useCallback(
    (story: NormalizedStory) => dispatch(toggleBookmark(story)),
    [dispatch],
  );

  const remove = useCallback(
    (id: number) => dispatch(removeBookmark(id)),
    [dispatch],
  );

  return { items, isBookmarked, toggle, remove };
}
