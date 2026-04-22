import React, { memo, useState } from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { COLORS, FONT_SIZE, RADIUS, SPACING } from '../constants';
import { relativeTime } from '../utils/story';
import type { NormalizedStory } from '../types';

interface Props {
  story: NormalizedStory;
  onPress: () => void;
}

function StoryCard({ story, onPress }: Props) {
  const [imgFailed, setImgFailed] = useState(false);

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.75}
      accessibilityRole="button"
      accessibilityLabel={`Open ${story.title}`}
    >
      <View style={styles.row}>
        {imgFailed ? (
          <View style={[styles.favicon, styles.faviconFallback]}>
            <Text style={styles.faviconLetter}>
              {story.domain.charAt(0).toUpperCase()}
            </Text>
          </View>
        ) : (
          <Image
            source={{ uri: story.faviconUrl }}
            style={styles.favicon}
            onError={() => setImgFailed(true)}
          />
        )}
        <View style={styles.content}>
          <Text style={styles.title} numberOfLines={3}>
            {story.title}
          </Text>
          <Text style={styles.domain} numberOfLines={1}>
            {story.domain}
          </Text>
          <View style={styles.meta}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>▲ {story.score}</Text>
            </View>
            <Text style={styles.time}>{relativeTime(story.time)}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default memo(StoryCard);

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  favicon: {
    width: 42,
    height: 42,
    borderRadius: RADIUS.sm,
    marginRight: SPACING.sm,
    backgroundColor: COLORS.surfaceElevated,
    flexShrink: 0,
  },
  faviconFallback: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  faviconLetter: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.lg,
    fontWeight: '700',
  },
  content: {
    flex: 1,
  },
  title: {
    color: COLORS.text,
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    lineHeight: 22,
    marginBottom: SPACING.xs,
  },
  domain: {
    color: COLORS.accent,
    fontSize: FONT_SIZE.sm,
    marginBottom: SPACING.xs,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  badge: {
    backgroundColor: COLORS.accentMuted,
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
  },
  badgeText: {
    color: COLORS.accent,
    fontSize: FONT_SIZE.xs,
    fontWeight: '700',
  },
  time: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.xs,
  },
});
