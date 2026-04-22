import React, { useCallback, useRef, useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { COLORS, DEBOUNCE_DELAY, FONT_SIZE, RADIUS, SPACING } from '../constants';
import { debounce } from '../utils/debounce';

interface Props {
  onSearch: (query: string) => void;
}

export function SearchBar({ onSearch }: Props) {
  const [value, setValue] = useState('');

  const debouncedSearch = useRef(
    debounce((q: string) => onSearch(q), DEBOUNCE_DELAY),
  ).current;

  const handleChange = useCallback(
    (text: string) => {
      setValue(text);
      debouncedSearch(text);
    },
    [debouncedSearch],
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={handleChange}
        placeholder="Search stories..."
        placeholderTextColor={COLORS.textMuted}
        returnKeyType="search"
        clearButtonMode="while-editing"
        autoCapitalize="none"
        autoCorrect={false}
        accessibilityLabel="Search stories"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.sm,
  },
  input: {
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm + 2,
    color: COLORS.text,
    fontSize: FONT_SIZE.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
});
