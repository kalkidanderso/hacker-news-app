import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { BookmarksScreen } from '../features/bookmarks/BookmarksScreen';
import { ArticleDetailScreen } from '../features/feed/ArticleDetailScreen';
import { COLORS } from '../constants';
import type { RootStackParamList } from '../types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function BookmarksStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: COLORS.surface },
        headerTintColor: COLORS.text,
        headerTitleStyle: { fontWeight: '700', color: COLORS.text },
        headerShadowVisible: false,
        contentStyle: { backgroundColor: COLORS.background },
      }}
    >
      <Stack.Screen
        name="ArticleList"
        component={BookmarksScreen}
        options={{ title: 'Bookmarks' }}
      />
      <Stack.Screen
        name="ArticleDetail"
        component={ArticleDetailScreen}
        options={{ title: '' }}
      />
    </Stack.Navigator>
  );
}
