import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import {
  FlatList,
  ListRenderItem,
  StyleSheet,
  View,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppStore';
import { loadStories, setSortKey, setSearchQuery } from './feedSlice';
import { filterStories, sortStories } from '../../utils/story';
import { SkeletonList } from '../../components/SkeletonList';
import { ErrorState } from '../../components/ErrorState';
import { EmptyState } from '../../components/EmptyState';
import StoryCard from '../../components/StoryCard';
import { SortToggle } from '../../components/SortToggle';
import { SearchBar } from '../../components/SearchBar';
import { useScrollPosition } from '../../hooks/useScrollPosition';
import { COLORS, SPACING } from '../../constants';
import type { NormalizedStory, RootStackParamList, SortKey } from '../../types';

const ITEM_HEIGHT = 110;

type Props = NativeStackScreenProps<RootStackParamList, 'ArticleList'>;

export function ArticleListScreen({ navigation }: Props) {
  const dispatch = useAppDispatch();
  const { stories, status, sortKey, searchQuery } = useAppSelector(s => s.feed);
  const { listRef, savePosition, restorePosition } = useScrollPosition();

  const lastVisibleIndex = useRef(0);

  const load = useCallback(() => {
    dispatch(loadStories());
  }, [dispatch]);

  useEffect(() => {
    if (status === 'idle') load();
  }, [status, load]);

  useFocusEffect(
    useCallback(() => {
      restorePosition();
    }, [restorePosition]),
  );

  const handleSortChange = useCallback(
    (key: SortKey) => dispatch(setSortKey(key)),
    [dispatch],
  );

  const handleSearch = useCallback(
    (q: string) => dispatch(setSearchQuery(q)),
    [dispatch],
  );

  const displayedStories = useMemo(
    () => filterStories(sortStories(stories, sortKey), searchQuery),
    [stories, sortKey, searchQuery],
  );

  const handlePress = useCallback(
    (story: NormalizedStory) => {
      savePosition(lastVisibleIndex.current);
      navigation.navigate('ArticleDetail', { story });
    },
    [navigation, savePosition],
  );

  const renderItem: ListRenderItem<NormalizedStory> = useCallback(
    ({ item }) => <StoryCard story={item} onPress={() => handlePress(item)} />,
    [handlePress],
  );

  const keyExtractor = useCallback((item: NormalizedStory) => String(item.id), []);

  const getItemLayout = useCallback(
    (_: ArrayLike<NormalizedStory> | null | undefined, index: number) => ({
      length: ITEM_HEIGHT,
      offset: ITEM_HEIGHT * index,
      index,
    }),
    [],
  );

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: Array<{ index: number | null }> }) => {
      if (viewableItems.length > 0 && viewableItems[0].index !== null) {
        lastVisibleIndex.current = viewableItems[0].index;
      }
    },
  ).current;

  if (status === 'loading' && stories.length === 0) {
    return (
      <View style={styles.container}>
        <SearchBar onSearch={handleSearch} />
        <SkeletonList />
      </View>
    );
  }

  if (status === 'failed') {
    return (
      <View style={styles.container}>
        <ErrorState onRetry={load} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SearchBar onSearch={handleSearch} />
      <View style={styles.toolbar}>
        <SortToggle value={sortKey} onChange={handleSortChange} />
      </View>
      <FlatList
        ref={listRef}
        data={displayedStories}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        getItemLayout={getItemLayout}
        contentContainerStyle={styles.list}
        onRefresh={load}
        refreshing={status === 'loading'}
        ListEmptyComponent={<EmptyState />}
        removeClippedSubviews
        maxToRenderPerBatch={10}
        windowSize={21}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ minimumViewTime: 100, viewAreaCoveragePercentThreshold: 50 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingTop: SPACING.sm,
  },
  toolbar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.sm,
  },
  list: {
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.xl,
  },
});
