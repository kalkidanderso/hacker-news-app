import React, { useCallback } from 'react';
import {
  Linking,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useBookmarks } from '../../hooks/useBookmarks';
import { relativeTime } from '../../utils/story';
import { COLORS, FONT_SIZE, RADIUS, SPACING } from '../../constants';
import type { RootStackParamList } from '../../types';

type Props = NativeStackScreenProps<RootStackParamList, 'ArticleDetail'>;

export function ArticleDetailScreen({ route, navigation }: Props) {
  const { story } = route.params;
  const { isBookmarked, toggle } = useBookmarks();
  const bookmarked = isBookmarked(story.id);

  const openLink = useCallback(() => {
    Linking.openURL(story.url).catch(() => {
      // nothing to surface — URL may be invalid
    });
  }, [story.url]);

  const shareStory = useCallback(async () => {
    await Share.share({
      title: story.title,
      message: `${story.title}\n${story.url}`,
      url: story.url,
    });
  }, [story]);

  const handleBookmark = useCallback(() => toggle(story), [toggle, story]);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={styles.headerActions}>
          <TouchableOpacity
            onPress={shareStory}
            style={styles.headerButton}
            accessibilityLabel="Share article"
            accessibilityRole="button"
          >
            <Text style={styles.headerIcon}>↑</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleBookmark}
            style={styles.headerButton}
            accessibilityLabel={bookmarked ? 'Remove bookmark' : 'Add bookmark'}
            accessibilityRole="button"
          >
            <Text style={[styles.headerIcon, bookmarked && styles.bookmarkActive]}>
              {bookmarked ? '★' : '☆'}
            </Text>
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation, bookmarked, shareStory, handleBookmark]);

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.sourceRow}>
        <View style={styles.sourceBadge}>
          <Text style={styles.sourceText}>{story.domain}</Text>
        </View>
      </View>

      <Text style={styles.title}>{story.title}</Text>

      <View style={styles.metaRow}>
        <View style={styles.scoreBadge}>
          <Text style={styles.scoreText}>▲ {story.score}</Text>
        </View>
        <Text style={styles.metaText}>by {story.by}</Text>
        <Text style={styles.metaDot}>·</Text>
        <Text style={styles.metaText}>{relativeTime(story.time)}</Text>
      </View>

      <TouchableOpacity
        style={styles.linkButton}
        onPress={openLink}
        activeOpacity={0.8}
        accessibilityRole="link"
        accessibilityLabel={`Open ${story.url}`}
      >
        <Text style={styles.linkText} numberOfLines={2}>
          {story.url}
        </Text>
        <Text style={styles.linkArrow}>→</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: SPACING.md,
    paddingTop: SPACING.lg,
  },
  headerActions: {
    flexDirection: 'row',
    gap: SPACING.xs,
  },
  headerButton: {
    padding: SPACING.xs,
  },
  headerIcon: {
    color: COLORS.text,
    fontSize: FONT_SIZE.xl,
    fontWeight: '700',
  },
  bookmarkActive: {
    color: COLORS.accent,
  },
  sourceRow: {
    marginBottom: SPACING.md,
  },
  sourceBadge: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.accentMuted,
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 3,
  },
  sourceText: {
    color: COLORS.accent,
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
  },
  title: {
    color: COLORS.text,
    fontSize: FONT_SIZE.xxl,
    fontWeight: '700',
    lineHeight: 32,
    marginBottom: SPACING.md,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.lg,
    flexWrap: 'wrap',
  },
  scoreBadge: {
    backgroundColor: COLORS.accentMuted,
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
  },
  scoreText: {
    color: COLORS.accent,
    fontSize: FONT_SIZE.sm,
    fontWeight: '700',
  },
  metaText: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.sm,
  },
  metaDot: {
    color: COLORS.textMuted,
    fontSize: FONT_SIZE.sm,
  },
  linkButton: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: SPACING.sm,
  },
  linkText: {
    flex: 1,
    color: COLORS.accent,
    fontSize: FONT_SIZE.sm,
    textDecorationLine: 'underline',
  },
  linkArrow: {
    color: COLORS.accent,
    fontSize: FONT_SIZE.lg,
    fontWeight: '700',
  },
});
