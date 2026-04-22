import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { COLORS, RADIUS, SPACING } from '../constants';

function SkeletonBlock({
  width,
  height,
  style,
  shimmer,
}: {
  width: number | string;
  height: number;
  style?: object;
  shimmer: Animated.Value;
}) {
  const backgroundColor = shimmer.interpolate({
    inputRange: [0, 1],
    outputRange: [COLORS.skeletonBase, COLORS.skeletonHighlight],
  });

  return (
    <Animated.View
      style={[
        {
          width: width as number,
          height,
          borderRadius: RADIUS.sm,
          backgroundColor,
        },
        style,
      ]}
    />
  );
}

function SkeletonCard({ shimmer }: { shimmer: Animated.Value }) {
  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <SkeletonBlock width={42} height={42} shimmer={shimmer} style={styles.avatar} />
        <View style={styles.content}>
          <SkeletonBlock width="90%" height={14} shimmer={shimmer} style={styles.line} />
          <SkeletonBlock width="60%" height={12} shimmer={shimmer} style={styles.line} />
          <SkeletonBlock width="40%" height={10} shimmer={shimmer} style={styles.line} />
        </View>
      </View>
    </View>
  );
}

export function SkeletonList() {
  const shimmer = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmer, { toValue: 1, duration: 800, useNativeDriver: false }),
        Animated.timing(shimmer, { toValue: 0, duration: 800, useNativeDriver: false }),
      ]),
    );
    anim.start();
    return () => anim.stop();
  }, [shimmer]);

  return (
    <View style={styles.container}>
      {Array.from({ length: 8 }, (_, i) => (
        <SkeletonCard key={i} shimmer={shimmer} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.sm,
  },
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
  avatar: {
    borderRadius: RADIUS.sm,
    marginRight: SPACING.sm,
    flexShrink: 0,
  },
  content: {
    flex: 1,
  },
  line: {
    marginBottom: SPACING.xs,
  },
});
