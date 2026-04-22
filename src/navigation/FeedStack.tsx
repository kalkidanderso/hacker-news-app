import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ArticleListScreen } from '../features/feed/ArticleListScreen';
import { ArticleDetailScreen } from '../features/feed/ArticleDetailScreen';
import { COLORS } from '../constants';
import type { RootStackParamList } from '../types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function FeedStack() {
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
        component={ArticleListScreen}
        options={{ title: 'Hacker News' }}
      />
      <Stack.Screen
        name="ArticleDetail"
        component={ArticleDetailScreen}
        options={{ title: '' }}
      />
    </Stack.Navigator>
  );
}
