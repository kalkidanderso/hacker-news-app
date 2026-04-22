import React, { useCallback } from 'react';
import {
  FlatList,
  ListRenderItem,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useBookmarks } from '../../hooks/useBookmarks';
import { COLORS, FONT_SIZE, RADIUS, SPACING } from '../../constants';
import { EmptyState } from '../../components/EmptyState';
import { relativeTime } from '../../utils/story';
import type { NormalizedStory, RootStackParamList } from '../../types';

type Props = NativeStackScreenProps<RootStackParamList, 'ArticleList'>;

export function BookmarksScreen({ navigation }: Props) {
  const { items, remove } = useBookmarks();

  const handlePress = useCallback(
    (story: NormalizedStory) =>
      navigation.navigate('ArticleDetail', { story }),
    [navigation],
  );

  const renderItem: ListRenderItem<NormalizedStory> = useCallback(
    ({ item }) => (
      <View style={styles.card}>
        <TouchableOpacity
          style={styles.cardContent}
          onPress={() => handlePress(item)}
          activeOpacity={0.75}
        >
          <Text style={styles.domain}>{item.domain}</Text>
          <Text style={styles.title} numberOfLines={2}>
            {item.title}
          </Text>
          <View style={styles.meta}>
            <Text style={styles.metaText}>▲ {item.score}</Text>
            <Text style={styles.metaDot}>·</Text>
            <Text style={styles.metaText}>{relativeTime(item.time)}</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => remove(item.id)}
          accessibilityRole="button"
          accessibilityLabel={`Remove ${item.title} from bookmarks`}
        >
          <Text style={styles.removeText}>✕</Text>
        </TouchableOpacity>
      </View>
    ),
    [handlePress, remove],
  );

  const keyExtractor = useCallback((item: NormalizedStory) => String(item.id), []);

  return (
    <View style={styles.container}>
      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={[
          styles.list,
          items.length === 0 && styles.listEmpty,
        ]}
        ListEmptyComponent={<EmptyState message="No bookmarks yet." />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  list: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.xl,
  },
  listEmpty: {
    flex: 1,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
  },
  cardContent: {
    flex: 1,
    padding: SPACING.md,
  },
  domain: {
    color: COLORS.accent,
    fontSize: FONT_SIZE.xs,
    fontWeight: '600',
    marginBottom: 4,
  },
  title: {
    color: COLORS.text,
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    lineHeight: 20,
    marginBottom: 6,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  metaText: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.xs,
  },
  metaDot: {
    color: COLORS.textMuted,
    fontSize: FONT_SIZE.xs,
  },
  removeButton: {
    width: 48,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.surfaceElevated,
    borderLeftWidth: 1,
    borderLeftColor: COLORS.border,
  },
  removeText: {
    color: COLORS.error,
    fontSize: FONT_SIZE.md,
    fontWeight: '700',
  },
});
