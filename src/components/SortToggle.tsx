import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS, FONT_SIZE, RADIUS, SPACING } from '../constants';
import type { SortKey } from '../types';

interface Props {
  value: SortKey;
  onChange: (key: SortKey) => void;
}

const OPTIONS: { key: SortKey; label: string }[] = [
  { key: 'score', label: 'Top' },
  { key: 'time', label: 'New' },
];

export function SortToggle({ value, onChange }: Props) {
  return (
    <View style={styles.container}>
      {OPTIONS.map(opt => (
        <TouchableOpacity
          key={opt.key}
          style={[styles.pill, value === opt.key && styles.pillActive]}
          onPress={() => onChange(opt.key)}
          activeOpacity={0.7}
          accessibilityRole="radio"
          accessibilityState={{ selected: value === opt.key }}
        >
          <Text style={[styles.label, value === opt.key && styles.labelActive]}>
            {opt.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: RADIUS.full,
    padding: 3,
    gap: 2,
  },
  pill: {
    paddingHorizontal: SPACING.md,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
  },
  pillActive: {
    backgroundColor: COLORS.accent,
  },
  label: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
  },
  labelActive: {
    color: COLORS.white,
  },
});
