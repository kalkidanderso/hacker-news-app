import { useCallback, useRef, useState } from 'react';
import type { FlatList } from 'react-native';
import type { NormalizedStory } from '../types';

export function useScrollPosition() {
  const listRef = useRef<FlatList<NormalizedStory>>(null);
  const [savedIndex, setSavedIndex] = useState<number | null>(null);

  const savePosition = useCallback((index: number) => {
    setSavedIndex(index);
  }, []);

  const restorePosition = useCallback(() => {
    if (savedIndex !== null && listRef.current) {
      listRef.current.scrollToIndex({
        index: savedIndex,
        animated: false,
        viewPosition: 0,
      });
    }
  }, [savedIndex]);

  return { listRef, savePosition, restorePosition };
}
